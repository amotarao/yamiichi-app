/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Button, Paper } from '@material-ui/core';
import React from 'react';
import { OfferItemInterface } from '../../../stores/database/offers';
import { PriceInfo } from './PriceInfo';
import { RemainingTime } from './RemainingTime';
import {
  WrapperStyle,
  TextThumbnailStyle,
  MetaAreaStyle,
  UserAreaStyle,
  ActionAreaStyle,
  TitleStyle,
  UserStyle,
  MainAreaStyle,
  OfferInfoStyle,
  ActionButtonStyle,
} from './styled';

export const OfferCard: React.FC<OfferItemInterface> = ({ data: { ...props } }) => {
  return (
    <Paper css={WrapperStyle} className={`rowspan-3 rowspan-${[2, 3][Math.floor(Math.random() * 2)]}`} elevation={1}>
      <div css={MainAreaStyle}>
        <div css={TextThumbnailStyle}>
          <p css={TitleStyle}>{props.title}</p>
        </div>
        <PriceInfo {...props} />
        <div css={OfferInfoStyle}>
          <p>{props.title}</p>
          <p>{props.description}</p>
        </div>
      </div>
      <div css={MetaAreaStyle}>
        <div css={UserAreaStyle}>
          {props.authorRef && (
            <div css={UserStyle}>
              {/* <div css={UserImageStyle}>
                <img src={props.authorRef.iconUrl || 'https://placehold.jp/24x24.png'} />
              </div>
              <p css={UserNameStyle}>{props.authorRef.name}</p> */}
            </div>
          )}
        </div>
        <div css={ActionAreaStyle}>
          <RemainingTime date={props.periodDate.toDate()} />
          <Button css={ActionButtonStyle} variant="text" color="primary">
            入札
          </Button>
          <Button css={ActionButtonStyle} variant="contained" color="primary">
            即決
          </Button>
        </div>
      </div>
    </Paper>
  );
};
