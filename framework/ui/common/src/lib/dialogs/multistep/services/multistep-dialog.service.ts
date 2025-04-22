import { inject, Injectable, StaticProvider } from '@angular/core';
import { UiCommonDialogService } from '../../base';
import { MultistepDialog } from '../model/classes/multistep-dialog.class';
import { IEditorDialogResult } from '../../base';
import { StepType } from '../model/enums/step-type.enum';
import { IWizardStepCustom, IWizardStepForm, IWizardStepGrid } from '../model/interfaces/wizard-step.interface';
import { MultistepDialogAdvanced } from '../model/classes/multistep-dialog-advanced.class';

/**
 * Displays a dialog box whose content is split up into several steps.
 *
 * @group Dialogs
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonMultistepDialogService {
	private readonly modalDialogService = inject(UiCommonDialogService);

	/**
	 * crate a multi-steps dialog.
	 * @param multistepDialog config of the multi-steps dialog.
	 * @typeParam T The object type edited in the dialog.
	 * @returns Result of the dialog.
	 */
	public showDialog<T extends object>(multistepDialog: MultistepDialog<T> | MultistepDialogAdvanced<T>): Promise<IEditorDialogResult<T>> | undefined {
		// assign the sub model to each step via modelName.
		multistepDialog.wizardSteps.forEach((x) => {
			const dataItem = multistepDialog.dataItem as Record<string, unknown>;
			if (x.stepType === StepType.Custom) {
				const stepCustom = x as IWizardStepCustom;
				if (stepCustom.bodyProviders) {
					multistepDialog.dialogOptions.bodyProviders?.concat(stepCustom.bodyProviders);
				}
				if (stepCustom.modelName) {
					const model = dataItem[stepCustom.modelName] as Record<string, unknown>;
					if (!model) {
						throw new Error(`Model: ${stepCustom.modelName} could not find in dataItem.`);
					}
					stepCustom.model = model;
				}
			} else if (x.stepType === StepType.Form) {
				const step = x as IWizardStepForm<object>;
				if (!step.modelName && !step.model) {
					throw new Error(`Could not find model config of step: ${x.id}.`);
				} else if (step.modelName) {
					if (!dataItem[step.modelName]) {
						throw new Error(`Model: ${step.modelName} could not find in dataItem.`);
					}
					step.model = dataItem[step.modelName] as object;
				}
			} else if (x.stepType === StepType.Grid) {
				const step = x as IWizardStepGrid<object>;
				if (!step.modelName && !Array.isArray(step.model)) {
					throw new Error(`Could not find model config of step: ${x.id}.`);
				} else if (step.modelName) {
					if (!dataItem[step.modelName]) {
						throw new Error(`Model: ${step.modelName} could not find in dataItem.`);
					}
					step.model = dataItem[step.modelName] as object[];
				}
			}
		});

		const multistepDialogAdv = multistepDialog as MultistepDialogAdvanced<T>;
		const providers: StaticProvider[] = [];
		providers.concat(multistepDialogAdv.sectionTop?.providers ?? []);
		providers.concat(multistepDialogAdv.sectionLeft?.providers ?? []);
		providers.concat(multistepDialogAdv.sectionRight?.providers ?? []);
		providers.concat(multistepDialogAdv.sectionBottom?.providers ?? []);

		multistepDialog.dialogOptions.bodyProviders?.concat(providers);

		return this.modalDialogService.show(multistepDialog.dialogOptions)?.then((result) => {
			// unwrap the result
			const multiStepResult: IEditorDialogResult<T> = {
				value: result.value?.dataItem,
				closingButtonId: result.closingButtonId,
			};
			return multiStepResult;
		});
	}
}
