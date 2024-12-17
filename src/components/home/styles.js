import styled from "styled-components";

export const MiddleBlockSection = styled.section`
  padding-top: 0;
  position: relative;
  text-align: center;
  width: 80%;
  margin: 0 auto;
`;

export const Content = styled.p`
  padding: 0.75rem 0 0.75rem;
  font-size: 1.2rem;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ResponsiveLayout = styled.div`
  display: flex;
  flex-direction: row; /* Default for larger screens */
  height: 100vh;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column; /* Stack vertically on mobile */
    height: auto; /* Allow scrolling */
  }
`;
