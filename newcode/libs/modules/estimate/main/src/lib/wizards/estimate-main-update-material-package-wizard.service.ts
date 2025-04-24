/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, inject } from '@angular/core';
import { PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { CustomStep, MultistepDialog, StandardDialogButtonId, UiCommonMessageBoxService, UiCommonMultistepDialogService } from '@libs/ui/common';
import { EstimateMainUpdateMaterialPackageUpdateItemComponent } from '../components/wizards/update-material-package/update-material-package-update-item/update-material-package-update-item.component';
import { EstimateMainUpdateMaterialPackageBasicOptionComponent } from '../components/wizards/update-material-package/update-material-package-basic-option/update-material-package-basic-option.component';
import { EstimateMainUpdateMaterialPackageMergeOrCreate } from '../model/enums/estimate-main-update-material-package.enum';
import {
	IEstimateMainUpdateMaterialPackageDataComplete,
	IEstimateMainUpdateMaterialPackageEntity,
	IEstimateMainUpdateMaterialPackageUpdateItemDto,
	IEstimateMainUpdateMaterialPackageUpdateOptionEntity,
} from '../model/interfaces/estimate-main-update-material-package.interface';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { EstimateMainResourceService } from '../containers/resource/estimate-main-resource-data.service';
import { EstimateMainLineItemScopeOption } from '../model/enums/estimate-main-line-item-scope.enum';
import { CostGroupCompleteEntity, IBasicsSharedUniqueFieldProfileService, IUniqueFieldDto } from '@libs/basics/shared';

@Injectable({providedIn: 'root'})
/**
 *
 * This service provides functionality for updating material package in the main estimate.
 */
export class EstimateMainUpdateMaterialPackageWizardService implements IBasicsSharedUniqueFieldProfileService {
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly http = inject(PlatformHttpService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly estimateMainService = inject(EstimateMainService);
	private readonly estimateMainResourceService = inject(EstimateMainResourceService);
	private multistepService = inject<UiCommonMultistepDialogService>(UiCommonMultistepDialogService);

	public async updateMaterialPackageFromLineItems() {
		//todo the estimate module getSelectedProjectId not completed.
		/*
		const projectId = this.estimateMainContextService.getSelectedProjectId();
		if (projectId <= 0) {
			this.messageBoxService.showMsgBox('estimate.main.createMaterialPackageWizard.noProjectItemSelected', 'cloud.common.informationDialogHeader', 'ico-info');
			return;
		}
		*/
		const dataItem: IEstimateMainUpdateMaterialPackageDataComplete = {
			basicOption: EstimateMainLineItemScopeOption.CurrentResultSet,
			updateItem: {
				isUpdateBudgetForExistedAssignment: false,
				isHideBoqGeneratePackage: true,
				isAggregateItem: true,
				mergeOrCreate: EstimateMainUpdateMaterialPackageMergeOrCreate.Merge,
				//dynamicUniqueField: [],
				uniqueFields: [],
				updatePackages: []
			},
		};
		const stepTitle = this.translateService.instant('estimate.main.updateMaterialPackageWizard.updateMaterialPackage');
		const basicSetting = new CustomStep('basicOption', stepTitle, EstimateMainUpdateMaterialPackageBasicOptionComponent, [], 'basicOption');
		const updateItems = new CustomStep('updateItem', stepTitle, EstimateMainUpdateMaterialPackageUpdateItemComponent, [], 'updateItem');
		const multistepDialog = new MultistepDialog(dataItem, [basicSetting, updateItems]);
		const btns = multistepDialog.dialogOptions?.buttons;
		if (btns) {
			multistepDialog.onChangingStep = async (dialog, nextIndex) => {
				if (dialog.stepIndex === 0 && nextIndex > dialog.stepIndex) {
					this.fillGridFromPackage(dialog.dataItem);
				}
			};
			//todo discuss with fan ,here suggest rewrite first
			const okButton = btns.find((x) => x.id == StandardDialogButtonId.Ok);
			if (okButton) {
				btns[3] = {
					id: 'update',
					caption: {key: 'basics.common.button.ok'},
					isVisible: (info) => {
						return info.dialog.value?.stepIndex === 1;
					},
					fn: (event, info) => {
						if (info.dialog.value) {
							if (info.dialog.value?.dataItem) {
								this.updateItem(info.dialog.value?.dataItem);
							}
						}
					},
					isDisabled: (info) => {
						if (info.dialog.value && info.dialog.value.dataItem) {
							const selectedItems = info.dialog.value.dataItem.updateItem.updatePackages.filter((item) => item.Selected);
							return selectedItems.length == 0;
						}
						return true;
					},
				};
			}
		}
		const result = await this.multistepService.showDialog(multistepDialog);
		return result?.value;
	}

	public async fillGridFromPackage(dataItem: IEstimateMainUpdateMaterialPackageDataComplete) {
		const resultSet = dataItem.basicOption;
		const lineItemIds = this.estimateMainService.getSelection().map((item) => {
			return item.Id;
		});
		//todo The code here is for testing functionality and will be removed in the future
		const estHeaderFk = 3980; //this.estimateMainContextService.selectedEstProject?.EstHeaderFk || -1;
		const prjProjectId = 277; //this.estimateMainContextService.selectedProjectInfo?.ProjectId || -1;
		const filterRequest = {
			ExecutionHints: false,
			IncludeNonActiveItems: false,
			IsEnhancedFilter: false,
			PKeys: null,
			PageNumber: 0,
			PageSize: 4000,
			Pattern: null,
			PinningContext: [{token: 'project.main', id: 277}],
			ProjectContextId: 227,
			filter: '',
			UseCurrentClient: false,
			UseCurrentProfitCenter: false,
			furtherFilters: [{Token: 'EST_HEADER', Value: 3980}, {Token: 'EST_LINE_ITEM'}],
			isFromSideBar: true,
			isReadingDueToRefresh: false,
			orderBy: [{Field: 'Code'}]
		};
		//const filterRequest = null; //this.estimateMainService.getLastFilter(), - TODO
		const resp = await this.http.post('estimate/main/wizard/getPackageByEst', {
				filterRequest: filterRequest,
				resultSet: resultSet,
				estHeaderFk: estHeaderFk,
				prjProjectFk: prjProjectId,
				lineItemIds: lineItemIds
			}
		);
		if (resp) {
			const response = resp as { packages: IEstimateMainUpdateMaterialPackageEntity[]; updateOptions: IEstimateMainUpdateMaterialPackageUpdateOptionEntity[] };
			const updateItems: IEstimateMainUpdateMaterialPackageUpdateItemDto[] = [];
			const updateOptions = response.updateOptions;
			response.packages.forEach((packageItem) => {
				const updateOptionsByPackage = updateOptions.filter((updateOption) => {
					return updateOption.PrcPackageFk == packageItem.Id;
				});
				const selected = !!updateOptions.find((updateOption) => {
					return updateOption.PrcPackageFk == packageItem.Id && updateOption.IsMaterial;
				});
				let isMaterial: boolean | undefined = undefined;
				let isService: boolean | undefined = undefined;
				updateOptionsByPackage.forEach((item) => {
					if (!isMaterial) {
						isMaterial = item.IsMaterial;
						isService = item.IsService;
					} else {
						isMaterial = isMaterial || item.IsMaterial;
						isService = isService || item.IsService;
					}
				});
				const updateItem: IEstimateMainUpdateMaterialPackageUpdateItemDto = {
					Id: packageItem.Id,
					Selected: selected,
					Code: packageItem.Code,
					Description: packageItem.Description,
					PackageStatusFk: packageItem.Status,
					ConfigurationFk: packageItem.Configuration,
					IsMaterial: isMaterial,
					IsService: isService
				};
				updateItems.push(updateItem);
			});
			dataItem.updateItem.updatePackages = updateItems;
		}
	}

	public async updateItem(dataItem: IEstimateMainUpdateMaterialPackageDataComplete) {
		const resultSet = dataItem.basicOption;
		const lineItemIds = this.estimateMainService.getSelection().map((item) => {
			return item.Id;
		});
		const estHeaderFk = this.estimateMainContextService.selectedEstProject?.EstHeaderFk || -1;
		const prjProjectId = this.estimateMainContextService.selectedProjectInfo?.ProjectId || -1;
		const filterRequest = null; //this.estimateMainService.getLastFilter(), - TODO
		const selectPackageIds = dataItem.updateItem.updatePackages.filter((item) => {
			return item.Selected;
		});
		const resp = await this.http.post('estimate/main/wizard/updatePackageItem', {
			filterRequest: filterRequest,
			resultSet: resultSet,
			estHeaderFk: estHeaderFk,
			prjProjectFk: prjProjectId,
			lineItemIds: lineItemIds,
			aggregateProfileFlg: dataItem.updateItem.isAggregateItem,
			sameItemMergeFlg: dataItem.updateItem.mergeOrCreate,
			uniqueFieldsProfile: [], //uniqueFields,
			updateBudgetForExistedAssignmentFlg: dataItem.updateItem.isUpdateBudgetForExistedAssignment,
			packageIds: selectPackageIds,
		});
		if (resp) {
			await this.messageBoxService.showMsgBox(`estimate.main.updateMaterialPackageWizard.${resp ? 'updatePackageSuccess' : 'updatePackageFailure'}`, 'cloud.common.informationDialogHeader', 'ico-info');
		}
		//todo need refresh resource list ,in angular.js have this logic
		//this.estimateMainResourceService.refresh();
		return true;
	}

	public async getDynamicUniqueFields() {
		//const prjProjectId = this.estimateMainContextService.selectedProjectInfo?.ProjectId || -1;
		const prjProjectId = 508;
		const resp = await this.http.get('basics/costgroupcat/list', {
			params: {
				projectId: prjProjectId
			}
		});
		const costGroupComplete = resp! as CostGroupCompleteEntity;
		const lic = costGroupComplete.LicCostGroupCats;
		const prjCostGroup = costGroupComplete.PrjCostGroupCats ?? [];
		const fields = lic?.concat(prjCostGroup).map(item => {
			const field: IUniqueFieldDto = {
				id: item.Id,
				model: item.Code,
				fieldName: item.Code,
				isSelect: false
			};
			return field;
		});
		return fields!;
	}
}
