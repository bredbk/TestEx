import { Request, Response, Router } from "express";
import { Readable } from "stream";
import readline from "readline";

import multer from "multer";
import { prismaClient } from "./database/client";

const multerConfig = multer();

const router = Router();

interface IClient {
    id: number
    nome: string
    altura: number
    lactose: boolean
    peso: number
    atleta: boolean
}

router.post("/clients", multerConfig.single("file"), async (request: Request, response: Response) => {
    const { file } = request;
    if (file !== undefined) {

        const { buffer } = file;
        const readableFile = new Readable();
        readableFile.push(buffer);
        readableFile.push(null);

        const clientLine = readline.createInterface({
            input: readableFile
        });

        const clients: IClient[] = [];

        for await (let line of clientLine) {
            const clientLineSplit = line.split(";");

            
            clients.push({
                id: Number(clientLineSplit[0]),
                nome: clientLineSplit[1].trim(),
                altura: Number(parseFloat(clientLineSplit[2].replace(',', '.'))),
                lactose: clientLineSplit[3] === "0" ? false : true,
                peso: parseFloat(clientLineSplit[4].replace(',', '.')),
                atleta: clientLineSplit[5] === "0" ? false : true
            });
            
            
        } 
        for await (let { id, nome, altura, lactose, peso, atleta } of clients) {
            await prismaClient.clients.create({
                data: {
                    id,
                    nome,
                    altura,
                    lactose,
                    peso,
                    atleta
                }
            });
            console.log("Client created successfully");
        }
        return response.json(clients);
    } else {
        console.log("File is undefined");
    }

});

router.get("/clients", async (request: Request, response: Response) => {
    const clients = await prismaClient.clients.findMany();
    return response.json(clients);
});

router.get("/clients/:id", async (request: Request, response: Response) => {
    const { id } = request.params;
    const client = await prismaClient.clients.findFirst({
        where: {
            id: Number(id)
        }
    });
    return response.json(client);
});
router.get("/client/:name", async (request: Request, response: Response) => {
    const { name } = request.params;
    const client = await prismaClient.clients.findFirst({
        where: {
            nome: name
        }
    });
    return response.json(client);
});

export { router };