const tintColor = '#2f95dc';
// const primaryColor = '#22BCB5';
const lightBackground = '#FFF'
const darkBackground = '#263238';
const primaryColor = '#22BCB5';
const secondaryColor = '#e91d50';
const linksColor = '#1ea6a0';
const mainFontFamily = 'roboto';


const Constants = {
  mainFontFamily,
  tintColor,
  iconDefault: '#ccc',
  iconSelected: tintColor,
  primaryColor,
  secondaryColor,
  errorBackground: 'red',
  errorText: '#bb0000',
  warningBackground: '#EAEB5E',
  warningText: '#666804',
  noticeBackground: tintColor,
  noticeText: '#fff',
  headerSmall: 18,
  headerMedium: 22,
  headerLarge: 24,
  headerXLarge: 26,
  fontSmall: 14,
  fontMedium: 16,
  fontLarge: 18,
  fontXLarge: 20,
  fontWeightLight: '300',
  fontWeightMedium: '500',
  fontWeightHeavy: '700',
  buttonDesign: {
    borderRadius: 45,
    backgroundColor: primaryColor,
    fontSize: 20,
    fontWeight: '500'
  },
  buttonLinkDesign: {
    color: linksColor,
    fontWeight: '500'
  },
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: {height: 4, width: 4},
    shadowOpacity: .25,
    shadowRadius: 3.5,
    elevation: 5,
  }
};

const LightTheme = {
  lightBackground,
  tabBar: '#212121',
};

const DarkTheme = {
  darkBackground,
  tabBar: '#fefefe',
};

const Colors = [
  // '#59b2ab',
  '#18a79b',
  '#18a777',
  '#1bbd87',
  '#579bb2',
  '#2f95dc',
  '#0066ff',
  '#576eb2',
  '#5757b2',
  '#8557b2',
  '#6e57b2',
  '#9966ff',
  // '#4A148C'
];

export { Constants, LightTheme, DarkTheme, Colors }

