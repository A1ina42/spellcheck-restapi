const https = require('https');

// Получить данные из файла от пользователя
export function getReqData(req: any) {
    return new Promise((resolve, reject) => {
        try {
            let chunks = "";
            req.on("data", (chunk: any) => {
                chunks += chunk.toString();
            });
            req.on("end", () => {
                resolve(chunks);
            });
        } catch (err) {
            reject(err);
        }
    });
}

// Получить от api слова, в которых есть опечатки
export async function getSpellCheck(text: string) {
    const url = 'https://speller.yandex.net/services/spellservice.json/checkText?text=';

    return new Promise((resolve, reject) => {
        https.get(url + text, (res: any) => {
            let data = "";
            res.on('data', (chunk: any) => { data += chunk.toString() })
            res.on('end', () => {
                resolve(JSON.parse(data));
            })
            res.on('error', (err: any) => {
                reject(err)
            })
        })
    })
}
