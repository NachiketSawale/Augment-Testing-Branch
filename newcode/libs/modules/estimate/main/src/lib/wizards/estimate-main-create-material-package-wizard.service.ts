/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { createLookup, CustomStep, FieldType, IGridDialogOptions, MultistepDialog, StandardDialogButtonId, UiCommonGridDialogService, UiCommonMessageBoxService, UiCommonMultistepDialogService } from '@libs/ui/common';
import { CollectionHelper, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { CreateMatPkgBasicOptionComponent } from '../components/wizards/create-material-package/create-material-package-basic-option/create-material-package-basic-option.component';
import { EstimateMainLineItemScopeOption } from '../model/enums/estimate-main-line-item-scope.enum';
import {
	EstimateMainCreateMaterialPackageCatalogGroupType,
	EstimateMainCreateMaterialPackageCostCodeType, EstimateMainCreateMaterialPackageItemType, EstimateMainCreateMaterialPackageMatchnessType,
	EstimateMainCreateMaterialPackageModeOption,
	EstimateMainCreateMaterialPackageSelectionOption
} from '../model/enums/estimate-main-create-material-package.enum';
import {
	ICreateMatPkgCatAndGrpSelectionItem,
	ICreateMatPkgDataComplete, ICreateMatPkgMatAndCCSelectionItem, ICreateMatPkgPackageAssignmentItem, ICreateMatPkgSelectionItem, ICreateMatPkgSimulationItem
} from '../model/interfaces/estimate-main-create-material-package.interface';
import { CreateMatPkgSelectionComponent } from '../components/wizards/create-material-package/create-material-package-selection/create-material-package-selection.component';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { groupBy, uniqBy } from 'lodash';
import { CreateMatPkgSimulationComponent } from '../components/wizards/create-material-package/create-material-package-simulation/create-material-package-simulation.component';
import {
	BasicsSharedNumberGenerationService,
	BasicsSharedPackageStatusLookupService,
	BasicsSharedProcurementStructureLookupService,
	BasicsSharedStatusIconService,
	ClerkEntity,
	CostGroupCompleteEntity,
	IBasicsSharedUniqueFieldProfileService, IUniqueFieldDto
} from '@libs/basics/shared';
import { ProcurementPackageLookupService } from '@libs/procurement/shared';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { IBasicsCustomizePackageStatusEntity } from '@libs/basics/interfaces';
import { EstimateMainResourceService } from '../containers/resource/estimate-main-resource-data.service';

@Injectable({providedIn: 'root'})
export class EstimateMainCreateMaterialPackageWizardService implements IBasicsSharedUniqueFieldProfileService {
	private readonly http = inject(PlatformHttpService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly estimateMainService = inject(EstimateMainService);
	private readonly resourceService = inject(EstimateMainResourceService);
	private multistepService = inject<UiCommonMultistepDialogService>(UiCommonMultistepDialogService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private numberGenerationService = inject(BasicsSharedNumberGenerationService);
	private packageStatusService = inject(BasicsSharedStatusIconService<IBasicsCustomizePackageStatusEntity, ICreateMatPkgPackageAssignmentItem>);

	public async createMaterialPackageFromLineItems() {
		const stepTitle = this.translateService.instant('estimate.main.createMaterialPackageWizard.createMaterialPackage');
		//todo.when form support have text label after the field .can change to formStep
		const basicSetting = new CustomStep('basicOptions', stepTitle, CreateMatPkgBasicOptionComponent, [], 'basicOptions');
		const selectionStep = new CustomStep('selectionOptions', stepTitle, CreateMatPkgSelectionComponent, [], 'selectionOptions');
		const simulationStep = new CustomStep('simulationOptions', stepTitle, CreateMatPkgSimulationComponent, [], 'simulationOptions');
		const dataItem: ICreateMatPkgDataComplete = {
			basicOptions: {
				optionItem: {
					scopeOption: EstimateMainLineItemScopeOption.CurrentResultSet,
					selectedItem: EstimateMainCreateMaterialPackageSelectionOption.ProcurementStructure,
					isSelectedReferenceLineItem: true,
					isSelectMultiPackageAssignmentModel: false,
					isAllResultTobeChosen: false
				}
			},
			selectionOptions: {
				optionItem: {
					selectedItem: EstimateMainCreateMaterialPackageSelectionOption.ProcurementStructure,
					showCostCodeItems: [],
					showMaterialAndCostCodeItems: [],
					selectionMaterialAndCostCodeItems: [],
					isRootLevel: false,
					isRootLevelDisable: true,
					modeOption: EstimateMainCreateMaterialPackageModeOption.inclusiveMode,
					isIncludeMaterial: true,
					isIncludeDirectCost: true,
					isIncludeInDirectCost: true,
					isIncludeMarkUpCost: false,
				},
				selectionItems: []
			},
			simulationOptions: {
				optionItem: {
					simulationItems: [],
					uniqueFields: [],
					isGenerateItem: true,
					isAggregateProfile: true,
					isGenerateCostCode: false,
					isFreeQuantity: false,
					isOnePackage: false,
					isSeparateMaterialCatalog: false,
				},
				newPackageOption: {
					procurementstructureId: null,
					configurationId: null,
					code: '',
					packageDescription: '',
					subpackageDescription: '',
					reference: '',
					responsibleId: null,
				}
			}
		};
		const multistepDialog = new MultistepDialog(dataItem, [basicSetting, selectionStep, simulationStep]);
		const btns = multistepDialog.dialogOptions?.buttons;
		if (btns) {
			multistepDialog.onChangingStep = async (dialog, nextIndex) => {
				if (dialog.stepIndex === 0 && nextIndex > dialog.stepIndex) {
					if (dialog.dataItem.basicOptions.optionItem.isAllResultTobeChosen && dialog.dataItem.basicOptions.optionItem.selectedItem === EstimateMainCreateMaterialPackageSelectionOption.MaterialAndCostCode) {
						this.loadSimulation(dialog.dataItem);
					} else {
						dialog.dataItem.selectionOptions.optionItem.selectedItem = dialog.dataItem.basicOptions.optionItem.selectedItem;
						this.getSelections(dialog.dataItem);
					}
				}
				if (dialog.stepIndex === 1 && nextIndex >= dialog.stepIndex) {
					this.loadSimulation(dialog.dataItem);
				}
				if (dialog.stepIndex === 2 && nextIndex < dialog.stepIndex) {
					this.setPreviousSelections(dialog.dataItem);
				}
			};
		}
		const result = await this.multistepService.showDialog(multistepDialog);
		if (result && result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
			this.createItemPackage(result.value);
		}
		return result?.value;
	}

	private async getSelections(dataItem: ICreateMatPkgDataComplete) {
		const optionItem = dataItem.basicOptions.optionItem;
		const resultSet = optionItem.scopeOption;
		const selectedIds = this.estimateMainService.getSelection().map((item) => {
			return item.Id;
		});
		const lineItemIds = this.estimateMainService.getList().map((item) => {
			return item.Id;
		});
		const estHeaderFk = 3936; //this.estimateMainContextService.selectedEstProject?.EstHeaderFk || -1;
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
			furtherFilters: [{Token: 'EST_HEADER', Value: 3936}, {Token: 'EST_LINE_ITEM'}],
			isFromSideBar: true,
			isReadingDueToRefresh: false,
			orderBy: [{Field: 'Code'}],
		};
		//const filterRequest = null; //this.estimateMainService.getLastFilter(), - TODO
		const fromMaterialAndCostCode = optionItem.selectedItem === EstimateMainCreateMaterialPackageSelectionOption.MaterialAndCostCode;
		const resp = await this.http.post('estimate/main/wizard/' + (fromMaterialAndCostCode ? 'getMaterialSelections' : 'creatematerialpackage'), {
			flag: optionItem.selectedItem,
			filterRequest: filterRequest,
			resultSet: resultSet,
			estHeaderFk: estHeaderFk,
			prjProjectFk: prjProjectId,
			selectedLineItemIds: selectedIds,
			lineItemIds: lineItemIds,
			isSelectedReferenceLineItem: optionItem.isSelectedReferenceLineItem,
			isSelectMultiPackageAssignmentModel: optionItem.isSelectMultiPackageAssignmentModel
		});
		if (resp) {
			if (optionItem.selectedItem === EstimateMainCreateMaterialPackageSelectionOption.ProcurementStructure || optionItem.selectedItem === EstimateMainCreateMaterialPackageSelectionOption.CostCode) {
				const response = resp as { datas: ICreateMatPkgSelectionItem[], ids: number[] };
				dataItem.selectionOptions.selectionItems = this.generateDistinctDataWithHierarchy(response.datas);
			} else if (optionItem.selectedItem === EstimateMainCreateMaterialPackageSelectionOption.MaterialCatalogAndGroup) {
				const response = resp as { datas: ICreateMatPkgCatAndGrpSelectionItem[], ids: number[] };
				this.setIdIndex(response.datas);
				dataItem.selectionOptions.selectionItems = response.datas;
			} else {
				const response = resp as ICreateMatPkgMatAndCCSelectionItem[];
				response.forEach(item => {
					item.Idx = `${item.Id}-${item.Type}`;
					item.Selected = false;
				});
				dataItem.selectionOptions.optionItem.selectionMaterialAndCostCodeItems = response;
			}
		}
	}

	private setPreviousSelections(dataItem: ICreateMatPkgDataComplete) {
		const optionItem = dataItem.basicOptions.optionItem;
		//when click previous ,cause rerender grid,require rerender grid data too
		setTimeout(() => {
			if (optionItem.selectedItem === EstimateMainCreateMaterialPackageSelectionOption.MaterialAndCostCode) {
				dataItem.selectionOptions.optionItem.showMaterialAndCostCodeItems = [...dataItem.selectionOptions.optionItem.showMaterialAndCostCodeItems];
			} else if (optionItem.selectedItem === EstimateMainCreateMaterialPackageSelectionOption.CostCode) {
				dataItem.selectionOptions.optionItem.showCostCodeItems = [...dataItem.selectionOptions.optionItem.showCostCodeItems];
			} else {
				dataItem.selectionOptions.selectionItems = [...dataItem.selectionOptions.selectionItems];
			}
		});
	}

	private buildChildrenHierarchy(entity: ICreateMatPkgSelectionItem, list: ICreateMatPkgSelectionItem[]) {
		const children = list.filter(item => item.ParentFk === entity.Id && item.TypeFk === entity.TypeFk);
		if (children.length > 0) {
			children.forEach(item => {
				this.buildChildrenHierarchy(item, list);
			});
			entity.resultChildren = children;
		} else {
			entity.resultChildren = [];
		}
	}

	//cause project cost code and mdc cost code maybe have same Id in grid.here need use Idx to index of grid
	private setIdIndex(items: ICreateMatPkgSelectionItem[]) {
		items.forEach(item => {
			item.Idx = `${item.Id}-${item.TypeFk}`;
			if (item.resultChildren) {
				this.setIdIndex(item.resultChildren);
			}
		});
	}

	private generateDistinctDataWithHierarchy(items: ICreateMatPkgSelectionItem[]) {
		this.setIdIndex(items);
		const gdata = groupBy(items, 'Idx');
		const resultData: ICreateMatPkgSelectionItem[] = [];
		const list = CollectionHelper.Flatten(items || [], (item) => {
			return item.resultChildren as ICreateMatPkgSelectionItem[] || [];
		});
		const unionByResult = uniqBy(list, 'Idx');
		Object.keys(gdata).forEach(key => {
			const entity = unionByResult.find(item => item.Idx === key);
			if (entity) {
				this.buildChildrenHierarchy(entity, unionByResult);
				resultData.push(entity);
			}
		});
		return resultData;
	}

	private loadSimulation(dataItem: ICreateMatPkgDataComplete) {
		this.loadResponsible(dataItem);
		this.loadPrcConfiguration(dataItem);
		this.getSimulations(dataItem);
		this.numberGenerationService.getNumberGenerateConfig('procurement/package/numbergeneration/list');
		//load unique fields todo.dev-17925
	}

	private getSelectedItemList(selectionItems: ICreateMatPkgSelectionItem[]) {
		return CollectionHelper.Flatten(selectionItems || [], (item) => {
			return item.resultChildren || [];
		}).filter(e => e.Selected);
	}

	private async getSimulations(dataItem: ICreateMatPkgDataComplete) {
		const optionItem = dataItem.basicOptions.optionItem;
		const optionSelectionItem = dataItem.selectionOptions.optionItem;
		const resultSet = optionItem.scopeOption;
		const selectedIds = this.estimateMainService.getSelection().map((item) => {
			return item.Id;
		});
		//const filterRecords = 1; //on pink project ,but from project ,add directly ,the filterResult.RecordsFound=0 sametime .in angular.js
		// const lineItemIds = filterRecords === 0 ? this.estimateMainService.getList().map((item) => {
		// 	return item.Id;
		// }) : [];
		const lineItemIds: number[] = [];
		const estHeaderFk = 3936; //this.estimateMainContextService.selectedEstProject?.EstHeaderFk || -1;
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
			furtherFilters: [{Token: 'EST_HEADER', Value: 3936}, {Token: 'EST_LINE_ITEM'}],
			isFromSideBar: true,
			isReadingDueToRefresh: false,
			orderBy: [{Field: 'Code'}],
		};
		const type = optionSelectionItem.selectedItem;
		const selectionItems = dataItem.selectionOptions.selectionItems;

		let selectedItemsNum = 0;

		//angular.js send request is ids.
		let prcStructureIds: number[] = [];
		let mdcCostCodeIds: number[] = [];
		let prjCostCodeIds: number[] = [];
		let mdcCatalogIds: number[] = [];
		let mdcGroupIds: number[] = [];
		const materialIds: number[] = [];
		const indirectCostCodes: ICreateMatPkgMatAndCCSelectionItem[] = [];

		switch (type) {
			case EstimateMainCreateMaterialPackageSelectionOption.ProcurementStructure:
				// eslint-disable-next-line no-case-declarations
				const structureSelectedList = this.getSelectedItemList(selectionItems);
				selectedItemsNum = structureSelectedList.length;
				prcStructureIds = structureSelectedList.map(e => e.Id);
				break;
			case EstimateMainCreateMaterialPackageSelectionOption.CostCode:
				// eslint-disable-next-line no-case-declarations
				const costCodeSelectedList = this.getSelectedItemList(dataItem.selectionOptions.optionItem.showCostCodeItems);
				mdcCostCodeIds = costCodeSelectedList.filter(e => e.TypeFk === EstimateMainCreateMaterialPackageCostCodeType.MdcCostCode).map(e => e.Id);
				prjCostCodeIds = costCodeSelectedList.filter(e => e.TypeFk === EstimateMainCreateMaterialPackageCostCodeType.PrjCostCode).map(e => e.Id);
				break;
			case EstimateMainCreateMaterialPackageSelectionOption.MaterialCatalogAndGroup:
				// eslint-disable-next-line no-case-declarations
				const catalogAndGroupSelectedList = this.getSelectedItemList(selectionItems);
				mdcCatalogIds = catalogAndGroupSelectedList.filter(e => e.TypeFk === EstimateMainCreateMaterialPackageCatalogGroupType.MdcCatalog).map(e => e.Id);
				mdcGroupIds = catalogAndGroupSelectedList.filter(e => e.TypeFk === EstimateMainCreateMaterialPackageCatalogGroupType.MdcGroup).map(e => e.Id);
				break;
			case EstimateMainCreateMaterialPackageSelectionOption.MaterialAndCostCode:
				// eslint-disable-next-line no-case-declarations
				const materialCostCodeSelectedItems = optionSelectionItem.showMaterialAndCostCodeItems.filter(e => !e.Selected);
				selectedItemsNum = materialCostCodeSelectedItems.length;
				materialCostCodeSelectedItems.forEach(item => {
					if (item.Type === EstimateMainCreateMaterialPackageItemType.Material) {
						materialIds.push(item.Id);
					} else {
						indirectCostCodes.push(item);
					}
				});
				break;
		}
		//const prcStructureIds = dataItem.selectionOptions.optionItem.selectionItems.filter(item => item).map(item => item.Id);
		//const filterRequest = null; //this.estimateMainService.getLastFilter(), - TODO
		const resp = await this.http.post('estimate/main/wizard/getSimulationDatas', {
			prjId: prjProjectId,
			estHeaderId: estHeaderFk,
			filterRequest: filterRequest,
			flag: optionItem.selectedItem,
			resultSet: resultSet,
			prcStructureIds: prcStructureIds,
			materialIds: materialIds,
			mdcCatalogIds: mdcCatalogIds,
			mdcGroupIds: mdcGroupIds,
			mdcCostCodeIds: mdcCostCodeIds,
			IndirectCostCodes: indirectCostCodes,
			prjCostCodeIds: prjCostCodeIds,
			selectedItemsNum: selectedItemsNum,
			selectedLineItemIds: selectedIds,
			lineItemIds: lineItemIds,
			modeFlg: optionSelectionItem.modeOption,
			isAllResultTobeChosen: optionItem.isAllResultTobeChosen,
			isSelectedReferenceLineItem: optionItem.isSelectedReferenceLineItem,
			isSelectMultiPackageAssignmentModel: optionItem.isSelectMultiPackageAssignmentModel
		});
		if (resp) {
			const simulationItems = resp as ICreateMatPkgSimulationItem[];
			//simulationItems
			dataItem.simulationOptions.optionItem.simulationItems = this.updateSimulationDataAfterLoad(simulationItems);
		}
	}

	private updateSimulationDataAfterLoad(simulationItems: ICreateMatPkgSimulationItem[]) {
		simulationItems.forEach(item => {
			if (item.MatchnessType === EstimateMainCreateMaterialPackageMatchnessType.New) {
				item.Selected = true;
				/* control grid readonly
				setReadOnly(item, 'Selected', true);
				setReadOnly(item, 'ConfigurationFk', false);
				setReadOnly(item, 'ClerkPrcFk', false);
				setReadOnly(item, 'Merge', true);
				 */
			} else {
				/* control grid readonly
				setReadOnly(item, 'ConfigurationFk', true);
				setReadOnly(item, 'ClerkPrcFk', true);
				 */
			}
		});
		return simulationItems;
	}

	private async loadResponsible(dataItem: ICreateMatPkgDataComplete) {
		const resp = await this.http.get('basics/clerk/clerkByClient');
		if (resp) {
			dataItem.simulationOptions.newPackageOption.responsibleId = (resp as ClerkEntity).Id;
		}
	}

	private async loadPrcConfiguration(dataItem: ICreateMatPkgDataComplete) {
		const resp = await this.http.get('basics/procurementconfiguration/configuration/getByStructure?rubricId=31');
		if (resp) {
			dataItem.simulationOptions.newPackageOption.configurationId = resp as number;
		}
	}

	private async createItemPackage(dataItem: ICreateMatPkgDataComplete) {
		const optionItem = dataItem.basicOptions.optionItem;
		const simulationOption = dataItem.simulationOptions;
		const simulationItemOption = simulationOption.optionItem;
		const newPackageOption = simulationOption.newPackageOption;
		const estHeaderFk = 3936; //this.estimateMainContextService.selectedEstProject?.EstHeaderFk || -1;
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
			furtherFilters: [{Token: 'EST_HEADER', Value: 3936}, {Token: 'EST_LINE_ITEM'}],
			isFromSideBar: true,
			isReadingDueToRefresh: false,
			orderBy: [{Field: 'Code'}],
		};
		const selectedIds = this.estimateMainService.getSelection().map((item) => {
			return item.Id;
		});
		const lineItemIds = this.estimateMainService.getList().map((item) => {
			return item.Id;
		});
		const simulationGridData = simulationItemOption.simulationItems;
		const resp = await this.http.post('estimate/main/wizard/updateOrCreatePackage', {
			flag: optionItem.selectedItem,
			resultSet: optionItem.scopeOption,
			prjId: prjProjectId,
			estHeaderId: estHeaderFk,
			gridDatas: simulationGridData,
			onePackageFlg: simulationItemOption.isOnePackage,
			eachMaterialCatalogFlg: simulationItemOption.isSeparateMaterialCatalog,
			generateItemFlg: simulationItemOption.isGenerateItem,
			aggregateProfileFlg: simulationItemOption.isAggregateProfile,
			generateCostcodeFlg: simulationItemOption.isGenerateCostCode,
			freeQuantityFlg: simulationItemOption.isFreeQuantity,
			uniqueFieldsProfile: [],
			filterRequest: filterRequest,
			selectedLineItemIds: selectedIds,
			lineItemIds: lineItemIds,
			isSelectedReferenceLineItem: optionItem.isSelectedReferenceLineItem,
			isSelectMultiPackageAssignmentModel: optionItem.isSelectMultiPackageAssignmentModel,
			packageOption: newPackageOption
		});
		if (resp) {
			const packageAssignmentItems = resp as ICreateMatPkgPackageAssignmentItem[];
			const gridDialogData: IGridDialogOptions<ICreateMatPkgPackageAssignmentItem> = {
				width: '550px',
				windowClass: 'grid-dialog',
				headerText: 'estimate.main.createMaterialPackageWizard.packageAssignmentResult',
				gridConfig: {
					uuid: '4643221abb984dc384ba8b0f0ca28022',
					columns: [{
						type: FieldType.Lookup,
						id: 'Status',
						model: 'PackageStatusFk',
						label: {text: 'Status', key: 'estimate.main.createMaterialPackageWizard.status'},
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedPackageStatusLookupService,
							imageSelector: this.packageStatusService,
							displayMember: 'DescriptionInfo.Translated',
						}),
						sortable: true,
						width: 90,
						visible: true
					}, {
						type: FieldType.Lookup,
						id: 'Code',
						model: 'CodeFk',
						label: {text: 'Code', key: 'cloud.common.entityCode'},
						lookupOptions: createLookup({
							dataServiceToken: ProcurementPackageLookupService,
							displayMember: 'Code',
						}),
						sortable: true,
						width: 100,
						visible: true
					}, {
						type: FieldType.Lookup,
						id: 'PackageDescription',
						model: 'PackageDescriptionFk',
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						lookupOptions: createLookup({
							dataServiceToken: ProcurementPackageLookupService,
							displayMember: 'Description',
						}),
						sortable: true,
						width: 120,
						visible: true
					}, {
						type: FieldType.Lookup,
						id: 'StructureCode',
						model: 'StructureCodeFk',
						label: {text: 'Structure Code', key: 'estimate.main.createMaterialPackageWizard.structureCode'},
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedProcurementStructureLookupService,
							displayMember: 'Code',
						}),
						width: 100,
						sortable: true,
						visible: true
					}, {
						type: FieldType.Lookup,
						id: 'BusinessPartner',
						model: 'BusinessPartnerFk',
						label: {text: 'Business Partner', key: 'estimate.main.createMaterialPackageWizard.businessPartner'},
						lookupOptions: createLookup({
							dataServiceToken: BusinessPartnerLookupService,
							displayMember: 'BusinessPartnerName1',
						}),
						width: 150,
						sortable: true,
						visible: true
					}],
				},
				items: packageAssignmentItems,
				selectedItems: [],
				isReadOnly: true,
				resizeable: true
			};
			const result = await this.gridDialogService.show(gridDialogData);
			if (result && result.closingButtonId === StandardDialogButtonId.Ok) {
				// this.resourceService.refresh();
			}
		}
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