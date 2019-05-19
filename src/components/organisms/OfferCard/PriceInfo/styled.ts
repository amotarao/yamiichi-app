import { css } from '@emotion/core';

export const PriceInfoStyle = css`
  && {
    align-items: flex-end;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: flex-end;
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-transition: top 0.18s ease-out;
    transition: top 0.18s ease-out;
    width: 100%;
  }
`;

export const MaxPriceStyle = css`
  && {
    background: #fff;
    font-size: 0.8rem;
    padding: 0.2rem 0.6rem;
  }
`;

export const CurrentPriceStyle = css`
  && {
    background: #fff;
    font-size: 1.3rem;
    margin: 0.4rem 0;
    padding: 0.2rem 0.6rem;

    span {
      font-size: 0.8rem;
    }
  }
`;
