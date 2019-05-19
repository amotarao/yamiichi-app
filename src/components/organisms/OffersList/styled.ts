import { css } from '@emotion/core';

export const WrapperStyle = css`
  && {
    display: grid;
    gap: 16px;
    grid-auto-flow: row dense;
    grid-auto-rows: 80px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

    margin: 0 auto;
    padding: 16px 16px 160px;
    width: auto;

    background-color: #fff;
  }
`;
