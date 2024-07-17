import {statMarkup, helpMarkup, aboutMarkup, back, adminBtn, adminBack} from './button.js'
import { db, User } from './db.js';

export const Start = '*Welcome to Code Pro Bot 👋*\n\n_*I can convert Unicode to Ascii 😉*_\nSend your text here 📝\n\nUse /help for more\n\n★Join here 👉 @pencemodesign'
export const Help = '*⭕️ Hey; Follow these steps:* \n\n _● Send your Malayalam text here \n ● I will send some text \n ● Just copy & paste \n ● Select any Malayalam Ascii font \n ● For more go to @pencemodesign_\n\n⭕️ *Available Commands* \n\n /start : Checking bot online \n /help : For more help \n /about : For more about me \n /issues : letter problem\n /toadmin : Message to admin  \n\n*©️ @pencemodesigns*'
export const About = '📄 About the Bot\n\nThis bot converts Unicode to ASCII text. Use it to easily convert your texts. Contact @pencemodesign for more info.'
const Commands = '👮‍♂️ Admin Commands :- \n\n●/users - Count of users\n●/allusers - List of all users\n●/search <userName> - Find User\n●/sendmessage <userName> <your text> - Send msg\n●/broadcast --<button> <link> - Brodcast\n●/blockusers <userName> - Block user\n●/unblockusers <userName> - Unblockusers user\n●/blockedusers List of blocked user'
const Admin = '👋👋 Hey; Admin \n Follow billow button to use admin options \n\n🚀 Commands = Admin Commands\n🚀 Usars = All users count\n🚀 Block = List of Block users\n🚀 Home = Start Message'
// const BotUser = model('User', UserSchema);

export const callBack = async (ctx) => {
    const callbackData = ctx.callbackQuery.data;
 
    if(callbackData === 'help'){
       ctx.editMessageText(Help,{
         parse_mode: 'MarkdownV2',
        ...helpMarkup
       })

    }else if(callbackData === 'about'){
       ctx.editMessageText(About, {
          ...aboutMarkup
       })

    }else if(callbackData === 'start'){
       ctx.editMessageText(Start, {
          parse_mode: 'MarkdownV2',
          ...statMarkup
       });

    }else if(callbackData === 'blockuser'){
      try {
        const blockedUsers = await User.find({ isBlocked: true }).exec();
        if (blockedUsers.length > 0) {
          const userList = blockedUsers.map(user => `● @${user.username}`).join('\n');
          ctx.editMessageText(`Blocked users list \n----------------------\n\n${userList}`, {...adminBack});
        } else {
          ctx.editMessageText('No users are currently blocked.', {...adminBack});
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
        return ctx.editMessageText('You are not Admin 😂😂\n\n To connect with admin use /toadmin <Your Message>',{...back});
      }else{
        return ctx.editMessageText(Admin,{
          ...adminBtn
         })
      }
    }
 
    ctx.answerCallbackQuery();
 }


