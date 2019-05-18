/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useRef, useState } from 'react';
import { Avatar, IconButton, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem } from '@material-ui/core';
import { ButtonStyle } from './styled';

export interface AvatarButtonProps {
  className?: string;
  signedIn: boolean;
  user: {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    uid: string;
  } | null;
  signOut: () => void;
}

export const AvatarButton: React.FC<AvatarButtonProps> = ({ className, signedIn, user, signOut }) => {
  const [open, setOpen] = useState(false);
  const anchorEl = useRef<HTMLElement>(null);
  const menuId = 'menu-list-grow';

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = (event: React.ChangeEvent<{}> | React.MouseEvent<HTMLElement>) => {
    if (anchorEl.current && anchorEl.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton
        className={className}
        css={ButtonStyle}
        buttonRef={anchorEl}
        aria-owns={open ? menuId : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        {(() => {
          if (!signedIn || !user) return <Avatar>?</Avatar>;
          if (user.photoURL) return <Avatar src={user.photoURL} alt={user.displayName || ''} />;
          if (user.displayName) return <Avatar>{user.displayName.slice(0, 1).toUpperCase()}</Avatar>;
          return <Avatar>U</Avatar>;
        })()}
      </IconButton>
      <Popper open={open} anchorEl={anchorEl.current} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper id={menuId}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  <MenuItem
                    onClick={(event) => {
                      signOut();
                      handleClose(event);
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
};
