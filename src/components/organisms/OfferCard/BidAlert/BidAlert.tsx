import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';
import React from 'react';

export interface BidAlertProps {
  title: string;
  price: number;
  isMaxPrice?: boolean;
  disabled: boolean;
  open: boolean;
  onApprove: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export const BidAlert: React.FC<BidAlertProps> = ({ title, price, isMaxPrice = false, disabled, open, onApprove, onCancel, onClose }) => {
  const alertTitle = isMaxPrice ? '落札しますか？' : '入札しますか？';
  const alerText = isMaxPrice ? `${title} を、即決価格 ¥${price.toLocaleString()} で落札します` : `${title} を、¥${price.toLocaleString()} で入札します`;
  const alertApproveTitle = isMaxPrice ? '落札する' : '入札する';

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{alertTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{alerText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary" disabled={disabled}>
          キャンセル
        </Button>
        <Button onClick={onApprove} variant="contained" color="primary" disabled={disabled} autoFocus>
          {alertApproveTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
