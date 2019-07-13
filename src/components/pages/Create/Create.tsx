/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState } from 'react';
import { FormControl, TextField, Button, Paper, Typography, FormLabel, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import { InputWrapperStyle, InputStyle, PaperStyle, TypographyStyle, DurationLabelStyle, ActionButtonStyle } from './styled';
import { OfferItemRegistrationInterface } from '../../../stores/database/offers';

export interface CreateProps {
  className?: string;
  isLoading: boolean;
  create: (data: OfferItemRegistrationInterface) => Promise<any>;
  success: () => void;
  cancel: () => void;
}

export const Create: React.FC<CreateProps> = ({ className, create, success, cancel }) => {
  const durationOptions = [
    { name: '1時間', value: '1h' },
    { name: '3時間', value: '3h' },
    { name: '6時間', value: '6h' },
    { name: '1日', value: '1d' },
    { name: '3日', value: '3d' },
    { name: '5日', value: '5d' },
    { name: '1週間', value: '1w' },
  ];

  const [title, setTitle] = useState<string>('');
  const [titleError, setTitleError] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [initialPrice, setInitialPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [duration, setDuration] = useState<string>('1h');
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);

  const getSecondsFromDuration = (duration: string): number | null => {
    const matches = duration.match(/(\d+)([hdw])/);
    if (!matches) {
      return null;
    }
    const base = Number(matches[1]);
    switch (matches[2]) {
      case 'h':
        return base * 60 * 60;
      case 'd':
        return base * 24 * 60 * 60;
      case 'w':
        return base * 7 * 24 * 60 * 60;
      default:
        return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitDisabled(true);
    const periodDuration = getSecondsFromDuration(duration);
    create({
      title: title || '',
      description: description || undefined,
      initialPrice: initialPrice === null ? -1 : initialPrice,
      maxPrice: maxPrice === null ? undefined : maxPrice,
      periodDuration: periodDuration === null ? -1 : periodDuration,
    })
      .then(() => {
        success();
      })
      .catch((error) => {
        setSubmitDisabled(false);
        console.log(error);
      });
  };

  return (
    <div className={className}>
      <Paper css={PaperStyle} elevation={1}>
        <Typography css={TypographyStyle} variant="h6" color="inherit" component="h1">
          出品
        </Typography>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div css={InputWrapperStyle}>
            <TextField
              css={InputStyle}
              label="タイトル"
              value={title}
              required
              error={titleError}
              onChange={(event) => {
                const value = event.target.value;
                setTitleError(false);
                setTitle(value);
              }}
              onBlur={(event) => {
                const value = event.target.value;
                if (value.replace(/\s/g, '') === '') {
                  setTitleError(true);
                }
              }}
            />
          </div>
          <div css={InputWrapperStyle}>
            <TextField
              css={InputStyle}
              label="詳細"
              value={description}
              multiline
              rows={1}
              rowsMax={5}
              onChange={(event) => {
                const value = event.target.value;
                setDescription(value);
              }}
            />
          </div>
          <div css={InputWrapperStyle}>
            <TextField
              css={InputStyle}
              type="number"
              label="出品価格"
              value={initialPrice === null ? '' : initialPrice}
              required
              inputProps={{
                max: 1000000,
                min: 0,
                step: 1,
              }}
              onChange={(event) => {
                const value = event.target.value.replace(/[\D]/g, '');
                if (isNaN(Number(value)) || value === '') {
                  setInitialPrice(null);
                  return;
                }
                setInitialPrice(Number(value));
              }}
            />
          </div>
          <div css={InputWrapperStyle}>
            <TextField
              css={InputStyle}
              type="number"
              label="即決価格"
              value={maxPrice === null ? '' : maxPrice}
              inputProps={{
                max: 1000000,
                min: 0,
                step: 1,
              }}
              onChange={(event) => {
                const value = event.target.value.replace(/[\D]/g, '');
                if (isNaN(Number(value)) || value === '') {
                  setMaxPrice(null);
                  return;
                }
                setMaxPrice(Number(value));
              }}
            />
          </div>
          <FormControl css={InputWrapperStyle} required>
            <FormLabel css={DurationLabelStyle}>出品期間</FormLabel>
            <RadioGroup
              aria-label="出品期間"
              value={duration}
              row
              onChange={(event, value) => {
                setDuration(value);
              }}
            >
              {durationOptions.map((duration) => (
                <FormControlLabel label={duration.name} value={duration.value} key={duration.value} control={<Radio color="primary" />} />
              ))}
            </RadioGroup>
          </FormControl>
          <div css={InputWrapperStyle}>
            <Button css={ActionButtonStyle} type="submit" variant="contained" color="primary" disabled={submitDisabled}>
              出品
            </Button>
            <Button css={ActionButtonStyle} variant="text" color="primary" onClick={cancel}>
              キャンセル
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};
