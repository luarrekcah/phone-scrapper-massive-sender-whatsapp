module.exports.run = async (client, message, args) => {
    return client.sendText(
        message.from,
        `
        Comandos:
        \n\n
        *!pem <pesquisa>* - Pesquisa e Envio Massivo: Pesquisa números no google maps e faz o envio
        \n
        *!ajuda* - Envia essa mensagem
        `
    );
}