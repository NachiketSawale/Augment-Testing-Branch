/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IBasicsCustomizeQuantityTypeEntity, IBasicsCustomizeSystemOptionEntity } from '@libs/basics/interfaces';
import { IProjectEntity } from '@libs/project/interfaces';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IEstAllMarkup2costcodeBaseEntity } from '../model/est-all-markup-2costcode-entity.base.interface';
import { IEstCopyOptionBaseEntity } from '../model/est-copy-option-entity.base.interface';
import { IEstAllowanceBaseEntity } from '../model/est-allowance-entity.base.interface';
import { find, get, isUndefined, size, sortBy } from 'lodash';
import { EstimateMainRoundingDataService } from './rounding/estimate-main-rounding-data.service';
import { IEstRoundingConfigComplete } from '../model/est-rounding-config-complete.interface';
import { IEstHeaderEntity } from '@libs/estimate/interfaces';
import { ProjectEntity } from '@libs/project/shared';
import { PlatformConfigurationService, PlatformPermissionService } from '@libs/platform/common';
import { IEstimateCompositeEntity } from '../model/estimate-composite-entity.interface';
import { IEstimateEntity } from '../model/estimate-entity.interface';
import { IEstProjectInfo } from '../model/est-project-info.interface';
import { IEstLineItemResponseEntity } from '../model/est-line-item-response-entity.interface';

@Injectable({ providedIn: 'root' })
export class EstimateMainContextService {
	private estimateMainRoundingDataService: EstimateMainRoundingDataService = inject(EstimateMainRoundingDataService);
	private contextService = inject(PlatformConfigurationService);

	private readonly platformPermissionService = inject(PlatformPermissionService);

	private estConfigData: object[] = [];
	private estimateReadData: IEstLineItemResponseEntity | null = null;

	private readonly enableInputLineItemTotalQuantityOption = 810;
	public selectedEstHeaderFk: number | null = null;
	public isUpdateDataByParameter: boolean = false;
	public selectedEstHeaderColumnConfigFk: number | null = null;
	public selectedEstHeaderColumnConfigTypeFk: number | null = null;
	public isColumnConfig: boolean | null = null;
	public ruleToDelete: [] = [];
	public selectedEstHeaderItem: IEstHeaderEntity | null = null;
	public selectedEstProject: IEstimateEntity | null = null;
	public selectedProjectInfo: IEstProjectInfo | null = null;
	public cacheExchangeProjectId: number = -1;

	public CompanyMdcContextFk: number | null = null;
	public isHeaderStatusReadOnly: boolean = false;
	public JobFk: number | null = null;
	public LineItemJobFk: number | null = null;
	public PackageReferenceLen: number = 252;
	public EstLineItemStatusList: { [key: number]: boolean } = {};
	public EstRoundingConfigDetails: IEstRoundingConfigComplete | null = null;
	public EstCopyOptions: IEstCopyOptionBaseEntity | null = null;
	public CostGroupCatalogs: [] = [];
	public QuantityTypes: IBasicsCustomizeQuantityTypeEntity[] | null = [];
	public Boq2CalcQtySplitMap: { Item1: number; Item2: number; Item3: boolean }[] = [];

	//System Options
	public IsCalcTotalWithWQ: boolean = false;
	public IsWQReadOnly: boolean = false;
	public IsTotalAQBudget: boolean = false;
	public DoConsiderDisabledDirect: boolean = false;
	public IsBudgetEditable: boolean = true;
	public IsFixedBudgetTotal: boolean = true;
	public IsAllowAssemblyTemplateNavigation: boolean = true;
	public EquipmentAssemblyCostUnitAlwaysEditable: boolean = true;
	public SystemOptions: IBasicsCustomizeSystemOptionEntity[] | null = [];

	// Allowance Calculation Relation
	public AdvancedAllowanceCc: number | null = null;
	public AdvancedAll: number = 0;
	public AllowanceEntity: IEstAllowanceBaseEntity | null = null;
	public EstMarkup2CostCodes: IEstAllMarkup2costcodeBaseEntity[] = [];
	public MdcCostCodeStructure: { Id: number; ParentFk: number | null }[] = [];
	public PrjCostCodeStructure: { Id: number; ParentFk: number | null; MdcCostCodeFk: number | null }[] = [];
	public LineItemsWithAdvancedAll: IEstLineItemEntity[] = [];
	public FixedPriceLineItems: IEstLineItemEntity[] = [];

	// Project Relation
	public prjEstComposites: IEstimateCompositeEntity[] | null = [];
	public SelectedPrj: IProjectEntity | null = null;

	// Dynamic Columns
	public IsEstDynamicColumnActive: boolean = false;
	public DynamicColumns: object = {};
	public ExtendColumns: [] = [];

	// Lookup Relation
	public LookupAssemblies: IEstLineItemEntity[] = [];

	// Configuration
	public showDeleteMessage: boolean = true;
	public isLoadByNavigation: boolean = false;
	public isLoadByPrjFavorites: boolean = false;
	public isReadOnlyService: boolean = false;
	public isRegisterContextUpdated: boolean = false;
	public isDoRefreshLD: boolean = false;
	public systemOptionForPlantTypeResource: boolean = true;

	/**
	 * search the system option to check whether LineItem QuantityTotal will be input
	 */
	public enableInputLineItemTotalQuantity(): boolean {
		const option = find(this.SystemOptions, (e) => e.Id === this.enableInputLineItemTotalQuantityOption);
		return !(option && option.ParameterValue && (option.ParameterValue === '1' || option.ParameterValue.toLowerCase() === 'true'));
	}

	/**
	 * check whether BoqSplitQuantityFk will be input
	 */
	public doCalculateSplitQuantity(boqHeaderId?: number | null, boqItemId?: number | null): boolean {
		if (!boqHeaderId || !boqItemId) {
			return true;
		}
		const boqItem = find(this.Boq2CalcQtySplitMap, { Item1: boqHeaderId, Item2: boqItemId });
		return !!(boqItem && boqItem.Item3);
	}

	/**
	 * check whether LineItem is readonly
	 * @param item
	 */
	public isLineItemStatusReadonly(item: IEstLineItemEntity): boolean {
		if (item.EstLineItemStatusFk) {
			//TODO: whether need to consider HeaderStatus and Permission
			return this.EstLineItemStatusList[item.EstLineItemStatusFk] || false;
		}
		return false;
	}

	public initialize(loaded: IEstLineItemResponseEntity) {
		this.isUpdateDataByParameter = false;
		this.AdvancedAllowanceCc = loaded.advancedAllowanceCc;
		this.AllowanceEntity = loaded.allowanceEntity || null;
		this.AdvancedAll = loaded.advancedAll;
		this.LineItemsWithAdvancedAll = loaded.lineItemsWithAdvancedAll || [];
		this.FixedPriceLineItems = loaded.fixedPriceLineItems || [];
		this.MdcCostCodeStructure = loaded.mdcCostCodeStructure;
		this.PrjCostCodeStructure = loaded.prjCostCodeStructure;
		this.EstMarkup2CostCodes = loaded.estMarkup2CostCodes || [];
		this.EstLineItemStatusList = loaded.EstLineItemStatusList;
		this.SelectedPrj = loaded.selectedPrj;
		this.prjEstComposites = loaded.prjEstComposites;
		this.EstRoundingConfigDetails = loaded.EstRoundingConfigDetails || null;
		if (this.EstRoundingConfigDetails) {
			this.estimateMainRoundingDataService.setEstRoundingConfigData(this.EstRoundingConfigDetails);
		}
		if (loaded.EstCopyOptions) {
			this.EstCopyOptions = loaded.EstCopyOptions;
			//TODO: waiting for estimateMainCopySourceCopyOptionsDialogService
			//$injector.get('estimateMainCopySourceCopyOptionsDialogService').setCurrentItem(estCopyOptions);
		}
		this.IsCalcTotalWithWQ = loaded.IsCalcTotalWithWQ;
		this.IsWQReadOnly = loaded.IsWQReadOnly || false;
		this.IsTotalAQBudget = loaded.IsTotalAQBudget || false;
		this.DoConsiderDisabledDirect = loaded.DoConsiderDisabledDirect || false;
		this.IsBudgetEditable = isUndefined(loaded.IsBudgetEditable) || loaded.IsBudgetEditable === null ? true : loaded.IsBudgetEditable;
		this.IsAllowAssemblyTemplateNavigation = isUndefined(loaded.IsAllowAssemblyTemplateNavigation) || loaded.IsAllowAssemblyTemplateNavigation === null ? true : loaded.IsAllowAssemblyTemplateNavigation;
		this.IsFixedBudgetTotal = loaded.IsFixedBudgetTotal;
		this.Boq2CalcQtySplitMap = loaded.Boq2CalcQtySplitMap || [];
		this.EquipmentAssemblyCostUnitAlwaysEditable = loaded.EquipmentAssemblyCostUnitAlwaysEditable;
		this.QuantityTypes = loaded.QuantityTypes || [];
		this.SystemOptions = loaded.SystemOptions;
		this.JobFk = loaded.jobFk || null;
		this.LineItemJobFk = loaded.jobFk || null;
		this.PackageReferenceLen = loaded.packageReferenceLen ?? 252;

		if (loaded.selectedPrj) {
			this.setSelectedProjectInfo(loaded.selectedPrj as ProjectEntity);
			//TODO:move to estimateMainService or not need anymore
			//service.updateModuleHeaderInfo();
		}
		if (loaded.prjEstComposites) {
			this.prjEstComposites = get(loaded, 'prjEstComposites') as IEstimateCompositeEntity[];
			if (this.selectedProjectInfo && size(this.prjEstComposites) > 0) {
				this.setSelectedPrjEstHeader(this.prjEstComposites[0]);
			}
		}

		this.setEstConfigData(loaded);
	}

	public setSelectedProjectInfo(projectEntity: IProjectEntity | null) {
		if (projectEntity) {
			this.selectedProjectInfo = {
				ProjectNo: projectEntity.ProjectNo,
				ProjectName: projectEntity.ProjectName,
				ProjectId: projectEntity.Id,
				ProjectCurrency: projectEntity.CurrencyFk,
				PrjCalendarId: projectEntity.CalendarFk,
				ProjectLongNo: projectEntity.ProjectLongNo,
			};
		} else {
			this.selectedProjectInfo = null;
		}
	}

	public setSelectedPrjEstHeader(estimateCompositeItem: IEstimateCompositeEntity | null) {
		if (estimateCompositeItem) {
			this.selectedEstProject = estimateCompositeItem.PrjEstimate;
			this.selectedEstHeaderItem = estimateCompositeItem.EstHeader;

			//TODO: maybe need to get form estimateMainContextService
			//estimateMainLookupService.setSelectedProjectId(selectedEstProject.PrjProjectFk);
			//estimateMainJobCostcodesLookupService.setSelectedProjectId(selectedEstProject.PrjProjectFk, selectedEstHeaderItem.LgmJobFk);
			//estimateMainPrjMaterialLookupService.setProjectId(selectedEstProject.PrjProjectFk);
			//estimateRuleFormatterService.setSelectedProject(selectedEstProject.PrjProjectFk);

			if (this.selectedEstHeaderItem) {
				//$injector.get('estimateResourcesSummaryService').setCurrentEstHeaderId(selectedEstHeaderItem.Id);
				this.selectedEstHeaderFk = this.selectedEstHeaderItem.Id;
				this.selectedEstHeaderColumnConfigFk = this.selectedEstHeaderItem.EstConfigFk;
				this.selectedEstHeaderColumnConfigTypeFk = this.selectedEstHeaderItem.EstConfigtypeFk;
				if ('IsColumnConfig' in this.selectedEstHeaderItem) {
					this.isColumnConfig = this.selectedEstHeaderItem.IsColumnConfig!;
				}

				//TODO:maybe need to refactor those service to get estHeaderFk and projectFk form estimateMainContextService
				//estimateParameterFormatterService.setSelectedEstHeaderNProject(selectedEstHeaderItem.Id, selectedEstProject.PrjProjectFk);
				//estimateRuleFormatterService.setSelectedEstHeaderNProject(selectedEstHeaderItem.Id, selectedEstProject.PrjProjectFk);
				//$injector.get('estimateMainResourceDynamicUserDefinedColumnService').setSelectedEstHeader(selectedEstHeaderItem);
			}

			// set or reset current PermissionObjectInfo
			if (estimateCompositeItem && 'PermissionObjectInfo' in estimateCompositeItem) {
				this.contextService.setPermissionObjectInfo(estimateCompositeItem.PermissionObjectInfo || null);
			}
		} else {
			this.selectedEstProject = this.selectedEstHeaderItem = this.selectedEstHeaderFk = null;
			this.selectedEstHeaderColumnConfigFk = this.selectedEstHeaderColumnConfigTypeFk = null;
		}

		// enable / disable add button in line item container
		//service.onEstHeaderSet.fire();
	}

	public setEstConfigData(data: object): void {
		if ('EstStructureDetails' in data) {
			this.estConfigData = sortBy(data.EstStructureDetails as object[], 'Sorting');
		}
	}

	public clearEstConfigData() {
		this.estConfigData = [];
	}

	public setContext(estimateCompositeItem: IEstimateCompositeEntity | null) {
		if (estimateCompositeItem) {
			if (estimateCompositeItem.projectInfo) {
				this.selectedProjectInfo = estimateCompositeItem.projectInfo;
			}
			if (estimateCompositeItem.PrjEstimate && estimateCompositeItem.PrjEstimate.PrjProjectFk) {
				if (this.getSelectedProjectId() !== estimateCompositeItem.PrjEstimate.PrjProjectFk) {
					//TODO: may not need
					//estimateMainLookupService.setSelectedProjectId(estimateCompositeItem.PrjEstimate.PrjProjectFk);
					//estimateMainJobCostcodesLookupService.setSelectedProjectId(estimateCompositeItem.PrjEstimate.PrjProjectFk, estimateCompositeItem.EstHeader.LgmJobFk);
					// when change to another project, should clear lookup cache
					//service.clearLookupCache();
				}
			}
		} else {
			this.selectedProjectInfo = null;
		}
		//setLsumUom();
		this.setSelectedPrjEstHeader(estimateCompositeItem);
	}

	public activeLoadByNavigation() {
		this.isLoadByNavigation = true;
	}

	public setEstimateReadData(readData: IEstLineItemResponseEntity) {
		this.estimateReadData = readData;
	}

	public getEstimateReadData() {
		return this.estimateReadData;
	}

	public UpdateLineItemData(lineItemEntity: IEstLineItemEntity | null) {
		this.LineItemJobFk = lineItemEntity?.LgmJobFk || null;
	}

	public getSelectedProjectInfo() {
		return this.selectedProjectInfo;
	}

	public getSelectedProjectId() {
		return this.getProjectId() || -1;
	}

	public getProjectId() {
		let projectId;
		// let existProjectContainer = platformGridAPI.grids.exist('713b7d2a532b43948197621ba89ad67a');
		//
		// if(!projectId && existProjectContainer){
		// 	// should exist the project container
		// 	let projectMainService = $injector.get('projectMainService');
		// 	let project = projectMainService.getSelected();
		// 	if (project) {
		// 		projectId = project.Id;
		// 	}
		// }
		// if(!projectId){
		// 	let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
		// 	let item = cloudDesktopPinningContextService.getPinningItem('project.main');
		// 	if (item) {
		// 		projectId = item.id;
		// 	}
		// }
		if (!projectId) {
			if (this.selectedEstProject && this.selectedEstProject.PrjProjectFk) {
				projectId = this.selectedEstProject.PrjProjectFk;
			} else if (this.getSelectedProjectInfo()) {
				projectId = this.getSelectedProjectInfo()?.ProjectId;
			}
		}

		return projectId;
	}

	public getSelectedEstHeaderId() {
		if (!this.selectedEstHeaderFk || this.selectedEstHeaderFk <= 0) {
			// 1. This is called from estimate page when browser is reloaded
			//let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
			//let estHeaderContext = _.find(cloudDesktopPinningContextService.getContext(), {token: moduleName});
			//selectedEstHeaderFk = estHeaderContext ? estHeaderContext.id : -1;
		}

		return this.selectedEstHeaderFk !== null ? this.selectedEstHeaderFk : -1;
	}

	public getEstTypeIsTotalWq() {
		return this.IsCalcTotalWithWQ;
	}

	public getAdvancedAllowanceCc() {
		return this.AdvancedAllowanceCc;
	}

	public getAllowanceEntity() {
		return this.AllowanceEntity;
	}

	public getHeaderStatus() {
		return this.isHeaderStatusReadOnly;
	}

	public getSelectedEstHeaderItem() {
		return this.selectedEstHeaderItem;
	}

	public getSystemOptionForPlantTypeResource() {
		return this.systemOptionForPlantTypeResource;
	}

	public isReadonly() {
		return this.isReadOnlyService;
	}

	public getLineItemJobId(lineItem: IEstLineItemEntity | null | undefined): number | null {
		if (!lineItem) {
			return null;
		}
		if (lineItem.LgmJobFk) {
			return lineItem.LgmJobFk;
		}
		const headerItem = this.selectedEstHeaderItem;
		return headerItem && headerItem.Id === lineItem.EstHeaderFk ? headerItem.LgmJobFk : null;
	}
}
