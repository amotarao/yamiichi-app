/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Button, Paper } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { OfferItemInterface, OfferItemBiderInterface } from '../../../stores/database/offers';
import { PublicUserItemInterface } from '../../../stores/database/publicUsers';
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
  UserImageStyle,
  UserNameStyle,
} from './styled';

export interface OfferCardProps {
  item: OfferItemInterface;
  bid: (data: OfferItemBiderInterface) => Promise<any>;
  getUserById: (id: string) => PublicUserItemInterface | undefined;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  item: {
    id,
    data: { ...props },
  },
  bid: bidAction,
  getUserById,
}) => {
  const [isOpenedBidSelector, openBidSelector, closeBidSelector] = useBool(false);
  const [isOpenedBidWithMaxPriceAlert, openBidWithMaxPriceAlert, closeBidWithMaxPriceAlert] = useBool(false);
  const [author, setAuthor] = useState<PublicUserItemInterface | undefined>(undefined);
  const [lastBidder, setLastBidder] = useState<PublicUserItemInterface | undefined>(undefined);
  const biderPriceList = generateBiderPriceList(props.initialPrice, props.currentPrice, props.maxPrice, 5);
  const hasMaxPrice = props.maxPrice >= 0;

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

  useEffect(() => {
    (async () => {
      if (props.authorRef) {
        const author = await getUserById(props.authorRef.id);
        if (author) {
          setAuthor(author);
          return;
        }
      }
      setAuthor(undefined);
    })();
  }, [props.authorRef, getUserById]);

  useEffect(() => {
    (async () => {
      if (props.lastBidderRef) {
        const lastBidder = await getUserById(props.lastBidderRef.id);
        if (lastBidder) {
          setLastBidder(lastBidder);
        }
      }
      setLastBidder(undefined);
    })();
  }, [props.lastBidderRef, getUserById]);

  const finished = props.periodDate.toDate().getTime() < new Date().getTime();
  const bidDisabled = !props.active || (hasMaxPrice && props.maxPrice <= props.currentPrice) || finished;

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
          {author && (
            <div css={UserStyle}>
              <div css={UserImageStyle}>
                <img src={author.data.photoURL || 'https://placehold.jp/24x24.png'} alt={`${author.data.displayName} の画像`} />
              </div>
              <p css={UserNameStyle}>{author.data.displayName}</p>
            </div>
          )}
          {lastBidder && (
            <div css={UserStyle}>
              <div css={UserImageStyle}>
                <img src={lastBidder.data.photoURL || 'https://placehold.jp/24x24.png'} alt={`${lastBidder.data.photoURL} の画像`} />
              </div>
              <p css={UserNameStyle}>{lastBidder.data.displayName}</p>
            </div>
          )}
        </div>
        <div css={ActionAreaStyle}>
          {!bidDisabled ? <RemainingTime date={props.periodDate.toDate()} /> : <p>終了</p>}
          <Button css={ActionButtonStyle} variant={hasMaxPrice ? 'text' : 'contained'} color="primary" disabled={bidDisabled} onClick={handleClickBid}>
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
          {hasMaxPrice && (
            <React.Fragment>
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
            </React.Fragment>
          )}
        </div>
      </div>
    </Paper>
  );
};
