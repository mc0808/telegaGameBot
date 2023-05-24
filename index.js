const TelegramApi = require ('node-telegram-bot-api');

const {gameOptions, againOptions} = require ('./option');
const token = '5940916186:AAFoARjmEd9YMFJ7thDC3tuDL-g816Elkjk';

const bot = new TelegramApi(token, {polling: true});

const chats = {};


const startGame =  async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9 а ты должен ее угадать!');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}
const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Стартовая команда'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Игра угадай число'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/h/helltakerhent/helltakerhent_001.webp')
            return bot.sendMessage(chatId, 'Добро пожаловать в телеграм чат бот')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}, ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId);
            
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю')
    });
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Ты угадал! цифра ${chats[chatId]}`, againOptions )
        } else {
            return bot.sendMessage(chatId, `К сожалению я загадал другую цифру ${chats[chatId]}`, againOptions)
        }

        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
        
    })
}

start()