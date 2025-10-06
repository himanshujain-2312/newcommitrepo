import React, { useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Button, ProgressBar, Alert } from "react-bootstrap";

const socket = io("http://localhost:5000");
// console.log("Socket Connected",socket)
const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const FileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const Upload = async () => {
    if (!file) {
      setError("Please Select File");
      return;
    }

    setError("");
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log(data)
      const socketId = data.socketid;

      socket.emit("file_upload", { socketId });

      socket.on("progress", (progressdata) => {
        setProgress(progressdata.progress);
        setMessage(progressdata.message);
      });
    } catch (error) {
      console.error("File Upload Failed", error);
      setError("Error Has been raised in uploading file");
      setIsUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Upload File Here</h2>
      <div className="mb-3">
        <input type="file" className="form-control" onChange={FileChange} />
      </div>

      <Button variant="primary" onClick={Upload} disabled={isUploading}className="mb-3">
        {isUploading ? "Uploading....." : "Upload File"}
      </Button>

      {error && <Alert variant="danger">{error}</Alert>}

      {isUploading && (
        <div>
          <p>{message}</p>
          <ProgressBar now={progress} label={`${progress}%`} />
        </div>
      )}

      {progress === 100 && !error && !isUploading && (
        <Alert variant="success">Upload Complete!</Alert>
      )}
    </div>
  );
};

export default FileUpload;
