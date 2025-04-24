/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import {
	IDataServiceEndPointOptions,
	IDataServiceRoleOptions,
	ServiceRole,
	IDataServiceOptions,
	IReadOnlyField, DataServiceFlatRoot
}
	from '@libs/platform/data-access';
import { EstimateMainStandardAllowancesComplete } from '../../model/complete/estimate-main-standard-allowances-complete.class';
import {EstimateMainContextService} from '@libs/estimate/shared';
import {extend, find, get} from 'lodash';
import {ISearchResult} from '@libs/platform/common';
import { IEstAllowanceEntity } from '@libs/estimate/interfaces';
import { EstimateMainService } from '../../containers/line-item/estimate-main-line-item-data.service';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainStandardAllowancesDataService extends DataServiceFlatRoot<IEstAllowanceEntity, EstimateMainStandardAllowancesComplete> {
	private estHeaderFk = -1;
	private isExchangeHeader = true;
	private allowanceType:[]  = [];
	private isActiveChange:boolean = false;
	private isSelectChange:boolean = false;
	private activeAllowanceChange: number | null = null;
	private readonly markupGridId = 'e4a0ca6ff2214378afdc543646e6b079';
	private isReadOnlyContainer: boolean = false;
	private isDeleteAllowance: {
		deleteEntity: boolean,
		deleteActiveAllowance: boolean
	} = {
		deleteEntity: false,
		deleteActiveAllowance: false
	};

	protected readonly estimateMainService = inject(EstimateMainService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	// private readonly estStandardAllowancesCostCodeDetailDataService = inject(EstStandardAllowancesCostCodeDetailDataService);

	public constructor() {
		const options: IDataServiceOptions<IEstAllowanceEntity> = {
			apiUrl: 'estimate/main/estimateallowance',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getEstimateAllowances',
				usePost: true
			},
			createInfo:<IDataServiceEndPointOptions>{
				endPoint:'create',
				usePost: true
			},
			updateInfo:<IDataServiceEndPointOptions>{
				endPoint:'update',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceRoleOptions<'IEstAllowanceEntity'>>{
				role: ServiceRole.Root,
				itemName: 'EstimateAllowanceToSave',
			}
		};

		super(options);
	}

	/**
	 * Replace initReadData methods
	 * @protected
	 */
	protected override provideLoadByFilterPayload(): object {
		const previousEstimateHeader = this.getHeader();
		this.estHeaderFk = this.estimateMainContextService.getSelectedEstHeaderId();
		this.isExchangeHeader = previousEstimateHeader !== this.estHeaderFk;
		return {
			EstHeaderFk: this.estHeaderFk ? this.estHeaderFk : -1
		};
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: IEstAllowanceEntity[]): ISearchResult<IEstAllowanceEntity> {
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: loaded.length,
				RecordsRetrieved: 0,
				ResultIds: []
			},
			dtos: loaded! as IEstAllowanceEntity[]
		};
	}

	/**
	 *
	 * @param created
	 * @protected
	 */
	protected override onCreateSucceeded(created: IEstAllowanceEntity): IEstAllowanceEntity{
		created.EstHeaderFk = this.estimateMainContextService.getSelectedEstHeaderId();
		return created;
	}

	// TODO
	// serviceContainer.data.newEntityValidator = estStandardAllowancesCostCodeDetailValidationProcessService;
	// serviceContainer.data.showHeaderAfterSelectionChanged = null;
	// serviceContainer.data.isRealRootForOpenedModule = function isRealRootForOpenedModule(){
	// 	return false;
	// };

	// TODO walt gridRefresh
	/**
	 * set IsActive column to unique
	 * @param entity
	 */
	public setUniqueIsActive(entity: IEstAllowanceEntity){
		const currencyAllowance = this.getList();
		currencyAllowance.forEach(item =>{
			if(item.IsActive){
				// this.markItemAsModified(item);
				this.setModified(item);
			}
			item.IsActive = item.Id === entity.Id;
		});
		this.setList(currencyAllowance);
		// service.gridRefresh();
	}

	/**
	 * Clear Modify entity
	 * @param entity
	 */
	public setHasUpdateItem(entity: IEstAllowanceEntity){
		this.clearModifications();
		// serviceContainer.data.doClearModifications(entity,serviceContainer.data);
	}

	// TODO walt platformDataProcessExtensionHistoryCreator and gridRefresh
	/**
	 * refresh update entity
	 * @param response
	 */
	public updateSuccess(response: IEstAllowanceEntity[]){
		const items = this.getList();
		response.forEach(data =>{
			items.forEach(item =>{
				if(data.Id === item.Id){
					extend(item,data);
					this.setAllowanceTypeReadOnly(item);
					// $injector.get('platformDataProcessExtensionHistoryCreator').processItem(item);
				}
			});
		});

		// service.gridRefresh();
	}

	/**
	 * deselect entity
	 */
	public clearSelectedItem(){
		// serviceContainer.data.selectedItem = null;
		this.deselect();
	}

	/**
	 * replace service.doPrepareUpdateCall
	 * @param dataToUpdate
	 */
	public override createUpdateEntity(dataToUpdate: IEstAllowanceEntity | null): EstimateMainStandardAllowancesComplete {
		const complete = new EstimateMainStandardAllowancesComplete();
		complete.EstHeaderId = this.estimateMainContextService.getSelectedEstHeaderId();
		complete.ProjectId =  this.estimateMainContextService.getProjectId();
		complete.IsActiveChange = this.getIsActiveChange();
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

		if (dataToUpdate !== null) {
			// complete.EstimateAllowanceToSave = dataToUpdate;
		}

		return complete;
	}

	// TODO
	// public loadAllowance(){
	// 	if(this.getIsLoad()){
	// 		this.loadAllowanceType().then(function () {
	// 			this.load();
	// 		});
	// 	}else {
	// 		let configurationColumn = platformGridAPI.columns.configuration(markupGridId);
	// 		if(!configurationColumn){
	// 			return;
	// 		}
	// 		let estStandardAllowancesCostCodeDetailDataService = $injector.get('estStandardAllowancesCostCodeDetailDataService');
	// 		let AllColumns = estStandardAllowancesCostCodeDetailDataService.getAllColumns();
	// 		let currentColumn = configurationColumn.current;
	// 		if(AllColumns.length && currentColumn && AllColumns.length === currentColumn.length){
	// 			estStandardAllowancesCostCodeDetailDataService.refreshColumns(markupGridId);
	// 		}
	// 	}
	// }
	//
	// public loadAllowanceType() {
	// 	let deferred = $q.defer();
	// 	$http.get(globals.webApiBaseUrl + 'estimate/main/estimateallowance/getAllowanceType').then(function (response) {
	// 		let result = null;
	// 		if (response && response.data) {
	// 			result = response.data;
	// 			allowanceType = result;
	// 		}
	// 		deferred.resolve(result);
	// 	});
	// 	return deferred.promise;
	// };

	// let baseDeleteSelection = service.deleteSelection;
	// service.deleteSelection = function deleteSelection() {
	// 	let selectItems = service.getSelectedEntities();
	// 	if(selectItems.length > 0){
	// 		service.setIsDeleteAllowance(true,false);
	// 		_.forEach(selectItems,function (item) {
	// 			if(item.IsActive){
	// 				service.setIsDeleteAllowance(true,true);
	// 				// estimateMainService.setAAReadonly(true);
	// 			}
	// 		});
	// 	}
	//
	// 	baseDeleteSelection();
	// };

	// public reCalculateWhenMarkUpCalcTypeChange(args) {
	// 	let lookupItem = args.selectedItem;
	// 	let allowance = service.getSelected();
	// 	allowance.MdcMarkUpCalcTypeFk = lookupItem.Id;
	// 	service.markItemAsModified(allowance);
	// 	if(service.setIsLoading){
	// 		service.setIsLoading(true);
	// 	}
	// 	estimateMainService.update().then(function(){
	// 		// calculate
	// 		let param = {
	// 			EstHeaderId: estimateMainService.getSelectedEstHeaderId(),
	// 			ProjectId: estimateMainService.getProjectId(),
	// 			EstAllowance: service.getSelected()
	// 		};
	//
	// 		$http.post(globals.webApiBaseUrl + 'estimate/main/estimateallowance/recalculate', param).then(function (response) {
	// 			if (response && response.data){
	// 				estimateMainService.load();
	// 				$injector.get('estStandardAllowancesCostCodeDetailDataService').load();
	// 			}
	// 			if(service.setIsLoading){
	// 				service.setIsLoading(false);
	// 			}
	// 		},function(){
	// 			if(service.setIsLoading){
	// 				service.setIsLoading(false);
	// 			}
	// 		});
	// 	});
	// };

	// TODO wait estStandardAllowancesCostCodeDetailDataService
	/**
	 * set MarkupItem isReadOnly
	 * @param estimateHeader
	 * @param isReadOnly
	 */
	public processMarkupItem(estimateHeader: object,isReadOnly: boolean) {
		const oldHeader = this.getHeader();
		const oldIsReadOnlyContainer = this.getIsReadOnlyContainer();
		const estimateHeaderId = get(estimateHeader, 'Id', -1);
		if(oldHeader > 0 && (oldHeader === estimateHeaderId) && (isReadOnly !== oldIsReadOnlyContainer)){
			// let data = this.estStandardAllowancesCostCodeDetailDataService.getList();
			// data.forEach(li => {
			// 	this.processItem(li,isReadOnly);
			// });
		}
	}

	/**
	 * process allowance entity readonly
	 * @param item
	 * @param isHeaderReadOnly
	 */
	public processItem(item: IEstAllowanceEntity, isHeaderReadOnly: boolean) {
		if(!item || item.Id < 0){
			return;
		}

		const fields: IReadOnlyField<IEstAllowanceEntity>[] = [
			{field: 'MdcCostCodeFk', readOnly: true},
			{field: 'GaPerc', readOnly: isHeaderReadOnly},
			{field: 'RpPerc', readOnly: isHeaderReadOnly},
			{field: 'AmPerc', readOnly: isHeaderReadOnly},
			{field: 'DefMGraPerc', readOnly: isHeaderReadOnly},
			{field: 'DefMPerc', readOnly: isHeaderReadOnly},
			{field: 'DefMGcPerc', readOnly: isHeaderReadOnly},
			{field: 'DefMOp', readOnly: isHeaderReadOnly}
		];

		this.setEntityReadOnlyFields(item, fields); // set readonly replace platformRuntimeDataService
	}

	/**
	 * set MdcAllowanceType ReadOnly
	 * @param item
	 */
	public setAllowanceTypeReadOnly(item: IEstAllowanceEntity){
		const allFieldsReadOnly: IReadOnlyField<IEstAllowanceEntity>[] = [];
		const isReadonly = item && item.Version > 0 && item.MdcAllowanceTypeFk === 3;
		const field = {field: 'MdcAllowanceTypeFk', readOnly: isReadonly};
		allFieldsReadOnly.push(field);
		this.setEntityReadOnlyFields(item, allFieldsReadOnly); // set readonly replace platformRuntimeDataService
	}

	public getHeader(): number{
		return this.estHeaderFk;
	}

	public setHeader(estHeaderId: number): void {
		this.estHeaderFk = estHeaderId;
	}

	public getIsExchangeHeader(): boolean {
		return this.isExchangeHeader;
	}

	public setIsExchangeHeader(isChange: boolean): void {
		this.isExchangeHeader = isChange;
	}

	public getIsLoad(): boolean {
		const previousEstimateHeader = this.getHeader();
		this.estHeaderFk = this.estimateMainContextService.getSelectedEstHeaderId();
		return  previousEstimateHeader !== this.estHeaderFk;
	}

	public getIsClearMarkupContainer(): boolean {
		const previousEstimateHeader = this.getHeader();
		return  previousEstimateHeader !== this.estimateMainContextService.getSelectedEstHeaderId();
	}

	public getAllowanceType(): [] {
		return this.allowanceType;
	}

	public getIsActiveChange (): boolean {
		return this.isActiveChange;
	}

	public setIsActiveChange(flag: boolean): void {
		this.isActiveChange = flag;
	}

	public getIsSelectChange(): boolean {
		return this.isSelectChange;
	}

	public setIsSelectChange(flag: boolean): void {
		this.isSelectChange = flag;
	}

	// public getIsDeleteAllowance(): {
	// 	deleteEntity: boolean,
	// 	deleteActiveAllowance: boolean
	// }
	// {
	// 	return this.isDeleteAllowance;
	// };

	/**
	 * Tag deletion
	 * @param deleteFlag
	 * @param deleteActiveFlag
	 */
	public getIsDeleteAllowance(deleteFlag: boolean,deleteActiveFlag: boolean): void {
		this.isDeleteAllowance.deleteEntity = deleteFlag;
		this.isDeleteAllowance.deleteActiveAllowance = deleteActiveFlag;
	}

	public getActiveAllowanceChange(): number| null {
		return this.activeAllowanceChange;
	}

	public setActiveAllowanceChange(allowance : number | null): void {
		this.activeAllowanceChange = allowance;
	}

	public setIsReadOnlyContainer(isReadOnly: boolean): void {
		this.isReadOnlyContainer = isReadOnly;
	}

	public getIsReadOnlyContainer(): boolean {
		return this.isReadOnlyContainer;
	}

	public getActiveAllowance(): IEstAllowanceEntity | undefined {
		return find(this.getList(), {IsActive: true});
	}
}

