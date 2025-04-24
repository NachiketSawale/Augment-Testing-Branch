import { inject, Injectable } from '@angular/core';
import { MessageStep, UiCommonMessageBoxService, UiCommonMultistepDialogService } from '@libs/ui/common';
import { SplitLineItemConfiguration } from './estimate-main-split-line-item-configuration';
import { SplitLineItemMethodStep } from './split-line-item-method-step-wizard.service';
import { SplitLineItemByResourceStep } from './split-line-item-by-resource-step-wizard.service';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';


import { HttpClient } from '@angular/common/http';
import { EstimateMainSplitLineItemMethodsLookupService } from './estimate-main-split-line-item-methods-lookup.service';
import { EstimateMainService } from '../../containers/line-item/estimate-main-line-item-data.service';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { SplitLineItemByQuantityStep } from './split-line-item-by-quantity-step-wizard.service';


/*./split-line-item-method-step.class
 * Copyright(c) RIB Software GmbH
 */

@Injectable({
	providedIn: 'root'
})
/**
 * Estimate Main Split Line Item Wizardservice
 */
export class EstimateMainSplitLineItemWizardservice {     // need to remigrate 

	protected http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	private readonly estimateMainService = inject(EstimateMainService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly modalDialogService = inject(UiCommonMultistepDialogService);
	private readonly splitLineItemMethodStep = inject(SplitLineItemMethodStep);
	private readonly splitLineItemByResourceStep = inject(SplitLineItemByResourceStep);
	private readonly splitLineItemByQuantityStep = inject(SplitLineItemByQuantityStep);
	private readonly splitLineItemMethodsLookupService = inject(EstimateMainSplitLineItemMethodsLookupService);
	private createProjectAlternativeConfiguration = new SplitLineItemConfiguration();
	//private multiStepDialog!: MultistepDialog<any>;

	private constructor() {
		//this.trackSplitMethodChanges();
	}

	/**
	 * Create Estimate Main Split Line Item Wizard
	 */
	// public splitLineItem() {
	// 	this.createProjectAlternativeConfiguration.splitLineItemMethodsForm.resultSet = this.splitLineItemMethodStep.ESTIMATE_SCOPE.RESULT_HIGHLIGHTED.value;
	// 	this.createProjectAlternativeConfiguration.splitLineItemMethodsForm.splitMethod = this.splitLineItemMethodsLookupService.SplitLineItemMethods.SplitByPercentAndQuantity.id;

	// 	const selectedLineItem = this.estimateMainService.getSelectedEntity();
	// 	if (selectedLineItem) {
	// 		const splitLineItems: ISplitLineItems = {
	// 			Id: selectedLineItem.Id,
	// 			info: selectedLineItem.Info,
	// 			code: selectedLineItem.Code,
	// 			desc: selectedLineItem.DescriptionInfo?.Description ?? '',
	// 			quantityPercent: 100,
	// 			quantityTotal: selectedLineItem.QuantityTotal,
	// 			splitDifference: null,
	// 			estLineItemFk: selectedLineItem.EstLineItemFk,
	// 			mdcControllingUnitfk: selectedLineItem.MdcControllingUnitFk,
	// 			boqRootRef: selectedLineItem.BoqItemFk,
	// 			EstBoqFk: selectedLineItem.BoqItemFk,
	// 			psdActivityScheduleFk: selectedLineItem.PsdActivityFk,
	// 			psdActivityFk: selectedLineItem.PsdActivityFk,
	// 			prjLocationFk: selectedLineItem.PrjLocationFk,
	// 			isMainItem: true
	// 		};
	// 		this.createProjectAlternativeConfiguration.splitByQuantityForm.splitLineItems = [splitLineItems];
	// 	}
	// 	this.multiStepDialog = new MultistepDialog(
	// 		this.createProjectAlternativeConfiguration,
	// 		[this.splitLineItemMethodStep.createForm()],
	// 		'estimate.main.splitLineItemWizard.title');

	// 	const okButton = this.multiStepDialog.dialogOptions?.buttons?.find(x => x.id == StandardDialogButtonId.Ok);
	// 	if (okButton) {
	// 		okButton.isDisabled = (info) => {
	// 			if (this.createProjectAlternativeConfiguration.splitLineItemMethodsForm.splitMethod == this.splitLineItemMethodsLookupService.SplitLineItemMethods.SplitByCommissioningResources.id) {
	// 				return false;
	// 			}
	// 			return !(info.dialog.value?.currentStep.canFinish);
	// 		};
	// 		okButton.fn = () => {
	// 			return this.onFinish();
	// 		};
	// 		okButton.autoClose = true;
	// 	}

	// 	const nextButton = this.multiStepDialog.dialogOptions?.buttons?.find(x => x.id == 'next');
	// 	if (nextButton) {
	// 		nextButton.isDisabled = () => {
	// 			return !(this.createProjectAlternativeConfiguration.splitLineItemMethodsForm.splitMethod) || (this.createProjectAlternativeConfiguration.splitLineItemMethodsForm.splitMethod === this.splitLineItemMethodsLookupService.SplitLineItemMethods.SplitByCommissioningResources.id);
	// 		};
	// 	}
	// 	this.modalDialogService.showDialog(this.multiStepDialog);
	// 	this.onSplitMethodChange(this.createProjectAlternativeConfiguration.splitLineItemMethodsForm.splitMethod);
	// }

	// private trackSplitMethodChanges() {
	// 	Object.defineProperty(this.createProjectAlternativeConfiguration.splitLineItemMethodsForm, '_splitMethod', {
	// 		value: this.createProjectAlternativeConfiguration.splitLineItemMethodsForm.splitMethod,
	// 		writable: true,
	// 		enumerable: true,
	// 		configurable: true
	// 	});
	// 	Object.defineProperty(this.createProjectAlternativeConfiguration.splitLineItemMethodsForm, 'splitMethod', {
	// 		get: () => this.createProjectAlternativeConfiguration.splitLineItemMethodsForm._splitMethod,
	// 		set: (value) => {
	// 			this.createProjectAlternativeConfiguration.splitLineItemMethodsForm._splitMethod = value;
	// 			this.onSplitMethodChange(value);
	// 		}
	// 	});
	// }

	// private onSplitMethodChange(value: number) {
	// 	if (this.multiStepDialog) {
	// 		const stepToRemove: string[] = ['splitByResourcesForm', 'completionStep', 'splitByQuantityForm'];
	// 		this.multiStepDialog.removeWizardSteps(stepToRemove);
	// 		let stepCount = this.multiStepDialog.wizardSteps.length;
	// 		console.log(stepCount);
	// 		const splitLineItemMethodsForm = this.multiStepDialog.wizardSteps.find(x => x.id == 'splitLineItemMethodsForm');
	// 		if (splitLineItemMethodsForm) {
	// 			splitLineItemMethodsForm.bottomDescription = this.getNoteText(value);
	// 			switch (value) {
	// 				case this.splitLineItemMethodsLookupService.SplitLineItemMethods.SplitByObjectLocation.id:
	// 					// TODO
	// 					break;
	// 				case this.splitLineItemMethodsLookupService.SplitLineItemMethods.SplitByObjects.id:
	// 					// TODO
	// 					break;
	// 				case this.splitLineItemMethodsLookupService.SplitLineItemMethods.SplitByCommissioningResources.id:
	// 					break;
	// 				case this.splitLineItemMethodsLookupService.SplitLineItemMethods.SplitByPercentAndQuantity.id:
	// 					this.multiStepDialog.insertWizardStep(this.splitLineItemByQuantityStep.createForm(this.createProjectAlternativeConfiguration.splitByQuantityForm), stepCount++);
	// 					this.multiStepDialog.insertWizardStep(this.completionStep(), stepCount);
	// 					break;
	// 				case this.splitLineItemMethodsLookupService.SplitLineItemMethods.SplitByResources.id:
	// 					this.multiStepDialog.insertWizardStep(this.splitLineItemByResourceStep.createForm(this.createProjectAlternativeConfiguration.splitByResourcesForm), stepCount);
	// 					break;
	// 			}
	// 		}
	// 	}
	// }

	/**
	 * configure the fist step introduction of dailog
	 *
	 * @returns {MessageStep} return the MessageStep object for introduction in mutistep dailog
	 */
	public completionStep(): MessageStep {
		const formstep = new MessageStep('completionStep', '', { key: 'estimate.main.splitLineItemWizard.completionSplitByQuantity' }, 'ico-info');
		formstep.canFinish = true;
		return formstep;
	}

	private getNoteText(method: number) {
		return method === this.splitLineItemMethodsLookupService.SplitLineItemMethods.SplitByObjectLocation.id || method === this.splitLineItemMethodsLookupService.SplitLineItemMethods.SplitByObjects.id ? this.translateService.instant('estimate.main.splitLineItemWizard.noteOption')
			: method === this.splitLineItemMethodsLookupService.SplitLineItemMethods.SplitByPercentAndQuantity.id ? this.translateService.instant('estimate.main.splitLineItemWizard.lineItemSplitByPercentNoteOptions') : '';
	}

	private showWarning(message: string, headerText: string,) {
		this.messageBoxService.showMsgBox(message, headerText, 'ico-warning');
	}

	private showSuccess(message: string, headerText: string,) {
		this.messageBoxService.showMsgBox(message, headerText, 'ico-info');
	}

	private onFinish() {
		const splitMethod = this.createProjectAlternativeConfiguration.splitLineItemMethodsForm.splitMethod;
		switch (splitMethod) {
			case this.splitLineItemMethodsLookupService.SplitLineItemMethods.SplitByObjectLocation.id:
				break;
			case this.splitLineItemMethodsLookupService.SplitLineItemMethods.SplitByObjects.id:
				break;
			case this.splitLineItemMethodsLookupService.SplitLineItemMethods.SplitByCommissioningResources.id:
				// const itemData = {
				// 	estHeaderFk: this.estimateMainContextService.selectedEstProject?.EstHeaderFk || -1,
				// 	prjProjectFk: this.estimateMainContextService.selectedProjectInfo?.ProjectId || -1,
				// 	filterRequest: null,																				 //this.estimateMainService.getLastFilter(), - TODO
				// 	resultSet: this.createProjectAlternativeConfiguration.splitLineItemMethodsForm.resultSet,
				// 	lineItems: this.estimateMainService.getSelection(),
				// 	splitMethod: splitMethod
				// };
				// TODO - Show loading indicator
				// let estMainStandardDynamicService = $injector.get('estimateMainDynamicConfigurationService');
				// estMainStandardDynamicService.showLoadingOverlay();
				// this.http.post(this.configService.webApiBaseUrl + 'estimate/main/wizard/savecommissioningresources', itemData)
				// 	.subscribe(response => {
				// 		//estMainStandardDynamicService.hideLoadingOverlay();
				// 		if (response === 0) {
				// 			this.showSuccess(this.translateService.instant('estimate.main.splitLineItemWizard.title').text, this.translateService.instant('estimate.main.splitLineItemWizard.splitMessage').text)
				// 		} else if (response === 4) {
				// 			this.showWarning(this.translateService.instant('estimate.main.splitLineItemWizard.title').text, this.translateService.instant('estimate.main.splitLineItemWizard.abortNoResources').text)
				// 		}
				// 	});
				break;
				//todo
				break;
			case this.splitLineItemMethodsLookupService.SplitLineItemMethods.SplitByResources.id:
				// const postData = {
				// // 	estHeaderFk: this.estimateMainContextService.selectedEstProject?.EstHeaderFk || -1,
				// // 	prjProjectFk: this.estimateMainContextService.selectedProjectInfo?.ProjectId || -1,
				// // 	filterRequest: null, //this.estimateMainService.getLastFilter(), - TODO
				// // 	resultSet: this.createProjectAlternativeConfiguration.splitLineItemMethodsForm.resultSet,
				// // 	lineItems: this.estimateMainService.getSelection(),
				// // 	splitMethod: splitMethod,
				// // 	DoSplitByCostPortions: this.createProjectAlternativeConfiguration.splitByResourcesForm.splitByResourcesOptions === 2
				// // };

				// this.http.post(this.configService.webApiBaseUrl + 'estimate/main/wizard/executesplitbyresources', postData)
				// 	.subscribe(response => {
				// 		// TODO
				// 	});
				// break;
		}
	
		// this.createProjectAlternativeConfiguration = new SplitLineItemConfiguration;
	}

}