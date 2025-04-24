import { inject } from '@angular/core';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { BusinesspartnerSharedEvaluationScreenModalComponent } from '../components/evaluation-screen-modal/evaluation-screen-modal.component';
import { EvaluationDetailService } from './evaluation-detail.service';
import { EvaluationExtendCreateOptionsToken, EvaluationExtendUpdateOptionsToken, EvaluationToolbarList, EvaluationToolbarListToken, IExtendCreateOptions, IExtendUpdateOptions } from '@libs/businesspartner/interfaces';
import { MODULE_INFO } from '../model/entity-info/module-info.model';


export class EvaluationScreenModalService {
	private readonly dialogService = inject(UiCommonDialogService);
	private readonly evaluationDetailService: EvaluationDetailService;

	public constructor() {
		this.evaluationDetailService = inject(EvaluationDetailService);
	}

	public showEvaluationScreenModalDialog(options: IExtendCreateOptions | IExtendUpdateOptions, toolbarList: EvaluationToolbarList) {
		let createOptions: IExtendCreateOptions | null = null;
		let updateOptions: IExtendUpdateOptions | null = null;
		if ((options as IExtendCreateOptions).isCreate) {
			createOptions = options as IExtendCreateOptions;
		} else if ((options as IExtendUpdateOptions).isUpdate) {
			updateOptions = options as IExtendUpdateOptions;
		}

		const dialogOption: ICustomDialogOptions<StandardDialogButtonId, BusinesspartnerSharedEvaluationScreenModalComponent> = {
			id: 'showEvaluationScreenModalDialog',
			headerText: {
				key: MODULE_INFO.businesspartnerMainModuleName + '.screenEvaluatoinDailogTitle',
			},
			maxWidth: '1200px',
			width: '1000px',
			showCloseButton: true,
			dontShowAgain: true,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					fn: (event, info) => {
						if ((createOptions?.canSave) || (updateOptions?.canSave)) {
							if (this.evaluationDetailService.isValidatedForUpdateData()) {
								this.evaluationDetailService.updateDetail();
							} else {
								//
								// const error = {
								// 	show: true,
								// 	messageCol: 1,
								// 	message: this.evaluationDetailService.getValidationErrors(this.evaluationDetailService.getSelectedEntity()!),
								// 	iconCol: 1,
								// 	type: 3,
								// };

								// $scope.error = {
								// 	show: true,
								// 	messageCol: 1,
								// 	message: evaluationDetailService.getValidationError(),
								// 	iconCol: 1,
								// 	type: 3
								// };
							}
						}
						
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
				},
			],
			bodyComponent: BusinesspartnerSharedEvaluationScreenModalComponent,
			bodyProviders: [
				{
					provide: EvaluationExtendCreateOptionsToken,
					useValue: createOptions,
				},
				{
					provide: EvaluationExtendUpdateOptionsToken,
					useValue: updateOptions,
				},
				{
					provide: EvaluationToolbarListToken,
					useValue: toolbarList,
				},
			],
		};
		this.dialogService.show(dialogOption);
	}
}
