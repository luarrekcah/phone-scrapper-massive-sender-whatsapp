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

    let numbers = [];
    const files = [];

    fs.readdir(`${__dirname}/../medias`, (err, filesLoaded) => {
        console.log(filesLoaded)
        filesLoaded.forEach(file => {
            files.push(`${__dirname}/../medias/${file}`)
        });

        console.log(`Encontrei ${files.length} para envio.`);

        const config = {
            pages: 25,
            intervaloEnvio: 5
        }

        client.sendText(
            message.from,
            `*Pesquisando...*`
        );

        for (let index = 0; index < config.pages; index++) {
            search.json({
                engine: "google_maps",
                type: "search",
                ll: '@-10.3488815,-58.9089475,5.6z',
                start: index === 0 ? 0 : (index + 1) * 20,
                q,
            }, (result) => {
                if (result.local_results === undefined) return;
                result.local_results.forEach(i => {
                    if (i.phone === undefined) return;
                    const formated = i.phone.replaceAll("+", "").replaceAll(" ", "").replaceAll("-", "")
                    if (formated.slice(4).startsWith("9")) {
                        numbers.push(`${formated}@c.us`);
                    }
                });
            });
        }
    
        setTimeout(() => {
    
            if (numbers.length === 0) return client.sendText(
                message.from,
                `Ocorreu um problema com a pesquisa.`
            );
    
            client.sendText(
                message.from,
                `Coletei *${numbers.length}* números válidos de empresas.\n\nConfiguração do BOT: \n\nLimite de buscas: *${config.pages * 20} empresas* || Intervalo de envio: *${config.intervaloEnvio}s*\n\n\n*⚠️Realizando envio para os números⚠️*`
            );
    
            numbers.forEach(num => {
                setTimeout(async () => {
                    try {
                        client.sendText(
                            num,
                            text.toString()
                        );
                        files.forEach(async f => {
                            await client
                                .sendFile(
                                    num,
                                    f,
                                    '',
                                    ''
                                )
                        });
                    } catch (error) {
                        console.log(error)
                    }
                }, config.intervaloEnvio * 1000)
            })
        }, 10 * 1000);
    });
}