export const plans = [
  {
    title: "Free",
    features: [
      { text: "Limited to 20 queries", className: "feature-free" },
      { text: "Multilingual support including Indian languages" },
      { text: "Upto 2 containers" },
      { text: "Upto 2 documents per container" },
      { text: "10MB/document" },
      { text: "Upto 400 pages per container" },
    ],
    buttonText: "Try for Free",
    buttonLink: "/",
    price: "0/month",
  },
  {
    title: "Premium",
    features: [
      { text: "Unlimited queries", className: "feature-premium" },
      { text: "Multilingual support including Indian languages" },
      { text: "Upto 5 containers" },
      { text: "Upto 10 documents per container" },
      { text: "20MB/document" },
      { text: "Upto 800 pages per container" },
    ],
    buttonText: "Pay Now",
    buttonAction: () => {},
    price: "",
  },
  {
    title: "Business",
    features: [
      { text: "On-premise solution", className: "feature-business" },
      { text: "Secure private data" },
      { text: "Containerised Deployment" },
    ],
    buttonText: "Contact Us",
    buttonAction: () => {
      window.location.href = "mailto:contact@carnotresearch.com";
    },
    price: "Custom pricing",
  },
];

export const paymentPlanOptions = [
  { value: 0, label: "₹19 /day", price: 1900 },
  { value: 1, label: "₹59 /week", price: 5900 },
  { value: 2, label: " ₹189 /month", price: 18900 },
  { value: 3, label: " ₹479 /3months", price: 47900 },
];

export const languages = [
  { value: "23", label: "English" },
  { value: "1", label: "Hindi" },
  { value: "2", label: "Gom" },
  { value: "3", label: "Kannada" },
  { value: "4", label: "Dogri" },
  { value: "5", label: "Bodo" },
  { value: "6", label: "Urdu" },
  { value: "7", label: "Tamil" },
  { value: "8", label: "Kashmiri" },
  { value: "9", label: "Assamese" },
  { value: "10", label: "Bengali" },
  { value: "11", label: "Marathi" },
  { value: "12", label: "Sindhi" },
  { value: "13", label: "Maithili" },
  { value: "14", label: "Punjabi" },
  { value: "15", label: "Malayalam" },
  { value: "16", label: "Manipuri" },
  { value: "17", label: "Telugu" },
  { value: "18", label: "Sanskrit" },
  { value: "19", label: "Nepali" },
  { value: "20", label: "Santali" },
  { value: "21", label: "Gujarati" },
  { value: "22", label: "Odia" },
];

export const sttSupportedLanguages = {
  23: "", // English
  1: "hi-IN", // Hindi
  11: "mr-IN", // Marathi
  10: "bn-IN", // Bengali
  7: "ta-IN", // Tamil
  17: "te-IN", // Telugu
  3: "kn-IN", // Kannada
  21: "gu-IN", // Gujarati
  15: "ml-IN", // Malayalam
};

export const ttsSupportedLanguages = ["1", "23"];
