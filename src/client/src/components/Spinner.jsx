import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;

const Spinner = ({ currentcolor }) => {
  return (
    <StyledSpinner currentcolor={currentcolor}>
      {/* Your spinner content here */}
    </StyledSpinner>
  );
};

const StyledSpinner = styled.div`
  margin: 4.8rem auto;
  width: 6.4rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(
        farthest-side,
        ${({ currentcolor }) => currentcolor || "#b68a1c"} 94%,
        #0000
      )
      top / 10px 10px no-repeat,
    conic-gradient(
      #0000 30%,
      ${({ currentcolor }) => currentcolor || "#b68a1c"}
    );
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 10px), #000 0);
  animation: ${rotate} 1.5s infinite linear;
`;

export default Spinner;
