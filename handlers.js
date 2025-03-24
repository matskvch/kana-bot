import axios from 'axios'
// do not use arrow fn
const api_endpoint = 'http://localhost:4001'

export async function getAllKana(kanaTable) {
    try {
        const response = await axios.get(`${api_endpoint}/get_all_${kanaTable}`)
        return response.data
    } catch (error) {
        console.error('Fetching error:', error)
        return []
    }
}

export function getRandomKana(context) {
    if (!context.session.unusedKana) {
        //start new cycle of training
        context.session.unusedKana = [...context.session.allKana]
        context.reply('Kanas finished. Start new training.')
    }

    const randomIndex = Math.floor(Math.random() * context.session.unusedKana.length)
    const kana = context.session.unusedKana[randomIndex]
    context.session.unusedKana.splice(randomIndex, 1)
    return kana
}

export async function sendNextQuestion(context) {
    try {
        const randomKana = getRandomKana(context)
        context.session.currentKana = randomKana

        await context.replyWithPhoto(
            { url: randomKana.image_url },
            { caption: 'How this kana read?' }
        )
    } catch (error) {
        console.error('Error:', error)
        await context.reply('Error for sending kana.')
    }  
}

export async function startTraining(context, kanaTable) {
    try {
        const kanaList = await getAllKana(kanaTable)

        if (!kanaList) {
            await context.reply('Kana downloading error.')
            return
        }

        context.session = {
            type: kanaTable,
            allKana: kanaList,
            unusedKana: [...kanaList],
            currentKana: null,
            correctAnswers: 0,
            totalAnswers: 0
        }

        await sendNextQuestion(context)
    } catch (error) {
        console.log('Error:', error)
        await context.reply('Error occured while starting training.')
    }
}

export async function checkAnswer(context, userAnswer) {
    try {
        if (!context.session || context.session.currentKana) {
            await context.reply('Please start the training')
            return
        }

        const correctAnswer = context.session.currentKana.reading
        const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase()

        context.session.totalAnswers += 1
        if (isCorrect) {
            context.session.correctAnswers += 1
        }

        if (isCorrect) {
            await context.reply('✅ Correct!')
        } else {
            await context.reply(`❌ Incorrect. Correct reading is: ${correctAnswer}`)
        }

        await sendNextQuestion(context)
        
    } catch (error) {
        console.log('Error:', error)
        await context.reply('Error while checking answer')
    }
}