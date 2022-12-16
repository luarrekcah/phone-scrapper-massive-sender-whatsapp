require('dotenv').config();
const SerpApi = require('google-search-results-nodejs')
const search = new SerpApi.GoogleSearch(process.env.serpapiKey)
const fs = require('fs');

module.exports.run = async (client, message, args) => {
    const q = args.join(" ");

    if (!q) return client.sendText(
        message.from,
        `Você não me deu uma pesquisa para fazer. Exemplo: !pem restaurantes em ariquemes`
    );

    const data = fs.readFileSync(__dirname + '/../txts/pem.txt', 'utf8');

    if (!data) return client.sendText(
        message.from,
        `Nao localizei meu template (pem.txt) na pasta "txts".`
    );

    const numbers = [];

    search.json({
        engine: "google_maps",
        type: "search",
        q,
    }, (result) => {
        const data = result.local_results;

        data.forEach(i => {
            if (i.phone === undefined &&
                !i.phone.replaceAll("+", "").replaceAll(" ", "").replaceAll("-", "").slice(4).startsWith("9"))
                return;

            numbers.push(`${i.phone.replaceAll("+", "").replaceAll(" ", "").replaceAll("-", "")}@c.us`);
        });

        if (numbers.length === 0) return client.sendText(
            message.from,
            `Ocorreu um problema com a pesquisa.`
        );

        numbers.forEach(num => {
            setTimeout(() => {
                client.sendText(
                    num,
                    data.toString() + `\n\n${(Math.random() + 1).toString(36).substring(7)}`
                );
            }, 3000)
        })

        return client.sendText(
            message.from,
            `Coletei e fiz o envio para ${numbers.length} empresas`
        );
    });
}