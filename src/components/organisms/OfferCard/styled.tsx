import { css } from '@emotion/core';

export const WrapperStyle = css`
  && {
    grid-row-end: span 2;

    display: flex;
    flex-direction: column;

    border-radius: 4px;
    overflow: hidden;

    &.rowspan-3 {
      grid-row-end: span 3;
    }
  }
`;

export const MainAreaStyle = css`
  && {
    flex: 1 1 auto;
    overflow: hidden;
    position: relative;

    &::after {
      background: rgba(0, 0, 0, 0.3);
      content: '';
      display: block;
      height: 100%;
      opacity: 0;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      transition: opacity 0.18s ease-out;
      width: 100%;
    }

    &:hover::after {
      opacity: 1;
    }
  }
`;

export const TextThumbnailStyle = css`
  && {
    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
    background: #64b5f6;
    height: 100%;
    padding: 16px;
    width: 100%;
  }
`;

export const TitleStyle = css`
  && {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;

    color: #fff;
    font-size: 1.2rem;
    font-weight: bold;
  }
`;

export const OfferInfoStyle = css`
  && {
    height: 100%;
    padding: 16px;
    position: absolute;
    top: 100%;
    left: 0;
    transition: top 0.18s ease-out;
    width: 100%;
    z-index: 1;

    *:hover > & {
      top: 0%;
    }

    p {
      color: #fff;
    }
  }
`;

export const MetaAreaStyle = css`
  && {
    flex: 0 0 auto;
    font-size: 0.9rem;
  }
`;

export const UserAreaStyle = css`
  && {
    display: flex;
    padding: 16px;
  }
`;

export const UserStyle = css`
  && {
    align-items: center;
    display: flex;

    &:first-of-type {
      margin-right: 16px;
    }
  }
`;

export const UserImageStyle = css`
  && {
    border-radius: 50%;
    height: 24px;
    margin-right: 6px;
    overflow: hidden;
    width: 24px;

    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
`;

export const UserNameStyle = css`
  && {
    font-size: 0.75rem;
  }
`;

export const ActionAreaStyle = css`
  && {
    align-items: center;
    display: flex;
    padding: 0 12px 12px 16px;
  }
`;

export const ActionButtonStyle = css`
  && {
    margin-left: 8px;
  }
`;
