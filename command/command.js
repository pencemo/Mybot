import { helpMarkup, aboutMarkup, home } from "./button.js"
import { Help, About } from "./callback.js"
import { db, User } from './db.js';

const issuesMdg = '📝 Use letter below for solving ണ്ട problem; \n\n   ● MLKV & Apple cards  👉  ( @ ) \n   ● FML & MVM  👉 ( ï ) \n   ● Scribe  👉  ( > )\n\n📝 Use letter below for solving സ്റ്റ problem\n\n   ● All fonts 👉 ( Ì ) \n\n\n©️ @pencemodesign'

const help = (ctx) => {
    ctx.reply(Help, {
       parse_mode: 'MarkdownV2',
       reply_markup:{
         inline_keyboard: [
            [
                 {text: '🌟 Share Me 🌟', url:'http://t.me/share/url?url=https://t.me/Unicodepro_bot'}
             ],[
               {text: 'Home', callback_data: 'start'}
             ]
         ]
     }
    })
 }

 const about = (ctx) => {
    ctx.reply(About, {
       ...home
    })
 }

 const issues = (ctx) => {
    ctx.reply(issuesMdg, {
       ...home
    })
 }

 const id = (ctx) => {
    ctx.reply(`ID : ${ctx.from.id}\nUser Name : @${ctx.from.username}`)
 }


const search = async (ctx) => {
   if (!ctx.session.user || !ctx.session.user.isAdmin) {
     return ctx.reply('You are not authorized to use this command.');
   }
 
   const username = ctx.message.text.split(' ')[1];
   if (!username) {
     return ctx.reply('Please provide a username to search.');
   }
 
   const user = await User.findOne({ username }).exec();
   if (user) {
     ctx.reply(`User found:\nUsername: @${user.username}\nName: ${user.firstName} ${user.lastName}`);
   } else {
     ctx.reply('User not found.');
   }
 }


 export {id, search, issues, about, help}