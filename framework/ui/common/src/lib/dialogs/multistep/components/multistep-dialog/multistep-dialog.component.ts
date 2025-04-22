import { AfterViewInit, Component, inject, InjectionToken, ViewChild } from '@angular/core';
import { IDialogData } from '../../../base/model/interfaces/dialog-data-interface';
import { MultistepDialog } from '../../model/classes/multistep-dialog.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkStepper, StepperSelectionEvent } from '@angular/cdk/stepper';
import { IWizardStep, IWizardStepCustom, IWizardStepForm, IWizardStepGrid, IWizardStepMessage } from '../../model/interfaces/wizard-step.interface';
import { StepType } from '../../model/enums/step-type.enum';
import { DialogButtonSettingFunc, getCustomDialogDataToken, ICustomDialog } from '../../../base';
import { MultistepTitleFormat } from '../../model/enums/multistep-title-format.enum';
import { PlatformTranslateService } from '@libs/platform/common';
import { MultistepDialogAdvanced } from '../../model/classes/multistep-dialog-advanced.class';
import { StepperCommand } from '../../model/enums/stepper-command.enum';

const MULTISTEP_DIALOG_DATA_TOKEN = new InjectionToken('dlg-multistep-data');

/**
 * can get the data and control the multistep dialog in custom step component.
 *
 * @group Dialogs
 */
export function getMultiStepDialogDataToken<T extends object>(): InjectionToken<MultistepDialog<T>> {
	return MULTISTEP_DIALOG_DATA_TOKEN;
}

export function getMultiStepDialogAdvancedDataToken<T extends object>(): InjectionToken<MultistepDialogAdvanced<T>> {
	return MULTISTEP_DIALOG_DATA_TOKEN;
}

@Component({
	selector: 'ui-common-multistep-dialog',
	templateUrl: './multistep-dialog.component.html',
	styleUrls: ['./multistep-dialog.component.scss'],
})
export class MultistepDialogComponent<T extends object> implements AfterViewInit {
	@ViewChild('cdkStepper')
	public cdkStepper!: CdkStepper;

	public get wizardSteps() {
		return this.dialogData.wizardSteps;
	}

	public get wizardStepsDesc() {
		return this.dialogData.wizardSteps.map((x) => x.title);
	}

	public wzStrings = {
		stepFinish: 'platform.wizard.stepFinish',
		nextStep: 'platform.wizard.nextStep',
	};

	public get hideIndicators() {
		return this.dialogData.hideIndicators;
	}

	public get hideDisplayOfNextStep() {
		return this.dialogData.hideDisplayOfNextStep;
	}

	public get showTabs() {
		return this.dialogData.showTabs;
	}

	private matData = inject(MAT_DIALOG_DATA) as IDialogData<this, MultistepDialogComponent<T>>;

	public readonly dialogData = inject(getMultiStepDialogAdvancedDataToken<T>());

	private readonly dialogWrapper = inject(getCustomDialogDataToken<T, MultistepDialogComponent<T>>());

	private translate = inject(PlatformTranslateService);

	// use for requireSelection
	private _gridSelected = false;

	private nextIsDisabled: boolean | DialogButtonSettingFunc<ICustomDialog<this, MultistepDialogComponent<T>, void>, boolean, void> = false;
	private backIsDisabled: boolean | DialogButtonSettingFunc<ICustomDialog<this, MultistepDialogComponent<T>, void>, boolean, void> = false;
	private finishIsDisabled: boolean | DialogButtonSettingFunc<ICustomDialog<this, MultistepDialogComponent<T>, void>, boolean, void> = false;

	public constructor() {
		const wizardDialog = this.dialogData;
		if (wizardDialog) {
			wizardDialog.command.subscribe((command) => {
				switch (command.command) {
					case StepperCommand.GoToNext:
						this.stepNext();
						break;
					case StepperCommand.GoToPrevious:
						this.stepPrevious();
						break;
					case StepperCommand.SetHeaderText:
						this.setHeaderText(command.value as string | undefined);
						break;
					case StepperCommand.GoTo:
						this.GoToIndex(command.value as number);
				}
			});
			this.setHeaderText();
		}
	}

	public async GoToIndex(index: number): Promise<void> {
		if (this.dialogData.onChangingStep) {
			await this.dialogData.onChangingStep(this.dialogData, index);
		}
		this.cdkStepper.selectedIndex = index;
	}

	public ngAfterViewInit() {
		setTimeout(() => this.footerButtons());
	}

	public onStepChange(event: StepperSelectionEvent) {
		this.setStepIndex(event.selectedIndex);
		if (event.selectedIndex > event.previouslySelectedIndex) {
			// mask step as completed after step move next
			(this.wizardSteps[event.previouslySelectedIndex] as unknown as Record<string, unknown>)['completed'] = true;
		}

		//reset the grid selected after change step.
		this._gridSelected = false;

		// re-render the component after change step if needed.
		if (this.wizardSteps[event.selectedIndex].autoRefresh) {
			this.wizardSteps[event.selectedIndex] = this.wizardSteps[event.selectedIndex].copy();
		}

		const step = this.wizardSteps[event.selectedIndex];

		this.setHeaderText();
		const backBtn = this.matData.dialog.getButtonById('back');
		//const backIsDisabled = backBtn?.isDisabled;
		const nextBtn = this.matData.dialog.getButtonById('next');
		//const nextIsDisabled = nextBtn?.isDisabled;

		const finishBtn = this.matData.dialog.getButtonById('ok');
		//const cancelBtn = this.matData.dialog.getButtonById('cancel');

		const requireSelection = (step as IWizardStepGrid<object>).requireSelection;
		const isLastStep = event.selectedIndex === this.wizardSteps.length - 1;

		if (backBtn) {
			backBtn.isDisabled = (info) => {
				return event.selectedIndex === 0 || (typeof this.backIsDisabled === 'boolean' ? this.backIsDisabled : this.backIsDisabled(info));
			};
		}

		if (nextBtn) {
			nextBtn.isDisabled = (info) => {
				return isLastStep || !this._gridSelected || (typeof this.nextIsDisabled === 'boolean' ? this.nextIsDisabled : this.nextIsDisabled(info));
			};

			if (!requireSelection) {
				this._gridSelected = true;
			}
		}

		if (finishBtn) {
			finishBtn.isDisabled = (info) => {
				return !this._gridSelected || (typeof this.finishIsDisabled === 'boolean' ? this.finishIsDisabled : this.finishIsDisabled(info));
			};
			if (!requireSelection) {
				this._gridSelected = true;
			}
		}

		if (this.dialogData.onChangeStep) {
			this.dialogData.onChangeStep(this.dialogData, event);
		}
	}

	public footerButtons(): void {
		const nextButton = this.matData.dialog.getButtonById('next');
		const backButton = this.matData.dialog.getButtonById('back');
		const finishButton = this.matData.dialog.getButtonById('finish');

		const firstStep = this.matData.dialog.value?.wizardSteps[0];

		// cache the isDisabled function
		this.backIsDisabled = backButton?.isDisabled === undefined ? false : backButton.isDisabled;
		this.nextIsDisabled = nextButton?.isDisabled === undefined ? false : nextButton.isDisabled;
		this.finishIsDisabled = finishButton?.isDisabled === undefined ? false : finishButton.isDisabled;

		if (nextButton) {
			nextButton.fn = () => {
				this.stepNext();
				return undefined;
			};

			if (firstStep) {
				const requireSelection = (firstStep as IWizardStepGrid<object>).requireSelection;
				if (requireSelection) {
					nextButton.isDisabled = (info) => {
						return !this._gridSelected || (typeof this.nextIsDisabled === 'boolean' ? this.nextIsDisabled : this.nextIsDisabled(info));
					};
				}
			}
		}

		if (backButton) {
			backButton.fn = () => {
				this.stepPrevious();
				return undefined;
			};
			backButton.isDisabled = true;
		}
	}

	public setHeaderText(headerText?: string) {
		setTimeout(() => {
			this.dialogWrapper.headerText = headerText ?? this.getHeaderText();
		});
	}

	public getHeaderText() {
		let title;
		let titleLeft = '';
		if (this.dialogData.title) {
			titleLeft = `${this.translate.instant(this.dialogData.title).text} - `;
		}
		switch (this.dialogData.titleFormat) {
			case MultistepTitleFormat.StepTitle:
				title = this.translate.instant(this.wizardSteps[this.dialogData.stepIndex].title).text;
				break;
			case MultistepTitleFormat.MainTileStepTitle: {
				title = `${titleLeft}${this.translate.instant(this.wizardSteps[this.dialogData.stepIndex].title).text}`;
				break;
			}
			default:
				title = `${titleLeft}${this.dialogData.stepIndex + 1}/${this.wizardSteps.length} ${this.translate.instant(this.wizardSteps[this.dialogData.stepIndex].title).text}`;
		}
		return title;
	}

	public castToStepCustom(step: IWizardStep): IWizardStepCustom {
		return step as IWizardStepCustom;
	}

	public castToStepForm(step: IWizardStep): IWizardStepForm<object> {
		return step as IWizardStepForm<object>;
	}

	public castToStepGrid(step: IWizardStep): IWizardStepGrid<object> {
		return step as IWizardStepGrid<object>;
	}

	public castToStepMessage(step: IWizardStep): IWizardStepMessage {
		return step as IWizardStepMessage;
	}

	protected onSelectionChanged(selectedItems: object[]) {
		this._gridSelected = selectedItems && selectedItems.length > 0;
	}

	/**
	 * set the stepIndex of the multiStepDialogClass
	 * @param index
	 * @private
	 */
	private setStepIndex(index: number) {
		const multistepDialog = this.dialogData as unknown as Record<string, unknown>;
		if (multistepDialog['stepIndex'] || multistepDialog['stepIndex'] === 0) {
			multistepDialog['stepIndex'] = index;
		}
	}

	private async stepNext(): Promise<void> {
		if (this.dialogData.onChangingStep) {
			await this.dialogData.onChangingStep(this.dialogData, this.dialogData.stepIndex + 1);
		}
		this.cdkStepper.next();
	}

	private async stepPrevious(): Promise<void> {
		if (this.dialogData.onChangingStep) {
			await this.dialogData.onChangingStep(this.dialogData, this.dialogData.stepIndex - 1);
		}
		this.cdkStepper.previous();
	}

	protected readonly stepType = StepType;
}
