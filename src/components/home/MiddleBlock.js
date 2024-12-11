import { Slide } from "react-awesome-reveal";
import { Button, Row, Col } from "react-bootstrap";
import { MiddleBlockSection, Content, ContentWrapper } from "./styles";
import { useNavigate } from "react-router-dom";

const MiddleBlock = ({ setSidebarCollapsed }) => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login");
  };
  const handleTrialClick = () => {
    setSidebarCollapsed(false);
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
    backgroundColor: "#007bff",
    color: "white",
    maxWidth: "10rem",
    minWidth: "7rem",
    margin: "auto",
  };
  const listStyles = {
    listStylePosition: "inside",
    // padding: "0",
    margin: "0",
  };
  return (
    <MiddleBlockSection>
      <Slide direction="right" triggerOnce>
        <Row justify="center" align="middle">
          <ContentWrapper>
            <Col lg={24} md={24} sm={24} xs={24}>
              <h2>
                <b>
                  icarKno
                  <span style={tmStyles}>TM</span> Chat
                </b>
              </h2>
              <Content>{content}</Content>
              <div
                className="container mt-3"
                style={{
                  padding: "auto 3rem",
                  alignItems: "center",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  className="row"
                  style={{
                    padding: "0 1rem",
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    className="col-lg-4 col-md-6 col-sm-12"
                    name="submit"
                    onClick={handleLoginClick}
                    style={buttonStyles}
                  >
                    Go To Login
                  </Button>
                  <Button
                    className="col-lg-4 col-md-6 col-sm-12"
                    name="submit"
                    onClick={handleTrialClick}
                    style={buttonStyles}
                  >
                    Free Trial
                  </Button>
                </div>
              </div>
              <div style={{ textAlign: "left", marginTop: "2rem" }}>
                <ul style={listStyles}>
                  <li>
                    Your info remains safe and not shared externally with anyone
                  </li>
                  <li>
                    On-premise deployments for corporate and application
                    specific use-cases
                  </li>
                </ul>
              </div>
            </Col>
          </ContentWrapper>
        </Row>
      </Slide>
    </MiddleBlockSection>
  );
};

export default MiddleBlock;
