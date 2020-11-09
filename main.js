const Discord = require('discord.js')

const config = require('./config.json')

const fs = require('fs')

const moment = require('moment')

var client = new Discord.Client

client.msgs = require("./setup.json")

//-----------------------------------------------\\

Footername = "Cultura Bot - 2020"

Footer = "https://media.discordapp.net/attachments/760140818538299432/774343223110926426/discord-logo.png"

//-----------------------------------------------\\

client.on("ready", () => {
    console.log("Logged in as "+client.user.username+"...")
    client.user.setPresence({status: "idle"})
})

//-----------------------------------------------\\
//Setups

let userApplications = {}

client.on("message", function(message) {



    if(message.author.bot) return;
    let authorId = message.author.id;
    if(message.content === ".setup"){
        UsedServer = message.guild.id
        Servername = message.guild.name
        if(message.member.hasPermission("ADMINISTRATOR")){
            if (!(authorId in userApplications)) {
                userApplications[authorId] = { "step" : 1}
                const embed1 = new Discord.MessageEmbed()
                .setTitle('Setupsystem')
                .setDescription('*Willkommen beim Setup des Servers** \n \n **Um einzelne Sachen zu bearbeiten, musst du das ganze Setup erneut machen!**')
                .setColor('#06f81c')
                const embed02 = new Discord.MessageEmbed()
                .setTitle('Prefix')
                .setDescription('Welchen Prefix soll dieser Bot haben? (.setup bleibt unbeeinflusst)')
                .setColor('#ff7600')
                message.author.send(embed1);
                message.author.send(embed02);
            }
        }
        else{
            const noPermissions = new Discord.MessageEmbed()
            .setTitle("Keine Berechtigung")
            .setDescription("Du besitzt leider keine Berechtigung, um diesen Command nutzen zu können. Dieses Setup kann nur von Personen mit Administratorrechten ausgeführt werden. Im Setup kann jedoch eingestellt werden, welche Personen alle anderen Administratorcommands nutzen können.")
            .setColor("#FF0000")
            message.channel.send(noPermissions)
        }
    } 
    else if(message.channel.type === "dm" && authorId in userApplications) {
        let authorApplication = userApplications[authorId];
        if (authorApplication.step == 1 ) {
            authorApplication.answer1 = message.content;
            const embed2 = new Discord.MessageEmbed()
            .setTitle('Radiosystem')
            .setDescription('Wir haben ein Radiosystem. In welchem Channel soll dies laufen? (Schreibe "none", wenn kein Channel ausgewählt werden soll)')
            .setColor('#ff7600')
            message.author.send(embed2);
            authorApplication.step ++;
        }
        else if (authorApplication.step == 2) {
            authorApplication.answer2 = message.content;
            const embed3 = new Discord.MessageEmbed()
            .setTitle('Administratorrole')
            .setDescription('Welche Rollenid soll alle Administratorcommands nutzen können? (Schreibe "none", wenn nur Personen mit Administratorrolle die Administratorcommands nutzen dürfen)')
            .setColor('#ff7600')
            message.author.send(embed3);
            authorApplication.step ++;
        }
        else if (authorApplication.step == 3) {
            authorApplication.answer3 = message.content;
            const embed4 = new Discord.MessageEmbed()
            .setTitle('Botnews')
            .setDescription('Wir updaten den Bot regelmäßig. In welchen Channel sollen die neuesten Updateinformationen gesendet werden? (Schreibe "none", wenn keine Updateinformationen gesendet werden sollen.)')
            message.author.send(embed4);
            authorApplication.step ++;
        }
        else if (authorApplication.step == 4) {
            authorApplication.answer4 = message.content;
            message.author.send("**Alle angegebenen Informationen werden nun gespeichert und sind ab sofort wirkend (Dieser Vorgang kann bis zu 30 Sekunden dauern, bitte gedulde dich, falls es noch nicht funktioniert**");
            delete userApplications[authorId];
            client.msgs [UsedServer] = {
                servername: Servername,
                serverid: UsedServer,
                Prefix: authorApplication.answer1,
                RadioChannel: authorApplication.answer2,
                Administrator: authorApplication.answer3,
                Botnewschannel: authorApplication.answer4,
            };
        }
    }
    fs.writeFile("./setup.json", JSON.stringify(client.msgs, null, 4), err =>{
        if (err) throw err;
    })
        });


//-----------------------------------------------\\
//Prefix

client.on("message", (message)=>{
    if(message.author.bot) return;
    if(message.content.includes("prefix")){
        let Prefix = client.msgs[message.guild.id].Prefix
        const Prefixmessage = new Discord.MessageEmbed()
        .setTitle("Prefix")
        .setDescription('Der Prefix von diesem Bot auf diesem Server ist: "'+Prefix+'"')
        .setColor("#01e5a7")
        if(message.content === Prefix+"prefix"){
            message.channel.send(Prefixmessage)
        }
        else if(message.content === ".prefix"){
            message.channel.send(Prefixmessage)
        }
    }
})

//-----------------------------------------------\\
//Userinfo , Serverinfo , Aver

client.on("message" , async message => {
    if(message.author.bot) return;
    if(message.content.includes("serverinfo")) {
        let Prefix = client.msgs[message.guild.id].Prefix
        if(message.content === Prefix + "serverinfo"){
            var serverIcon = message.guild.iconURL();
            let embed1 = new Discord.MessageEmbed()
            .setTitle("<a:stern:774582248829616148> **Infos zum Server** <a:stern:774582248829616148> ")
            .setThumbnail(serverIcon)
            .addField("・Name: ", message.guild.name)
            .addField("・Inhaber: ", message.guild.owner, true)
            .addField("・Mitglieder: ", message.guild.memberCount)
            .addField("・Emojis: ", message.guild.emojis.cache.size)
            .addField("・Rollen: ", message.guild.roles.cache.size)
            .addField("・Region: ", message.guild.region)
            .addField("・Erstellt am: ", `${moment.utc(message.guild.createdAt).format("LLLL")}`)
            .setColor("#20ff00")
            .setFooter(Footername , Footer)
            .setTimestamp()
            message.channel.send(embed1)

        }
    }
})

client.on("guildCreate" , guild => {
    guild.owner.send("**Danke das du __Cultura Bot__ auf deinem Server eingeladen hast! Das Prefix kannst du mit .setup einstellen.**")
    message.guild.cache.get("753315155168985099").channels.cache.get("771840416269991976").send('Der Bot ist nun ein Server reicher!')

})


//-----------------------------------------------\\

client.on("message" , async message => {
    if(message.content.startsWith(".createticket")){
        let rawusername = message.author.username.split("").slice(0)

        let username = "";

        for(i=0;i<rawusername.length;i++){

            if(rawusername[i].toLowerCase() == "a"

            || rawusername[i].toLowerCase() == "b"

            || rawusername[i].toLowerCase() == "c"

            || rawusername[i].toLowerCase() == "d"

            || rawusername[i].toLowerCase() == "e"

            || rawusername[i].toLowerCase() == "f"

            || rawusername[i].toLowerCase() == "g"

            || rawusername[i].toLowerCase() == "h"

            || rawusername[i].toLowerCase() == "i"

            || rawusername[i].toLowerCase() == "j"

            || rawusername[i].toLowerCase() == "k"

            || rawusername[i].toLowerCase() == "l"

            || rawusername[i].toLowerCase() == "m"

            || rawusername[i].toLowerCase() == "n"

            || rawusername[i].toLowerCase() == "o"

            || rawusername[i].toLowerCase() == "p"

            || rawusername[i].toLowerCase() == "q"

            || rawusername[i].toLowerCase() == "r"

            || rawusername[i].toLowerCase() == "s"

            || rawusername[i].toLowerCase() == "t"

            || rawusername[i].toLowerCase() == "u"

            || rawusername[i].toLowerCase() == "v"

            || rawusername[i].toLowerCase() == "w"

            || rawusername[i].toLowerCase() == "x"

            || rawusername[i].toLowerCase() == "y"

            || rawusername[i].toLowerCase() == "z"

            || rawusername[i].toLowerCase() == "0"

            || rawusername[i].toLowerCase() == "1"

            || rawusername[i].toLowerCase() == "2"

            || rawusername[i].toLowerCase() == "3"

            || rawusername[i].toLowerCase() == "4"

            || rawusername[i].toLowerCase() == "5"

            || rawusername[i].toLowerCase() == "6"

            || rawusername[i].toLowerCase() == "7"

            || rawusername[i].toLowerCase() == "8"

            || rawusername[i].toLowerCase() == "9"){

                username+=rawusername[i].toLowerCase();

            }

        }

        if(message.channel.name !== "ticket") return (await message.reply("DU kannst hier kein Ticket erstellen!")).then(msg=>msg.delete({timeout:"5000"}));

        message.delete()

        let kategroy = message.guild.channels.cache.find(ct=>ct.name === "tickets" && ct.type === "category");

        if(!kategroy) await message.guild.channels.create("tickets" , {type:"category"}).then(cat=>kategroy = cat);

        if(message.guild.channels.cache.find(cha=>cha.name === `ticket-${username.toLowerCase()}`)) return message.reply("Du hast bereits ein ticket!").then(msg=>msg.delete({timeout:"5000"}));

        let supporterRole = message.guild.roles.cache.find(rl=>rl.name ==="Supporter")

        if(!supporterRole) return message.reply("Es gibt keine Supporter Rolle").then(msg=>msg.delete({timeout:"5000"}));

        await message.guild.channels.create(`ticket-${message.author.username}`,{type:"text"}).then(ch=>{
            ch.setParent(kategroy);
            ch.overwritePermissions([
                {
                    id:message.guild.id,
                    deny:["SEND_MESSAGES","VIEW_CHANNEL","ATTACH_FILES"]
                },
                {
                    id:message.author.id,
                    allow:["SEND_MESSAGES","VIEW_CHANNEL","ATTACH_FILES"]
                },
                {
                    id:supporterRole.id,
                    allow:["SEND_MESSAGES","VIEW_CHANNEL","ATTACH_FILES"]
                }
            ]);

            ch.send(`Hey <@&${supporterRole.id}> `);

        }).catch(err=>{
            if(err) return message.channel.send(err)
        })

        message.reply("EIn Ticket wurde erstellt beschreibe dein Problem").then(msg=>msg.delete({timeout:"9000"}));
    }

    if(message.content.startsWith(".closeticket")){
        let rawusername = message.author.username.split("").slice(0)

        let username = "";

        for(i=0;i<rawusername.length;i++){

            if(rawusername[i].toLowerCase() == "a"

            || rawusername[i].toLowerCase() == "b"

            || rawusername[i].toLowerCase() == "c"

            || rawusername[i].toLowerCase() == "d"

            || rawusername[i].toLowerCase() == "e"

            || rawusername[i].toLowerCase() == "f"

            || rawusername[i].toLowerCase() == "g"

            || rawusername[i].toLowerCase() == "h"

            || rawusername[i].toLowerCase() == "i"

            || rawusername[i].toLowerCase() == "j"

            || rawusername[i].toLowerCase() == "k"

            || rawusername[i].toLowerCase() == "l"

            || rawusername[i].toLowerCase() == "m"

            || rawusername[i].toLowerCase() == "n"

            || rawusername[i].toLowerCase() == "o"

            || rawusername[i].toLowerCase() == "p"

            || rawusername[i].toLowerCase() == "q"

            || rawusername[i].toLowerCase() == "r"

            || rawusername[i].toLowerCase() == "s"

            || rawusername[i].toLowerCase() == "t"

            || rawusername[i].toLowerCase() == "u"

            || rawusername[i].toLowerCase() == "v"

            || rawusername[i].toLowerCase() == "w"

            || rawusername[i].toLowerCase() == "x"

            || rawusername[i].toLowerCase() == "y"

            || rawusername[i].toLowerCase() == "z"

            || rawusername[i].toLowerCase() == "0"

            || rawusername[i].toLowerCase() == "1"

            || rawusername[i].toLowerCase() == "2"

            || rawusername[i].toLowerCase() == "3"

            || rawusername[i].toLowerCase() == "4"

            || rawusername[i].toLowerCase() == "5"

            || rawusername[i].toLowerCase() == "6"

            || rawusername[i].toLowerCase() == "7"

            || rawusername[i].toLowerCase() == "8"

            || rawusername[i].toLowerCase() == "9"){

                username+=rawusername[i].toLowerCase();

            }

        }

        if(!message.channel.name.includes("ticket") || message.channel.name === "ticket") return;

        if(message.channel.name !== `ticket-${username.toLowerCase()}` && !message.member.roles.cache.find(rl=>rl.name==="Supporter")) return message.reply("Ist nicht dein Ticket").then(msg=>msg.delete({timeout:"5000"}));

        await message.channel.send("Ticket wird geschlossen...");

        await message.channel.delete().catch(err=>{
            if(err) return console.error("Fehler passiert: "+err);

        })

         


    }
})


client.on("message" , async message =>{
    let Prefix = client.msgs[message.guild.id].Prefix
    const args = message.content.slice(Prefix).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(command === Prefix + "clear") {
        const deleteCount = parseInt(args[0], 10);
        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
          return message.channel.send("<a:632933525078802452:769141799205470208> | **Bitte gebe eine Zahl von 1 - 100 an!**");
        const fetched = await message.channel.messages.fetch({limit: deleteCount});
        message.channel.bulkDelete(fetched)
        message.channel.send("<a:Jaa:769141799452278837> | **Es wurden __"+deleteCount+"__ Nachrichten gelöscht!**").then(msg=>msg.delete({timeout:"3000"}));
    }

    if(!message.member.hasPermission("BAN_MEMBERS")) return;
    if(message.content.startsWith(Prefix + "ban")) {
        const WAS = message.content.split(' ').slice(2);
        const user = message.mentions.users.first();
        if (user) {
          const member = message.guild.member(user);
          if (member) {
            member.ban({
              reason: `${WAS}`,
            }).then(() => {
              const banembed = new Discord.MessageEmbed()
              .setTitle('**Ein User wurde gebannt!**')
              .setDescription(`<:Pfeil:768087037127032874> User: \n ${user.tag} \n \n <:Pfeil:768087037127032874> Grund: \n ${WAS} `)
              .setColor('#16ff00')
              .setFooter(message.author.username , message.author.avatarURL())
              message.channel.send(banembed)
            }).catch(err => {
              message.channel.send('<a:Einstellung:774582945243594792> | **Du hast keine Rechte!**');
              console.error(err);
            });
          } else {
            message.channel.send('<a:Loading:768452983242358815> | **Der User befindet sich nicht auf diesen Server!**');
          }
        } else {
          message.channel.send('<a:NervigerPing:774960199101841408> | **Erwähne bitte ein User!**');
        }
      }

      if(!message.member.hasPermission("KICK_MEMBERS")) return;
      if(message.content.startsWith(Prefix + "kick")) {
          const WAS2 = message.content.split(' ').slice(2);
          const user = message.mentions.users.first();
          if (user) {
            const member = message.guild.member(user);
            if (member) {
              member.kick({
                reason: `${WAS2}`,
              }).then(() => {
                const banembed = new Discord.MessageEmbed()
                .setTitle('**Ein User wurde gekickt!**')
                .setDescription(`<:Pfeil:768087037127032874> User: \n ${user.tag} \n \n <:Pfeil:768087037127032874> Grund: \n ${WAS2} `)
                .setColor('#16ff00')
                .setFooter(message.author.username , message.author.avatarURL())
                message.channel.send(banembed)
              }).catch(err => {
                message.channel.send('<a:Einstellung:774582945243594792> | **Du hast keine Rechte!**');
                console.error(err);
              });
            } else {
              message.channel.send('<a:Loading:768452983242358815> | **Der User befindet sich nicht auf diesen Server!**');
            }
          } else {
            message.channel.send('<a:NervigerPing:774960199101841408> | **Erwähne bitte ein User!**');
          }
        }

    
})




  
client.login(config.token)