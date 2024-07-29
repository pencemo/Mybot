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
 
   // const user = await User.findOne({ username }).exec();
   let user;
      if (!isNaN(username)) {
        // Identifier is a number, treat it as chat ID
        user = await User.findOne(
          { chatId: username },
        ).exec();
      } else {
        // username is not a number, treat it as username or first name
        user = await User.findOne(
          {
            $or: [
              { username: username },
              { firstName: username }
            ]
          }
        ).exec();
      }
   if (user) {
     ctx.reply(`🔎 User found:\n\n● User ID: ${user.chatId}\n● Username: @${user.username}\n● Name: ${user.firstName} ${user.lastName && user.lastName}\n● Status: ${user.isBlocked ? 'Blocked ❌' : 'Active ✔️'}`);
   } else {
     ctx.reply(`User not found for ${username}`);
   }
 }


const deleteuser = async (ctx) => {
   if (!ctx.session.user || !ctx.session.user.isAdmin) {
     return ctx.reply('You are not authorized to use this command.');
   }
 
   const identifiers = ctx.message.text.split(' ').slice(1);
   if (identifiers.length === 0) {
     return ctx.reply('Please provide at least one identifier (username, first name, or chat ID) to delete.');
   }
 
   for (const identifier of identifiers) {
     try {
       let user;
       if (!isNaN(identifier)) {
         // Identifier is a number, treat it as chat ID
         user = await User.findOneAndDelete({ chatId: identifier }).exec();
       } else {
         // Identifier is not a number, treat it as username or first name
         user = await User.findOneAndDelete({
           $or: [
             { username: identifier },
             { firstName: identifier }
           ]
         }).exec();
       }
 
       if (user) {
         ctx.reply(`User ${identifier} has been deleted.`);
       } else {
         ctx.reply(`User ${identifier} not found.`);
       }
     } catch (error) {
       console.error(`Error deleting user ${identifier}:`, error);
       ctx.reply(`Failed to delete user ${identifier}.`);
     }
   }
 };
 

 export {id, search, issues, about, help, deleteuser}