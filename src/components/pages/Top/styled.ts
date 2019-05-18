import css from '@emotion/css';

export const HeaderStyle = css`
  && {
    align-items: center;
    background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
    color: #fff;
    display: flex;
    font-family: 'Noto Sans JP';
    flex-direction: column;
    height: 100vh;
    justify-content: center;
    padding: 16px;
    width: 100vw;
  }
`;

export const TitleStyle = css`
  && {
    color: #fff;
    font-family: 'Noto Sans JP';
    font-feature-settings: 'palt';
    font-size: 2.4rem;
    line-height: 1;
    margin-bottom: 0.8em;
  }
`;

export const CatchStyle = css`
  && {
    display: flex;
    flex-wrap: wrap;
    font-feature-settings: 'palt';
    font-size: 1.2rem;
    justify-content: center;
    letter-spacing: 0.08rem;
    line-height: 1.2;
    margin-bottom: 1.6em;
    text-align: center;

    > span {
      white-space: nowrap;

      &.p1 {
        margin-right: -0.5em;
      }
    }
  }
`;
