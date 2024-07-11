import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function PaymentForm() {
  const [email, setEmail] = useState('');
  const [password] = useState('');
  const navigate = useNavigate();
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: `${process.env.REACT_APP_RAZORPAY_PAYMENT_KEY}`,
      amount: '50000', // Amount in paise (50000 paise = INR 500)
      currency: 'INR',
      name: 'Carnot Research Pvt. Ltd.',
      description: 'Test Transaction',
      image: 'https://example.com/your_logo',
      handler: async function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        // Send email to backend
        try {
          const apiResponse = await fetch('http://127.0.0.1:5000/updatepayment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
          });
          const apiData = await apiResponse.json();
          console.log(apiData);
          navigate('/');
        } catch (error) {
          console.error('Error sending email to backend:', error);
        }
      },
      prefill: {
        name: 'Your Name',
        email: email,
        contact: '1234567890',
      },
      notes: {
        address: 'Some Address',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.header}>Upgrade Subscription</h2>
        Please confirm your email before payment.
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        
        <button type="submit" style={styles.button}>Pay</button>
      </form>
    </div>
  );
}

export default PaymentForm;

// Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7'
  },
  form: {
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    width: '300px'
  },
  header: {
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007BFF',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px'
  }
};