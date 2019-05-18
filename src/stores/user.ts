import { Container } from 'unstated';
import { auth } from '../modules/firebase';

export interface UserState {
  isLoading: boolean;
  signedIn: boolean;
  user: firebase.User | null;
}

export class UserContainer extends Container<UserState> {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      signedIn: false,
      user: null,
    };
    this.onAuthStateChanged();
  }

  onAuthStateChanged = () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await this.setState({
          ...this.state,
          isLoading: false,
          signedIn: true,
          user,
        });
      } else {
        await this.setState({
          ...this.state,
          isLoading: false,
          signedIn: false,
          user: null,
        });
      }
    });
  };

  signIn = async (token: string) => await auth.signInWithCustomToken(token);

  signOut = async () => await auth.signOut();
}
