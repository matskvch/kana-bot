import { Context, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { Markup } from "telegraf";
import dotenv from 'dotenv'

dotenv.config()

const bot = new Telegraf(process.env.TELEGRAM_API_KEY)

bot.telegram.setMyCommands([
    {command: 'test1', description: 'show test'},
    {command: 'test2', description: 'test 2 descr'}
])

bot.command('test1', (context) => {
    context.reply('Hello you pressed test 1')
})

bot.command('test2', (context) => {
    context.reply('Hello YOU pressed test 2')
})

bot.start((context) => {
    context.reply(
        'Hi!',
        Markup.keyboard(['Hiragana', 'Katakana'])
            .resize()
            .oneTime()
    );
});

bot.hears('Hiragana', (context) => {
    
})

// bot.on(message('text'), (context) => {
//     const text = context.message.text
//     todo.push(String(text)); //add to todo list

//     context.deleteMessage()

//     context.reply(`'${text}' added to todo list.`) //show what has been added
// })

bot.launch()

console.log('Bot started')