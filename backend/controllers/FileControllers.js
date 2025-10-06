import { Worker} from 'worker_threads'
import path from 'path'
import fs from 'fs'
import Item from '../model/fileModel.js';



export const UploadFiles = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "Please upload a file" });
        }

        const file = req.file;
        const ext = path.extname(file.originalname).toLowerCase();

        const fileType = ext === '.csv' ? 'csv' : ext === '.xlsx' || ext === '.xls' ? 'excel' : null;

        if (!fileType) {
            fs.unlinkSync(file.path);
            return res.status(400).send({ message: "Invalid file type. Please upload CSV or Excel file." });
        }

       
        await Item.create({ name: file.originalname, size: file.size });

        
        const worker = new Worker('./controllers/Workerthread.js', {
            workerData: 
            {
                filePath: file.path,
                fileType,
            }
        });

    
        worker.on('message', (msg) => {
            console.log("Message from worker:", msg);
            
        });

        worker.on('error', (err) => {
            console.error("Worker error:", err);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
            }
        });
        res.status(200).send({ message: "File uploaded and processing started" });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "File upload failed: " + err.message });
    }
};


