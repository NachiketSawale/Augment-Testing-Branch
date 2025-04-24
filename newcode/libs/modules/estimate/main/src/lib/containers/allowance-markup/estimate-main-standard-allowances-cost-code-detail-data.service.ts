/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import {
	DataServiceHierarchicalLeaf,
	IDataServiceEndPointOptions,
	IDataServiceOptions, IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';
import {EstimateMainStandardAllowancesComplete} from '../../model/complete/estimate-main-allowance-area-complete.class';
import {EstimateMainAllowanceAreaDataService} from '../allowance-area/estimate-main-allowance-area-data.service';
import {EstimateMainStandardAllowancesDataService} from '../allowance/estimate-main-standard-allowances-data.service';
import {EstimateMainContextService} from '@libs/estimate/shared';
import {ICostCodeEntity} from '@libs/basics/costcodes';
import {cloneDeep, find, get, isNull, isUndefined, map} from 'lodash';
import {EstimateMainCommonService} from '../../services/common/estimate-main-common.service';
import {firstValueFrom, Subject} from 'rxjs';
import {PlatformConfigurationService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import {BasicsSharedTreeDataHelperService} from '@libs/basics/shared';
import { IEstAllMarkup2costcodeEntity, IEstAllowanceAreaEntity, IEstAllowanceEntity } from '@libs/estimate/interfaces';
import { EstimateMainService } from '../../containers/line-item/estimate-main-line-item-data.service';

// todo will be done in the future
@Injectable({
	providedIn: 'root'
})
export class EstimateMainStandardAllowancesCostCodeDetailDataService extends DataServiceHierarchicalLeaf<IEstAllMarkup2costcodeEntity, IEstAllowanceAreaEntity, EstimateMainStandardAllowancesComplete>{
	private estHeaderFk = 0;
	private allCostCodes: ICostCodeEntity[] = [];
	private gridId = 'e4a0ca6ff2214378afdc543646e6b079';
	private totalEntity: IEstAllMarkup2costcodeEntity | null = null;

	private http = inject(HttpClient);
	private readonly estimateMainService = inject(EstimateMainService);
	private readonly estimateMainCommonService = inject(EstimateMainCommonService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	protected readonly configurationService = inject(PlatformConfigurationService);
	protected treeHelper = inject(BasicsSharedTreeDataHelperService);
	private readonly estimateMainStandardAllowancesDataService = inject(EstimateMainStandardAllowancesDataService);

	public afterSetSelectedEntities = new Subject<void>();
	public afterclearContent = new Subject<void>();


	public constructor(estimateMainAllowanceAreaDataService: EstimateMainAllowanceAreaDataService) {
		const options: IDataServiceOptions<IEstAllMarkup2costcodeEntity> = {
			apiUrl: 'estimate/main/estallmarkup2costcode',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getEstimateAllMarkup2CostCodeNew',
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
			deleteInfo:<IDataServiceEndPointOptions>{
				endPoint:'delete',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IEstAllMarkup2costcodeEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'AllowanceMarkUp2CostCode',
				parent: estimateMainAllowanceAreaDataService
			}
		};
		super(options);
	}

	public override childrenOf(element: IEstAllMarkup2costcodeEntity): IEstAllMarkup2costcodeEntity[] {
		if(element && element.CostCodes){
			return element.CostCodes as IEstAllMarkup2costcodeEntity[];
		}
		return [];
	}

	public override parentOf(element: IEstAllMarkup2costcodeEntity): IEstAllMarkup2costcodeEntity | null {
		if (element.CostCodeParentFk == null) {
			return null;
		}

		const parentId = element.CostCodeParentFk;
		const parent = this.flatList().find(candidate => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	/**
	 * Replace initReadData methods
	 * @protected
	 */
	protected override provideLoadPayload(): object {
		const allowance = this.estimateMainStandardAllowancesDataService.getSelectedEntity();
		const projectId = this.estimateMainContextService.getProjectId() ? this.estimateMainContextService.getProjectId() : 0;
		this.estHeaderFk = this.estimateMainContextService.getSelectedEstHeaderId() ? this.estimateMainContextService.getSelectedEstHeaderId() : 0;
		const selectParent = this.getSelectedParent();

		this.refreshColumns(this.gridId, null);

		return {
			EstAllowanceFk: !isNull(allowance) ? allowance.Id : null,
			ProjectId: projectId,
			EstHeaderId: this.estHeaderFk,
			isReturnCostCodes: this.allCostCodes.length <= 0,
			EstAllowanceAreaFk: isNull(allowance) ? -1 : allowance.MdcAllowanceTypeFk !== 3 ? -1 : (!isUndefined(selectParent) ? (selectParent.Id > 0 ? selectParent.Id : -2) : -1)
		};
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadSucceeded(loaded: object): IEstAllMarkup2costcodeEntity[] {
		return this.incorporateDataRead(loaded);
	}

	protected incorporateDataRead(loaded: object){
		const totalEntity = get(loaded, 'totalEntity') as unknown as IEstAllMarkup2costcodeEntity;
		if(totalEntity){
			this.setTotalEntity(totalEntity);
			this.totalEntity = totalEntity;
		}

		let dtos = get(loaded, 'dtos', []) as IEstAllMarkup2costcodeEntity[];
		dtos.forEach(item => {
			item.CostCodes = [];
			item.normalGcValue = item.GcValue;
		});

		const costCodes = get(loaded, 'costCodes', []) as ICostCodeEntity[];
		if(costCodes && costCodes.length){
			this.allCostCodes = [];
			this.allCostCodes = this.treeHelper.flatTreeArray(costCodes,(e) => e.CostCodes);
		}

		// let lookupData = estimateMainOnlyCostCodeAssignmentDetailLookupDataService.getFlattenDatas();
		// if(!lookupData.length && readData.costCodes !== null){
		// 	estimateMainOnlyCostCodeAssignmentDetailLookupDataService.setFlattenDatas(allCostCodes);
		// }
		// set totalEntity readOnly
		// let allFieldsReadOnly = [];
		// _.forOwn(totalEntity, function (value, key) {
		// 	if (key !== 'IsReadonly') {
		// 		let field = {field: key, readonly: true};
		// 		allFieldsReadOnly.push(field);
		// 	}
		// });
		// runtimeDataService.readonly(totalEntity, allFieldsReadOnly);

		if(dtos.length){
			dtos.unshift(totalEntity);

			dtos = this.buildTree(dtos);
		}

		return dtos;
		// platformDataServiceEntitySortExtension.sortTree(readData.dtos, 'CostCode', 'CostCodes');
		// platformDataServiceSelectionExtension.doSelectCloseTo(readData.dtos.length > 0 ? 1 : -1, container.data);
	}

	private buildTree(items: IEstAllMarkup2costcodeEntity[]) {
		const firstItem: IEstAllMarkup2costcodeEntity[] = [];
		items.forEach(item => {
			const parent = items.find(e => e.Id === item.CostCodeParentFk);
			if (parent && item.Id !== -2) {
				if(!isNull(parent.CostCodes) && !parent.CostCodes.find(e => e.Id === item.Id)){
					parent.CostCodes?.push(item);
				}
			} else {
				firstItem.push(item);
			}
		});
		return firstItem;
	}

	private refreshColumns(gridId: string, allowance: IEstAllowanceEntity | null){
		// TODO wait platformGridAPI
		// let gridItem =platformGridAPI.grids.element('id', grid);
		// if(!gridItem){
		// 	return;
		// }
		//
		// if(!gridItem.instance){
		// 	return;
		// }
		//
		// if(!allowance){
		// 	allowance = $injector.get('estimateMainStandardAllowancesDataService').getSelected();
		// }
		// if(allowance){
		// 	let column = resolveColumns(allowance);
		// 	if(column){
		// 		platformGridAPI.columns.configuration(grid, angular.copy(column));
		// 		platformGridAPI.grids.refresh(grid);
		//
		// 		platformGridAPI.grids.onColumnStateChanged(grid);
		// 		platformGridAPI.grids.invalidate(grid);
		// 	}
		// }
	}

	private setAllCostCodes(items: ICostCodeEntity[]){
		this.allCostCodes = cloneDeep(items);
	}

	private getAllCostCodes(){
		return this.allCostCodes;
	}

	private findParentNode(allCostCodes: ICostCodeEntity[], currentCostCode: ICostCodeEntity, markup2CostCodeFks: (number | null)[]): ICostCodeEntity | undefined | null{
		if(isNull(markup2CostCodeFks)){
			return null;
		}

		if(currentCostCode && !currentCostCode.CostCodeParentFk){
			return null;
		}

		const costCodeParentFk = currentCostCode.CostCodeParentFk;
		if (costCodeParentFk && markup2CostCodeFks.indexOf(costCodeParentFk)>=0){
			return  find(allCostCodes,{'Id':costCodeParentFk});
			// return parentNode1;
		}

		const parentNode = find(allCostCodes,{'Id':costCodeParentFk}) as unknown as ICostCodeEntity;
		if(parentNode){
			return this.findParentNode(allCostCodes,parentNode,markup2CostCodeFks);
		}
		return null;
	}

	private setGridId(value: string) {
		this.gridId = value;
	}

	private getGridId() {
		return this.gridId;
	}

	public updateSuccess(responseData: IEstAllMarkup2costcodeEntity[]){
		const updateTree = function updateTree(list: IEstAllMarkup2costcodeEntity[]) {
			list.forEach(oldItem => {
				const updatedItem = find(responseData, {Id: oldItem.Id});
				if (updatedItem) {
					oldItem.Version = updatedItem.Version;
				}
				if (oldItem.CostCodes) {
					updateTree(oldItem.CostCodes);
				}
			});
		};

		updateTree(this.getList());
	}

	public setUpdateMajorCostCodeButtonIsDisabled(item: IEstAllowanceEntity | null){
		if(item && item.MdcAllowanceTypeFk < 3){
			return !item;
		}else {
			const areaItem = this.getSelectedParent();
			return areaItem ? !(areaItem.AreaType < 3 && areaItem.Id > 0) : true;
		}
	}


	public async updateMajorCostCode(){
		const currentAllowance = this.estimateMainStandardAllowancesDataService.getSelectedEntity();
		if(isNull(currentAllowance)){
			return;
		}
		const projectId = this.estimateMainContextService.getProjectId() ? this.estimateMainContextService.getProjectId() : 0;
		const estHeaderId = this.estimateMainContextService.getSelectedEstHeaderId() ? this.estimateMainContextService.getSelectedEstHeaderId() : 0;
		const contextId = this.estimateMainCommonService.getCompanyContextFk();
		const entities = this.getList();
		const parentCostCodes = entities.filter((entity: IEstAllMarkup2costcodeEntity) => {
			return 	entity.CostCodeParentFk = -2;
		});
		const parentFks: number[] = [];
		if(parentCostCodes.length > 0){
			parentCostCodes.forEach( d => {
				if(d.CostCodeMainId){
					parentFks.push(d.CostCodeMainId);
				}
			});
		}
		const selectParent = this.getSelectedParent();


		const postData = {
			MdcContextId:contextId,
			EstAllowanceFk:currentAllowance.Id,
			MarkupGa:currentAllowance.MarkUpGa,
			MarkupRp:currentAllowance.MarkUpRp,
			MarkupAm:currentAllowance.MarkUpAm,
			ProjectId:projectId,
			EstHeaderId:estHeaderId,
			estMarkupCostCodeIds:parentFks.length > 0 ? parentFks : null,
			EstAllowanceAreaFk: currentAllowance.MdcAllowanceTypeFk !== 3 ? -1 : (!isUndefined(selectParent) ? (selectParent.Id > 0 ? selectParent.Id : -2) : -1)
		};

		const response = await firstValueFrom(this.http.post(this.configurationService.webApiBaseUrl + 'estimate/main/estallmarkup2costcode/updateMajorCostCode',postData));
		if(response){
			const costCodes: ICostCodeEntity[] =  get(response, 'allCostCode', []);
			const dto: IEstAllMarkup2costcodeEntity[] =  get(response, 'dto', []);


			this.allCostCodes = [];
			this.allCostCodes = this.treeHelper.flatTreeArray(costCodes,(e) => e.CostCodes);
			// todo wait estimateMainOnlyCostCodeAssignmentDetailLookupDataService
			// estimateMainOnlyCostCodeAssignmentDetailLookupDataService.setFlattenDatas(allCostCodes);
			if (dto && dto.length) {
				dto.forEach(d => {
					d.CostCodeMainId = d.MdcCostCodeFk;
					d.isUpdateMajorCostCode = true;
				});
				this.createSucceeded(dto);
			}
			// else {
			// 	this.gridRefresh();
			// }
			return dto;
		}else {
			return;
		}
	}

	protected createSucceeded(newItems: IEstAllMarkup2costcodeEntity[]){
		let data = this.getList();
		let isUpdateMajorCostCode = false;

		const updateData: IEstAllMarkup2costcodeEntity[] = [];
		newItems.forEach(item =>  {
			item.CostCodes = [];
			item.normalGcValue = item.GcValue;
			const cd = find(data, {'CostCodeMainId': item.CostCodeMainId});
			isUpdateMajorCostCode = item.isUpdateMajorCostCode;
			if(!cd){
				updateData.push(item);
			}
		});

		// if(!updateData.length){
		// 	service.gridRefresh();
		// 	if(gridId){
		// 		platformGridAPI.rows.expandAllNodes(gridId);
		// 	}
		// 	this.setSelected(_.find(container.data.itemList,{CostCodeMainId:newItems[0].CostCodeMainId}));
		// 	return;
		// }

		data.forEach(d => {
			d.CostCodes = [];
		});
		data = data ? data : [];

		const totalEntityCostCodeMainId = isNull(this.totalEntity) ? null : this.totalEntity.CostCodeMainId;
		if(data.length && totalEntityCostCodeMainId) {
			const findItem = find(data,{'CostCodeMainId': totalEntityCostCodeMainId});
			if(isUndefined(findItem)){
				this.totalEntity = null;
			}else {
				this.totalEntity = findItem;
			}

			updateData.forEach (d => {
				if(d.IsCustomProjectCostCode){
					d.MdcCostCodeFk = d.Project2MdcCstCdeFk;
				}

				if(!isNull(this.totalEntity)){
					this.totalEntity.DjcTotal = this.totalEntity.DjcTotal + d.DjcTotal;
					this.totalEntity.GcTotal = this.totalEntity.GcTotal + d.GcTotal;

					this.totalEntity.GaValue = this.totalEntity.GaValue + d.GaValue;
					this.totalEntity.GcValue = this.totalEntity.GcValue + d.GcValue;
					this.totalEntity.AmValue = this.totalEntity.AmValue + d.AmValue;
					this.totalEntity.RpValue = this.totalEntity.RpValue + d.RpValue;
					this.totalEntity.FmValue = this.totalEntity.FmValue + d.FmValue;
					this.totalEntity.AllowanceValue = this.totalEntity.AllowanceValue + d.AllowanceValue;

					this.totalEntity.DjcTotalOp = this.totalEntity.DjcTotalOp + d.DjcTotalOp;
					if(isNull(this.totalEntity.normalGcValue)){
						this.totalEntity.normalGcValue = d.GcValue;
					}else {
						this.totalEntity.normalGcValue = this.totalEntity.normalGcValue + d.GcValue;
					}
				}

				const itemList = this.getList();
				itemList.push(d);
				this.setList(itemList);
				this.setModified(d);
			});
		}else{
			if(!isNull(this.totalEntity)){
				this.setDefaultValutInTotal(this.totalEntity);
			}

			updateData.forEach (d => {
				if(d.IsCustomProjectCostCode){
					d.MdcCostCodeFk = d.Project2MdcCstCdeFk;
				}

				if(!isNull(this.totalEntity)){
					this.totalEntity.DjcTotal = this.totalEntity.DjcTotal + d.DjcTotal;
					this.totalEntity.GcTotal = this.totalEntity.GcTotal + d.GcTotal;

					this.totalEntity.GaValue = this.totalEntity.GaValue + d.GaValue;
					this.totalEntity.GcValue = this.totalEntity.GcValue + d.GcValue;
					this.totalEntity.AmValue = this.totalEntity.AmValue + d.AmValue;
					this.totalEntity.RpValue = this.totalEntity.RpValue + d.RpValue;
					this.totalEntity.FmValue = this.totalEntity.FmValue + d.FmValue;
					this.totalEntity.AllowanceValue = this.totalEntity.AllowanceValue + d.AllowanceValue;

					this.totalEntity.DjcTotalOp = this.totalEntity.DjcTotalOp + d.DjcTotalOp;
					if(isNull(this.totalEntity.normalGcValue)){
						this.totalEntity.normalGcValue = d.GcValue;
					}else {
						this.totalEntity.normalGcValue = this.totalEntity.normalGcValue + d.GcValue;
					}
				}

				const itemList = this.getList();
				itemList.push(d);
				this.setList(itemList);
				this.setModified(d);
			});

			if(!isNull(this.totalEntity)){
				this.totalEntity.CostCodes = [];
				const itemList = this.getList();
				itemList.push(this.totalEntity);
				this.setList(itemList);
			}
		}

		if(data.length > 0){
			const costCodeFks = map(data,'CostCodeMainId');
			data.forEach(d => {

				const cd = this.allCostCodes.find((item) =>{
					return item.Id === d.CostCodeMainId;
				});

				if(cd) {
					d.CostCodeMainId = cd.Id;
					d.CostCode = cd.Code;

					const parentNode = this.findParentNode (this.allCostCodes, cd, costCodeFks);
					if (parentNode) {
						d.CostCodeParentFk = parentNode.Id;
					}else {
						const parentCostCodeFk = find(costCodeFks,function (item) {
							return item === d.CostCodeParentFk;
						});
						d.CostCodeParentFk = parentCostCodeFk ? (parentCostCodeFk ? parentCostCodeFk : totalEntityCostCodeMainId) : totalEntityCostCodeMainId;
					}
				}
			});
		}

		data = this.buildTree(data);

		// prepareItems(container.data.itemTree);

		// container.data.listLoaded.fire(null, container.data.itemList);

		// if(gridId){
		// 	platformGridAPI.rows.expandAllNodes(gridId);
		// }

		if(isUpdateMajorCostCode){
			this.setUpdateMajorCostCodeSelected(data);
		}
		// else {
		// 	service.setSelected(_.find(container.data.itemList,{Id:newItems[0].Id}));
		// }
	}

	private setDefaultValutInTotal(totalEntity: IEstAllMarkup2costcodeEntity){
		totalEntity.DjcTotal = 0;
		totalEntity.GcTotal = 0;

		totalEntity.GaValue = 0;
		totalEntity.GcValue = 0;
		totalEntity.AmValue = 0;
		totalEntity.RpValue = 0;
		totalEntity.FmValue = 0;
		totalEntity.AllowanceValue =0;
		totalEntity.DjcTotalOp = 0;
		if(!isNull(this.totalEntity)){
			totalEntity.normalGcValue = this.totalEntity.GcValue;
		}
	}

	private setUpdateMajorCostCodeSelected(data: IEstAllMarkup2costcodeEntity[]) {
		if(this.getSelectedEntity()){
			return;
		}
		// let selected = data[0];
		// this.setSelected(selected.Id === -2 ? data[1] : selected);
	}

	public refreshData(){
		const estimateAllowancesDataService = inject(EstimateMainStandardAllowancesDataService);
		const IsExchangeHeader = estimateAllowancesDataService.getIsExchangeHeader();

		if(IsExchangeHeader){
			const EstAllowanceSelected = estimateAllowancesDataService.getSelectedEntity();
			if(!EstAllowanceSelected){
				this.totalEntity = null;
				this.allCostCodes = [];
				this.setList([]);
			}
			estimateAllowancesDataService.setIsExchangeHeader(false);
		}

		if(this.estHeaderFk === 0){
			this.totalEntity = null;
			this.allCostCodes = [];
			this.setList([]);
		}
		// else {
		// 	if(!platformGridAPI.grids.element('id', 'fec1963fae2e43f2815921ac04bcdff3')){
		// 		let currencyEstHeaderFk = this.estimateMainContextService.getSelectedEstHeaderId();
		//
		// 		if(this.estHeaderFk !== currencyEstHeaderFk){
		// 			this.totalEntity = null;
		// 			this.allCostCodes = [];
		// 			this.setList([]);
		// 			this.estHeaderFk = currencyEstHeaderFk;
		// 		}
		// 	}
		// }
	}

	private setTotalEntity(totalEntity: IEstAllMarkup2costcodeEntity){
		totalEntity.AmPerc = null;
		totalEntity.AmPercConverted = null;
		totalEntity.FinM = null;
		totalEntity.FinMGc = null;
		totalEntity.FinMGra = null;
		totalEntity.FinMOp = null;
		totalEntity.GaPerc = null;
		totalEntity.GaPercConverted = null;
		totalEntity.GraPerc = null;
		totalEntity.RpPerc = null;
		totalEntity.RpPercConverted = null;
		totalEntity.CostCodes = [];
		totalEntity.normalGcValue = totalEntity.GcValue;
	}

	// private asFlatList(entities: IEstAllMarkup2costcodeEntity[]) {
	// 	let flatten = [];
	// 	this.flatten(entities, flatten);
	// 	return _.uniq(flatten);
	// }
	//
	//
	// public override delete(entities: IEstAllMarkup2costcodeEntity[] | IEstAllMarkup2costcodeEntity) {
	// 	if(isArray((entities))){
	// 		// let selectEntity = doPrepareDeleteInHierarchy(entities,container.data);
	//
	// 		this.setItemsToDelete (entities);
	// 		this.updateTree();
	// 		// let context = {
	// 		// 	treeOptions:{
	// 		// 		parentProp: 'CostCodeParentFk',
	// 		// 		childProp: 'CostCodes'
	// 		// 	},
	// 		// 	IdProperty: 'CostCodeMainId'
	// 		// };
	// 		//
	// 		// if(container.data.itemList.length){
	// 		// 	container.data.itemTree = [];
	// 		// 	container.data.itemTree =  $injector.get('basicsLookupdataTreeHelper').buildTree(container.data.itemList, context);
	// 		// }
	// 		//
	// 		// container.data.listLoaded.fire(null, container.data.itemList);
	// 		// service.setSelected(selectEntity);
	// 	}
	// 	else {
	// 		super.delete(entities);
	// 	}
	// }

	// function doPrepareDeleteInHierarchy(deleteParams, data) {
	// 	let res = deleteParams.entity || null;
	// 	if (!res && deleteParams && deleteParams.length > 0) {
	// 		res = deleteParams[0];
	// 	}
	//
	// 	if(!res || res.Id === -2){
	// 		return null;
	// 	}
	//
	// 	if(res.CostCodeParentFk === -2 && res.Id !== -2){
	// 		let treeData = data.itemTree[0].CostCodes;
	// 		let index = treeData.indexOf(res);
	//
	// 		return treeData.length - 1 === index ? treeData[index - 1] : treeData[index + 1];
	// 	}
	//
	// 	let findData = _.find(data.itemList,{CostCodeMainId : res.CostCodeParentFk});
	//
	// 	if(findData.CostCodes.length && findData.CostCodes.length > 1){
	// 		let index = findData.CostCodes.indexOf(res);
	// 		if(index === findData.CostCodes.length -1){
	// 			return findData.CostCodes[index - 1];
	// 		}
	// 		return  findData.CostCodes[index + 1];
	// 	}
	//
	// 	return findData;
	// }

	// private setItemsToDelete(entities: IEstAllMarkup2costcodeEntity[]){
	// 	let deleteEntity = [];
	// 	let deleteMajorCostCode = _.filter(entities,function (entity) {
	// 		return entity.CostCodeParentFk === -2;
	// 	});
	//
	// 	let deleteChildEntity = _.filter(entities,function (entity) {
	// 		return entity.CostCodeParentFk !== -2 && entity.Id !== -2;
	// 	});
	//
	// 	if(deleteMajorCostCode.length){
	// 		deleteEntity = this.asFlatList(deleteMajorCostCode);
	// 	}
	//
	// 	if(deleteChildEntity.length){
	// 		deleteEntity = deleteEntity.concat(deleteChildEntity);
	// 	}
	//
	// 	deleteEntity = _.uniq(deleteEntity);
	//
	// 	let totalEntity = _.find(this.getList(), function (item) {
	// 		return item.CostCodeParentFk === null;
	// 	});
	//
	// 	deleteEntity.forEach(entity => {
	// 		let items = _.filter(this.getList(),function (d2) {
	// 			return d2.Id !== entity.Id;
	// 		});
	// 		this.setList(items);
	//
	// 		if(!isUndefined(totalEntity) && totalEntity.Id){
	// 			totalEntity.DjcTotal = totalEntity.DjcTotal - entity.DjcTotal;
	// 			totalEntity.GcTotal = totalEntity.GcTotal - entity.GcTotal;
	//
	// 			totalEntity.GaValue = totalEntity.GaValue - entity.GaValue;
	// 			totalEntity.GcValue = totalEntity.GcValue - entity.GcValue;
	// 			totalEntity.AmValue = totalEntity.AmValue - entity.AmValue;
	// 			totalEntity.RpValue = totalEntity.RpValue - entity.RpValue;
	// 			totalEntity.FmValue = totalEntity.FmValue - entity.FmValue;
	// 			totalEntity.AllowanceValue = totalEntity.AllowanceValue - entity.AllowanceValue;
	//
	// 			totalEntity.DjcTotalOp = totalEntity.DjcTotalOp - entity.DjcTotalOp;
	// 			totalEntity.normalGcValue = totalEntity.normalGcValue - entity.GcValue;
	// 		}
	// 	});
	//
	// 	if(this.getList().length === 1){
	// 		this.setList([]);
	// 	}
	//
	// 	this.clearModifications();
	// 	this.setModified(deleteEntity);
	// }
	//
	// private updateTree(){
	// 	let data = this.getList();
	// 	// update the data tree
	// 	let costCodeFks = map(data,'MdcCostCodeFk');
	// 	data.forEach(d => {
	// 		d.CostCodes = null;
	// 		let cd = find(this.allCostCodes,{'Id':d.MdcCostCodeFk});
	// 		if(cd) {
	// 			d.CostCodeMainId = cd.Id;
	// 			d.CostCode = cd.Code;
	//
	// 			let parentNode = this.findParentNode (this.allCostCodes, cd, costCodeFks);
	// 			if (parentNode) {
	// 				d.CostCodeParentFk = parentNode.Id;
	// 			}else {
	// 				d.CostCodeParentFk = this.totalEntity.CostCodeMainId;
	// 			}
	// 		}
	// 	});
	// }

	// private canDelete() {
	// 	let items = service.getSelectedEntities();
	// 	if(items.length === 0){
	// 		return  false;
	// 	}
	// 	return !(items.length === 1 && items[0].Id === -2);
	// }
	//
	// private canCreate() {
	// 	let item = estimateMainStandardAllowancesDataService.getSelected();
	// 	if(item && item.MdcAllowanceTypeFk < 3){
	// 		return !!item;
	// 	}else {
	// 		let areaItem = estimateMainAllowanceAreaService.getSelected();
	// 		return areaItem ? (areaItem.AreaType <3 && areaItem.Id > 0) : false;
	// 	}
	// }

	// let baseSetSelectedEntities = service.setSelectedEntities;
	// service.setSelectedEntities = function setSelectedEntities(entities) {
	// 	baseSetSelectedEntities(entities);
	// 	service.afterSetSelectedEntities.fire();
	// };
	//
	// let clearContent = container.data.clearContent;
	// container.data.clearContent = function clearTreeContent(data){
	// 	clearContent(data);
	// 	service.afterclearContent.fire();
	// };

	public clearData(){
		this.allCostCodes = [];
		const data = this.getList();
		if(data.length === 0){
			return;
		}

		this.setList([]);
	}

	public clearDataFromFavorites(){
		const estimateMainStandardAllowancesDataService = inject(EstimateMainStandardAllowancesDataService);
		if(estimateMainStandardAllowancesDataService.getIsClearMarkupContainer()){
			this.clearData();
			estimateMainStandardAllowancesDataService.setHeader(-1);
		}
	}
	// public ReCalculateMarkup2costCodes(columnName: string){
	// 	let allowances = inject(EstimateMainStandardAllowancesDataService).getList();
	//
	// 	if(!allowances || !_.isArray(allowances)){
	// 		return;
	// 	}
	//
	// 	let allowanceEntity = inject(EstimateMainStandardAllowancesDataService).getSelectedEntity();
	//
	// 	let estMarkup2costCodes = this.getList();
	// 	if(!isNull(allowanceEntity) && _.isArray(estMarkup2costCodes)){
	//
	// 		if(columnName === 'MarkUpGa'){
	// 			estMarkup2costCodes.forEach(item => {
	// 				if(item.Id !== -2){
	// 					item.GaPerc = allowanceEntity.MarkUpGa;
	// 				}
	// 			});
	// 		}
	//
	// 		if(columnName === 'MarkUpRp'){
	// 			estMarkup2costCodes.forEach(item=> {
	// 				if(item.Id !== -2){
	// 					item.RpPerc = allowanceEntity.MarkUpRp;
	// 				}
	// 			});
	// 		}
	//
	// 		if(columnName === 'MarkUpAm'){
	// 			estMarkup2costCodes.forEach(item => {
	// 				if(item.Id !== -2){
	// 					item.AmPerc = allowanceEntity.MarkUpAm;
	// 				}
	// 			});
	// 		}
	//
	// 		// let advancedAll = inject(EstimateMainContextService).getAdvancedAll();
	// 		//
	// 		// inject(EstimateMainMarkup2costcodeCalculationService).calculateMarkup2costCodes(allowanceEntity, estMarkup2costCodes, advancedAll);
	// 		// _.forEach(estMarkup2costCodes, function(item){
	// 		// 	service.markItemAsModified(item);
	// 		// });
	// 		// service.gridRefresh();
	// 	}
	//
	// 	// function prepareItems(nodes, parentNode) {
	// 	// 	let n;
	// 	// 	let level = 0;
	// 	// 	if (parentNode) {
	// 	// 		level = parentNode.nodeInfo ? parentNode.nodeInfo.level + 1 : 0;
	// 	// 	}
	// 	// 	for (let i = 0; i < nodes.length; i++) {
	// 	// 		n = nodes[i];
	// 	// 		if (n.nodeInfo === undefined) {
	// 	// 			let nodeInfo = {
	// 	// 				level: level,
	// 	// 				collapsed: false,
	// 	// 				lastElement: false,
	// 	// 				children: !_.isNil(n['CostCodes']) && n['CostCodes'].length
	// 	// 			};
	// 	// 			n.nodeInfo = nodeInfo;
	// 	// 			n.HasChildren = !_.isNil(n['CostCodes']) && n['CostCodes'].length;
	// 	// 		}
	// 	// 		if (!_.isNil(n['CostCodes']) && n['CostCodes'].length > 0) {
	// 	// 			n.nodeInfo.lastElement = false;
	// 	// 			n.nodeInfo.children = true;
	// 	// 			n.HasChildren = true;
	// 	// 			n.nodeInfo.level = level;
	// 	// 			prepareItems(n['CostCodes'], n);
	// 	// 		} else {
	// 	// 			n.nodeInfo.lastElement = true;
	// 	// 			n.nodeInfo.children = false;
	// 	// 			n.HasChildren = false;
	// 	// 			n.nodeInfo.level = level;
	// 	// 		}
	// 	// 	}
	// 	// }
	// 	// container.data.usesCache = false;
	// 	// service.changeContainerHeaderTitle = new PlatformMessenger();
	// 	//
	// 	// container.data.filterParent = function (data) {
	// 	// 	data.currentParentItem = data.parentService.getSelected();
	// 	// 	data.selectedItem = null;
	// 	// 	if (data.currentParentItem && [1,2].indexOf(data.currentParentItem.AreaType) > -1) {
	// 	// 		return data.currentParentItem.Id;
	// 	// 	}else {
	// 	// 		return undefined;
	// 	// 	}
	// 	// };
	// }
}








