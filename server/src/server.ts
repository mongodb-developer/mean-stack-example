import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import path from "path";
import { connectToDatabase } from "./database";
import { employeeRouter } from "./employee.routes";

// Cloud Run defaults to 8080 but checking PORT is a best practice.
const port = Number(process.env["PORT"]) || 8080;

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
    console.error("No ATLAS_URI environment variable has been defined in config.env");
    process.exit(1);
}

connectToDatabase(ATLAS_URI)
    .then(() => {
        const app = express();
        app.use(cors());

        // API
        app.use("/employees", employeeRouter);

        // Serve client UI assets on root route /
        app.use(express.static(path.join(__dirname, "public")));

        // Start the Express server
        app.listen(port, () => {
            console.log(`Server listening on :${port}`);
        });
    })
    .catch(error => console.error(error));
