const venom = require('venom-bot');
venom
  .create({
    session: 'session-name',
    multidevice: true
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

const start = async (client) => {

  client.onMessage((message) => {
    if (!message.sender.isMyContact && message.isGroupMsg) return;
    if (message.content === undefined) return;
    try {
      if (message.content.startsWith("!")) {
        console.log(message);
        let args = message.content.split(" ").slice(1);
        let command = message.content.split(" ")[0];
        command = command.slice("!".length);
        let commandFile = require(`./comandos/${command}.js`);

        return commandFile.run(client, message, args);
      }
    } catch (err) {
      console.log("o erro é :" + err);
      if (err.code == "MODULE_NOT_FOUND")
        return client.sendText(
          message.from,
          `${message.content} não é um comando`
        );
    }
  });
}
