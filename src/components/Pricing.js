import React, { useState } from "react";
import Button from "@mui/material/Button";
import "../styles/pricing.css";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import axios from "axios";

const plans = [
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

const Pricing = ({ plan, darkMode }) => {
  const [paymentPlan, setPaymentPlan] = useState(2);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const paymentPlanOptions = [
    { value: 1, label: "₹19/day", price: 1900 },
    { value: 1, label: "₹59/week", price: 5900 },
    { value: 2, label: " ₹189/month", price: 18900 },
    { value: 3, label: " ₹479/quarter", price: 47900 },
  ];

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const selectedPlan = paymentPlanOptions.find(
      (plan) => plan.value === parseInt(paymentPlan)
    );

    if (!selectedPlan) {
      console.error("Selected payment plan not found");
      return;
    }

    const options = {
      key: `${process.env.REACT_APP_RAZORPAY_PAYMENT_KEY}`,
      amount: selectedPlan.price,
      currency: "INR",
      name: "Carnot Research Pvt. Ltd.",
      description: "Test Transaction",
      image: "../public/logo.png",
      handler: async function (response) {
        alert(
          `Payment successful! Payment ID: ${response.razorpay_payment_id}`
        );
        // Send email to backend
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_UPGRADE_ACCOUNT_URL}`,
            {
              email,
              paymentPlan: selectedPlan.value,
            }
          );
          console.log(response);
          navigate("/");
        } catch (error) {
          console.error("Error sending email to backend:", error);
        }
      },
      prefill: {
        name: "Your Name",
        email: "",
        contact: "1234567890",
      },
      notes: {
        address: "Some Address",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  plans[1].buttonAction = handlePayment;
  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <h1 className="page-title">Subscription Plans</h1>
      <div style={{ textAlign: "center", marginBottom: "5px" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button
           
           startIcon={<ArrowBackIosNewIcon fontSize="small" />} 
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              backgroundColor: "#f9f9f9",
              color: "black",
              "&:hover": {
                backgroundColor: "#f9f9f9",
              },
            }}
          >
            icarKno
            <span
              style={{
                verticalAlign: "super",
                fontSize: "0.5rem",
                top: "-0.2rem",
                position: "relative",
              }}
            >
              TM
            </span>{" "}
            Chat
          </Button>
        </Link>
      </div>

      <div className="pricing-container">
        {plans.map((plan, index) => (
          <div key={index} className="plan-section">
            <h2>{plan.title}</h2>
            {plan.title === "Free" && (
              <h5
                style={{
                  textAlign: "left",
                  marginLeft: "5px",
                  color: darkMode ? "white" : "black",
                }}
              >
                ₹{plan.price}
              </h5>
            )}
            {plan.title === "Premium" && (
              <>
                <h5>{plan.price}</h5>
                <select
                  value={paymentPlan}
                  onChange={(e) => setPaymentPlan(e.target.value)}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    fontSize: "19px",
                    marginBottom: "16px",
                    padding: "7px",
                  }}
                >
                  {paymentPlanOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </>
            )}
            {plan.title === "Business" && (
              <h5
                style={{
                  textAlign: "left",
                  marginLeft: "5px",
                  color: darkMode ? "white" : "black",
                }}
              >
                {plan.price}
              </h5>
            )}
            <ul className="features-list">
              {plan.features.map((feature, index) => (
                <li key={index} className={`feature-item ${feature.className}`}>
                  <span className="feature-icon"></span>
                  <span className="feature-text">{feature.text}</span>
                </li>
              ))}
            </ul>
            {plan.buttonLink ? (
              <Link to={plan.buttonLink} style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    color: "rgba(54, 183, 183, 0.8)",
                    borderColor: "rgba(54, 183, 183, 0.8)",
                    "&:hover": {
                      borderColor: "transparent",
                      backgroundColor: "",
                    },
                    borderWidth: "1px",
                  }}
                >
                  {plan.buttonText}
                </Button>
              </Link>
            ) : (
              <Button
                variant="outlined"
                onClick={plan.buttonAction}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  color: "rgba(54, 183, 183, 0.8)",
                  borderColor: "rgba(54, 183, 183, 0.8)",
                  "&:hover": {
                    borderColor: "transparent",
                    backgroundColor: "",
                  },
                  borderWidth: "2px",
                }}
              >
                {plan.buttonText}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
