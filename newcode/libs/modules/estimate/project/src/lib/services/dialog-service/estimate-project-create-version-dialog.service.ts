/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { EstimateProjectDataService } from '../estimate-project-data.service';

/**
 * PrjEstCreationData Interface
 */
export interface IPrjEstCreationData {
	JobCode: string;
	JobDescription: string;
	VersionNo: string;
	VersionDescription: string;
	VersionComment: string;
	CurrentJob: string;
	VersionJob: string;
	VersionJobDescription: string;
	CurrentJobDescription: string;
}

@Injectable({ providedIn: 'root' })

/**
 * Estimate Project Create Version Dialog Service
 */
export class EstimateProjectCreateVersionDialogService {
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private translate = inject(PlatformTranslateService);
	private etimateProjectDataService = inject(EstimateProjectDataService);

	/**
	 * Show Create Version Dialog
	 * @param isGenerated
	 * @returns
	 */
	public showCreateVersionDialog(isGenerated: boolean) {
		const currentItem: IPrjEstCreationData = {
			JobCode: isGenerated ? this.translate.instant('cloud.common.isGenerated').text : '',
			JobDescription: '',
			VersionNo: this.translate.instant('cloud.common.isGenerated').text,
			VersionDescription: '',
			VersionComment: '',
			CurrentJob: '',
			VersionJob: '',
			VersionJobDescription: '',
			CurrentJobDescription: ''
		};
		const formConfig: IFormConfig<IPrjEstCreationData> = {
			formId: 'estimate.project.createversion',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					groupId: 'CreateVersion',
					header: { key: 'estimate.project.createEstimateVersion' },
					open: true
				},
			],
			rows: [
				{
					groupId: 'CreateVersion',
					id: 'JobCode',
					label: {
						key: 'estimate.project.lgmJobFk'
					},
					type: FieldType.Code,
					model: 'JobCode',
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
					groupId: 'CreateVersion',
					id: 'JobDescription',
					label: {
						key: 'cloud.common.entityDescription'
					},
					type: FieldType.Description,
					model: 'JobDescription'
				},
				{
					groupId: 'CreateVersion',
					id: 'VersionNo',
					label: {
						key: 'estimate.project.versionNo'
					},
					type: FieldType.Description,
					model: 'VersionNo',
					readonly: true
				},
				{
					groupId: 'CreateVersion',
					id: 'VersionDescription',
					label: {
						key: 'estimate.project.versionDesc'
					},
					type: FieldType.Description,
					model: 'VersionDescription'
				},
				{
					groupId: 'CreateVersion',
					id: 'VersionComment',
					label: {
						key: 'estimate.project.versionComment'
					},
					type: FieldType.Comment,
					model: 'VersionComment'
				},
			],
		};

		const result = this.formDialogService
			.showDialog<IPrjEstCreationData>({
				id: 'createEstimateVersion',
				headerText: { key: 'estimate.project.createEstimateVersion' },
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

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleOk(result: IEditorDialogResult<IPrjEstCreationData>): void {
		if (result.value) {
			this.etimateProjectDataService.createEstimateBackup(result.value);
		}
	}
}
