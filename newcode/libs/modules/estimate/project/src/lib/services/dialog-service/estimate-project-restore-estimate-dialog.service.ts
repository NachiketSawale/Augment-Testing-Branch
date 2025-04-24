/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, inject } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { EstimateProjectDataService } from '../estimate-project-data.service';
import { IPrjEstCreationData } from './estimate-project-create-version-dialog.service';

@Injectable({ providedIn: 'root' })
export class EstimateProjectRestoreEstimateDialogService {
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private translate = inject(PlatformTranslateService);
	private etimateProjectDataService = inject(EstimateProjectDataService);

	/**
	 * Show Restore Estimate Dialog
	 * @param isGenerated
	 * @returns
	 */
	public showRestoreEstimateDialog(isGenerated: boolean) {
		const currentItem: IPrjEstCreationData = {
			JobCode: '',
			JobDescription: '',
			VersionNo: '',
			VersionDescription: '',
			VersionComment: '',
			CurrentJob: isGenerated ? this.translate.instant('cloud.common.isGenerated').text : '',
			VersionJob: isGenerated ? this.translate.instant('cloud.common.isGenerated').text : '',
			VersionJobDescription: '',
			CurrentJobDescription: ''
		};

		const formConfig: IFormConfig<IPrjEstCreationData> = {
			formId: 'estimate.project.restoreversion',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					groupId: 'RestoreEstimate',
					header: { key: 'estimate.main.restoreEstimateVersion' },
					open: true
				}
			],
			rows: [
				{
					groupId: 'RestoreEstimate',
					id: 'CurrentJob',
					label: {
						key: 'estimate.project.currentJob',
					},
					type: FieldType.Code,
					model: 'CurrentJob',
					required: true,
					readonly: isGenerated
					// todo
					// 'asyncValidator': function (entity, value, model) {
					//     return $http.get(globals.webApiBaseUrl + 'logistic/job/isCodeUnique?code=' + value).then(function (response) {
					//         let result = {
					//             valid: response && response.data,
					//             error: $translate.instant('estimate.project.jobCodeIsUnique')
					//         };
					//         runtimeDataService.applyValidationResult(result, entity, model);
					//         return result;
					//     });
					// },
				},
				{
					groupId: 'RestoreEstimate',
					id: 'CurrentJobDescription',
					label: {
						key: 'cloud.common.entityDescription',
					},
					type: FieldType.Description,
					model: 'CurrentJobDescription'
				},
				{
					groupId: 'RestoreEstimate',
					id: 'VersionJob',
					label: {
						key: 'estimate.project.versionJob'
					},
					type: FieldType.Description,
					model: 'VersionJob',
					required: true,
					readonly: isGenerated
					// todo
					// 'asyncValidator': function (entity, value, model) {
					//     return $http.get(globals.webApiBaseUrl + 'logistic/job/isCodeUnique?code=' + value).then(function (response) {
					//         let result = {
					//             valid: response && response.data,
					//             error: $translate.instant('estimate.project.jobCodeIsUnique')
					//         };
					//         if (result.valid && entity.CurrentJob) {
					//             result.valid = entity.CurrentJob !== value;
					//         }
					//         runtimeDataService.applyValidationResult(result, entity, model);
					//         return result;
					//     });
					// },
				},
				{
					groupId: 'RestoreEstimate',
					id: 'VersionJobDescription',
					label: {
						key: 'estimate.project.entityDescription'
					},
					type: FieldType.Description,
					model: 'VersionJobDescription'
				},
				{
					groupId: 'RestoreEstimate',
					id: 'VersionComment',
					label: {
						key: 'estimate.project.versionComment'
					},
					type: FieldType.Comment,
					model: 'VersionComment'
				}
			],
		};

		const result = this.formDialogService
			.showDialog<IPrjEstCreationData>({
				id: 'restoreEstimateVersion',
				headerText: { key: 'estimate.project.restoreEstimateVersion' },
				formConfiguration: formConfig,
				entity: currentItem,
				customButtons: [],
				topDescription: ''
			})
			?.then((result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					this.handleOk(result);
				}
			});
		return result;
	}

	private handleOk(result: IEditorDialogResult<IPrjEstCreationData>): void {
		if (result.value) {
			this.etimateProjectDataService.restoreEstimateByVersion(result.value);
		}
	}
}
