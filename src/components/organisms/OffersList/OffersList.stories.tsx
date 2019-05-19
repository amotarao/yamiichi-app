import React from 'react';
import { MemoryRouter } from 'react-router';
import { storiesOf } from '@storybook/react';
import { withKnobs, number } from '@storybook/addon-knobs';
import { OffersList, OffersListProps } from './OffersList';

const stories = storiesOf('organisms', module);
stories.addDecorator((story) => <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>);
stories.addDecorator(withKnobs);

stories.add('OffersList', () => {
  const item = {
    id: '1',
    data: {
      title: 'タイトル',
      description: '商品説明商品説明商品説明商品説明商品説明商品説明商品説明商品説明商品説明商品説明',
      active: true,
      author: {
        name: 'author',
        iconUrl: 'https://placehold.jp/24x24.png',
      },
      lastBidder: {
        name: 'lastBidder',
        iconUrl: 'https://placehold.jp/24x24.png',
      },
      initialPrice: 0,
      maxPrice: 1000,
      currentPrice: 300,
      registrationDate: new Date(2018, 0, 1, 12, 0),
      periodDate: new Date(2019, 11, 31, 12, 0),
    },
  };

  const props: OffersListProps = {
    items: new Array(number('items', 12)).fill(item).map((elm, i) => ({ ...elm, id: i.toString() })),
  };

  return <OffersList {...props} />;
});
