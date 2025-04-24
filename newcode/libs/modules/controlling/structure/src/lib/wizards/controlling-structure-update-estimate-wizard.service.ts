import { Injectable, inject } from '@angular/core';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { ColumnDef, FieldType, IEditorDialogResult, IFormDialogConfig, IGridDialogOptions, StandardDialogButtonId, UiCommonFormDialogService, UiCommonGridDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { ControllingStructureGridDataService } from '../services/controlling-structure-grid-data.service';
import { ProjectMainForCOStructureDataService } from '../services/project-main-for-costructure-data.service';
import { HttpClient } from '@angular/common/http';
import { IControllingUnitEntity } from '../model/models';

interface IUpdateEstimateParam {
	selectedLevel: string;
	IsUpdEstimate: boolean,
	IsUpdEstCost: boolean,
	IsSplitBudget: boolean
}
@Injectable({
	providedIn: 'root'
})
export class ControllingStructureUpdateEstimateWizardService {
	private readonly http = inject(HttpClient);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly translateService = inject(PlatformTranslateService);
	private formDialogService = inject(UiCommonFormDialogService);
	private readonly controllingUnitDataService = inject(ControllingStructureGridDataService);
	private readonly projectMainForCOStructureDataService = inject(ProjectMainForCOStructureDataService);
	private readonly controllingStructureMainService = inject(ControllingStructureGridDataService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);

	public async onStartWizard() {
		const controllinUnitEntity = this.controllingUnitDataService.getSelectedEntity();
		if (null === controllinUnitEntity) {
			await this.messageBoxService.showMsgBox(
				this.translateService.instant('cloud.common.noCurrentSelection').text,
				this.translateService.instant('cloud.common.errorMessage').text,
				'ico-error');
		} else {
			const entity: IUpdateEstimateParam = {
				selectedLevel: this.translateService.instant('controlling.structure.selectedItems').text,
				IsUpdEstimate: true,
				IsUpdEstCost: true,
				IsSplitBudget: true
			};
			const modalOptions: IFormDialogConfig<IUpdateEstimateParam> = {
				headerText: 'controlling.structure.spreadUpdateBudget',
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
						id: 'UpdEstimateCost',
						model: 'IsUpdEstCost',
						label: {
							text: 'Update Estimate',
							key: 'controlling.structure.updItemEstimateCost'
						},
						type: FieldType.Boolean,
						sortOrder: 1,
						readonly: false
					}
						,
					{
						groupId: 'baseGroup',
						id: 'SpreadBudget',
						model: 'IsSplitBudget',
						label: {
							text: 'Update Estimate',
							key: 'controlling.structure.spreadBudget'
						},
						type: FieldType.Boolean,
						sortOrder: 1,
						readonly: false
					},
					{
						groupId: 'baseGroup',
						id: 'UpdateEstimate',
						model: 'IsUpdEstimate',
						label: {
							text: 'Update Estimate',
							key: 'controlling.structure.updateEstimate'
						},
						type: FieldType.Boolean,
						sortOrder: 1,
						readonly: false
					},
					{
						groupId: 'baseGroup',
						id: 'SelectedItem',
						model: 'selectedLevel',
						label: {
							text: 'Update Estimate',
							key: 'controlling.structure.updateEstimate'
						},
						type: FieldType.Radio,
						itemsSource: {
							items: [
								{
									id: 1,
									displayName: this.translateService.instant('controlling.structure.selectedItems').text,
								},
								{
									id: 2,
									displayName: this.translateService.instant('controlling.structure.allItems').text,
								},
							],
						},
						readonly: false,
						sortOrder: 1
					}]
				},
				customButtons: [
				],
				entity: entity
			};
			this.formDialogService.showDialog(modalOptions)?.then((result: IEditorDialogResult<IUpdateEstimateParam>) => {
				if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
					const prjEntity = this.projectMainForCOStructureDataService.getSelectedEntity();
					const selectedEntity = this.controllingStructureMainService.getSelectedEntity();
					const selectedItemId = selectedEntity ? selectedEntity.Id : 0;
					const postData = {
						ProjectFk: prjEntity ? prjEntity.Id : 0,  //1015710
						SelectedLevel: result.value.selectedLevel,
						SelectedItemId: selectedItemId,  //2949132,
						CntrStructureIds: [selectedItemId], //2949132
						IsSplitBudget: result.value.IsSplitBudget,
						IsUpdateEstCost: result.value.IsUpdEstCost,
						IsUpdateEstimate: result.value.IsUpdEstimate
					};
					return this.http.post<IControllingUnitEntity[]>(
						`${this.configService.webApiBaseUrl}controlling/structure/spreadupdateestimate`, postData
					).subscribe(response => {
						this.controllingStructureMainService.load({ id: postData.SelectedItemId }).then(() => {
							// TODO:
							// this.controllingStructureMainService.select([]).then(() => {
							// 	const list = this.controllingStructureMainService.getList();
							// 	const selected = list.find(item => item.Id === postData.SelectedItemId);
							// 	selected ? this.controllingStructureMainService.select(selected) : null;
							// });
						});
						let gridRows: IControllingUnitEntity[] = [];
						gridRows = response;
						const gridDialogData: IGridDialogOptions<IControllingUnitEntity> = {
							width: '50%',
							headerText: 'controlling.structure.updateEstimateSummaryTitle',
							windowClass: 'grid-dialog',
							gridConfig: {
								columns: [{
									id: 'code',
									model: 'Code',
									required: true,
									label: {
										text: 'Code',
										key: 'cloud.common.entityCode'
									},
									type: FieldType.Code,
									sortOrder: 1,
									readonly: false
								},
								{
									id: 'desc',
									model: 'DescriptionInfo',
									width: 200,
									required: true,
									label: {
										text: 'Description',
										key: 'cloud.common.entityDescription'
									},
									type: FieldType.Description,
									sortOrder: 1,
									readonly: false
								},
								{
									id: 'budget',
									model: 'Budget',
									width: 200,
									required: true,
									label: {
										text: 'Budget',
										key: 'controlling.structure.budget'
									},
									type: FieldType.Decimal,
									sortOrder: 1,
									readonly: false
								}] as ColumnDef<IControllingUnitEntity>[],
								treeConfiguration: {
									parent: entity => {
										return null;
									},
									children: entity => {
										return entity.ControllingUnitChildren ? entity.ControllingUnitChildren : [];
									}
								},
							},
							items: gridRows,
							isReadOnly: true,
							selectedItems: [],
							resizeable: true,
							id: 'Id',
							topDescription: this.getSuccessfullMessage(response)?.text
						};
						if (response) {
							return this.gridDialogService.show(gridDialogData)?.then(function () {
								return {
									success: true
								};
							});
						} else {
							// TODO: check why same message although a distinction is made here
							if (postData.IsSplitBudget && postData.IsUpdateEstCost && postData.IsUpdateEstimate) {
								this.messageBoxService.showMsgBox('controlling.structure.spreadUpdateBudgetErr', 'controlling.structure.updateEstimateBudgetHeader', 'info');
							} else if (!postData.IsSplitBudget && postData.IsUpdateEstCost && postData.IsUpdateEstimate) {
								this.messageBoxService.showMsgBox('controlling.structure.spreadUpdateBudgetErr', 'controlling.structure.updateEstimateBudgetHeader', 'info');
							}
							return { success: false };
						}
					});
				} else {
					return { success: false };
				}
			});
		}
	}
	public getSuccessfullMessage(response: IControllingUnitEntity[]) {
		if (response.length > 1) {
			return this.translateService.instant('controlling.structure.multiUpdateEstimateUnitAssigned', {
				count: response.length
			});
		} else if (response.length === 1) {
			// TODO: check values of translation keys (correct migrated, but seems to be wrong already in ngjs client) / why "{{count}} Controlling Unit(s)"
			return this.translateService.instant('controlling.structure.oneUpdateEstimateUnitAssigned', {
				count: response.length
			});
		}
		return null;
	}
}




