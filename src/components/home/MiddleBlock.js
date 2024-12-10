import { Slide } from "react-awesome-reveal";
import { Button, Row, Col } from "react-bootstrap";
import { MiddleBlockSection, Content, ContentWrapper } from "./styles";

const MiddleBlock = ({ setSidebarCollapsed }) => {
  const handleLoginClick = () => {
    console.log("handle button click");
  };
  const handleTrialClick = () => {
    setSidebarCollapsed(false);
  };

  const content =
    "Interact with secure knowledge container in your mother tongue";
  const tmStyles = {
    verticalAlign: "super",
    fontSize: "0.6rem",
    top: "-0.2rem",
    position: "relative",
    fontWeight: "bolder",
  };
  const buttonStyles = {
    marginRight: "1rem",
    backgroundColor: "#007bff",
    color: "white",
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
              <div className="mt-3">
                <Button
                  name="submit"
                  onClick={handleLoginClick}
                  style={buttonStyles}
                >
                  Go To Login
                </Button>
                <Button
                  name="submit"
                  onClick={handleTrialClick}
                  style={buttonStyles}
                >
                  Free Trial
                </Button>
              </div>
              <div style={{ textAlign: "left" }} className="mt-5">
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
