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
      Root: {
        path: 'root',
        screens: {
          Home: 'home',
          Links: 'links',
          Account: 'account',
        },
      },
    },
  });
}
