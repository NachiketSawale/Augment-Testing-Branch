import { Injectable, inject } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { FieldType, IEditorDialogResult, IFormDialogConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService, createLookup } from '@libs/ui/common';
import { ControllingStructureGridDataService } from '../services/controlling-structure-grid-data.service';
import { BasicsCompanyLookupService } from '@libs/basics/shared';

interface IChangeCompanyParam {
	CompanyId: number;
}
@Injectable({
	providedIn: 'root'
})
export class ControllingStructureChangeCompanyWizardService {
	private readonly translateService = inject(PlatformTranslateService);
	private formDialogService = inject(UiCommonFormDialogService);
	private readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly controllingUnitDataService = inject(ControllingStructureGridDataService);

	public async onStartWizard() {
		const controllinUnitEntity = this.controllingUnitDataService.getSelectedEntity();
		let companyId = 0;
		if (null === controllinUnitEntity) {
			await this.dialogService.showMsgBox(
				this.translateService.instant('cloud.common.noCurrentSelection').text,
				this.translateService.instant('cloud.common.errorMessage').text,
				'ico-error');
		} else {
			const companyEntity: IChangeCompanyParam = {
				CompanyId: controllinUnitEntity.CompanyFk
			};
			const modelOptions: IFormDialogConfig<IChangeCompanyParam> = {
				headerText: 'controlling.structure.changeCompanyWizardTitle',
				showOkButton: true,
				formConfiguration: {
					showGrouping: false,
					groups: [
						{
							groupId: 'baseGroup',
						}
					],
					rows: [{
						groupId: 'baseGroup',
						id: 'companyId',
						model: 'CompanyId',
						label: {
							text: 'Company',
							key: 'cloud.common.entityCompany'
						},
						type: FieldType.Lookup,
						change: (event) => {
							companyId = Number(event.newValue);
						},
						lookupOptions: createLookup({
							dataServiceToken: BasicsCompanyLookupService,
							serverSideFilter: {
								key: 'controlling-structure-change-company-filter',
								execute() {
									return {
										depth: 10,
										includeStart: true
									};
								}
							}
						}),
						sortOrder: 1,
						readonly: false
					}]
				},
				customButtons: [
				],
				entity: companyEntity
			};
			return this.formDialogService.showDialog(modelOptions)?.then((result: IEditorDialogResult<IChangeCompanyParam>) => {
				if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
					if (companyId > 0 && controllinUnitEntity != null) {
						controllinUnitEntity.CompanyFk = companyId;
					}
				}
			});
		}
	}

}




