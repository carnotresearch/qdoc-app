import styled from "styled-components";

export const MiddleBlockSection = styled.section`
padding-top: 10cm;
  position: relative;
  text-align: center;
  display: flex;
  justify-content: center;
  width: 70%;

  @media screen and (max-width: 1024px) {
    padding: 5.5rem 0 3rem;
  }
`;

export const Content = styled.p`
  padding: 0.05rem 0 0.05rem;
  font-size: 1.2rem;
`;

export const ContentWrapper = styled.div`
  @media only screen and (max-width: 768px) {
    max-width: 100%;
  }
`;

// const ResponsiveLayout = styled.div`
//   display: flex;
//   flex-direction: row; /* Default for larger screens */
//   height: 100vh;
//   width: 100%;
//   @media (max-width: 768px) {
//     flex-direction: column; /* Stack vertically on mobile */
//     height: auto; /* Allow scrolling */
//   }
// `;