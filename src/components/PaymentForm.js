
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StarsIcon from '@mui/icons-material/Stars';


function PaymentForm() {
  const [email, setEmail] = useState("");
  const [password] = useState("");
  const navigate = useNavigate();
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  const [paymentPlan, setPaymentPlan] = useState("");
  const paymentPlanOptions = [
    { value: 1, label: "₹19/day", price: 1900 },
    { value: 1, label: "₹59/week", price: 5900 },
        { value: 2, label: " ₹189/month",price: 18900 },
        { value: 3, label: " ₹479/quarter",price: 47900 },
  ];
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

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
      // Handle error: Selected payment plan not found
      console.error("Selected payment plan not found");
      return;
    }

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
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
        email: email,
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

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={{ marginTop: '20px', ...styles.header }}>Upgrade</h3>
        <div style={{ ...styles.pointList, marginBottom: '30px' }}> </div>
        <div style={styles.pointList}>
  
  <div style={styles.point}>
    <StarsIcon fontSize="small" style={{ marginRight: '5px' ,marginBottom:'19px'}} />
    <span style={{ fontWeight: 'bold' }}>Multilingual support across Indian languages</span>
  </div>
  <div style={styles.point}>
    <StarsIcon fontSize="small" style={{ marginRight: '5px' }} />
    <span style={{ fontWeight: 'bold' }}>Multiple Containers</span>
  </div>
  <div style={styles.point}>
    <StarsIcon fontSize="small" style={{ marginRight: '5px' }} />
    <span style={{ fontWeight: 'bold' }}>Unlimited queries</span>
  </div>
  <div style={styles.point}>
    <StarsIcon fontSize="small" style={{ marginRight: '5px' }} />
    <span style={{ fontWeight: 'bold' }}>Upto 800 pages per container
    </span>
  </div>
</div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="paymentPlan">
          <div style={{ ...styles.pointList, marginBottom: '30px' }}> </div>
           
          </label>
          <select
            id="paymentPlan"
         

            value={paymentPlan}
            onChange={(e) => setPaymentPlan(e.target.value)}
            style={styles.select}
          >
            <option value="" >
  Select a payment plan
</option>

            {paymentPlanOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                price={option.price}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ ...styles.pointList}}> </div>
        <button type="submit" style={styles.button}>
          Pay
        </button>
      </form>
    </div>
  );
}

export default PaymentForm;


const styles = {
  container: {
    position: "fixed", // Fixes the position relative to the viewport
    top: "50%",        // Centers vertically
    left: "50%",       // Centers horizontally
    transform: "translate(-50%, -50%)", // Offsets the element to truly center it
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "52vh",    // Maintain height relative to viewport height
    width: "100vw",     // Optional: make it full width
    /*border: "2px solid black",*/
  },
  point: {
    display: 'flex',
    alignItems: 'center',

  },


  form:{
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    width: "300px",
    height:"400px",
      
  },

  
  select: {
    marginLeft: '5px', 
    fontSize:'18px',
    alignItems:'center',
  },
  header: {
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    border: "none",
marginTop:"20px",
    borderRadius: "4px",
    backgroundColor: " rgba(54, 183, 183, 0.8)",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
  },
};
