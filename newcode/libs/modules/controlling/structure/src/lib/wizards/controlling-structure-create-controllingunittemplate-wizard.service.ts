import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { FieldType, IEditorDialogResult, IFormDialogConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { ControllingStructureGridDataService } from '../services/controlling-structure-grid-data.service';
import { ProjectMainForCOStructureDataService } from '../services/project-main-for-costructure-data.service';

interface IContollingUnitTemplateParams {
	code: string;
	description: string;
}
@Injectable({
	providedIn: 'root'
})
export class ControllingStructureCreateControllingUnitTemplateWizardService {
	private readonly translateService = inject(PlatformTranslateService);
	private formDialogService = inject(UiCommonFormDialogService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly http = inject(HttpClient);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly controllingUnitDataService = inject(ControllingStructureGridDataService);
	private readonly projectMainForCOStructureDataService = inject(ProjectMainForCOStructureDataService);

	public async onStartWizard() {
		const controllinUnitEntity = this.controllingUnitDataService.getSelectedEntity();
		if (controllinUnitEntity === null) {
			await this.dialogService.showMsgBox(
				this.translateService.instant('cloud.common.noCurrentSelection').text,
				this.translateService.instant('cloud.common.errorMessage').text,
				'ico-error');
		} else {
			const unitTemplateEntity: IContollingUnitTemplateParams = {
				code: controllinUnitEntity.Code,
				description: controllinUnitEntity.DescriptionInfo?.Description ?? '',
			};
			const modelOptions: IFormDialogConfig<IContollingUnitTemplateParams> = {
				headerText: 'controlling.structure.createControllingUnitTemplateWizardTitle',
				showOkButton: true,
				formConfiguration: {
					showGrouping: false,
					groups: [
						{
							groupId: 'baseGroup',
						},
					],
					rows: [
						// Code
						{
							groupId: 'baseGroup',
							id: 'code',
							model: 'Code',
							required: true,
							label: {
								text: 'Code',
								key: 'cloud.common.entityCode'
							},
							type: FieldType.Code,
							change: (event) => {
								unitTemplateEntity.code = event.newValue?.toString() ?? '';
							},

							sortOrder: 1,
							readonly: false
						},
						// Description
						{
							groupId: 'baseGroup',
							id: 'decsription',
							model: 'Description',
							required: true,
							label: {
								text: 'Description',
								key: 'cloud.common.entityDescription'
							},
							type: FieldType.Description,
							// TODO validator not available yet
							// validator: function (entity, code, model) {
							//     return this.http.get(this.configService.webApiBaseUrl + 'controlling/controllingunittemplate/isuniquecode?code=' + code).then(function (response) {
							//         let result = {
							//             valid: response && response.data,
							//             error: this.translate.instant('cloud.common.uniqueValueErrorMessage')
							//         };
							//        // .applyValidationResult(result, entity, model);
							//         return result;
							//     });
							// },
							change: (event) => {
								unitTemplateEntity.description = event.newValue?.toString() ?? '';
							},
							sortOrder: 2,
							readonly: false
						}]

				},
				customButtons: [
				],
				entity: unitTemplateEntity,

			};
			return this.formDialogService.showDialog(modelOptions)?.then((result: IEditorDialogResult<IContollingUnitTemplateParams>) => {
				if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
					const selectedProject = this.projectMainForCOStructureDataService.getSelectedEntity();
					const params = {
						code: unitTemplateEntity.code ?? '',
						description: unitTemplateEntity.description ?? '',
						projectId: selectedProject?.Id
					};
					this.http.post(
						`${this.configService.webApiBaseUrl}controlling/controllingunittemplate/createcontrollingunittemplate`, params
					).subscribe(response => {
						if (response) {
							this.dialogService.showMsgBox(
								this.translateService.instant('cloud.common.doneSuccessfully').text,
								this.translateService.instant('controlling.structure.createControllingUnitTemplateWizardTitle').text,
								'ico-info');
						} else {
							this.messageBoxService.showInfoBox('error', 'ico-info', false);
						}
					});
				}
			});
		}
	}

}




