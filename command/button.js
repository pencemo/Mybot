import dotenv from "dotenv";
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
              {text: 'Back 🔙', callback_data: 'start'},
              {text: 'Admin 👮‍♂️', callback_data: 'admin'},
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



export {join, adminBtn, adminBack};