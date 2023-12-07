import { Request, Response, Router } from "express";

import multer from "multer";

const multerConfig = multer();

const router = Router();

router.post("/products", multerConfig.single("file"), (request: Request, response: Response) => {
    console.log(request.file?.buffer.toString("utf-8"));


    return response.send();
});

router.get("/ola", (request: Request, response: Response) => {
    return response.json({ message: "Olá" });
});
export { router };