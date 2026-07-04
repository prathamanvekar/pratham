import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="loader">
          <p className="m-0 select-none">probably</p>
          <div className="words">
            <span className="word">larping</span>
            <span className="word">vibe coding</span>
            <span className="word">hopium maxxing</span>
            <span className="word">larping</span>
            <span className="word">vibe coding</span>
            <span className="word">hopium maxxing</span>
            <span className="word">larping</span>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  transition: background-color 0.3s ease;

  .card {
    /* Color used to softly clip top and bottom of the .words container */
    --bg-color: var(--color-bg);
    background-color: transparent;
    padding: 0;
  }

  .loader {
    color: var(--color-muted);
    font-family: var(--font-mono);
    font-weight: 400;
    font-size: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column; /* Vertical stack by default (mobile) */
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 8px;
    letter-spacing: -0.5px;
    text-transform: lowercase;
    text-align: center;
  }

  @media (min-width: 768px) {
    .loader {
      flex-direction: row; /* Horizontal on desktop */
      height: 48px;
      gap: 0;
      text-align: left;
      padding: 0 10px;
    }
  }

  .words {
    overflow: hidden;
    position: relative;
    height: 48px; /* Locked height so it fits on mobile stack */
    min-width: 220px;
  }

  @media (min-width: 768px) {
    .words {
      height: 100%;
    }
  }

  .words::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      var(--bg-color) 10%,
      transparent 30%,
      transparent 70%,
      var(--bg-color) 90%
    );
    z-index: 20;
    pointer-events: none;
  }

  .word {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center; /* Centered on mobile */
    color: var(--color-link);
    white-space: nowrap;
    box-sizing: border-box;
    backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;
    transform: translate3d(0, 0, 0);
    will-change: transform;
    animation: spin_4991 4.5s infinite ease-in-out;
  }

  @media (min-width: 768px) {
    .word {
      justify-content: flex-start; /* Left-aligned on desktop */
      padding-left: 10px;
    }
  }

  .word:nth-child(1) { top: 0%; }
  .word:nth-child(2) { top: 100%; }
  .word:nth-child(3) { top: 200%; }
  .word:nth-child(4) { top: 300%; }
  .word:nth-child(5) { top: 400%; }
  .word:nth-child(6) { top: 500%; }
  .word:nth-child(7) { top: 600%; }

  @keyframes spin_4991 {
    0%, 5% {
      transform: translate3d(0, 0%, 0);
    }
    12%, 17% {
      transform: translate3d(0, -100%, 0);
    }
    28%, 33% {
      transform: translate3d(0, -200%, 0);
    }
    44%, 49% {
      transform: translate3d(0, -300%, 0);
    }
    60%, 65% {
      transform: translate3d(0, -400%, 0);
    }
    76%, 81% {
      transform: translate3d(0, -500%, 0);
    }
    92%, 100% {
      transform: translate3d(0, -600%, 0);
    }
  }
`;

export default Loader;
