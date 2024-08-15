import {statMarkup, helpMarkup, aboutMarkup, back, adminBtn, adminBack} from './button.js'
import { db, User } from './db.js';
import { deleteMessageAfterDelay } from '../Bot.js';

export const Start = '*Welcome to Code Pro Bot 👋*\n\n*I can convert Unicode to Ascii 😉*\nSend your text here 📝\n\nUse /help for more\n\n★Join here 👉 @pencemodesign'
export const Help = '*⭕️ Hey; Follow these steps:* \n\n _● Send your Malayalam text here \n ● I will send some text \n ● Just copy & paste \n ● Select any Malayalam Ascii font \n ● For more go to @pencemodesign_\n\n⭕️ *Available Commands* \n\n /start : Checking bot online \n /help : For more help \n /about : For more about me \n /issues : letter problem\n /toadmin : Message to admin  \n\n*©️ @pencemodesigns*'
export const About = '📄 <b>About Code Pro bot v2.2.0</b>\n\n<b>Creator :</b> <a href="http://t.me/mnmsby">α̅η̲ɗɾo͚ȋɗ കുഞ്ഞപ്പൻ </a>\n<b>Updates :</b> <a href="https://t.me/pencemodesigns">Pencemo Designs</a>\n<b>Language :</b> JavaScript\n<b>DataBase</b> : <a href="https://www.mongodb.com/">MongoDB</a>\n<b>Build Status :</b> v2.1.0 [stable]'

const Commands = '👮‍♂️ Admin Commands :- \n\n●/users - Count of users\n●/allusers - List of all users\n●/search <userName> - Find User\n●/sendmessage <userName> <your text> - Send msg\n●/broadcast <msg> --<button> <link> - Brodcast\n●/block <userName> - Block user\n●/unblock <userName> - Unblockusers user\n●/blockedusers List of blocked user\n●/delete To delete user'
const Admin = '👋👋 Hey; Admin \n Follow billow button to use admin options \n\n🚀 Commands = Admin Commands\n🚀 Usars = All users count\n🚀 Block = List of Block users\n🚀 Home = Start Message'


const time = 900000


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
    const originalMessageId = ctx.callbackQuery.message.message_id;
    const chatId = ctx.callbackQuery.message.chat.id;

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

    
    // Schedule deletion of the message
    deleteMessageAfterDelay(chatId, originalMessageId, time);

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
      // Schedule deletion of the message
    deleteMessageAfterDelay(chatId, originalMessageId, time);

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
      // Schedule deletion of the message
    deleteMessageAfterDelay(chatId, originalMessageId, time);

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
      // Schedule deletion of the message
    deleteMessageAfterDelay(chatId, originalMessageId, time);

    }
 
    ctx.answerCallbackQuery();
 }


