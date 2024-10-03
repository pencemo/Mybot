import dotenv from "dotenv";
import { InlineKeyboard } from "grammy";
dotenv.config()

const channelUserName = process.env.CHANNEL_USERNAME;

export const statMarkup = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Support Group 👩‍💻', url: 'https://t.me/pencemodesign' }
            ],
            [
                { text: 'Help ⚙️', callback_data: 'help' },
                { text: 'About 📝', callback_data: 'about' }
            ]
        ]
    }
}
export const helpMarkup = {
    reply_markup:{
        inline_keyboard: [
           [
               {text: 'Admin 👮‍♂️', callback_data: 'admin'},
              {text: 'Back 🔙', callback_data: 'start'},
            ],[
                { text: 'Download App 📱', url: `https://www.amazon.com/dp/B0DFPT4JWG/ref=apps_sf_sta` }
            ]
        ]
    }
}
export const aboutMarkup = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Back 🔙', callback_data: 'start' }
            ]
        ]
    }
}
export const back = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Back 🔙', callback_data: 'help' }
            ]
        ]
    }
}
export const home = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Home 🏠', callback_data: 'start' }
            ]
        ]
    }
}
const join = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Join Here 👩‍🦯', url: `https://t.me/${channelUserName}` }
            ]
        ]
    }
}

const adminBtn = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Commands 📝', callback_data: 'command' },
                { text: 'Users 👤', callback_data: 'users' }
            ],
            [
                { text: 'Blocked 🔕', callback_data: 'blockuser' },
                { text: 'Home 🏠', callback_data: 'start' }
            ],
            [
                { text: 'Back 🔙', callback_data: 'help' },
            ]
        ]
    }
}

const adminBack = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Back 🔙', callback_data: 'admin' }
            ]
        ]
    }
}



function buildPaginationKeyboard(userId, page, totalPages) {
    const buttons = [];

    if (page > 1) {
        buttons.push({ text: 'Previous', callback_data: `page:${userId}:${page - 1}` });
    }

    if (page < totalPages) {
        buttons.push({ text: 'Next', callback_data: `page:${userId}:${page + 1}` });
    }

    if (buttons.length > 0) {
        // Create a new row for pagination controls
        return new InlineKeyboard().add(...buttons);
    }

    return new InlineKeyboard();
}


function PaginationKeyboard(userId, page, totalPages) {
    const buttons = [];
  
    if (page > 1) {
        buttons.push({ text: '⏪ Previous ', callback_data: `page:${userId}:${page - 1}` });
    }
  
    if (page < totalPages) {
        buttons.push({ text: 'Next ⏩', callback_data: `page:${userId}:${page + 1}` });
    }
  
    if (buttons.length > 0) {
        // Create a new row for pagination controls
        // return new InlineKeyboard().add(...buttons);
        return buttons
    }
  
    return [];
  }
  

export {join, adminBtn, adminBack, buildPaginationKeyboard, PaginationKeyboard};