import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";

export async function POST(request: NextRequest) {
    try {
        const { image } = await request.json();

        if (!image) {
            return NextResponse.json(
                { error: "No image data provided" },
                { status: 400 }
            );
        }

        // Parse base64 string
        const matches = image.match(/^data:(image\/[a-z]+);base64,(.+)$/);
        let mimeType = "image/png";
        let base64Data = image;

        if (matches && matches.length === 3) {
            mimeType = matches[1];
            base64Data = matches[2];
        } else if (image.includes(',')) {
            base64Data = image.split(',')[1];
        }

        const buffer = Buffer.from(base64Data, 'base64');
        const blob = new Blob([buffer], { type: mimeType });

        // Connect to Gradio and get prediction
        const client = await Client.connect("Eli181927/elliot_digit_classifier");
        const result = await client.predict("/predict_digit", [blob]);

        const data = result.data;

        if (Array.isArray(data) && data.length >= 2) {
            const labelComponent = data[1];
            const diagnostics = data[3] || {};

            if (labelComponent && typeof labelComponent === "object") {
                const prediction = data[0] !== null ? String(data[0]) : labelComponent.label;
                const confidences = labelComponent.confidences || [];

                return NextResponse.json({
                    prediction,
                    confidences,
                    diagnostics,
                    success: true,
                });
            }
        }

        return NextResponse.json(
            { error: "Unexpected response format" },
            { status: 500 }
        );

    } catch (error) {
        console.error("Prediction error:", error);
        return NextResponse.json(
            {
                error: "Failed to get prediction",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
