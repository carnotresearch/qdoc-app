// utils/chatUtils.js
import jsPDF from "jspdf";

export const handleDownloadChat = (chatHistory) => {
  const chatText = chatHistory
    .map((chat) => `User: ${chat.user}\n\nBot: ${chat.bot}`)
    .join("\n---\n");

  const doc = new jsPDF();

  // Add text to the PDF (handle multi-line text)
  const pageHeight = doc.internal.pageSize.height; // Get page height
  const margin = 10; // Define margin
  const lineHeight = 10; // Height between lines
  let cursorY = margin; // Start position for text
  const lines = doc.splitTextToSize(chatText, doc.internal.pageSize.width - 2 * margin);

  lines.forEach((line) => {
    if (cursorY + lineHeight > pageHeight - margin) {
      doc.addPage(); // Add new page if text exceeds the page height
      cursorY = margin; // Reset cursor to the top of the new page
    }
    doc.text(line, margin, cursorY);
    cursorY += lineHeight;
  });

  // Save the PDF
  doc.save("chat_history.pdf");

  // Check if Web Share API is supported
  if (navigator.share) {
    const pdfBlob = doc.output("blob"); // Get the PDF as a blob
    const file = new File([pdfBlob], "chat_history.pdf", { type: "application/pdf" });

    navigator
      .share({
        title: "Chat History",
        text: "Here is the chat history I downloaded from icarKno-chat.",
        files: [file], // Share the file
      })
      .then(() => console.log("Share successful"))
      .catch((error) => console.error("Error sharing:", error));
  } else {
    alert("Your browser does not support sharing files. Please use a modern browser.");
  }
};
