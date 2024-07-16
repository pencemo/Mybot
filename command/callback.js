import {statMarkup, helpMarkup, aboutMarkup, back} from './button.js'

export const Start = '*Welcome to Code Pro Bot 👋*\n\n_*I can convert Unicode to Ascii 😉*_\nSend your text here 📝\n\nUse /help for more\n\n★Join here 👉 @pencemodesign'
export const Help = '*⭕️ Hey; Follow these steps:* \n\n _● Send your Malayalam text here \n ● I will send some text \n ● Just copy & paste \n ● Select any Malayalam Ascii font \n ● For more go to @pencemodesign_\n\n⭕️ *Available Commands* \n\n /start : Checking bot online \n /help : For more help \n /about : For more about me \n /issues : letter problem\n /toadmin : Message to admin  \n\n*©️ @pencemodesigns*'
export const About = '📄 About the Bot\n\nThis bot converts Unicode to ASCII text. Use it to easily convert your texts. Contact @pencemodesign for more info.'
export const Admin = '👮‍♂️ Admin Commands :- \n\n●/users - Count of users\n●/allusers - List of all users\n●/search <userName> - Find User\n●/sendmessage <userName> <your text> - Send msg\n●/broadcast --<button> <link> - Brodcast\n●/blockusers <userName> - Block user\n●/unblockusers <userName> - Unblockusers user\n●/blockedusers List of blocked user'

export const callBack = (ctx) => {
    const callbackData = ctx.callbackQuery.data;
 
    if(callbackData === 'help'){
       ctx.editMessageText(Help,{
         parse_mode: 'MarkdownV2',
        ...helpMarkup
       })
    }else if(callbackData === 'about'){
       ctx.editMessageText(About, {
          // parse_mode: 'MarkdownV2',
          ...aboutMarkup
       })
    }else if(callbackData === 'start'){
       ctx.editMessageText(Start, {
          parse_mode: 'MarkdownV2',
          ...statMarkup
       });
    }else if(callbackData === 'admin'){
      if (!ctx.session.user || !ctx.session.user.isAdmin) {
        return ctx.editMessageText('You are not Admin 😂😂\n\n To connect with admin use /toadmin <Your Message>',{...back});
      }else{
        return ctx.editMessageText(Admin,{
          ...back
         })
      }
    }
 
    ctx.answerCallbackQuery();
 }



  // parse_mode: 'MarkdownV2',
        //   reply_markup:{
        //      inline_keyboard: [
        //         [
        //              {text: '🌟 Share Me 🌟', url:'http://t.me/share/url?url=https://t.me/Unicodepro_bot'}
        //          ],[
        //            {text: 'Back', callback_data: 'start'}
        //          ]
        //      ]
        //  }