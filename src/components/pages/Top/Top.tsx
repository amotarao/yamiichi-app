/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { slackScopes } from '../../../utils/slack';
import { LoadingCircle } from '../../atoms/LoadingCircle';
import { HeaderStyle, TitleStyle, CatchStyle } from './styled';

export interface TopProps {
  className?: string;
  isLoading: boolean;
}

export const Top: React.FC<TopProps> = ({ className, isLoading }) => {
  return (
    <div className={className}>
      <LoadingCircle isLoading={isLoading} />
      <header css={HeaderStyle}>
        <h1 css={TitleStyle}>Yamiichi</h1>
        <p css={CatchStyle}>
          <span className="p1">Slackで簡単、</span>
          <span className="p2">闇市</span>
        </p>
        <a href={`https://slack.com/oauth/authorize?scope=${encodeURIComponent(slackScopes.join(','))}&client_id=${process.env.REACT_APP_SLACK_CLIENT_ID}`}>
          <img
            alt="Add to Slack"
            height="40"
            width="139"
            src="https://platform.slack-edge.com/img/add_to_slack.png"
            srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
          />
        </a>
      </header>
    </div>
  );
};
