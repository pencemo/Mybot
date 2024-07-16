import { helpMarkup, aboutMarkup, home } from "./button.js"
import { Help, About } from "./callback.js"

const issuesMdg = '📝 Use letter below for solving ണ്ട problem; \n\n   ● MLKV & Apple cards  👉  ( @ ) \n   ● FML & MVM  👉 ( ï ) \n   ● Scribe  👉  ( > )\n\n📝 Use letter below for solving സ്റ്റ problem\n\n   ● All fonts 👉 ( Ì ) \n\n\n©️ @pencemodesign'

export const help = (ctx) => {
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
export const about = (ctx) => {
    ctx.reply(About, {
      //  parse_mode: 'MarkdownV2',
       ...home
    })
 }
export const issues = (ctx) => {
    ctx.reply(issuesMdg, {
      //  parse_mode: 'MarkdownV2',
       ...home
    })
 }
export const id = (ctx) => {
    ctx.reply(`ID : ${ctx.from.id}\nUser Name : @${ctx.from.username}`)
 }