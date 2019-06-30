/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Button, Paper } from '@material-ui/core';
import React from 'react';
import { OfferItemInterface, OfferItemBiderInterface } from '../../../stores/database/offers';
import { generateBiderPriceList } from '../../../utils/bider';
import { useBool } from '../../../utils/hooks';
import { BidAlert } from './BidAlert';
import { BidSelector } from './BidSelector';
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

export interface OfferCardProps {
  item: OfferItemInterface;
  bid: (data: OfferItemBiderInterface) => Promise<any>;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  item: {
    id,
    data: { ...props },
  },
  bid: bidAction,
}) => {
  const [isOpenedBidSelector, openBidSelector, closeBidSelector] = useBool(false);
  const [isOpenedBidWithMaxPriceAlert, openBidWithMaxPriceAlert, closeBidWithMaxPriceAlert] = useBool(false);
  const biderPriceList = generateBiderPriceList(props.initialPrice, props.currentPrice, props.maxPrice, 5);

  const bid = async (price: number) => {
    await bidAction({
      id,
      price,
    })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
    closeBidSelector();
    closeBidWithMaxPriceAlert();
  };

  const handleClickBid = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (event.shiftKey) {
      if (props.currentPrice !== -1) {
        bid(biderPriceList ? biderPriceList[0] : -1);
        return;
      } else {
        bid(props.initialPrice);
        return;
      }
    }
    openBidSelector();
  };

  const handleClickBidWithMaxPrice = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (event.shiftKey) {
      bid(props.maxPrice);
      return;
    }
    openBidWithMaxPriceAlert();
  };

  const finished = props.periodDate.toDate().getTime() < new Date().getTime();
  const bidDisabled = !props.active || (props.maxPrice >= 0 && props.maxPrice <= props.currentPrice) || finished;

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
          {!bidDisabled ? <RemainingTime date={props.periodDate.toDate()} /> : <p>終了</p>}
          <Button css={ActionButtonStyle} variant="text" color="primary" disabled={bidDisabled} onClick={handleClickBid}>
            入札
          </Button>
          <BidSelector
            title={props.title}
            prices={biderPriceList || [props.maxPrice]}
            maxPrice={props.maxPrice}
            open={isOpenedBidSelector}
            bid={bid}
            onClose={closeBidSelector}
          />
          <Button css={ActionButtonStyle} variant="contained" color="primary" disabled={bidDisabled} onClick={handleClickBidWithMaxPrice}>
            即決
          </Button>
          <BidAlert
            title={props.title}
            price={props.maxPrice}
            isMaxPrice
            open={isOpenedBidWithMaxPriceAlert}
            onApprove={() => bid(props.maxPrice)}
            onCancel={closeBidWithMaxPriceAlert}
            onClose={closeBidWithMaxPriceAlert}
          />
        </div>
      </div>
    </Paper>
  );
};
