import { Button, Row, Col } from "react-bootstrap";
import { MiddleBlockSection, Content, ContentWrapper } from "./styles";
import { useNavigate } from "react-router-dom";
import RestrictedUpload from "./RestrictedUpload";
import { BsArrowRight } from "react-icons/bs"; // Import arrow icon

const iconStyles = { height: "5cm", cursor: "pointer", margin: "0" };

const MiddleBlock = ({ setSidebarCollapsed }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const content =
    "Interact with secure knowledge container in your preferred language";

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
  };

  const listStyles = {
    listStylePosition: "inside",
    margin: "0",
  };

  return (
    <MiddleBlockSection
      style={{
        height: "100%",
        overflow: "hidden",
        margin: 0,
        padding: "2rem 0 0 0", // Add padding on top
        border: "none",
      }}
    >
      <Row
        justify="center"
        align="middle"
        style={{
          margin: 0,
          padding: 0,
          width: "100%",
        }}
      >
        <ContentWrapper style={{ margin: 0, padding: 0 }}>
          <Col lg={24} md={24} sm={24} xs={24}>
            <div>
              <img
                src="./logo.png"
                alt="logo"
                style={iconStyles}
                onClick={() => navigate("/")}
              />
            </div>
            <h2>
              <b>
                icarKno
                <span style={tmStyles}>TM</span> Chat
              </b>
            </h2>
            <Content>{content}</Content>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                maxWidth: "7cm",
                width: "10cm"// Space above the buttons
              }}
            >
              {/* Restricted Upload */}
              <RestrictedUpload />

              {/* Go To Login Button */}

            </div>
            <Button
                name="submit"
                onClick={handleLoginClick}
                style={buttonStyles}
              >
                Already have an account? Login <BsArrowRight />
              </Button>
            <div style={{ textAlign: "left", marginTop: "2rem" }}>
              <center>
              <ul style={listStyles}>
                <li>
                  Your info remains safe and not shared externally with anyone
                </li>
                <li>
                  On-premise deployments for corporate and application-specific
                  use-cases
                </li>
              </ul>
              </center>
            </div>
          </Col>
        </ContentWrapper>
      </Row>
    </MiddleBlockSection>
  );
};

export default MiddleBlock;