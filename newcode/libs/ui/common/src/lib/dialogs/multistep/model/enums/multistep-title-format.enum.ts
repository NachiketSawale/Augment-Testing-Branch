/**
 * MultistepDialog title format
 * 0 default: MainTitle - 1/4 Step1Title
 * 1 No progress: MainTitle - Step1Title
 * 2 Only StepTitle: Step1Title
 * @group Dialogs
 */
export enum MultistepTitleFormat {
	/**
	 * default: MainTitle - 1/4 Step1
	 */
	MainTitleProgressStepTitle,
	/**
	 * No progress: MainTitle - Step1
	 */
	MainTileStepTitle,
	/**
	 * Only StepTitle: Step1
	 */
	StepTitle
}