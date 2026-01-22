const { Bot } = require("grammy");

// Создаём объект бота
const bot = new Bot(""); // <-- place your bot token in this string



// обработка команды start
bot.command('start', (ctx) => {
    console.log(ctx.from);
    
    ctx.reply("Приветствую " + ctx.from.username + ". Я помогу тебе разобраться с возможностями ботов в telegram")
})

// обратка команды hepl
bot.command('help', (ctx) => {
    ctx.reply(
        `/start: кратко рассказывает про бота.
/help: выводит список доступных команд.`
    )
})


// обработка текста
bot.on("message:text", (ctx) => {
    console.log(ctx.message)

    // обработка неизвестных команд

    if (ctx.message.text.startsWith('/')) {
        ctx.reply('Неизвестаня команда. Со списком доступных команд можете ознакомиться по команде /help.')
        return
    }

    const messageLength = ctx.message.text.length;

    let message = '';

    //возвращаем перевёрнутое сообщение 

    for (let i = messageLength-1; i >= 0; i--) {
        message += ctx.message.text[i];
    }

    ctx.reply(message)

});

bot.start();