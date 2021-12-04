const http = require("http");
const fs = require("fs");
const path = require("path");
const { getReqData, getSpellCheck } = require("./utils");

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req: any, res: any) => {
    if (req.url === "/api/check" && req.method === "POST") {
        getReqData(req).then(async (data: any) => {
            let stringsFile = data.split('\n');
            const text = stringsFile
                .slice(4, stringsFile.length - 2)
                .join('');

            getSpellCheck(text).then(async (resultSpellCheck: any) => {
                let resultString = text;
                for (const result of resultSpellCheck) {
                    resultString = await resultString.replaceAll(result.word, result.s[0]);
                }
                let writeStream = fs.createWriteStream(path.normalize(__dirname + '/result.txt'));
                writeStream.write(resultString);
                res.writeHead(200, { "Content-Type": "text/plain", "Content-Disposition": "form-data;filename=result.txt" });
                res.end(resultString);
            }).catch((err: any) => res.end("Error!"));

        }).catch((err: any) => res.end("Error!"))
    }

    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end("Route not found!");
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});

module.exports = server;