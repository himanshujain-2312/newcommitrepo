import { parentPort, workerData } from 'worker_threads';
import fs from 'fs';
import csv from 'csv-parser';
import xlsx from 'xlsx';



const {filePath , fileType , socketId } = workerData

function sendprocess(process){
    parentPort.postMessage({status:'in-process',process})
}

async function processFile() {
    try {
        if (fileType === 'csv') 
        {
            await processCsv(filePath);
        }
     else if (fileType === 'excel') 
        {
            await processExcel(filePath);
        } 
        else 
        {
            throw new Error('Unsupported file type');
        }
        parentPort.postMessage({ status: 'completed' });
    } 
    catch (error) {
        parentPort.postMessage({ status: 'error', error: error.message });
    } 
    finally 
    {
        fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete temp file:', err);
        });
    }
}

function processCsv(filePath){
    return new Promise((resolve,reject) => {
        const BATCH_SIZE = 1000
        const results = []
        let total = 0
        let processed = 0

        fs.createReadStream(filePath)
        .on('data',chunk => {
            total += chunk.toString().split('\n').length
        })
        .on('end', () => {
            fs.createReadStream(filePath)
            .pipe(csv()).on('data',(data) => {
            results.push(data)
            if(results.length >= BATCH_SIZE){
                processed += results.length
                sendProgress(results.splice(0,BATCH_SIZE),processed,total)
            }
        })      
        .on('end',()=> {
            if(results.length > 0) {
                processed += results.length
                sendProgress(results,processed,total)
            }
            resolve()
        })
        .on('error',reject)
    })
    .on('error',reject)
})
}
function processExcel(filePath){
    return new Promise((resolve,reject) => {
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet)

        const BATCH_SIZE = 1000;
        const total = data.length;
        let processed = 0

        for(let i=0; i < total; i += BATCH_SIZE){
            const chunk = data.slice(i , i, BATCH_SIZE)
            processed += chunk.length;
            sendProgress(chunk,processed,total)
        }
        resolve()
    })
}

function sendProgress (processed,total){
    const percent = Math.min(100,Math.round((processed/total) * 100))
    parentPort.postMessage({
        status:'in-progress', message:`Processed ${processed} of ${total} (${percent}%)`, progress:percent,
    })
}
processFile()