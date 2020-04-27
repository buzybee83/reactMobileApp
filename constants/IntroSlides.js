import { Income, Savings } from '../constants/FieldsConfig';
import { Colors } from '../constants/Theme';

const defaultSlides = [
  {
    id: '1',
    order: 0,
    title: 'Let\'s Get You Started!',
    text: 'In the next screens, we are going to personalize some settings to get your budget going.',
    image: require('../assets/images/calc.png'),
    color: '#fff',
    bgColor: '#59b2ab'
  },
  {
    id: '99',
    order: 99,
    title: 'Almost There!',
    titleAlt: 'Are You Sure You Want to Start Without Initial Setup?',
    text: 'Don\'t worry, these settings are just to get your budget started. You will be able to make changes later.',
    textAlt: 'Skipping the initial setup, you will have to manually configure all settings or you can revisit this walkthrough at a later time!',
    action: 'Launch Now!',
    actionAlt: 'Launch Anyway!',
    image: require('../assets/images/rocket-takeoff.png'),
    imageAlt: require('../assets/images/rocket.png'),
    color: '#fff',
    bgColor: '#4A148C',
    bgColorAlt: '#e91d50'
  }
];

export default function IntroSlidesComposer() {
  let slides = [defaultSlides[0]];
  let count = 0;
  Income.forEach(ele => {
    let tempEl = {
      id: ele.section,
      title: ele.section,
      form: true,
      bgColor: Colors[count],
      ...ele
    };
    count++;
    if (ele.default) tempEl.value = ele.default;
    if (ele.optionalSlides) {
      tempEl.optionalSlides = [];
      ele.optionalSlides.forEach((subEl) => {
        let subTempEl = {
          id: subEl.section,
          title: subEl.section,
          form: true,
          bgColor: Colors[count],
          ...subEl
        }
        count++;
        if (subEl.default) subTempEl.value = subEl.default;
        tempEl.optionalSlides.push(subTempEl);
      });
    }
    slides[slides.length] = tempEl;
  });

  Savings.forEach(ele => {
    let tempEl = {
      id: ele.section,
      title: ele.section,
      form: true,
      bgColor: Colors[count],
      ...ele
    };
    count++;
    if (ele.default) tempEl.value = ele.default;
    if (ele.optionalSlides) {
      tempEl.optionalSlides = [];
      ele.optionalSlides.forEach((subEl) => {
        let subTempEl = {
          id: subEl.section,
          title: subEl.section,
          form: true,
          bgColor: Colors[count],
          ...subEl
        }
        count++;
        if (subEl.default) subTempEl.value = subEl.default;
        tempEl.optionalSlides.push(subTempEl);
      });
    }
    slides[slides.length] = tempEl;
  });
  
  slides = slides.sort((a, b) => a.order > b.order);
  slides[slides.length] = defaultSlides[1];
  console.log('LENGTH ==', slides.length)
  return slides;
}
