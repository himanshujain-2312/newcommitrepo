import express from "express";
import upload from "../middleware/upload.js";
import { UploadFiles } from "../controllers/fileControllers.js";

const router = express.Router();

router.post("/upload", upload.single("file"), UploadFiles);

export default router;
