import { Context, session, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { Markup } from "telegraf";
import dotenv from 'dotenv'
import { startTraining, checkAnswer } from './handlers.js';

dotenv.config()

const bot = new Telegraf(process.env.TELEGRAM_API_KEY)
bot.use(session())

bot.telegram.setMyCommands([
    {command: 'start', description: 'Start training'}
])

bot.start((context) => {
    context.reply(
        'Hi!',
        Markup.keyboard(['Hiragana'])
            .resize()
            .oneTime()
    );
});

bot.hears('Hiragana', (context) => {
    startTraining(context, 'hiragana')
})

bot.on(message("text"), (context) => {
    const userAnswer = context.message.text;
    if (userAnswer.startsWith("/") || ["Hiragana", "Katakana"].includes(userAnswer)) {
        return;
    }

    checkAnswer(context, userAnswer);
});

bot.launch()
console.log('Bot started')
