/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import {
	EstimateLineItemBaseProcessService,
	IEstLineItemRequestEntity, IEstLineItemResponseEntity,
	LineItemBaseComplete
} from '@libs/estimate/shared';
import { inject, Injectable} from '@angular/core';
import {
	DataServiceFlatRoot,
	IDataServiceEndPointOptions,
	IDataServiceRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { set } from 'lodash';
import {
	IDescriptionInfo, ISearchPayload,
	LazyInjectable,
	Permissions,
	PlatformConfigurationService,
	PlatformPermissionService, PlatformTranslateService
} from '@libs/platform/common';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { ISearchResult } from '@libs/platform/common';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { IEstHeaderEntity } from '@libs/estimate/interfaces';
import { HttpClient } from '@angular/common/http';
import { IEstimateCompositeEntity } from '@libs/estimate/shared';
import { IDialogResult, UiCommonMessageBoxService } from '@libs/ui/common';
import { IProjectEntity } from '@libs/project/interfaces';
import { EstimateMainCommonService } from '../../services/common/estimate-main-common.service';
import { EstimateLineItemSelectionStatementDataService } from '../selection-statement/estimate-line-item-selection-statement-data.service';
import { ESTIMATE_MAIN_SERVICE_TOKEN, IEstimateMainService } from '@libs/estimate/interfaces';
import { EstimateLineItemCostGroupDynamicColumnService } from './dynamic-column/estimate-line-item-cost-group-dynamic-column.service';
import { BasicSharedDynamicColumnDataDecorator, BasicSharedDynamicColumnViewDecorator } from '@libs/basics/shared';

/**
 * Estimate Line Item Service
 */

@Injectable({
    providedIn: 'root',
})

@LazyInjectable<IEstimateMainService>({
    token: ESTIMATE_MAIN_SERVICE_TOKEN,
    useAngularInjection: true
})

export class EstimateMainService extends DataServiceFlatRoot<IEstLineItemEntity, LineItemBaseComplete> implements IEstimateMainService {

	private readonly lineItemProcessService: EstimateLineItemBaseProcessService<IEstLineItemEntity>;

	//Comment: Follow properties are move to estimateMainContextService

	//Comment: Follow functions are move to other service

	//Properties
	private selectedConstructionSystemInstance: { Id: number, InstanceHeaderFk: number } | null = null;
	private ruleParamSaveToLevel = '';
	private detailsParamAlwaysSave = '';
	private characteristicColumn = '';
	private isEstimate = false;
	private ruleToDelete = [];
	private sortCodeInfoToSave = [];
	private selectedLineItem: IEstLineItemEntity | null = null;
	private useCreationService: boolean = true;
	private isSelectEstimateHeaderDialogEnabled: boolean = false;// enable or disable dialog for project/estimate selection
	private gridId = '681223e37d524ce0b9bfa2294e18d650';
	private lastFilter: IEstLineItemRequestEntity | null = null;
	private isLoadByPrjFavorites = false;
	private isHeaderStatusReadOnly = false;

	//event
	public boqFilterOffEvent = new Subject<void>();
	public wicBoqFilterOffEvent = new Subject<void>();
	public onContextUpdated = new Subject<string>();
	public onProjectChanged = new Subject<void>();
	public onDataRead = new Subject<void>();
	public onUpdated = new Subject<void>();
	public onClearItems = new Subject<void>();
	public onRefreshLookup = new Subject<void>();
	public onEstHeaderChanged = new Subject<void>();
	public onSortCodeReset = new Subject<void>();
	public onQuantityChanged = new Subject<void>();
	public onBoqItemsUpdated = new Subject<void>();
	public onEstHeaderSet = new Subject<void>();
	public updatePackageAssignment = new Subject<void>();
	public onCostGroupCatalogsLoaded = new Subject<void>();
	public clearBoqEvent = new Subject<void>();

	//service
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly http = inject(HttpClient);
	private readonly platformPermissionService = inject(PlatformPermissionService);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly estimateMainCommonService = inject(EstimateMainCommonService);
	private readonly lineItemSelectionStatementDataService = inject(EstimateLineItemSelectionStatementDataService);

	//private estimateMainFilterService : any;
	//TODO: need to implement EstimateMainCreationService
	// private estimateMainCreationService: EstimateMainCreationService = inject(EstimateMainCreationService);

	private sidebarInquiryOptions = {
		active: true,
		moduleName: 'estimate.main',
		getSelectedItemsFn: this.getSelectedItems,
		getResultsSetFn: this.getResultsSet
	};

	private lookupFilter = [
		{
			key: 'costgroupfk-for-line-item',
			serverSide: true,
			fn: () => {
				const currentItem = this.estimateMainContextService.selectedEstHeaderItem;
				return 'LineItemContextFk=' + (currentItem ? currentItem.MdcLineItemContextFk : '-1');
			}
		},
		{
			key: 'projectfk',
			serverSide: true,
			fn: () => {
				const id = this.estimateMainContextService.getSelectedProjectId();
				return 'ProjectFk=' + (id);
			}
		},
		{
			key: 'est-controlling-unit-filter',
			serverSide: true,
			serverKey: 'basics.masterdata.controllingunit.filterkey',
			fn: () => {
				return {
					ProjectFk: this.estimateMainContextService.getSelectedProjectId()
				};
			}
		},
		{
			key: 'est-prj-controlling-unit-filter',
			serverSide: true,
			serverKey: 'controlling.structure.prjcontrollingunit.filterkey',
			fn: () => {
				return 'ProjectFk=' + this.estimateMainContextService.getSelectedProjectId();
			}
		},
		{
			key: 'estimate-prj-controlling-unit-filter',
			serverSide: true,
			serverKey: 'controlling.structure.estimate.prjcontrollingunit.filterkey',
			fn: () => {
				return {
					ByStructure: true,
					ExtraFilter: false,
					PrjProjectFk: this.estimateMainContextService.getSelectedProjectId(),
					CompanyFk: this.configurationService.getContext().clientId,
					FilterKey: 'controlling.structure.estimate.prjcontrollingunit.filterkey',
					IsProjectReadonly: function () {
						return true;
					},
					IsCompanyReadonly: function () {
						return true;
					}
				};
			}
		},
		{
			key: 'est-model-object-filter',
			serverSide: false,
			fn: function (item: { MdlModelFk: number | null, ModelFk: number | null }) {
				return item.MdlModelFk || item.ModelFk;
			}
		},
		{
			key: 'estimate-main-project-change-common-filter',
			serverSide: true,
			serverKey: 'estimate-main-project-change-common-filter',
			fn: (/* item */) => {
				return {
					ProjectFk: this.estimateMainContextService.getSelectedProjectId(),
					IsChangeOrder: false,
					IsProjectChange: true
				};
			}
		},
		{
			key: 'est-lineitem-reference-filter',
			serverSide: true,
			serverKey: 'est-lineitem-reference-filter',
			fn: function (entity: { EstHeaderFk: number, Id: number }) {
				return {
					estHeaderId: entity.EstHeaderFk,
					currentLineItemId: entity.Id
				};
			}
		}
	];

	public constructor() {
		const options = {
			apiUrl: 'estimate/main/lineitem',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listfiltered_new',
				usePost: true
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update',
				usePost: true
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IEstLineItemEntity>>{
				role: ServiceRole.Root,
				itemName: 'EstLineItems',
			}
		};
		super(options);
		this.lineItemProcessService = new EstimateLineItemBaseProcessService(this);
		this.processor.addProcessor(this.lineItemProcessService);
		this.selectionChanged$.subscribe((e) => {
			this.onSelectionChanged();
		});
	}

	public onSelectionChanged() {
		this.estimateMainContextService.UpdateLineItemData(this.getSelectedEntity());
	}

	/**
	 * Override the createUpdateEntity method to handle specific entity creation
	 * @param modified The modified line item entity or null
	 */
	public override createUpdateEntity(modified: IEstLineItemEntity | null): LineItemBaseComplete {
		const completeEntity = new LineItemBaseComplete();

		//TODO: not sure why
		if (this.estimateMainContextService.isUpdateDataByParameter) {
			completeEntity.EntitiesCount = 0;
			return completeEntity;
		}

		if (modified) {
			completeEntity.EstLineItems = [modified];
		}

		this.doPrepareUpdateCall(completeEntity);

		return completeEntity;
	}

	public override provideCreatePayload(): object {
		const creationData = {};
		const selectedItem = this.getSelectedEntity();
		if (selectedItem && selectedItem.Id > 0) {
			set(creationData, 'EstHeaderFk', selectedItem.EstHeaderFk);
			set(creationData, 'SelectedItem', selectedItem);
			set(creationData, 'Currency1Fk', selectedItem.Currency1Fk);
			set(creationData, 'Currency2Fk', selectedItem.Currency2Fk);
		} else {
			set(creationData, 'EstHeaderFk', (this.estimateMainContextService.selectedEstHeaderFk !== null) ? this.estimateMainContextService.selectedEstHeaderFk : 1);
		}
		// need to implement
		this.assignQtyRelationOfLeadingStructures(creationData);
		if (this.useCreationService) {
			//TODO: need to implement estimateMainCreationService
			// estimateMainCreationService.processItem(creationData);
		}

		if (!(('validStructure' in creationData) && creationData.validStructure)) {
			set(creationData, 'QtyRelFk', null);
		}

		if (('DescriptionInfo' in creationData) && creationData.DescriptionInfo) {
			const descInfo = creationData.DescriptionInfo as IDescriptionInfo;
			const maxln = 42;
			descInfo.Description = descInfo.Description && descInfo.Description.length > maxln ? descInfo.Description.substring(0, maxln) : descInfo.Description;
			descInfo.Translated = descInfo.Translated && descInfo.Translated.length > maxln ? descInfo.Translated.substring(0, maxln) : descInfo.Translated;
		}

		if (this.estimateMainContextService.selectedProjectInfo) {
			set(creationData, 'ProjectId', this.estimateMainContextService.selectedProjectInfo.ProjectId);
			set(creationData, 'ProjectName', this.estimateMainContextService.selectedProjectInfo.ProjectName);
			set(creationData, 'ProjectNo', this.estimateMainContextService.selectedProjectInfo.ProjectNo);
		}

		if (this.estimateMainContextService.selectedEstHeaderItem) {
			set(creationData, 'EstimationCode', this.estimateMainContextService.selectedEstHeaderItem.Code);
			set(creationData, 'EstimationDescription', this.estimateMainContextService.selectedEstHeaderItem.DescriptionInfo);
		}

		if ('BasUomFk' in creationData) {
			creationData.BasUomFk = creationData.BasUomFk ? creationData.BasUomFk : 0;
		}
		if ('BasUomTargetFk' in creationData) {
			creationData.BasUomTargetFk = creationData.BasUomTargetFk ? creationData.BasUomTargetFk : 0;
		}

		return creationData;
	}

	public  getIfSelectedIdElse(elseValue:number):number{
        const sel = this.getSelectedEntity();
		 return sel?.Id ?? elseValue;
     }

	protected override onCreateSucceeded(created: object): IEstLineItemEntity {
		const item = created as unknown as IEstLineItemEntity;

		// TODO: not sure why need this
		// item.Info = {type: 'image'};
		// item.BoqRootRef = {type: 'integer'};
		// item.PsdActivitySchedule = {type: 'code'};
		// item.Rule = [];

		const qtyToCalculate = this.estimateMainContextService.IsCalcTotalWithWQ ? item.WqQuantityTarget : item.QuantityTarget;
		item.QuantityUnitTarget = item.IsDisabled ? 0 : (item.Quantity * item.QuantityFactor1 * item.QuantityFactor2 * item.QuantityFactor3 * item.QuantityFactor4 * item.ProductivityFactor);

		const qtyTarget = item.IsLumpsum ? 1 : qtyToCalculate;
		item.QuantityTotal = (item.IsOptional && !item.IsOptionalIT) ? 0 : qtyTarget * item.QuantityUnitTarget;

		this.calculateCurrencies(item);
		this.setLineItemCurrenciesCreation(item);

		//TODO: handle dynamic columns
		//$injector.get('estimateMainColumnConfigService').attachExtendColumnsToLineItem(item, [], $injector.get('estimateMainConfigDetailService').getColumnConfigDetails());
		//$injector.get('estimateMainLineItemCharacteristicsService').createDefaultCharacteristics(item);

		// TODO: waiting for estimateMainBoqService, I think it should implement in serve side
		// let estimateMainBoqService = $injector.get('estimateMainBoqService');
		// let boqHeaderList = estimateMainBoqService.getBoqHeaderEntities();
		// let boqHeader = find(boqHeaderList, {'Id': item.BoqHeaderFk});
		// if (boqHeader) {
		// 	item.IsGc = boqHeader.IsGCBoq;
		// 	if(!boqHeader.IsGCBoq){
		// 		let boqSelected = estimateMainBoqService.getSelected();
		// 		item.IsOptional = estimateMainBoqService.IsLineItemOptional(boqSelected);
		// 		item.IsOptionalIT = estimateMainBoqService.IsLineItemOptionalIt(boqSelected);
		// 	}
		// }

		//TODO: add user defined column
		// attach empty user defined column value to new item.
		//let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
		//estimateMainDynamicUserDefinedColumnService.attachEmptyDataToColumn(item);

		return item;
	}

	public override delete(entities: IEstLineItemEntity[] | IEstLineItemEntity) {
		this.http.post<boolean>(this.configurationService.webApiBaseUrl + 'estimate/main/lineitem/hasreferencelineitems', entities).subscribe((response) => {
			this.estimateMainContextService.showDeleteMessage = response;
			const parameterData: { LineItemFk: number }[] = [];
			if (_.isArray(entities)) {
				_.forEach(entities, function (item) {
					parameterData.push({ LineItemFk: item.Id });
				});
			} else {
				parameterData.push({ LineItemFk: entities.Id });
			}
			this.http.post(this.configurationService.webApiBaseUrl + 'procurement/common/prcitemassignment/ValidPackageByEstimateLineItems', parameterData).subscribe((res) => {
				if (res) {
					this.messageBoxService.showMsgBox({
						headerText: this.translate.instant('platform.dialogs.deleteSelection.headerText'),
						bodyText: this.translate.instant('estimate.main.deleteResourceDialogBody'),
						iconClass: 'ico-warning',
						id: this.gridId,
						dontShowAgain: true
					});
				} else {
					if (this.estimateMainContextService.showDeleteMessage) {
						this.messageBoxService.deleteSelectionDialog({
							bodyText: this.translate.instant('estimate.main.confirmDeleteLineItems'),
							width: '640px'
						})?.then((dialogResult: IDialogResult) => {
							if (dialogResult.closingButtonId === 'yes') {
								super.delete(entities);
							}
						});
					} else {
						this.messageBoxService.deleteSelectionDialog()?.then((dialogResult: IDialogResult) => {
							if (dialogResult.closingButtonId === 'yes') {
								super.delete(entities);
							}
						});
					}
				}
			});

		});
	}

	protected override provideLoadByFilterPayload(payload: ISearchPayload): object {
		this.extendSearchFilter(payload as IEstLineItemRequestEntity);
		//this.extendSearchFilterAssign(payload as IEstLineItemRequestEntity);
		return payload;
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	@BasicSharedDynamicColumnViewDecorator({
		EntitiesPropertyName: 'dtos',
		GridGuid: '681223e37d524ce0b9bfa2294e18d650',
		DynamicServiceTokens:[EstimateLineItemCostGroupDynamicColumnService]
	})
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IEstLineItemEntity> {
		this.doDataReadSuccess(loaded as IEstLineItemResponseEntity);

		//TODO: need to refactor, some function may not need anymore
		const fr = _.get(loaded, 'FilterResult')!;
		return {
			FilterResult: fr,
			dtos: _.get(loaded, 'dtos')! as IEstLineItemEntity[]
		};
	}

	public override getModificationsFromUpdate(complete: LineItemBaseComplete): IEstLineItemEntity[] {
		if (!complete.EstLineItems) {
			return (complete.EstLineItems = []);
		}

		return complete.EstLineItems;
	}

	private doDataReadSuccess(readData: IEstLineItemResponseEntity) {
		//TODO: waiting for PinningContextService
		// update the module info
		// let project = $injector.get('cloudDesktopPinningContextService').getPinningItem('project.main');
		// if (!project){
		// 	this.estimateMainContextService.setSelectedProjectInfo(null);
		// }
		// let estHeader = $injector.get('cloudDesktopPinningContextService').getPinningItem('estimate.main');
		// if (!estHeader){
		// 	this.estimateMainContextService.setSelectedPrjEstHeader(null);
		// }

		this.estimateMainContextService.initialize(readData);

		// set pinning context
		if (this.isLoadByPrjFavorites && readData.selectedPrj && readData.prjEstComposites && readData.prjEstComposites.length > 0) {
			// const projectId = readData.selectedPrj.Id;
			// const estHeader = _.get(_.first(_.get(readData, 'prjEstComposites')), 'EstHeader');
			//TODO:
			// if(estimateMainPinnableEntityService.getPinned() !== estHeader.Id){
			// 	service.onEstHeaderChanged.fire();
			// }
			// project favorites are used, we set pinning context

			//TODO:waiting for estimateMainPinnableEntityService and projectMainPinnableEntityService
			//setEstimateToPinningContext(projectId, estHeader);
			this.isLoadByPrjFavorites = false;
			this.wicBoqFilterOffEvent.next();
		}

		// set company Context
		this.estimateMainCommonService.setCompanyContextFk(readData.companyMdcContextFk);
		this.estimateMainCommonService.setActivateEstIndicator();

		this.setSidebarNFavInfo(readData);
		this.setLineItemCurrencies(readData);

		//serviceContainer.data.sortByColumn(readData.dtos);
		// let moduleName = mainViewService.getCurrentModuleName();
		// let constructionSystemProjectInstanceHeaderService = $injector.get('constructionSystemProjectInstanceHeaderService');
		// let selectedConstructionSystemInstance = constructionSystemProjectInstanceHeaderService.getSelected();
		// let isFilterByCurrentInstance = constructionSystemProjectInstanceHeaderService.getFilterByCurrentInstance();
		//
		// let items = readData.dtos;
		// if(moduleName === 'estimate.main' && selectedConstructionSystemInstance && isFilterByCurrentInstance) {
		// 	items = _.filter(readData.dtos, function (item) {
		// 		return (item.CosInsHeaderFk === selectedConstructionSystemInstance.Id);
		// 	});
		// 	readData.dtos = items;
		// 	constructionSystemProjectInstanceHeaderService.setFilterByCurrentInstance(false);
		// }
		//
		// service.setDynamicQuantityColumns(readData.dtos);

		this.estimateMainContextService.setEstimateReadData(readData);

		if (readData.dtos && readData.dtos.length) {
			_.forEach(readData.dtos, (item) => {
				this.estimateMainCommonService.translateCommentCol(item);
			});
		}
		//TODO: waiting for estimateMainCommonService.checkDetailFormat
		//this.estimateMainCommonService.checkDetailFormat(readData.dtos, service);

		this.selectEstLineItem(readData.dtos);
		this.onDataRead.next();
	}

	@BasicSharedDynamicColumnDataDecorator({GridGuid: '681223e37d524ce0b9bfa2294e18d650'})
	private doPrepareUpdateCall(dataToUpdate: LineItemBaseComplete) {
		if (this.estimateMainContextService.selectedEstHeaderFk) {
			dataToUpdate.EstHeaderId = this.estimateMainContextService.selectedEstHeaderFk;
		}
		// skips budget calculation for reference line item
		dataToUpdate.SkipCalculationForRefLineItem = true;

		if (dataToUpdate.EstLineItems && dataToUpdate.EstLineItems.length) {
			dataToUpdate.EstLineItems.forEach(lineItem => {
				if (Object.hasOwnProperty.call(lineItem, 'EstAssemblyFkPrjProjectAssemblyFk')) {
					lineItem.EstAssemblyFk = lineItem.EstAssemblyFkPrjProjectAssemblyFk;
					// Delete temp field
					delete lineItem.EstAssemblyFkPrjProjectAssemblyFk;
				}

				if (lineItem.CommentText && lineItem.originCommentText) {
					const transVal = this.estimateMainCommonService.translateCommentColtext(lineItem.originCommentText);
					lineItem.CommentText = lineItem.CommentText.replace(transVal, lineItem.originCommentText);
				}
			});

			if (dataToUpdate.EstResourceToSave && dataToUpdate.EstResourceToSave.length) {
				dataToUpdate.EstResourceToSave.forEach(item => {
					if (item.EstResource && item.EstResource.CommentText && item.EstResource.originCommentText) {
						const transVal = this.estimateMainCommonService.translateCommentColtext(item.EstResource.originCommentText);
						item.EstResource.CommentText = item.EstResource.CommentText.replace(transVal, item.EstResource.originCommentText);
					}
				});
			}

			dataToUpdate.ShowedLineItemIds = this.getList().map(e => e.Id);
		}

		// if(Object.hasOwnProperty.call(dataToUpdate, 'AllowanceAreaToSave')){
		// 	dataToUpdate.AllowanceMarkUp2CostCodeToSave = [];
		// 	dataToUpdate.AllowanceMarkUp2CostCodeToDelete = [];
		// 	_.forEach(dataToUpdate.AllowanceAreaToSave,function (item) {
		// 		_.forEach(item.AllowanceMarkUp2CostCodeToSave,function (d) {
		// 			if(d.AllowanceMarkUp2CostCode.IsCustomProjectCostCode){
		// 				d.AllowanceMarkUp2CostCode.MdcCostCodeFk = null;
		// 			}
		// 			d.AllowanceMarkUp2CostCode.CostCodes =null;
		// 			if(d.AllowanceMarkUp2CostCode.Id !== -2){
		// 				dataToUpdate.AllowanceMarkUp2CostCodeToSave.push(d);
		// 			}
		// 		});
		//
		// 		_.forEach(item.AllowanceMarkUp2CostCodeToDelete,function (d) {
		// 			d.CostCodes =null;
		// 			if(d.Id !== -2){
		// 				dataToUpdate.AllowanceMarkUp2CostCodeToDelete.push(d);
		// 			}
		// 		});
		// 	});
		// }

		// if(Object.hasOwnProperty.call(dataToUpdate, 'EstimatePriceAdjustmentToSave')){
		// 	$injector.get('estimateMainPriceAdjustmentDataService').doPrepareUpdateCall(dataToUpdate);
		// }
		//
		// if(Object.hasOwnProperty.call(dataToUpdate, 'EstimatePriceAdjustmentTotalToSave')){
		// 	$injector.get('estimateMainPriceAdjustmentTotalDataService').doPrepareUpdateCall(dataToUpdate);
		// }
		//
		// if(Object.hasOwnProperty.call(dataToUpdate, 'CombinedLineItems')){
		// 	$injector.get('estimateMainCombinedLineItemClientService').doPrepareUpdateCall(dataToUpdate);
		// }
	}

	private selectEstLineItem(list: IEstLineItemEntity[] | null) {
		if (this.selectedLineItem && list && list.length) {
			this.selectById({ id: this.selectedLineItem.Id });
			this.selectedLineItem = null;
		}
	}

	private setSidebarNFavInfo(info: IEstLineItemResponseEntity) {
		const prjEstComposites = info.prjEstComposites;
		const selPrjEstComposites = prjEstComposites && _.size(prjEstComposites) === 1 ? prjEstComposites[0] : null;

		if (prjEstComposites && prjEstComposites.length) {
			// / TODO: extension for displayMember: currently no support for "displayMember: 'EstimateHeader.DescriptionInfo.Translated'"
			// / as soon as support is available, remove this code
			_.each(prjEstComposites, function (item) {
				item.displayMember = _.get(item, 'EstHeader.DescriptionInfo.Translated', '');
			});

			// project favourites / navigation endpoint (from project module)
			// or sidebar search if only one project with only one estimate header available
			if (selPrjEstComposites) {
				this.setProjectAndContext(info.selectedPrj, prjEstComposites[0]);
			}
		}
	}

	 public getHeaderStatus(){
		return this.isHeaderStatusReadOnly;
	}

	private setProjectAndContext(project: IProjectEntity | null, prjEstHeader: IEstimateCompositeEntity | null) {
		this.estimateMainContextService.setSelectedProjectInfo(project);
		this.estimateMainContextService.setContext(prjEstHeader);// compositeItem
	}

	public setLineItemCurrencies(readData: IEstLineItemResponseEntity) {
		const entities = readData.dtos ? readData.dtos : [];
		const estHeader = this.estimateMainContextService.selectedEstHeaderItem;
		if (estHeader && entities.length > 0) {
			entities.forEach(lineItem => {
				this.setLineItemCurrenciesCore(lineItem, estHeader);
			});
		}
	}

	public setLineItemCurrenciesCreation(lineItem: IEstLineItemEntity) {
		const estHeader = this.estimateMainContextService.selectedEstHeaderItem;
		if (estHeader !== null) {
			this.setLineItemCurrenciesCore(lineItem, estHeader);
		}
	}

	private setLineItemCurrenciesCore(lineItem: IEstLineItemEntity, estHeader: IEstHeaderEntity) {
		lineItem.Currency1Fk = estHeader.Currency1Fk;
		lineItem.Currency2Fk = estHeader.Currency2Fk;
		lineItem.ExchangeRate1 = estHeader.ExchangeRate1;
		lineItem.ExchangeRate2 = estHeader.ExchangeRate2;
	}

	public calculateCurrencies(lineItem: IEstLineItemEntity) {
		const estHeader = this.estimateMainContextService.selectedEstHeaderItem;
		if (estHeader !== null) {
			lineItem.CostExchangeRate1 = (estHeader.ExchangeRate1 ?? 1) * lineItem.CostTotal;
			lineItem.CostExchangeRate2 = (estHeader.ExchangeRate2 ?? 1) * lineItem.CostTotal;
			lineItem.ForeignBudget1 = (estHeader.ExchangeRate1 ?? 1) * lineItem.Budget;
			lineItem.ForeignBudget2 = (estHeader.ExchangeRate2 ?? 1) * lineItem.Budget;
		}
	}

	//TODO: need to implement
	public assignQtyRelationOfLeadingStructures(creationData: object) {

	}

	public getLineItemJobId(lineItem: IEstLineItemEntity | null | undefined): number | null {
		if (!lineItem) {
			return null;
		}
		if (lineItem.LgmJobFk) {
			return lineItem.LgmJobFk;
		}
		const headerItem = this.estimateMainContextService.selectedEstHeaderItem;
		return headerItem && headerItem.Id === lineItem.EstHeaderFk ? headerItem.LgmJobFk : null;
	}

	public getListOfLineItemsWhichTransferDataToActivity() {
		return this.getList().filter(item => item.EstQtyRelActFk === 2 || item.EstQtyRelActFk === 4);
	}

	public getListOfLineItemsWhichTransferDataNotToActivity() {
		return this.getList().filter(item => item.EstQtyRelActFk !== 2 && item.EstQtyRelActFk !== 4);
	}

	/**
	 * this function will be called from Sidebar Inquiry container when user presses the "AddSelectedItems" Button
	 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
	 */
	private getSelectedItems() {
		const resultSet = this.getSelection();
		return this.createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
	}

	/**
	 * this function will be called from Sidebar Inquiry container when user presses the "AddAllItems" Button
	 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
	 */
	private getResultsSet() {
		//TODO: platformGridAPI
		const filteredSet: IEstLineItemEntity[] = [];// platformGridAPI.filters.items(gridId);
		const resultSet = filteredSet && filteredSet.length ? filteredSet : this.getList();
		return this.createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
	}

	/**
	 * This function creates a Inquiry Resultset from input resultset (lineitem specific)
	 *
	 * {InquiryItem} containing:
	 *     {  id:   {integer} unique id of type integer
	 *        name: {string}  name of item, will be displayed in inquiry sidebar as name
	 *        description: {string}  description  of item, will be displayed in inquiry sidebar as description
	 *     });
	 *
	 * @param resultSet
	 * @returns {Array} see above
	 */
	private createInquiryResultSet(resultSet: IEstLineItemEntity[]) {
		const resultArr: { id: number, name?: string | null, description: string | null, estHeaderId: number }[] = [];
		_.forEach(resultSet, function (item) {
			if (item && item.Id) { // check for valid object
				resultArr.push({
					id: item.Id,
					name: item.Code,
					description: item.DescriptionInfo && item.DescriptionInfo.Description ? item.DescriptionInfo.Description : '',
					estHeaderId: item.EstHeaderFk
				});
			}
		});

		return resultArr;
	}

	private setEstDefaultSettings(readData: object) {
		// eslint-disable-next-line no-prototype-builtins
		if (readData.hasOwnProperty('isFromSideBar')) {
			// From sidebar
			return this.loadPermissionByEstHeader(readData);
		}
		return Promise.resolve();
	}

	private extendSearchFilter(filterRequest: IEstLineItemRequestEntity) {
		if (this.selectedLineItem && this.estimateMainContextService.selectedEstHeaderFk === -1) {
			this.estimateMainContextService.selectedEstHeaderFk = this.selectedLineItem.EstHeaderFk;
		}
		if (filterRequest.pinningContext) { // && _.find(filterRequest.PinningContext, {'token': 'estimate.main'})
			if (this.estimateMainContextService.selectedEstHeaderFk !== null) {
				if (!filterRequest.furtherFilters || !filterRequest.furtherFilters.length) {
					filterRequest.furtherFilters = [{
						Token: 'EST_HEADER',
						Value: this.estimateMainContextService.selectedEstHeaderFk
					}];
				} else {
					const estHeaderFilter = filterRequest.furtherFilters.find(e => e.Token === 'EST_HEADER');
					if (estHeaderFilter) {
						estHeaderFilter.Value = this.estimateMainContextService.selectedEstHeaderFk;
					}
				}
			}
		}

		if (this.selectedLineItem && filterRequest.pinningContext) {
			filterRequest.furtherFilters?.push(
				{
					Token: 'EST_LINE_ITEM',
					Value: this.selectedLineItem.Id
				}
			);
		}
		if (this.estimateMainContextService.isLoadByNavigation) {
			if (this.selectedConstructionSystemInstance) {
				filterRequest.furtherFilters?.push({
					Token: 'COS_INSTANCE',
					Value: this.selectedConstructionSystemInstance.Id
				});
				filterRequest.furtherFilters?.push({
					Token: 'COS_INS_HEADER',
					Value: this.selectedConstructionSystemInstance.InstanceHeaderFk
				});
			}
			this.estimateMainContextService.isLoadByNavigation = false;
		} else if ((filterRequest.setLoadByPrjFavorites) && filterRequest.pKeys && filterRequest.pKeys.length > 0 && !filterRequest.isReadingDueToRefresh) {
			const headerFilter = { Token: 'EST_LINE_ITEM', Value: filterRequest.pKeys[0] };
			filterRequest.furtherFilters = _.isArray(filterRequest.furtherFilters) && filterRequest.furtherFilters.length ? filterRequest.furtherFilters : [headerFilter];
			if (!_.some(filterRequest.furtherFilters, function (i) {
				return i && i.Token && i.Token === 'EST_HEADER';
			}
			)) {
				filterRequest.furtherFilters.push(headerFilter);
			}
			this.estimateMainContextService.isLoadByPrjFavorites = true;
			filterRequest.pKeys = [];
		}

		const headerForNavigate = _.find(filterRequest.furtherFilters, { Token: 'EST_HEADER' });

		//TODO: waiting for cloudDesktopSidebarService
		// let pinningContext = $injector.get('cloudDesktopSidebarService').getFilterRequestParams().PinningContext;
		// if(pinningContext) {
		// 	let estimateContext = _.find(pinningContext, {'token': 'estimate.main'});
		// 	if(headerForNavigate && headerForNavigate.Value && estimateContext && headerForNavigate.Value !== estimateContext.id){
		// 		$injector.get('cloudDesktopPinningContextService').clearPinningItem('project.main');
		// 		$injector.get('cloudDesktopPinningContextService').clearPinningItem('estimate.main');
		// 	}
		// }

		if (this.selectedLineItem && headerForNavigate && headerForNavigate.Value && headerForNavigate.Value === -1) {
			headerForNavigate.Value = this.selectedLineItem.EstHeaderFk;
		}
		const lineItemForNavigate = _.find(filterRequest.furtherFilters, { Token: 'EST_LINE_ITEM' });
		if (lineItemForNavigate && lineItemForNavigate.Value) {
			_.set(filterRequest, 'pKeys', [lineItemForNavigate.Value]);
			//filterRequest.pKeys = [lineItemForNavigate.Value];
		}
		if (filterRequest.pinningContext) {
			const projectForNavigate = _.find(filterRequest.pinningContext, { Token: 'project.main' }) || null;
			if (this.selectedLineItem && projectForNavigate && this.selectedLineItem.ProjectFk && projectForNavigate.Id !== this.selectedLineItem.ProjectFk) {
				projectForNavigate.Id = this.selectedLineItem.ProjectFk;
				projectForNavigate.Info = this.selectedLineItem?.ProjectNo + '-' + this.selectedLineItem?.ProjectName;
			}
		} else {
			filterRequest.pinningContext = (this.selectedLineItem && this.selectedLineItem.ProjectFk) ? [{
				Id: this.selectedLineItem.ProjectFk,
				Token: 'project.main',
				Info: this.selectedLineItem.ProjectNo + '-' + this.selectedLineItem.ProjectName
			}] : filterRequest.pinningContext;
		}
		filterRequest.orderBy = [{ Field: 'Code' }];

		//TODO: waiting for estimateMainFilterService
		// if(filterRequest && filterRequest.PinningContext && filterRequest.PinningContext.length > 1){
		// 	estimateMainFilterService.setFilterRequest(filterRequest);
		// }
	}

	private isDefined<T>(value: T | null | undefined): value is T {
		return value !== null && value !== undefined;
	}

	public setAAReadonly(value: boolean, lineItem: IEstLineItemEntity) {
		this.lineItemProcessService.setAdvanceAllowanceReadonly(lineItem, value);
	}

	private extendSearchFilterAssign(filterRequest: IEstLineItemRequestEntity) {
		// if(!filterRequest.furtherFilters || _.size(filterRequest.furtherFilters) === 0){
		// 	return;
		// }
		// // init furtherFilters - add filter IDs from filter structures
		// let filterType = this.estimateMainFilterService.getFilterFunctionType();
		//
		// // first remove all existing leading structure filters
		// filterRequest.furtherFilters = _.filter(filterRequest.furtherFilters, function(i) { return i && i.Token ? i.Token.indexOf('FILTER_BY_STRUCTURE') < 0 : true; });
		//
		// let leadingStructuresFilters = _.filter(_.map(this.estimateMainFilterService.getAllFilterIds(), function (v, k) {
		// 	if (_.size(v) === 0) {
		// 		return undefined;
		// 	}
		// 	// type 0 - assigned;
		// 	// -> no change needed
		//
		// 	if(k === 'EST_CONFIDENCE_CHECK'){
		// 		// type 0 - assigned and not assigned
		// 		if (filterType === 0) {
		// 			v = v.filter( x => x !== 'null' );
		// 		}else if (filterType === 1) {	// type 1 - assigned and not assigned
		// 			v.push('null');
		// 		}
		// 		// type 2 - not assigned
		// 		else if (filterType === 2) {
		// 			//v = ['null'];
		// 			v = v.filter( x => x !== 'null' );
		// 			v.push(999999); //To identify that not assigned filter is used at server side
		// 		}
		// 	}else{
		// 		// type 1 - assigned and not assigned
		// 		if (filterType === 1) {
		// 			v.push('null');
		// 		}
		// 		// type 2 - not assigned
		// 		else if (filterType === 2) {
		// 			v = ['null'];
		// 		}
		// 	}
		//
		// 	let value: string = v.join(',');
		// 	return {Token: 'FILTER_BY_STRUCTURE:' + k, Value: value};
		// }), this.isDefined);
		//
		// filterRequest.furtherFilters = filterRequest.furtherFilters ? _.concat(filterRequest.furtherFilters, leadingStructuresFilters) : leadingStructuresFilters;
		// this.lastFilter = filterRequest;
	}
		/**
		 * add items to list
		 * @param items
		 */
		public addList(items: IEstLineItemEntity[]) {
			if (items && items.length) {
				const list = this.getList();
				items.forEach((d) => {
					const item = _.find(list, { Id: d.Id, EstHeaderFk: d.EstHeaderFk });
					if (item) {
						Object.assign(item, d);
					} else {
						this.append(d);
					}
				});
				list.forEach(item => this.lineItemProcessService.process(item));
				
			}
			return items;
		}

	public hasCreateUpdatePermission() {
		return this.platformPermissionService.hasWrite(this.gridId) || this.platformPermissionService.hasCreate(this.gridId);
	}

	public deepCopy(copyAsRef: boolean) {
		const selectedItem = this.getSelectedEntity();
		if (!selectedItem) {
			this.messageBoxService.showMsgBox({
				headerText: this.translate.instant('estimate.main.infoDeepCopyLineItemHeader'),
				bodyText: this.translate.instant('estimate.main.infoDeepCopyLineItemBody'),
				iconClass: 'ico-info'
			});
		} else {
			// TODO
			// let containerData = serviceContainer.data;
			// let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
			// let updateData = modTrackServ.getModifications(service);
			const estHeader = this.estimateMainContextService.selectedEstHeaderItem;
			const estProject = this.estimateMainContextService.selectedEstProject;

			if (estHeader && estProject) {
				let copyPromise;
				if (copyAsRef) {
					const updateData = {
						CopyAsRef: copyAsRef,
						CopiedLineItems: this.getSelection(),
						MainItemName: 'EstLineItems',
						EstHeaderId: estHeader.Id,
						ProjectId: estProject.Id,
						SkipCalculationForRefLineItem: true,
						IsLookAtCopyOptions: true
					};
					copyPromise = this.http.post(this.configurationService.webApiBaseUrl + 'estimate/main/lineitem/deepcopy', updateData);
				} else {
					const dataTemp = {
						LineItems: this.getSelection(),
						SourceProjectId: estProject.Id,
						ProjectId: estProject.Id,
						SourceEstHeaderFk: estHeader.Id,
						EstHeaderFk: estHeader.Id,
						FromAssembly: null,
						IsCopyLineItems: true,
						CopyAsRef: copyAsRef,
						IsLookAtCopyOptions: true
					};
					copyPromise = this.http.post(this.configurationService.webApiBaseUrl + 'estimate/main/wizard/savecopyrequestdata', dataTemp);
				}
				copyPromise.subscribe((response) => {
					//TODO
					// copyPromise = null;
					// let result = response.data;
					// result[updateData.MainItemName] = result && result[updateData.MainItemName] && result[updateData.MainItemName].length ? result[updateData.MainItemName] : [];

					// let basicsCostGroupAssignmentService = $injector.get('basicsCostGroupAssignmentService');
					// basicsCostGroupAssignmentService.attachCostGroupValueToEntity(result.CopiedLineItems, result.EstLineItem2CostGroups, function identityGetter(entity) {
					// 	return {
					// 		EstHeaderFk: entity.RootItemId,
					// 		Id: entity.MainItemId
					// 	};
					// },
					// 	'LineItem2CostGroups'
					// );

					// // Update lineitem and resoruce user defined column value
					// if (result && angular.isArray(result.UserDefinedcolsOfLineItemModified)) {
					// 	let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
					// 	estimateMainDynamicUserDefinedColumnService.attachUpdatedValueToColumn(result.CopiedLineItems, result.UserDefinedcolsOfLineItemModified, true);
					// 	estimateMainDynamicUserDefinedColumnService.updateValueList(result.UserDefinedcolsOfLineItemModified);
					// }

					// service.addList(result.CopiedLineItems);
					// containerData.onUpdateSucceeded(result, containerData, updateData);
					// // clear updateData
					// modTrackServ.clearModificationsInRoot(service);
					// updateData = {};
					// service.fireListLoaded();
					// // service.setSelectedEntities(copiedItems);
				});
			}
		}
	}

	public override refreshAllLoaded(): Promise<IEstLineItemEntity[]> {
		this.lineItemSelectionStatementDataService.refreshAllLoaded();
		return super.refreshAllLoaded();
	}

	private loadPermissionByEstHeader(readData: object) {
		this.estimateMainContextService.isDoRefreshLD = true;
		//const selectEstHeader: { EstHeader: IEstHeaderEntity } | null = null;//TODO: $injector.get('estimateProjectService').getSelected();
		const estHeaderId = -1; //selectEstHeader ? selectEstHeader.EstHeader.Id : -1; //

		// 1. It is called from sidebar favorites estimate selection
		if (readData) {
			// eslint-disable-next-line no-prototype-builtins
			if (readData.hasOwnProperty('furtherFilters')) {
				//let estHeaderFilter = _.find(readData.furtherFilters, {Token: 'EST_HEADER'});
				//estHeaderId = estHeaderFilter ? estHeaderFilter.Value : -1;
			}
		}

		if (estHeaderId < 0) {
			// 2. This is called from estimate page initialization and refresh triggered
			//TODO: waiting for cloudDesktopPinningContextService
			//let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
			//let estHeaderContext = _.find(cloudDesktopPinningContextService.getContext(), {token: moduleName});
			//estHeaderId = estHeaderContext ? estHeaderContext.id : -1;
		}
		// if(readData && readData.EstHeader){
		// 	estHeaderId = readData.EstHeader.Id;
		// }
		if (estHeaderId < 0) { // multiple headers
			return Promise.resolve();
		}

		const descriptor = [
			'681223e37d524ce0b9bfa2294e18d650',
			'1dd77e2e10b54f2392870a53fcb44982',
			'ecaf41be6cc045588297d5efb9745fe4',
			'75bbd8df20de4a3b8f132bdacbb203f6',
			'c6f28f5792c54dfd91409b16fa2e79a1',
			'4f3dd493c4e145a49b54506af6da02ef',
			'd4d807d4047e439d9ba536d7114e9009',
			'f3044885941741b8a9c0c8eea34fb647',
			'3416213311ef4b078db786669a80735e',
			'204663b245a146b4a23791b950833e61',
			'96e6498b2ffc429dbb1ef2336b45a369',
			'7925d8cdb20b4256a0808620c28d4666',
			'ee8a005db2cb4fccaf4228bb311b56bb',
			'7b1f2a36a94245ecb03dd964e79d2254',
			'5bafbad1e3fe4bc2a7a114e27972795c',
			'72e7c6850eec42e9aca9a0fd831cb7cc',
			'49e56a48a2b5481189f871774a0e641a',
			'a08569edfec7481fa903fc29273d8df5',
			'9719261f74544c80851daf3554c49cdb',
			'f423a7daa8cd474385097af443f3c73f',
			'4265ca844fcb457e83e0fd8fadda115f',
			'e92749dba52e4d6d8e70293530aff5e8'];

		return new Promise((resolve) => {
			this.http.get<IEstimateCompositeEntity>(this.configurationService.webApiBaseUrl + 'estimate/project/getestimatebyid?estHeaderFk=' + estHeaderId)
				.subscribe(response => {
					const estDefaultSettings = response;
					const estHeader = estDefaultSettings.EstHeader;

					//TODO: waiting for estimateMainWicRelateAssemblyService
					//$injector.get('estimateMainWicRelateAssemblyService').setDefaultFilterBtn(estDefaultSettings.DefaultFilterOfRelatedAssembliesValue);

					// 1.
					// Permission
					const isHeaderStatusReadOnly = estDefaultSettings.IsHeaderStatusReadOnly || estDefaultSettings.IsGCOrder || (estHeader && !!estHeader.EstHeaderVersionFk);
					this.estimateMainContextService.isReadOnlyService = !!isHeaderStatusReadOnly;
					this.estimateMainContextService.isHeaderStatusReadOnly = isHeaderStatusReadOnly;
					this.platformPermissionService.restrict(descriptor, isHeaderStatusReadOnly ? Permissions.Read : false);

					//TODO: waiting for estimateMainStandardAllowancesDataService
					//let estimateMainStandardAllowancesDataService = $injector.get('estimateMainStandardAllowancesDataService');
					//estimateMainStandardAllowancesDataService.processMarkupItem(estHeader,permissionFlag);
					//estimateMainStandardAllowancesDataService.setIsReadOnlyContainer(permissionFlag);

					resolve(estDefaultSettings);
				});
		});
	}
}