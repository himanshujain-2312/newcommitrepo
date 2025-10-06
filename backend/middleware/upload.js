import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    console.log(ext);
    const isValid = /\.(csv|xlsx|xls)$/.test(ext);
    isValid ? cb(null, true) : cb(new Error("Only Csv and excel files allowed!"));
  },
});

export default upload;
