import React from 'react';
import {
	StyleSheet,
	View,
	Image,
	StatusBar,
	Keyboard,
	KeyboardAvoidingView,
	Platform
} from 'react-native';
import update from 'react-addons-update';
import { Text, Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import AppIntroSlider from 'react-native-app-intro-slider';

import { Context as BudgetContext } from '../context/BudgetContext';
import { ConstructSlides, DeconstructSlides } from '../services/IntroSlidesComposer';
import { Constants } from '../constants/Theme';
import Layout from '../constants/Layout';
import InitialFlowForm from '../components/InitialFlowForm';

StatusBar.setBarStyle('light-content');

export default class IntroScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			introSkipped: false,
			currentSlide: 0,
			slides: ConstructSlides()
		}

		this.formStateHandler = (newValue, childIndex) => {
			// Update parent or child within parent Slide
			if (childIndex !== undefined) {
				this.setState({
					slides: update(this.state.slides, { [this.state.currentSlide]: { children: { [childIndex]: { value: { $set: newValue } } } } })
				});
			} else {
				this.setState({
					slides: update(this.state.slides, { [this.state.currentSlide]: { value: { $set: newValue } } })
				});
			}

			// Check for Optional Slides & add in place if parent field was enabled
			if (this.state.slides[this.state.currentSlide].optionalSlides) {
				let indexRef = this.state.currentSlide + 1;
				// TODO: Take this out and add Method to Slides Composer
				if (newValue === true) {
					console.log('ADDING SLIDES')
					this.state.slides[this.state.currentSlide].optionalSlides.forEach((subSlide) => {
						if (subSlide.children !== undefined) {
							subSlide.children.forEach((child) => {
								if (child.default) child.value = child.default;
							});
						} 
						if (subSlide.default !== undefined) subSlide.value = subSlide.default;
						this.state.slides.splice(indexRef, 0, subSlide)
						indexRef++;
					});
				} else {
					console.log('SUBTRACTING SLIDES');
					this.state.slides.splice(indexRef, this.state.slides[this.state.currentSlide].optionalSlides.length);
				}

				this.setState({
					slides: this.state.slides
				});
			}
		};

		this.createBudget = (budgetValues) => {
			console.log('We have launch!!')
		};

		this.renderItem = ({ item, index }) => {
			switch (this.state.introSkipped) {
				/* SKIPPED FLOW */
				case true:
					return (
						<View style={[
							styles.slide,
							{
								backgroundColor: item.bgColorAlt,
							}
						]}>
							<Text style={styles.title}>{item.titleAlt}</Text>
							<Image source={item.imageAlt} />
							{
								item.action ?
									<Button
										raised
										containerStyle={styles.actionButtonContainer}
										buttonStyle={styles.actionButton}
										title={item.actionAlt}
										onPress={this.onDone}
										icon={<Ionicons
											name="md-checkmark"
											style={{ marginRight: 6 }}
											color="rgba(255, 255, 255, .9)"
											size={24}
										/>}
									/> :
									null
							}
							<Text style={[styles.text, {
								color: item.color,
							}]}>
								{item.textAlt}
							</Text>
						</View>
					)
				case false:
					/* REGULAR FLOW */
					return (
						<View
							style={[
								styles.slide,
								{
									backgroundColor: item.bgColor,
								}
							]}
						>
							<Text style={styles.title}>{item.title}</Text>
							<Image
								style={{ width: Layout.window.width, maxHeight: 400 }}
								resizeMode="contain"
								source={item.image}
							/>
							{
								item.form ?
									<View style={styles.formContainer} >
										<InitialFlowForm ref="FlowForm" action={this.formStateHandler} slideIndex={index} data={item} />
									</View> : null
							}
							{
								item.action ?
									<Button
										raised
										containerStyle={styles.actionButtonContainer}
										buttonStyle={styles.actionButton}
										title={item.action}
										onPress={this.onDone}
										icon={<Ionicons
											name="md-checkmark"
											style={{ marginRight: 6 }}
											color="rgba(255, 255, 255, .9)"
											size={24}
										/>}
									/> :
									null
							}
							<Text style={[styles.text, {
								color: item.color,
							}]}>
								{item.text}
							</Text>
						</View>
					)
			}
		};

		this.renderNextButton = () => {
			return (
				<View style={styles.buttonCircle}>
					<Ionicons
						name="md-arrow-round-forward"
						color="rgba(255, 255, 255, .9)"
						size={24}
					/>
				</View>
			);
		};

		this.renderDoneButton = () => {
			return (
				<>
				</>
			);
		};

		this.checkSlideChange = (activeSlide) => {
			Keyboard.dismiss();
			if (this.state.introSkipped && this.state.currentSlide > activeSlide) {
				this.setState({ introSkipped: false });
			}

			this.setState({ currentSlide: activeSlide });
		};

		this.onSkip = () => {
			this.setState({ introSkipped: true });
			this.AppIntroSlider.goToSlide(this.state.slides.length - 1, true);
		};

		this.onDone = () => {
			let introStatus = 'COMPLETE';
			if (this.state.introSkipped) introStatus = 'SKIPPED';
			this.context.createBudget(DeconstructSlides(this.state.slides, introStatus));
		};
	}
	
	static contextType = BudgetContext;

	render() {
		return (
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS == 'ios' ? "padding" : "height"}>
				<AppIntroSlider
					renderItem={this.renderItem}
					renderDoneButton={this.renderDoneButton}
					renderNextButton={this.renderNextButton}
					data={this.state.slides}
					onSkip={this.onSkip}
					onSlideChange={index => this.checkSlideChange(index)}
					showSkipButton
					showPrevButton
					ref={ref => this.AppIntroSlider = ref}
				/>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		fontFamily: Constants.mainFontFamily,
		alignItems: 'center',
		justifyContent: 'center'
	},
	slide: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
		paddingBottom: 60
	},
	title: {
		fontSize: Constants.headerXLarge,
		fontWeight: Constants.fontWeightMedium,
		marginVertical: 24,
		color: 'white',
		textAlign: 'center',
	},
	text: {
		textAlign: 'center',
		marginVertical: 24,
		fontSize: Constants.fontMedium
	},
	formContainer: {
		width: '100%',
		marginHorizontal: 16,
		padding: 0,
	},
	actionButton: {
		backgroundColor: '#22BCB5',
	},
	actionButtonContainer: {
		marginVertical: 16
	},
	buttonCircle: {
		width: 40,
		height: 40,
		backgroundColor: 'rgba(0, 0, 0, .2)',
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	}
});


    // this.renderDoneButton = () => {
    //   return (
    //     <View style={styles.buttonCircle}>
    //       <Ionicons
    //         name="md-checkmark"
    //         color="rgba(255, 255, 255, .9)"
    //         size={24}
    //       />
    //     </View>
    //   );
    // };