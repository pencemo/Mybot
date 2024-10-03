import { InlineKeyboard } from 'grammy';
import {statMarkup, helpMarkup, aboutMarkup, back, adminBtn, adminBack, PaginationKeyboard} from './button.js'
import { db, User, Message } from './db.js';
import convertToAscii from '../utils/converter.js'

export const Start = '*Welcome to Code Pro Bot 👋*\n\n*I can convert Unicode to Ascii 😉*\nSend your text here 📝\n\nUse /help for more\n\n★Join here 👉 @pencemodesign'
// export const Help = '*Code Pro Bot*\n\nThis bot helps you convert Malayalam Unicode text to ASCII. Send your text here and it can be converted to various font styles.  \n\n⭕️ *Available Commands* \n\n /start : Checking bot online \n /help : For more help \n /about : For more about me \n /issues : letter problem\n /toadmin : Message to admin  \n\n*©️ @pencemodesigns*'
export const Help = '*⭕️ Hey; Follow these steps:* \n\n _This bot helps you convert Malayalam Unicode text to ASCII_\n\n⭕️ *Available Commands* \n\n /start : Checking bot online \n /help : For more help \n /about : For more about me \n /issues : letter problem\n /toadmin : Message to admin  \n\n*©️ @pencemodesigns*'
export const About = '📄 <b>About Code Pro bot v2.2.0</b>\n\n<b>Creator :</b> <a href="http://t.me/mnmsby">α̅η̲ɗɾo͚ȋɗ കുഞ്ഞപ്പൻ </a>\n<b>Updates :</b> <a href="https://t.me/pencemodesigns">Pencemo Designs</a>\n<b>Language :</b> JavaScript\n<b>DataBase</b> : <a href="https://www.mongodb.com/">MongoDB</a>\n<b>Build Status :</b> v2.1.0 [stable]'

const Commands = '👮‍♂️ Admin Commands :- \n\n●/users - Count of users\n●/allusers - List of all users\n●/search <userName> - Find User\n●/sendmessage <userName> <your text> - Send msg\n●/broadcast <msg> --<button> <link> - Brodcast\n●/block <userName> - Block user\n●/unblock <userName> - Unblockusers user\n●/blockedusers List of blocked user\n●/delete To delete user'
const Admin = '👋👋 Hey; Admin \n Follow billow button to use admin options \n\n🚀 Commands = Admin Commands\n🚀 Usars = All users count\n🚀 Block = List of Block users\n🚀 Home = Start Message'

async function saveToDB(userId, text) {
  try {
      await Message.updateOne(
          { id: userId },
          { $push: { text: { text } } },
          { upsert: true }
      );
  } catch (error) {
      console.error('Error saving message to database:', error);
  }
}

export async function fetchMessages(userId, page = 1) {
  const PAGE_SIZE = 8; // Number of messages per page
  const skip = (page - 1) * PAGE_SIZE;
  const messages = await Message.findOne({ id: userId });
  
  if (!messages) return [];

  return messages.text.slice(skip, skip + PAGE_SIZE);
}

export const callBack = async (ctx) => {
    const callbackData = ctx.callbackQuery.data;
 
    if(callbackData === 'help'){
       ctx.editMessageText(Help,{
         parse_mode: 'MarkdownV2',
        ...helpMarkup
       })

    }else if(callbackData === 'about'){
       ctx.editMessageText(About, {
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          ...aboutMarkup
       })
       
    }else if(callbackData === 'delete'){
       try {
        await ctx.api.deleteMessage(ctx.callbackQuery.message.chat.id, ctx.callbackQuery.message.message_id);
       } catch(err){
        console.log(err);
       }

    }else if(callbackData === 'start'){
       ctx.editMessageText(Start, {
          parse_mode: 'MarkdownV2',
          ...statMarkup
       });

    }else if(callbackData === 'blockuser'){
      try {
        const blockedUsers = await User.find({ isBlocked: true }).exec();
        if (blockedUsers.length > 0) {
          const userList = blockedUsers.map(user => user.username ? `@${user.username}` : user.firstName).join('\n');
          ctx.editMessageText(`Blocked users list \n--------------------------\n\n${userList}`, {...adminBack});
        } else {
          ctx.editMessageText('No users are currently blocked.', {...adminBack});
          await ctx.answerCallbackQuery({
            text: '🚨 No users are currently blocked',
            show_alert: false,
        });
        }
      } catch (error) {
        ctx.editMessageText('Failed to retrieve blocked users.', {...adminBack});
      }

    }else if(callbackData === 'command'){
      ctx.editMessageText(Commands, {
        ...adminBack
     });

    }else if(callbackData === 'users'){
       try {
        const userCount = await User.countDocuments().exec();
        ctx.editMessageText(`Number of users\n------------------------\n\n⌛ Total - ${userCount}\n\n🚀 /allusers for all users list`, {...adminBack});
      } catch (error) {
        ctx.editMessageText('Failed to count users.', {...adminBack});
      }

    }else if(callbackData === 'admin'){
      if (!ctx.session.user || !ctx.session.user.isAdmin) {
        ctx.editMessageText('You are not Admin 😂😂\n\n To connect with admin use /toadmin <Your Message>',{...back});
        await ctx.answerCallbackQuery({
          text: '🚨 You are not Admin 😂😂',
          show_alert: false,
      });
      }else{
        ctx.editMessageText(Admin,{
          ...adminBtn
         })
      }
    }
    
    const asciiTexts = ctx.session.originalAsciiText || '';
    const unicodeText = ctx.session.unicode || '';
    const userId = ctx.from.id;

    if (callbackData === 'mlkv') {

      let mlkvAsciiText = asciiTexts.replace(/ï/g, '@')
      // Reply with the mlkv asciiText
      ctx.editMessageText(`<code>${mlkvAsciiText}</code>\n\n⚡ Use MLKV Fonts`, {
          parse_mode: 'HTML',
          reply_markup: {
              inline_keyboard: [
                  [
                    {text: 'Back 🔙', callback_data: 'fml'}
                  ]
              ]
          }
      });

    

    } else if (callbackData === 'fml') {

      let fmlAsciiText = asciiTexts
      ctx.editMessageText(`<code>${fmlAsciiText}</code>\n\n⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑\n<i>📝 Use the buttons below to convert to another fonts</i>`, {
          parse_mode: 'HTML',
          reply_markup: {
              inline_keyboard: [
                  [
                    {text: 'MLKV', callback_data: 'mlkv'},
                    {text: 'Scribe', callback_data: 'scribe'}
                  ],
                  [
                    {text: 'Apple cards', callback_data: 'apple'},
                    {text: 'FML, MVM', callback_data: 'mvm'}
                  ]
              ]
          }
      });

    } else if (callbackData === 'scribe') {

      let scribeAsciiText = asciiTexts.replace(/ï/g, '>')
      // Reply with the scribe asciiText
      ctx.editMessageText(`<code>${scribeAsciiText}</code>\n\n⚡ Use Scribe Fonts`, {
          parse_mode: 'HTML',
          reply_markup: {
              inline_keyboard: [
                  [
                    {text: 'Back 🔙', callback_data: 'fml'}
                  ]
              ]
          }
      });

    } else if (callbackData === 'mvm') {

      let mvmAsciiText = asciiTexts
      // Reply with the mvm asciiText
      ctx.editMessageText(`<code>${mvmAsciiText}</code>\n\n⚡ Use FML or MVM Fonts`, {
          parse_mode: 'HTML',
          reply_markup: {
              inline_keyboard: [
                  [
                    {text: 'Back 🔙', callback_data: 'fml'}
                  ]
              ]
          }
      });
    } else if (callbackData === 'apple') {

      let appleAsciiText = asciiTexts.replace(/ï/g, '@')
      // Reply with the apple asciiText
      ctx.editMessageText(`<code>${appleAsciiText}</code>\n\n⚡ Use Apple Cards Fonts`, {
          parse_mode: 'HTML',
          reply_markup: {
              inline_keyboard: [
                  [
                    {text: 'Back 🔙', callback_data: 'fml'}
                  ]
              ]
          }
      });

    } else if (callbackData === 'save') {

      // let appleAsciiText = asciiTexts
      try{
        if(unicodeText.length > 3000){
          await editMessageText('text is too long')
        }else{
          await saveToDB(userId, unicodeText);
          ctx.editMessageText(`<code>Message saved successfully!</code>\n\n⚡-/savedtext to show msg`, {
              parse_mode: 'HTML',
              reply_markup: {
                  inline_keyboard: [
                      [
                        {text: 'Back 🔙', callback_data: 'fml'}
                      ]
                  ]
              }
          });
        }
      }catch(err){
        ctx.editMessageText(`<b>Error to save message</b>⚡\n\n`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                      {text: 'Back 🔙', callback_data: 'fml'}
                    ]
                ]
            }
        });
      }

    }



    const [action, iduser, args] = callbackData.split(':');

    if (action === 'msg') {
        // Send the selected message
        try{
          const id = args
          const data = await Message.findOne({ id: iduser })
          const text = data.text.find(item => item._id.equals(id));

          var asciiArray = convertToAscii(text.text);

          let savedAscii = '';
          asciiArray.map((item) => {
            savedAscii += item.chunk;
          });
          savedAscii = savedAscii.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

          if(text.text.length < 1500){
            await ctx.editMessageText(`Unicode Text 📝\n----------------------\n${text.text}\n\nAscii Text 📝\n----------------------\n${savedAscii}`, {
              reply_markup : {
                inline_keyboard: [
                    [
                        { text: 'Delete 🗑️', callback_data: `delete:${userId}:${text.id}` },
                        { text: 'Back 🔙', callback_data: `page:${userId}:${1}` } 
                    ]
                ]
            }
            });
            
          }else if(text.text.length > 1500 && text.text.length < 3000){
            await ctx.editMessageText(`Unicode Text 📝\n----------------------\n${text.text}`, {
              reply_markup : {
                inline_keyboard: [
                    [
                        { text: 'Delete 🗑️', callback_data: `delete:${userId}:${text.id}` },
                        { text: 'Back 🔙', callback_data: `page:${userId}:${1}` } 
                    ]
                ]
            }
            });
            await ctx.reply(`Ascii Text 📝\n----------------------\n${savedAscii}`);
          }else{
            await ctx.reply(`Your text is too long i cant sent it`);
          }
        }catch(err){
          await ctx.reply('Error to load text')
        }
    } else if (action === 'page') {
        const page = parseInt(args[0]);
        const messages = await fetchMessages(iduser, page);
        const totalMessages = (await Message.findOne({ id: iduser }))?.text.length || 0;
        const totalPages = Math.ceil(totalMessages / 8);

        // Build the keyboard with updated pagination
        const keyboard = new InlineKeyboard();
        messages.forEach((msg, index) => {
            if(index % 2 == 0){
              keyboard.add({ text: `${msg.text}`, callback_data: `msg:${iduser}:${msg.id}` });
            }else{
              keyboard.add({ text: `${msg.text}`, callback_data: `msg:${iduser}:${msg.id}` }).row();
            }
        });
        const buttonpage = PaginationKeyboard(iduser, page, totalPages);
        keyboard.add(...buttonpage);

        await ctx.editMessageText('Here are your saved messages', {
            reply_markup: keyboard 
        });
    } else if (action === 'delete'){
        const id = args
        const data = await Message.findOne({ id: iduser }) 
        const updated = data.text.filter((item)=> item.id !== id)
        await Message.findOneAndUpdate({id: iduser}, {text: updated}, {upsert: true},)
          .then(()=>{
            ctx.editMessageText('Message deleted successfully')
          }).catch(()=>{
            ctx.editMessageText('Error deleting message')
          })
        
    }
 
    ctx.answerCallbackQuery();
 }
 

