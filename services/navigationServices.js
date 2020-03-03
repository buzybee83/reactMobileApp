import { CommonActions } from '@react-navigation/native';

let navigator;

function setTopNavigator(navigatorRef) {
  if (!navigator) navigator = navigatorRef;
}

function navigate(routeName, params) {
  navigator.dispatch(
    CommonActions.navigate({
      name: routeName,
      params,
    })
  );
}
function resetNavigation() {
  navigator.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Root' }],
    })
  );
}

export {
  navigate,
  setTopNavigator,
  resetNavigation
};