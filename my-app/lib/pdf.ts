import PDFDocument from "pdfkit";
import { existsSync } from "fs";
import { join } from "path";

const DEFAULT_PDF_FONT_PATH = join(
  process.cwd(),
  "node_modules",
  "next",
  "dist",
  "compiled",
  "@vercel",
  "og",
  "Geist-Regular.ttf",
);

function resolvePdfFontPath(): string | undefined {
  if (existsSync(DEFAULT_PDF_FONT_PATH)) {
    return DEFAULT_PDF_FONT_PATH;
  }

  return undefined;
}

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
      const fontPath = resolvePdfFontPath();
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        ...(fontPath ? { font: fontPath } : {}),
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
      doc.fontSize(24).font(fontPath || "Helvetica").text("Thank You for Your Application!", {
        align: "center",
      });

      doc.moveDown(0.5);
      doc
        .fontSize(12)
        .font(fontPath || "Helvetica")
        .text(
          "We have received your application and appreciate your interest in joining our team.",
          {
            align: "center",
          },
        );

      doc.moveDown(1.5);

      // Application Details
      doc.fontSize(14).font(fontPath || "Helvetica").text("Application Details");
      doc.strokeColor("#cccccc").lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();

      doc.moveDown(0.5);

      const details = [
        { label: "Full Name:", value: data.fullName },
        { label: "Email:", value: data.email },
        { label: "Phone:", value: data.phone },
        { label: "Position Applied For:", value: data.jobTitle },
      ];

      details.forEach(({ label, value }) => {
        doc.fontSize(11).font(fontPath || "Helvetica").text(label, { width: 150 });
        doc.fontSize(11).font(fontPath || "Helvetica").text(value, { indent: 160, continued: false });
        doc.moveDown(0.3);
      });

      doc.moveDown(1);

      // Next Steps
      doc.fontSize(14).font(fontPath || "Helvetica").text("What Happens Next?");
      doc.strokeColor("#cccccc").lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();

      doc.moveDown(0.5);

      doc
        .fontSize(11)
        .font(fontPath || "Helvetica")
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
        .font(fontPath || "Helvetica")
        .text("If you have any questions, please feel free to contact us.", {
          align: "center",
        });

      doc.moveDown(0.3);
      doc
        .fontSize(9)
        .font(fontPath || "Helvetica")
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
      const fontPath = resolvePdfFontPath();
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        ...(fontPath ? { font: fontPath } : {}),
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
        .font(fontPath || "Helvetica")
        .text("Job Application Details", {
          align: "center",
        });

      doc.moveDown(0.3);

      doc
        .fontSize(11)
        .font(fontPath || "Helvetica")
        .text(`Position: ${jobTitle}`, {
          align: "center",
        });

      doc.moveDown(0.5);
      doc
        .fontSize(10)
        .font(fontPath || "Helvetica")
        .fillColor("#666666")
        .text(
          `Applicant: ${userName} | Date: ${new Date().toLocaleDateString()}`,
          {
            align: "center",
          },
        );

      doc.moveDown(1.5);

      // Application Responses
      doc.fontSize(12).font(fontPath || "Helvetica").text("Application Responses");
      doc.strokeColor("#cccccc").lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();

      doc.moveDown(0.8);

      let isAlternate = false;
      Object.entries(applicationData).forEach(([fieldLabel, value]) => {
        // Background color for alternating rows
        if (isAlternate) {
          doc.rect(50, doc.y - 3, 495, 18).fill("#f5f5f5");
          doc.fillColor("#000000");
        }

        doc.fontSize(10).font(fontPath || "Helvetica").text(fieldLabel + ":", { indent: 10 });

        const valueStr = Array.isArray(value) ? value.join(", ") : String(value);
        doc
          .fontSize(10)
          .font(fontPath || "Helvetica")
          .text(valueStr, { indent: 20, width: 475, continued: false });

        doc.moveDown(0.5);
        isAlternate = !isAlternate;
      });

      doc.moveDown(1);

      // Footer
      doc.fontSize(9).font(fontPath || "Helvetica").fillColor("#666666").text("Confidential", {
        align: "center",
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export interface AdmitCardPDFData {
  applicationId: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  appliedDate: Date;
  citizenshipNumber?: string;
  dobAD?: string;
  photoUrl?: string;
}

function toCloudinaryJpgUrl(url: string): string {
  if (!url.includes("/upload/")) {
    return url;
  }

  return url.replace("/upload/", "/upload/f_jpg/");
}

export async function generateApplicationAdmitCardPDF(
  data: AdmitCardPDFData,
): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const fontPath = resolvePdfFontPath();
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
        ...(fontPath ? { font: fontPath } : {}),
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

      const cardX = 40;
      const cardY = 60;
      const cardWidth = 515;
      const cardHeight = 720;

      doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 12).fillAndStroke("#f8fbfc", "#0f766e");

      doc
        .rect(cardX, cardY, cardWidth, 110)
        .fill("#0f766e");

      doc
        .fillColor("#ffffff")
        .fontSize(10)
        .font(fontPath || "Helvetica")
        .text("OFFICIAL DOCUMENT", cardX + 24, cardY + 20, {
          width: 220,
          align: "left",
        });

      doc
        .font(fontPath || "Helvetica")
        .fontSize(28)
        .text("ADMIT CARD", cardX + 24, cardY + 36, {
          width: 300,
        });

      doc
        .font(fontPath || "Helvetica")
        .fontSize(11)
        .text(`Application ID: ${data.applicationId}`, cardX + 24, cardY + 78, {
          width: 260,
        });

      const photoX = cardX + cardWidth - 124;
      const photoY = cardY + 18;
      const photoW = 84;
      const photoH = 96;

      doc.roundedRect(photoX - 2, photoY - 2, photoW + 4, photoH + 4, 6).fill("#ffffff");

      if (data.photoUrl) {
        try {
          const imageResponse = await fetch(toCloudinaryJpgUrl(data.photoUrl));
          if (imageResponse.ok) {
            const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
            doc.image(imageBuffer, photoX, photoY, {
              fit: [photoW, photoH],
              align: "center",
              valign: "center",
            });
          }
        } catch (error) {
          console.error("Failed to render admit card photo:", error);
        }
      }

      doc
        .lineWidth(0.6)
        .strokeColor("#9ca3af")
        .rect(photoX, photoY, photoW, photoH)
        .stroke();

      const contentX = cardX + 24;
      let contentY = cardY + 138;

      doc.fillColor("#0f172a");
      doc.font(fontPath || "Helvetica").fontSize(14).text("Applicant Information", contentX, contentY);
      contentY += 22;

      const rows: Array<{ label: string; value: string }> = [
        { label: "Full Name", value: data.fullName || "-" },
        { label: "Email", value: data.email || "-" },
        { label: "Phone", value: data.phone || "-" },
        { label: "Position", value: data.jobTitle || "-" },
        {
          label: "Applied Date",
          value: new Date(data.appliedDate).toLocaleDateString("en-GB"),
        },
      ];

      if (data.citizenshipNumber) {
        rows.push({ label: "Citizenship No.", value: data.citizenshipNumber });
      }

      if (data.dobAD) {
        rows.push({ label: "Date of Birth", value: data.dobAD });
      }

      rows.forEach((row, index) => {
        const rowY = contentY + index * 42;
        doc.roundedRect(contentX, rowY, 468, 34, 5).fill(index % 2 === 0 ? "#eef7f6" : "#ffffff");
        doc.fillColor("#134e4a").font(fontPath || "Helvetica").fontSize(10).text(row.label, contentX + 12, rowY + 7, {
          width: 150,
        });
        doc.fillColor("#0f172a").font(fontPath || "Helvetica").fontSize(10).text(row.value, contentX + 170, rowY + 7, {
          width: 286,
        });
      });

      const noticeY = contentY + rows.length * 42 + 24;
      doc
        .roundedRect(contentX, noticeY, 468, 82, 8)
        .fill("#fff7ed");

      doc
        .fillColor("#9a3412")
        .font(fontPath || "Helvetica")
        .fontSize(11)
        .text("Important", contentX + 12, noticeY + 12);

      doc
        .fillColor("#7c2d12")
        .font(fontPath || "Helvetica")
        .fontSize(9)
        .text(
          "Please carry this admit card along with a valid identity document during further recruitment steps. This admit card is system generated.",
          contentX + 12,
          noticeY + 30,
          { width: 440 },
        );

      doc
        .fillColor("#6b7280")
        .font(fontPath || "Helvetica")
        .fontSize(9)
        .text(`Generated on ${new Date().toLocaleString()}`, cardX + 24, cardY + cardHeight - 34, {
          width: 460,
          align: "left",
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
