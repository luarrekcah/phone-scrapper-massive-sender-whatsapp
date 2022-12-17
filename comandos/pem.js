require('dotenv').config();
const SerpApi = require('google-search-results-nodejs')
const search = new SerpApi.GoogleSearch(process.env.serpapiKey)
const fs = require('fs');


module.exports.run = async (client, message, args) => {
    const q = args.join(" ");

    const text = fs.readFileSync(__dirname + '/../txts/pem.txt', 'utf8');

    if (!q) return client.sendText(
        message.from,
        `Você não me deu uma pesquisa para fazer. Exemplo: !pem restaurantes em ariquemes`
    );

    if (!text) return client.sendText(
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
            if (i.phone === undefined)return;
            const formated = i.phone.replaceAll("+", "").replaceAll(" ", "").replaceAll("-", "")
            if (formated.slice(4).startsWith("9")) {
                numbers.push(`${formated}@c.us`);
            }
        });

        if (numbers.length === 0) return client.sendText(
            message.from,
            `Ocorreu um problema com a pesquisa.`
        );

       /* numbers.forEach(num => {
            setTimeout(async () => {
                try {
                    client.sendText(
                        num,
                        text.toString()
                    );
                    await client
                        .sendFile(
                            num,
                            __dirname + '/../medias/proposta.pdf',
                            'Proposta',
                            `Aqui está a proposta!`
                        )
                    await client
                        .sendFile(
                            num,
                            __dirname + '/../medias/video.mp4',
                            'Vídeo',
                            ``
                        )
                } catch (error) {
                    console.log(error)
                }
                
            }, 3000)
        })*/

        console.log(numbers)

        return client.sendText(
            message.from,
            `Coletei e fiz o envio para ${numbers.length} empresas`
        );
    });
}