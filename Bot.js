import { Bot, session, InlineKeyboard } from 'grammy';
import dotenv from "dotenv";
dotenv.config()
import { Api } from 'grammy';
import convertToAscii from './utils/converter.js';
import {callBack, Start} from './command/callback.js';
import {statMarkup, join} from './command/button.js'
import { help, about, issues, id , search, deleteuser} from './command/command.js';
import { db, User } from './command/db.js';

import express from 'express';
import bodyParser from 'body-parser';

const bot = new Bot(process.env.BOT_TOKEN);
const api = new Api(process.env.BOT_TOKEN);
const port = process.env.PORT || 3000;
const webhookurl = process.env.WEBHOOK_URL



// Middleware to handle user registration
bot.use(session({
  initial: () => ({ user: null }), // Initial session state
  load: async (ctx) => {
    const { from } = ctx.message || ctx.callbackQuery?.from;

    if (from) {
      try {
        const user = await User.findOne({ chatId: from.id }).exec();
        return { ...ctx.session, user: user || null }; // Update session with user or null
      } catch (error) {
        console.error('Error loading user:', error);
        return ctx.session; // Return current session on error
      }
    }

    return ctx.session; // Return current session if no `from` object
  },
  save: (ctx, session) => {
    ctx.session = session; // Save updated session
  },
}));


bot.use(async (ctx, next) => {
  if (ctx.chat?.type !== 'private') {
    // If the chat is not private, ignore the message and do nothing
    return;
  }
  // If the chat is private, proceed with the next middleware
  return next();
});


// Load admin usernames from environment variables
const adminUsernames = process.env.ADMIN_USERNAMES ? process.env.ADMIN_USERNAMES.split(',') : [];

// Middleware to grant admin rights based on username
bot.use(async (ctx, next) => {
  const { username } = ctx.from;
  if (username && adminUsernames.includes(username)) {
    await User.findOneAndUpdate({ chatId: ctx.from.id }, { isAdmin: true }).exec();
    if (ctx.session.user) {
      ctx.session.user.isAdmin = true;
    } else {
      ctx.session.user = { isAdmin: true };
    }
  }

  if (ctx.from) {
    try {
      const user = await User.findOne({ chatId: ctx.from.id }).exec();
      if (user && user.isBlocked) {
        return ctx.reply('You are blocked from using this bot 👩‍🦯');
      }
    } catch (error) {
      console.error('Error checking if user is blocked:', error);
    }
  }

  return next();
});

// Force subscribe middleware
bot.use(async (ctx, next) => {
  const channelId = process.env.CHANNEL_ID;
  const channelUserName = process.env.CHANNEL_USERNAME;
  const chatId = ctx.from.id;

  try {
    const member = await api.getChatMember(channelId, chatId);

    if (member.status === 'left' || member.status === 'kicked') {
      await ctx.reply(`Please subscribe our channel to use this bot 😐 @${channelUserName}`,{...join});
      return;
    }
  } catch (error) {
    if (error.error_code === 400 && error.description.includes('member not found')) {
      await ctx.reply(`You are not a member of the channel. Please subscribe to use this bot 😐 @${channelUserName}`,{...join});
    } else {
      console.error('Error checking channel subscription:', error);
      await ctx.reply('An error occurred while checking your subscription status. Please try again later.');
    }
    return;
  }

  return next();
});

function escapeMarkdownV2(text) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

bot.use(async (ctx, next) => {
  const { id, username, first_name, last_name } = ctx.from;

  let user = await User.findOne({ chatId: id }).exec();
  const admins = await User.find({ isAdmin: true }).exec();

  if (!user) {
    user = await User.create({
      chatId: id,
      username: username || '',
      firstName: first_name,
      lastName: last_name,
    });

    admins.forEach(async (admin) => {
      try {
        let name = escapeMarkdownV2(username ? `@${username}` : first_name);
        
        await bot.api.sendMessage(admin.chatId, `[${name}](tg://user?id=${id}) Start This bot`, {
          parse_mode: 'MarkdownV2',
          disable_web_page_preview: true
        });
      } catch (error) {
        console.log('error');
      }
    });
  }
  return next();
})

// Function to delete a message after a delay
export const deleteMessageAfterDelay = (chatId, messageId, delay) => {
  setTimeout(async () => {
    try {
      await bot.api.deleteMessage(chatId, messageId);
    } catch (error) {
      console.error(`Failed to delete message ${messageId} from chat ${chatId}:`, error);
    }
  }, delay);
};

// Command to start interaction with the bot
bot.command('start', async (ctx) => {
  const {first_name, id} = ctx.from;
  const firstname = escapeMarkdownV2(first_name)
  ctx.reply(`Hi [${firstname}](tg://user?id=${id}) \n`+Start,{ 
    parse_mode: 'MarkdownV2',
    disable_web_page_preview: true,
    ...statMarkup
  });
});

bot.command('help', help)
bot.command('about', about)
bot.command('issues', issues)
bot.command('id', id)

// Command to find a user by username (admin only)
bot.command('search', search);
bot.command('delete', deleteuser);

// Command to send message to a user (admin only)
bot.command('sendmessage', async (ctx) => {
  if (!ctx.session.user || !ctx.session.user.isAdmin) {
    return ctx.reply('You are not authorized to use this command.');
  }

  const [_, username, ...messageParts] = ctx.message.text.split(' ');
  const message = messageParts.join(' ');

  if (!username || !message) {
    return ctx.reply('Please provide a username and a message.');
  }

  const user = await User.findOne({ username }).exec();
  if (user) {
    try {
      await bot.api.sendMessage(user.chatId, message);
      ctx.reply(`Message sent to @${username}.`);
    } catch (error) {
      if (error.response && error.response.error_code === 403) {
        ctx.reply(`User @${username} blocked the bot. Removing from database.`);
      } else {
        ctx.reply(`Failed to send message to @${username}.`);
      }
    }
  } else {
    ctx.reply('User not found.');
  }
});

// Command to broadcast a message to all users (admin only)
bot.command('broadcast', async (ctx) => {
  if (!ctx.session.user || !ctx.session.user.isAdmin) {
    return ctx.reply('You are not authorized to use this command.');
  }

  // Extract the command text and button details
  const commandParts = ctx.message.text.split('--');
  const text = commandParts[0].split(' ').slice(1).join(' ');

  // Create an inline keyboard dynamically based on the provided button details
  const keyboard = new InlineKeyboard();
  for (let i = 1; i < commandParts.length; i++) {
    const parts = commandParts[i].trim().split(' ');
    if (parts.length >= 2) {
      const buttonText = parts[0].trim();
      const buttonUrl = parts.slice(1).join(' ').trim();
      if (buttonText && buttonUrl) {
        keyboard.url(buttonText, buttonUrl).row();;
      }
    }
  }

  const messageType = ctx.message.reply_to_message ? ctx.message.reply_to_message : null;

  if (!text && !messageType) {
    return ctx.reply('Please provide a message to broadcast or reply to a message with /broadcast.');
  }

  const users = await User.find().exec();
  let successCount = 0;
  let failedCount = 0;
  let blockUsers = 0;
  let failedUser =[]

  for (const user of users) {
    try {
      if (messageType) {
        if (messageType.photo) {
          const fileId = messageType.photo[messageType.photo.length - 1].file_id;
          await bot.api.sendPhoto(user.chatId, fileId, {
            caption: messageType.caption || '',
            reply_markup: keyboard,
            parse_mode: 'MarkdownV2'
          });
        } else if (messageType.document) {
          const fileId = messageType.document.file_id;
          await bot.api.sendDocument(user.chatId, fileId, {
            caption: messageType.caption || '',
            reply_markup: keyboard,
            parse_mode: 'MarkdownV2'
          });
        } else if (messageType.video) {
          const fileId = messageType.video.file_id;
          await bot.api.sendVideo(user.chatId, fileId, {
            caption: messageType.caption || '',
            reply_markup: keyboard,
            parse_mode: 'MarkdownV2'
          });
        } else if (messageType.audio) {
          const fileId = messageType.audio.file_id;
          await bot.api.sendAudio(user.chatId, fileId, {
            caption: messageType.caption || '',
            reply_markup: keyboard,
            parse_mode: 'MarkdownV2'
          });
        } else if (messageType.voice) {
          const fileId = messageType.voice.file_id;
          await bot.api.sendVoice(user.chatId, fileId, {
            caption: messageType.caption || '',
            reply_markup: keyboard,
            parse_mode: 'MarkdownV2'
          });
        } else if (messageType.video_note) {
          const fileId = messageType.video_note.file_id;
          await bot.api.sendVideoNote(user.chatId, fileId);
        } else if (messageType.animation) {
          const fileId = messageType.animation.file_id;
          await bot.api.sendAnimation(user.chatId, fileId, {
            caption: messageType.caption || '',
            reply_markup: keyboard,
            parse_mode: 'MarkdownV2'
          });
        } else if (messageType.sticker) {
          const fileId = messageType.sticker.file_id;
          await bot.api.sendSticker(user.chatId, fileId, {
            reply_markup: keyboard,
          });
        } else {
          await bot.api.sendMessage(user.chatId, ctx.message.reply_to_message.text, {
            reply_markup: keyboard,
            parse_mode: 'MarkdownV2'
          });
        }
      } else {
        await bot.api.sendMessage(user.chatId, text, {
          reply_markup: keyboard,
          parse_mode: 'MarkdownV2'
        });
      }
      successCount++
    } catch (error) {
      if (error.response && error.response.error_code === 403) {
        ctx.reply(`User @${user.username} blocked the bot. Removing from database.`);
        blockUsers++
        await User.findOneAndDelete({ chatId: user.chatId });
      } else {
        failedCount++
        failedUser.push(`${user.username ? `@${user.username}` : user.firstName}\n`)
        // ctx.reply(`Error sending message to @${user.username}`);
      }
    }
  }

  if (failedUser.length === 0){
    ctx.reply('Broadcast sent to all users');
  } else {
    ctx.reply('Failed users\n\n'+failedUser);
  }
  ctx.reply(`Broadcast Logs\n\n👤 Total Users = ${successCount+failedCount}\n✅ Success = ${successCount}\n❎ Failed = ${failedCount}`);
});

// Command to find number of all users (admin only)
bot.command('users', async (ctx) => {
  if (!ctx.session.user || !ctx.session.user.isAdmin) {
    return ctx.reply('You are not authorized to use this command.');
  }

  try {
    const userCount = await User.countDocuments().exec();
    ctx.reply(`Total number of users: ${userCount}`);
  } catch (error) {
    console.error('Error counting users:', error);
    ctx.reply('Failed to count users.');
  }
});

// Command to list all usernames (admin only)
bot.command('allusers', async (ctx) => {
  if (!ctx.session.user || !ctx.session.user.isAdmin) {
    return ctx.reply('You are not authorized to use this command.');
  }

  try {
    const users = await User.find().exec();
    const userCount = await User.countDocuments().exec();
    const usernames = users.map((user) =>{
      let Nameofuser = escapeMarkdownV2(user.username ? `@${user.username}` : user.firstName)
      return `${escapeMarkdownV2('-')} [${Nameofuser}](tg://user?id=${user.chatId})`
    } ).join('\n');
    ctx.reply(`⌛ Total users : *${userCount}*\n\n📝 *Names of users*\n\n${usernames}`,{
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true,
    });
  } catch (error) {
    ctx.reply('Failed to fetch user list.');
  }
});

// Command for users to send messages to the admin
bot.command('toadmin', async (ctx) => {
const messageText = ctx.message.text.split(' ').slice(1).join(' ');

if (!messageText) {
  return ctx.reply('Please provide a message to send to the admin.');
}

const admins = await User.find({ isAdmin: true }).exec();

if (admins.length === 0) {
  return ctx.reply('No admin found to send the message to.');
}

admins.forEach(async (admin) => {
  try {
    await bot.api.sendMessage(admin.chatId, `💌 Message from @${ctx.from.username}\n\n ${messageText}`);
  } catch (error) {
    if (error.response && error.response.error_code === 403) {
      ctx.reply(`Admin not found`);
    } else {
      ctx.reply(`Error sending message to admin`);
    }
  }
});

ctx.reply('Your message has been sent to the admin ✔️.');
ctx.react("😍")
});

// Command to block one or more users (admin only)
bot.command('block', async (ctx) => {
  if (!ctx.session.user || !ctx.session.user.isAdmin) {
    return ctx.reply('You are not authorized to use this command.');
  }

  const identifiers = ctx.message.text.split(' ').slice(1);
  if (identifiers.length === 0) {
    return ctx.reply('Please provide at least one username to block.');
  }

  for (const identifier of identifiers) {
    try {
      let user;
      if (!isNaN(identifier)) {
        // Identifier is a number, treat it as chat ID
        user = await User.findOneAndUpdate(
          { chatId: identifier },
          { isBlocked: true },
          { new: true }
        ).exec();
      } else {
        // Identifier is not a number, treat it as username or first name
        user = await User.findOneAndUpdate(
          {
            $or: [
              { username: identifier },
              { firstName: identifier }
            ]
          },
          { isBlocked: true },
          { new: true }
        ).exec();
      }

      if (user) {
        await bot.api.sendMessage(user.chatId, 'You have been blocked from using this bot 😏');
        ctx.reply(`User @${identifier} has been blocked.`);
      } else {
        ctx.reply(`User @${identifier} not found.`);
      }
    } catch (error) {
      console.error(`Error blocking user @${identifier}:`, error);
      ctx.reply(`Failed to block user @${identifier}.`);
    }
  }
});

// Command to unblock one or more users (admin only)
bot.command('unblock', async (ctx) => {
  if (!ctx.session.user || !ctx.session.user.isAdmin) {
    return ctx.reply('You are not authorized to use this command.');
  }

  const identifiers = ctx.message.text.split(' ').slice(1);
  if (identifiers.length === 0) {
    return ctx.reply('Please provide at least one username to unblock.');
  }

  for (const identifier of identifiers) {
    try {
      let user;
      if (!isNaN(identifier)) {
        // Identifier is a number, treat it as chat ID
        user = await User.findOneAndUpdate(
          { chatId: identifier },
          { isBlocked: false },
          { new: true }
        ).exec();
      } else {
        // Identifier is not a number, treat it as username or first name
        user = await User.findOneAndUpdate(
          {
            $or: [
              { username: identifier },
              { firstName: identifier }
            ]
          },
          { isBlocked: false },
          { new: true }
        ).exec();
      }

      if (user) {
        await bot.api.sendMessage(user.chatId, 'You have been unblocked. Now you can use the bot ☺️');
        ctx.reply(`User @${identifier} has been unblocked.`);
      } else {
        ctx.reply(`User @${identifier} not found.`);
      }
    } catch (error) {
      ctx.reply(`Failed to unblock user @${identifier}.`);
    }
  }
});

// Command to find all blocked users (admin only)
bot.command('blockedusers', async (ctx) => {
  if (!ctx.session.user || !ctx.session.user.isAdmin) {
    return ctx.reply('You are not authorized to use this command.');
  }

  try {
    const blockedUsers = await User.find({ isBlocked: true }).exec();
    if (blockedUsers.length > 0) {
      const userList = blockedUsers.map(user => {
        if (user.username) {
          return `@${user.username}`;
        } else {
          return user.firstName ? user.firstName : `Id: ${user.chatId}`;
        }
      }).join('\n');
      ctx.reply(`Blocked users list :\n\n${userList}`);
    } else {
      ctx.reply('No users are currently blocked.');
    }
  } catch (error) {
    ctx.reply('Failed to retrieve blocked users.');
  }
});


bot.on("message:text", async ctx => {
  var asciiArray = convertToAscii(ctx.message.text);
  let asciiText = '';
  asciiArray.map((item) => {
     asciiText += item.chunk;
  });
  asciiText = asciiText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Store asciiText in session or some form of context
  ctx.session.originalAsciiText = asciiText;

  const message = await ctx.reply(`<code>${asciiText}</code>\n\n⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑\n<i>📝 Use the buttons below to convert to another fonts</i>`,{
    parse_mode: 'HTML',
     reply_markup:{
        inline_keyboard: [
          [
            {text: 'MLKV', callback_data: 'mlkv'},
            {text: 'Scribe', callback_data: 'scribe'}
          ],
          [
            {text: 'Apple Cards', callback_data: 'apple'},
            {text: 'FML, MVM', callback_data: 'mvm'}
          ]
        ]
    }
  });


  deleteMessageAfterDelay(ctx.chat.id, message.message_id, 900000);


});


bot.on("callback_query:data", ctx => callBack(ctx))



// Global error handler
bot.catch((err) => {
  console.error('Error occurred:', err);

  const ctx = err.ctx;
  if (ctx) {
    ctx.reply('An unexpected error occurred. Please try again later.');
  }
});




const app = express();
app.use(bodyParser.json());

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  await bot.handleUpdate(req.body);
  res.sendStatus(200);
});

// Start bot and server
async function start() {
  try {
    await bot.api.setWebhook(`${webhookurl}/webhook`); // Replace with your actual webhook URL
    app.listen(port, () => console.log(`Bot listening on port ${port}`));
  } catch (error) {
    console.error('Error starting bot:', error);
  }
}

start()

// Start the bot
bot.start();


