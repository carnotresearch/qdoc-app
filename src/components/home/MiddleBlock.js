import { Button, Row } from "react-bootstrap";
import { MiddleBlockSection, Content, ContentWrapper } from "./styles";
import { useNavigate } from "react-router-dom";
import RestrictedUpload from "./RestrictedUpload";
import { BsArrowRight } from "react-icons/bs"; // Import arrow icon

const iconStyles = { height: "5rem", cursor: "pointer", margin: "0" };

const MiddleBlock = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const content =
    "To discover the potential of icarKno create a knowledge container by uploading a file below ⤵️";

  const tmStyles = {
    verticalAlign: "super",
    fontSize: "0.6rem",
    top: "-0.2rem",
    position: "relative",
    fontWeight: "bolder",
  };

  const buttonStyles = {
    backgroundColor: "#0056b3",
    color: "white",
    maxWidth: "115rem",
    minWidth: "7rem", // Add spacing between buttons
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    marginTop: "2rem",
  };

  const listStyles = {
    listStylePosition: "inside",
    margin: "0",
  };

  const titleStyles = {
    display: "flex",
    flexDirection: "row",
    margin: "0 auto",
    marginBottom: "2rem",
  };

  return (
    <MiddleBlockSection>
      <Row justify="center" align="middle">
        <ContentWrapper>
          <div style={titleStyles}>
            <img
              src="./logo.png"
              alt="logo"
              style={iconStyles}
              onClick={() => navigate("/")}
            />
            <h2 style={{ margin: "auto 0" }}>
              <b>
                icarKno
                <span style={tmStyles}>TM</span> Chat
              </b>
            </h2>
          </div>
          <Content>{content}</Content>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center", // Space above the buttons
            }}
          >
            {/* Restricted Upload */}
            <RestrictedUpload isLandingPage={true} />
          </div>

          <div style={{ textAlign: "left", marginTop: "1rem" }}>
            <center>
              <ul style={listStyles}>
                <li>
                  Your information remains safe and not shared externally with
                  anyone.
                </li>
                <li>
                  On-premise deployments for corporate and application-specific
                  use-cases.
                </li>
              </ul>
            </center>
          </div>
          {/* Go To Login Button */}
          <Button name="submit" onClick={handleLoginClick} style={buttonStyles}>
            Already have an account? Login <BsArrowRight />
          </Button>
        </ContentWrapper>
      </Row>
    </MiddleBlockSection>
  );
};

export default MiddleBlock;
