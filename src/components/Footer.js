import React from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="login-footer">
      <a
        className="Licon"
        href="https://www.linkedin.com/company/carnot-research-pvt-ltd/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkedInIcon style={{ color: "#0072b1", marginRight: "2px" }} />
      </a>

      <span className="footer-separator">|</span>

      <a href="https://carnotresearch.com/terms.html" className="footer-link">
        Terms & Conditions
      </a>

      <span className="footer-separator">|</span>

      <a href="https://carnotresearch.com/refund.html" className="footer-link">
        Refund Policy
      </a>
      <span className="footer-separator">|</span>

      <a href="mailto:contact@carnotresearch.com" className="footer-link">
        Contact us for private/corporate deployment
      </a>
    </footer>
  );
};

export default Footer;
