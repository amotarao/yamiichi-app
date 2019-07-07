/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Dialog, DialogTitle, DialogContent, FormControl, RadioGroup, FormControlLabel, Radio, DialogActions, Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useBool } from '../../../../utils/hooks';
import { BidAlert } from '../BidAlert';
import { DialogStyle } from './styled';

export interface BidSelectorProps {
  title: string;
  prices: number[];
  maxPrice: number;
  disabled: boolean;
  open: boolean;
  bid: (price: number) => Promise<any>;
  onClose: () => void;
}

export const BidSelector: React.FC<BidSelectorProps> = ({ title, prices, maxPrice, disabled, open = true, bid, onClose }) => {
  const hasMaxPrice = maxPrice >= 0;
  const [isOpenedAlert, openAlert, closeAlert] = useBool(false);
  const [selectedPrice, setPrice] = useState<number>(prices.length ? prices[0] : maxPrice);

  const handleChange = (event: React.ChangeEvent<unknown>) => {
    setPrice(Number((event.target as HTMLInputElement).value));
  };

  const handleClickBid = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (event.shiftKey) {
      bid(selectedPrice);
      return;
    }
    openAlert();
  };

  useEffect(() => {
    if (!open) {
      closeAlert();
    }
  }, [closeAlert, open]);

  return (
    <Dialog css={DialogStyle} open={open} onClose={onClose} aria-labelledby="simple-dialog-title">
      <DialogTitle id="simple-dialog-title">入札価格を選択</DialogTitle>
      <DialogContent>
        <FormControl component={'fieldset' as 'div'}>
          <RadioGroup aria-label="入札価格" name="price" value={selectedPrice.toString()} onChange={handleChange}>
            {prices.map((price, i) => {
              const labelSuffix = hasMaxPrice && maxPrice <= price ? ' (即決)' : '';
              return <FormControlLabel key={i} value={price.toString()} control={<Radio />} label={`¥${price.toLocaleString()}${labelSuffix}`} />;
            })}
            {hasMaxPrice && (!prices.length || prices[prices.length - 1] < maxPrice) && (
              <FormControlLabel value={maxPrice.toString()} control={<Radio />} label={`¥${maxPrice.toLocaleString()} (即決)`} />
            )}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={disabled}>
          キャンセル
        </Button>
        <Button onClick={handleClickBid} variant="contained" color="primary" disabled={disabled} autoFocus>
          入札
        </Button>
        <BidAlert
          title={title}
          price={selectedPrice}
          isMaxPrice={selectedPrice === maxPrice}
          disabled={disabled}
          open={isOpenedAlert}
          onApprove={() => bid(selectedPrice)}
          onCancel={closeAlert}
          onClose={closeAlert}
        />
      </DialogActions>
    </Dialog>
  );
};
