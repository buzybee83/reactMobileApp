import { CommonActions } from '@react-navigation/native';

let navigator;

function setTopNavigator(navigatorRef) {
  if (!navigator) navigator = navigatorRef;
}

function navigate(routeName, params) {
  navigator.dispatch(
    CommonActions.navigate({
      routeName,
      params,
    })
  );
}

export {
  navigate,
  setTopNavigator,
};