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
  padding: 0.75rem 0 0.75rem;
  font-size: 1.2rem;
`;

export const ContentWrapper = styled.div`
  @media only screen and (max-width: 768px) {
    max-width: 100%;
  }
`;
