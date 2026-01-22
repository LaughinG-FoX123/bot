const { Bot, InlineKeyboard } = require("grammy");


// Создаём объект бота
const bot = new Bot("8242094324:AAHMatw9XhDaiC7TXXetPLB33EPpzXSCRQ0"); // <-- place your bot token in this string

const userStat = new Map();

// Функция для приветствия пользователя
bot.command('start', async (ctx) => {
    saveUser(ctx.from.id)

    let userName = ctx.from.first_name || 'Пользователь';
    await ctx.reply("Привет, "+userName+"! Я бот 🤖, который может разворачивать текстовые сообщения и отвечать на команды.", { reply_markup: menuKeyboard });
    console.log("Приветствие отправлено пользователю: " + userName);
});

// Функция для команды /help
bot.command('help', async (ctx) => {
    const helpMessage =
        `Доступные команды:
        /start: Приветствие и описание возможностей бота
        /help: Список доступных команд
        ;`
    await ctx.reply(helpMessage);
    console.log('Пользователь запросил помощь.');
});


// Функция для обработки текстовых сообщений
bot.on('message:text', async (ctx) => {
    const userMessage = ctx.message.text.trim();

    // Если сообщение начинается с "/" - это команда
    if (userMessage.startsWith('/')) {
        // Неизвестная команда
        await ctx.reply('Неизвестная команда. Используйте /help для списка доступных команд.');
        console.log("Неизвестная команда от пользователя: " + userMessage);
        return;
    }

    if (userMessage.length === 0) {
        await ctx.reply('Пожалуйста, введите текст.');
        console.log('Пользователь отправил пустое сообщение или только пробелы.');
    } else {
        const reversedMessage = userMessage.split('').reverse().join('');
        await ctx.reply("Наоборот: " + reversedMessage);
        console.log("Ответ на сообщение: " + reversedMessage);
    }
})

function play(ctx) {
    let isWin = Math.random() >= 0.5;
    let choose = ctx.match;

    updateUserScore(ctx.from.id, isWin)

    if (isWin) {
        if (choose == "reshka") {
            ctx.reply("Выпала решка, победа", { reply_markup: playAgain });
        } else {
            ctx.reply("Выпал орел, победа", { reply_markup: playAgain });
        }
    } else {
        if (choose == "reshka") {
            ctx.reply("Выпал орел, поражение", { reply_markup: playAgain });
        } else {
            ctx.reply("Выпала решка, поражение", { reply_markup: playAgain });
        }
    }
}

const menuKeyboard = new InlineKeyboard()
    .text("Начать игру", "start_game")
    .text("Статистика", "statistic")

const playKeyboard = new InlineKeyboard()
    .text("Орел", "orel")
    .text("Решка", "reshka")

const playAgain = new InlineKeyboard()
    .text("Сыграть еще раз", "play_again")

bot.callbackQuery('start_game', (ctx) => {
    ctx.deleteMessage();
    ctx.answerCallbackQuery();
    ctx.reply("Выбери", { reply_markup: playKeyboard });
})

bot.callbackQuery('statistic', (ctx) => {
    ctx.deleteMessage();
    ctx.answerCallbackQuery();

    let user = userStat.get(ctx.from.id)

    ctx.reply(`Побед: ${user.wins}, Поражений: ${user.loses}`);
})

bot.callbackQuery('orel', (ctx) => {
    ctx.deleteMessage();
    ctx.answerCallbackQuery();
    play(ctx);
})

bot.callbackQuery('reshka', (ctx) => {
    ctx.deleteMessage();
    ctx.answerCallbackQuery();
    play(ctx);
})

bot.callbackQuery('play_again', (ctx) => {
    ctx.deleteMessage();
    ctx.answerCallbackQuery();
    ctx.reply("Выбери", { reply_markup: playKeyboard });
})

// Обработка ошибок
bot.catch((err) => {
    console.error('Произошла ошибка:', err);
})



function saveUser(user_id) {

if (userStat.get(user_id)) return;
    userStat.set(user_id, { wins: 0, loses: 0 })

    console.log('Пользователь сохранён: ', userStat)
}

function updateUserScore(user_id, isWin) {
    if(!userStat.get(user_id)) saveUser(user_id);

    let user = userStat.get(user_id)

    if (isWin) {
        user.wins += 1;
    } else {
        user.loses += 1;
    }
}

// Запуск бота
bot.start();
console.log('Бот запущен и ожидает сообщения...');