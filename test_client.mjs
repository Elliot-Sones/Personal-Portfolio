import { Client } from "@gradio/client";
import fs from "fs";

async function run() {
    try {
        console.log("Reading noise_b64.txt...");
        const b64WithHeader = fs.readFileSync("noise_b64.txt", "utf-8").trim();
        // Remove header
        const b64 = b64WithHeader.split(",")[1];

        console.log("Creating Blob...");
        // Convert to buffer
        const buffer = Buffer.from(b64, "base64");
        // Create Blob
        const blob = new Blob([buffer], { type: "image/png" });

        console.log("Connecting to Client...");
        const client = await Client.connect("Eli181927/elliot_digit_classifier");

        console.log("Predicting...");
        const result = await client.predict("/predict_digit", [blob]);

        console.log("Result:");
        console.log(JSON.stringify(result, null, 2));

    } catch (e) {
        console.error("Error:", e);
    }
}

run();
