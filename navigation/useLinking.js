import { useLinking } from '@react-navigation/native';
import { Linking } from 'expo';

export default function(containerRef) {
  return useLinking(containerRef, {
    prefixes: [Linking.makeUrl('/')],
    config: {
      Auth: {
        path: 'auth',
        screens: {
          Login: 'login',
          Signup: 'signup',
        },
      },
      Intro: {
        path: 'intro',
        screens: {
          Intro: 'intro'
        }
      },
      Root: {
        path: 'root',
        screens: {
          Home: 'home',
          Bills: 'bills',
          Account: 'account',
        },
      },
    },
  });
}
