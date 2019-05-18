import css from '@emotion/css';

export const ProgressWrapperStyle = css`
  && {
    align-items: center;
    background: #fff;
    display: flex;
    height: 100vh;
    justify-content: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100vw;
    z-index: 9999;

    &.is-loading-enter {
      opacity: 0;
    }
    &.is-loading-enter-active {
      opacity: 1;
      transition: opacity 0.7s;
    }
    &.is-loading-exit {
      opacity: 1;
    }
    &.is-loading-exit-active {
      opacity: 0;
      transition: opacity 0.7s;
    }
  }
`;
