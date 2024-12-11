import styled from "styled-components";

export const MiddleBlockSection = styled.section`
  position: relative;
  padding: 3rem 0 3rem;
  text-align: center;
  display: flex;
  justify-content: center;
  width: 70%;
  border: 2px solid #ddd; /* Light gray border */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  //   background-color: #fff; /* Background to make the shadow noticeable */

  @media screen and (max-width: 1024px) {
    padding: 5.5rem 0 3rem;
  }
`;

export const Content = styled.p`
  padding: 0.75rem 0 0.75rem;
  font-size: 1.2rem;
`;

export const ContentWrapper = styled.div`
  @media only screen and (max-width: 768px) {
    max-width: 100%;
  }
`;
