import PDFDocument from "pdfkit";
import { Readable } from "stream";

export interface PDFApplicationData {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  applicantName?: string;
}

export function generateApplicationThankYouPDF(data: PDFApplicationData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const chunks: Buffer[] = [];

      doc.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", (err: Error) => {
        reject(err);
      });

      // Header
      doc.fontSize(24).font("Helvetica-Bold").text("Thank You for Your Application!", {
        align: "center",
      });

      doc.moveDown(0.5);
      doc
        .fontSize(12)
        .font("Helvetica")
        .text(
          "We have received your application and appreciate your interest in joining our team.",
          {
            align: "center",
          },
        );

      doc.moveDown(1.5);

      // Application Details
      doc.fontSize(14).font("Helvetica-Bold").text("Application Details");
      doc.strokeColor("#cccccc").lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();

      doc.moveDown(0.5);

      const details = [
        { label: "Full Name:", value: data.fullName },
        { label: "Email:", value: data.email },
        { label: "Phone:", value: data.phone },
        { label: "Position Applied For:", value: data.jobTitle },
      ];

      details.forEach(({ label, value }) => {
        doc.fontSize(11).font("Helvetica-Bold").text(label, { width: 150 });
        doc.fontSize(11).font("Helvetica").text(value, { indent: 160, continued: false });
        doc.moveDown(0.3);
      });

      doc.moveDown(1);

      // Next Steps
      doc.fontSize(14).font("Helvetica-Bold").text("What Happens Next?");
      doc.strokeColor("#cccccc").lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();

      doc.moveDown(0.5);

      doc
        .fontSize(11)
        .font("Helvetica")
        .text(
          "Thank you for submitting your application. Our recruitment team will review your application carefully and will reach out to you very soon with updates regarding the next steps.",
          {
            align: "left",
            width: 495,
          },
        );

      doc.moveDown(1.5);

      // Footer
      doc
        .fontSize(10)
        .font("Helvetica")
        .text("If you have any questions, please feel free to contact us.", {
          align: "center",
        });

      doc.moveDown(0.3);
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#666666")
        .text("Generated on " + new Date().toLocaleDateString(), {
          align: "center",
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function generateApplicationDetailsPDF(
  applicationData: { [key: string]: string | boolean },
  jobTitle: string,
  userName: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const chunks: Buffer[] = [];

      doc.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", (err: Error) => {
        reject(err);
      });

      // Header
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Job Application Details", {
          align: "center",
        });

      doc.moveDown(0.3);

      doc
        .fontSize(11)
        .font("Helvetica")
        .text(`Position: ${jobTitle}`, {
          align: "center",
        });

      doc.moveDown(0.5);
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#666666")
        .text(
          `Applicant: ${userName} | Date: ${new Date().toLocaleDateString()}`,
          {
            align: "center",
          },
        );

      doc.moveDown(1.5);

      // Application Responses
      doc.fontSize(12).font("Helvetica-Bold").text("Application Responses");
      doc.strokeColor("#cccccc").lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();

      doc.moveDown(0.8);

      let isAlternate = false;
      Object.entries(applicationData).forEach(([fieldLabel, value]) => {
        // Background color for alternating rows
        if (isAlternate) {
          doc.rect(50, doc.y - 3, 495, 18).fill("#f5f5f5");
          doc.fillColor("#000000");
        }

        doc.fontSize(10).font("Helvetica-Bold").text(fieldLabel + ":", { indent: 10 });

        const valueStr = Array.isArray(value) ? value.join(", ") : String(value);
        doc
          .fontSize(10)
          .font("Helvetica")
          .text(valueStr, { indent: 20, width: 475, continued: false });

        doc.moveDown(0.5);
        isAlternate = !isAlternate;
      });

      doc.moveDown(1);

      // Footer
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Confidential", {
        align: "center",
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
