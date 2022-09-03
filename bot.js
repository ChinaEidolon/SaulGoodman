const Discord = require("discord.js")
const bot = new Discord.Client({ intents: ["Guilds",
        "GuildMessages", "GuildMembers", "MessageContent",] })
// const client = new Client({ intents: ["Guilds", "GuildVoiceStates"] });
const { MessageEmbed } = require("discord.js");

const config = require("./idea/config.json")

bot.on("ready", () => {
    console.log("All loaded up!")
});
// bot.on('messageCreate', async (message) => {
// //     // if (!interaction.isChatInputCommand()) return;
//     console.log("pick up");
//     // await interaction.reply('Pong!');
//     const user_input_faux = {input: message.content};
//     const user_input = JSON.stringify(user_input_faux);
//     console.log(user_input);
//
//
//
//     // jQuery.ajax({url:"/process", type: "POST", contentType: "application/json", data: JSON.stringify(user_input)});
//
//     if (message.content === 'ping') { // <--- this is not picking up
//         console.log("pick up");
// })

bot.on("messageCreate", async(message) => {
    // console.log("piece of shit");
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    if(message.content.indexOf(config.prefix) !== 0 && !message.member.permission.has('ADMINISTRATOR')){ return message.channel.send("gotta be a mod");}

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase()

    if (command === "help") {
        const helpEmbed = new Discord.EmbedBuilder().setTitle(`${bot.user.username}'s commands`).setDescription(`**Prefix:** ${config.prefix}`)
            .addField(`\`ping\``, `Check your bot's ping`)
            .addField(`\`kick\``, `Usage: **${config.prefix}kick [@User]**\n**${config.prefix}kick [@User][Reason]**`)
            .addField(`\`ban\``, `Usage: **${config.prefix}ban [@User]**\n**${config.prefix}ban [@User][Reason]**`)
            .addField(`\`add\``, `Adds a role to a user \nUsage: **${config.prefix}add [@User] [Role]**`)
            .addField(`\`remove\``, `Removes a role from a user \nUsage: **${config.prefix}remove [@User] [Role]**`)
            .addField(`\`purge\``, `Clears a number of messages between 2 or 100 \nUsage: **${config.prefix}purge [number]**`)
            .addField(`\`rps\``, `Play rock paper scissors`)
            .addField(`\`say\``, `Have the bot say something`)
        message.channel.send(helpEmbed)
    }

    if (command === "ping") {
        message.channel.send(`Pong **(${Date.now() - message.createdTimestamp}ms)**`)
    }

    if (command === "kick") {
        if (!message.member.permissions.has('KICK_MEMBERS'))
            return message.channel.send("Insufficient permissions (Requires permission `Kick members`)").then(msg => {
               // msg.delete({ timeout: 30000 })
            })
        const member = message.mentions.members.first();
        if (!member)
            return message.channel.send("You have not mentioned a user").then(msg => {
                //msg.delete({ timeout: 30000 })
            })
        if (!member.kickable)
            return message.channel.send("User is unkickable").then(msg => {
                //msg.delete({ timeout: 30000 })
            })
        const reason = args.slice(1).join(" ")
        if (member) {
            // return message.channel.send("responsive").then(msg => {})
            // return message.channel.send(member.toString()).then(msg => {})

            return member.kick().then(member => {
                message.channel.send(`${member.user.tag} was kicked, no reason was provided`);
            })
            // if (!reason) return member.kick().then(member => {
            //     message.channel.send(`${member.user.tag} was kicked, no reason was provided`);
            // })
            //
            // if (reason) return member.kick().then(member => {
            //     message.channel.send(`${member.user.tag} was kicked for ${reason}`);
            // })
        }
    }

    if (command === "ban") {
        if (!message.member.permissions.has('BAN_MEMBERS'))
            return message.channel.send("Insufficient permissions (Requires permission `Ban members`)").then(msg => {
                msg.delete({ timeout: 30000 })
            })
        const member = message.mentions.members.first();
        if (!member)
            return message.channel.send("You have not mentioned a user").then(msg => {
                msg.delete({ timeout: 30000 })
            })
        if (!member.bannable)
            return message.channel.send("This user is unbannable").then(msg => {
                msg.delete({ timeout: 30000 })
            })
        // const reason = args.slice(1).join(" ")
        if (member) {
            return member.ban().then(member => {
                message.channel.send(`${member.user.tag} was banned, no reason was provided`);
            })
        }
    }

    if (command === "add") { // add role
        if (!message.member.permission.has('MANAGE_ROLES'))
            return message.channel.send("Insufficient permissions (Requires permission `Manage roles`)").then(msg => {
                msg.delete({ timeout: 30000 })
            })
        const member = message.mentions.members.first();
        if (!member)
            return message.channel.send("You have not mentioned a user").then(msg => {
                msg.delete({ timeout: 30000 })
            })
        const add = args.slice(1).join(" ")
        if (!add)
            return message.channel.send("You have not specified a role").then(msg => {
                msg.delete({ timeout: 30000 })
            })
        const roleAdd = message.guild.roles.cache.find(role => role.name === add)
        if (!roleAdd)
            return message.channel.send("This role does not exist").then(msg => {
                msg.delete({ timeout: 30000 })
            })
        if (member.roles.cache.get(roleAdd.id))
            return message.channel.send(`This user already has the ${add} role`).then(msg => {
                msg.delete({ timeout: 30000 })
            })
        member.roles.add(roleAdd.id).then((member) => {
            message.channel.send(`${add} added to ${member.displayName}`)
        })
    }

    if (command === "remove") {
        if (!message.member.permissions.has('MANAGE_ROLES'))
            return message.channel.send("Insufficient permissions (Requires permission `Manage roles`)").then(msg => {
                msg.delete({ timeout: 30000 })
            })
        const member = message.mentions.members.first()
        if (!member)
            return message.channel.send("You have not mentioned a user").then(msg => {
                msg.delete({ timeout: 30000 })
            })
        const remove = args.slice(1).join(" ")
        if (!remove)
            return message.channel.send("You have not specified a role").then(msg => {
                msg.delete({ timeout: 30000 })
            })
        const roleRemove = message.guild.roles.cache.find(role => role.name === remove)
        if (!roleRemove)
            return message.channel.send("This role does not exist").then(msg => {
                msg.delete({ timeout: 30000 })
            })
        if (!member.roles.cache.get(roleRemove.id))
            return message.channel.send(`This user does not have the ${remove} role`).then(msg => {
                msg.delete({ timeout: 30000 })
            })
        member.roles.remove(roleRemove.id).then((member) => {
            message.channel.send(`${remove} removed from ${member.displayName}`)
        })
    }

    if (command === "say") {
        const text = args.join(" ")
        if(!text) return message.channel.send("You have not specified something to say").then(msg => {
            msg.delete({ timeout: 30000 })
        })
        message.channel.send(text)

    }

    if (command === "purge") {
        if(!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send("Insufficient permissions (requires permission `Manage messages`)").then(msg => {
            msg.delete({ timeout: 30000 })
        })
        const number = args.join(" ")
        if(!number) return message.channel.send("You haven't specified a number to purge").then(msg => {
            msg.delete({ timeout: 30000 })
        })
        message.channel.bulkDelete(number).catch(console.error)
        return message.channel.send("Just deleted " + number.toString() + " messages!")
    }

    if (command === "rps") {
        const options = [
            "rock :shell: ",
            "paper :newspaper2:",
            "scissors :scissors: "
        ]
        const option = options[Math.floor(Math.random() * options.length)]
        message.channel.send(`You got ${option}`)
    }

});


bot.login(config.token)

// const client = new Client({ intents: ["Guilds", "GuildVoiceStates"] });
// client.commands = new Collection();
// client.player = new Player(client);
// const token="MTAxMzQ2NjIxNTUwMDQ4NDY1OA.GDltZT.cWcSbjuAfU9ldWbUO1a53kyGwwkaFS6ByRLnGg"
//
// module.exports = client;
//
// // const config = require("./config");
//
//
// client.login(token);

// // const { Client, GatewayIntentBits,MessageEmbed } = require('discord.js');
// const { GatewayIntentBits, Client, Collection, MessageEmbed } =require('discord.js');
// const Discord = require("discord.js"); // require discord.js
// const discClient = new Discord.Client({
//     intents: [GatewayIntentBits.Guilds,
//         GatewayIntentBits.GuildMessages,
//         GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent,
//     ]
// }) // require the intents that we need to, read messages, see user, etc.
//
// // module.exports = {
// //     name: "userInfo",
// //     aliases: ['ui'],
// //     description: "mentioned member's information",
// // } // exports these things so that we can access them in another folder, i dont think we need to worry about this for now
//
//
// const TOKEN="MTAxMzQ2NjIxNTUwMDQ4NDY1OA.GDltZT.cWcSbjuAfU9ldWbUO1a53kyGwwkaFS6ByRLnGg"
//
//
//
//
// discClient.on('ready', () => {
//     console.log(`Logged in as ${discClient.user.tag}!`);
// });
//
//
//
// discClient.on('messageCreate', async (message) => {
//     // if (!interaction.isChatInputCommand()) return;
//     // console.log("pick up");
//     // await interaction.reply('Pong!');
//     const user_input_faux = {input: message.content};
//     const user_input = JSON.stringify(user_input_faux);
//     console.log(user_input);
//
//
//
//     // jQuery.ajax({url:"/process", type: "POST", contentType: "application/json", data: JSON.stringify(user_input)});
//
//     if (message.content === 'ping') { // <--- this is not picking up
//         console.log("pick up");
//         await message.reply('Pong!');
//         // if ping, get the number 5 from chatbot.py and print it here.
//     }
//
//
//     const args = message.content.slice(prefix.length).split(/ +/);
//     const command = args.shift().toLowerCase();
//
//     if (command === "kick") {
//         // if (!message.member.hasPermission('KICK_MEMBERS'))
//         //     return message.channel.send("Insufficient permissions (Requires permission `Kick members`)").then(msg => {
//         //         msg.delete({timeout: 30000})
//         //     })
//         await message.reply("hi");
//         const member = message.mentions.members.first();
//         console.log(member);
//         await message.reply(member);
//
//
//         if (!member)
//             await message.reply('Pong!');
//
//         return message.channel.send("You have not mentioned a user").then(msg => {
//                 msg.delete({timeout: 30000})
//             })
//     }
// });
//
//
// discClient.login(TOKEN);
//
//
//
//
// console.log("-------");
//
// //
//
//
//
//
// // pool.connect((err, client, done) => {
// //
// //
// //     if (err) throw err;
// //
// //     const callback = function(err, res) {
// //         if (err)
// //             console.log(err.stack);
// //         else {
// //             // console.log("table info 1: ");
// //             // console.log(res.rows[0]);
// //             tableInfo = JSON.stringify(res.rows);
// //             //
// //             // console.log('table info 2: ' + tableInfo);
// //             //
// //             // console.log('table info 3: ' + JSON.stringify(res.rows[0]));
// //
// //             discclient.on("messageCreate", msg => {
// //                 if (msg.content === "ping") {
// //                     msg.reply("testing:..." + tableInfo); // + roles
// //                 }
// //                 //
// //                 if (msg.content.startsWith("add")){
// //                     let member = msg.mentions.members.first();
// //                     let user = msg.member;
// //                     user = user.toString();
// //                     let usersname = JSON.stringify(msg.author.username);
// //                     let usersfull = JSON.stringify(msg.author.tag);
// //                     let rightPos=0;
// //                     let userstag;
// //                     for(let i = usersfull.length-1;i>=0;i--){
// //                         if(usersfull.charAt(i)=='#'){
// //                             rightPos = i;
// //                             break;
// //                         }
// //                     }
// //                     userstag = usersfull.substring(rightPos+1,usersfull.length-1);
// //                     // console.log(userstag);
// //                     // console.log(rightPos);
// //                     // console.log(usersfull.length);
// //                     // console.log("thing: ");
// //                     // console.log(userstag+5);
// //                     console.log(usersfull.substring(rightPos+1,usersfull.length-1));
// //
// //                     msg.reply(usersname + " " + JSON.stringify(userstag));
// //
// //                     // msg.reply(`${discclient.user.tag}`);
// //                     // msg.reply(user.username);
// //
// //                     pool.query(`INSERT INTO "discorduser" ("discordusername","discordtag") VALUES ('${msg.author.username}','${userstag}')`);
// //                     // INSERT INTO role('name') VALUES ('thing');
// //
// // // login through user of bot
// //
// //                     console.log(user.tag);
// //                     console.log(member);
// //                     //console.log(client.users.get(user).username);
// //
// //                 }
// //
// //             })
// //         }
// //         //    pool.end()
// //     }
// //
// //     client.query('SELECT name FROM role',callback) // a callback function is a code that is passed as an argument
// //     // the code is then run inside the function call
// //
// //
// // })
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// //const dbUser = _databaseHelper.select("audiobooks", {duration: 1479});
// // const dbUser = _databaseHelper.select("users", {id: 'cafaf8b8-f01b-4823-b6bd-b27acfe947f1'});
// //
// // const roles = _databaseHelper.select("role", {name: 'Testing'});
//
// // let resultExport;
// //
// // MongoClient.connect(url,function(err, client){
// //     var db = client.db('easyweb');
// //     // console.log("testing location of results----");
// //     // console.log(db.collection("role").findOne({id: "crap"}))
// //     // console.log("testing location of results----");
// //     db.collection('users').find().toArray((err,results) => {//{},function(err, {name: "hello"}
// //        if (err) throw err;
// //        resultExport=results;
// //         console.log("testing location of results 1 ----");
// //         console.log(results.name);
// //         console.log("testing location of results 1 ----");
// //
// //     //    client.close();
// //    });
// // });
// //
// // console.log("testing location of results 2 ----");
// // //console.log(resultExport);
// // console.log("testing location of results 2 ----");
//
//
//
//
//
//
//
//
// // var myDocument =
//
// // console.log("testing location----");
// //         //console.log(roles);
// //         console.log("testing location----");
//
//
//
// // MongoClient.connect(url ,function(err,db){
// //     if (err) throw err;
// //     var dbo = db.db("easyweb");
// //     dbo.collection("role").findOne({"name":"testing"},function(err,"name":"testing"){
// //         if (err) throw err;
// //         console.log("testing location----");
// //         console.log(result);
// //         console.log("testing location----");
// //         db.close();
// //     });
// // });
//
//
// // findResult = roles.find({
// //     name: 'Testing',
// //     //update: $,
// // });
//
// //db.role.insertOne( { id: 1 } )
//
//
//
// //console.log(cursor.forEach(console.dir))
//
// // console.log(dbUser)
// // console.log(roles)
//
