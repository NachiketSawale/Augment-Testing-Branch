/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, of } from 'rxjs';
import { IEstResourceToSave } from '../../model/interfaces/estimate-main-common.interface';
import { IBoqItemEntity } from '@libs/boq/interfaces';
//import { EstimateMainService } from '../estimate-main-line-item-data.service';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';

import { IPrjCostCodesEntity } from '@libs/project/interfaces';
import { GridApiService, IGridApi } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})

/**
 * This service is for common cost code and resource function used in EstimateMainCommonService
 */
export class EstimateMainCommonCostcodeAndResourceFunService {
	protected http = inject(HttpClient);
	protected configurationService = inject(PlatformConfigurationService);
	private estcontextServ = inject(EstimateMainContextService);
	//TODO: circle reference with EstimateMainService
	//estimateMainServ = inject(EstimateMainService);
	private basicLookupDescriptiorServ = null; // inject(basicsLookupdataLookupDescriptorService);
	private gridApi?: IGridApi<IEstResourceEntity> | null;

	/**
	 * Modify indirect value
	 * @param res Resource item
	 */
	public ModifyIsIndirectValue(res: IEstResourceEntity) {
		// const advancedAllowanceCostCode = this.estcontextServ.getAdvancedAllowanceCc();
		// const activeAllowance = this.estcontextServ?.getAllowanceEntity();

		//TODO: circle reference with EstimateMainService
		// let lineItem = this.estimateMainServ.getSelectedEntity();
		//
		// if (res.EstResourceTypeFk === 1 && res.MdcCostCodeFk !== null && res.MdcCostCodeFk === advancedAllowanceCostCode) {
		// 	res.IsIndirectCost = true;
		//
		// 	if (!activeAllowance || Object.keys(activeAllowance).length === 0) {
		// 		res.IsIndirectCost = lineItem?.AdvancedAllowance === 0 && lineItem?.AdvancedAll === 0 ? false : !(lineItem?.AdvancedAllowance === 0 && lineItem?.AdvancedAll !== 0);				res.IsIndirectCost = false;
		// 	}
		// }
	}

	/**
	 * Get assembly resource
	 * @param assembly Assembly item
	 * @param projectId Project id
	 * @param estHeaderFk Estimate header id
	 * @param estLineItemIds line item ids
	 */
	public getAssemblyResources(assembly: IEstLineItemEntity, projectId: number, estHeaderFk: number, estLineItemIds: number[]) {
		// create prepared resources (assemblies are resolved to subitems) from given assembly
		return this.http.post(this.configurationService.webApiBaseUrl + 'estimate/main/resource/copyResourcesWhenAssignAssembly', {
			AssemblyHeaderId: assembly.EstHeaderFk,
			AssemblyId: assembly.Id,
			ProjectId: projectId,
			EstHeaderId: estHeaderFk,
			EstLineItemIds: estLineItemIds,
		});
	}

	/**
	 * Get Leaf Boq
	 * @param boqItem Dynamic boq item
	 */
	public getLeafBoqItem(boqItem: IBoqItemEntity[]) {
		if (!boqItem) {
			return;
		}

		return boqItem.map((boqItem) => this.findLeafBoqItem(boqItem));
	}

	private findLeafBoqItem(boqItem: IBoqItemEntity): IBoqItemEntity {
		if (boqItem && boqItem['boqItems']) {
			return this.findLeafBoqItem((boqItem['boqItems'] as IBoqItemEntity[])[0]);
		}
		return boqItem;
	}

	/**
	 * Check if resource can be deleted
	 * @param lineItemId line item id
	 * @param lineItemUomFk line item Uom Id
	 * @param assemblyUomFk Assembly Uom id
	 * @param estHeaderFk Header id
	 */
	public checkIfResourceCanBeDeleted(lineItemId: number, lineItemUomFk: number, assemblyUomFk: number, estHeaderFk: number) {
		//TODO: circle reference with EstimateMainService
		const selectedItem = {} as IEstLineItemEntity;// this.estimateMainServ.getSelectedEntity();
		const estLineItemId = lineItemId ? lineItemId : selectedItem ? selectedItem.Id : null;
		const estHeaderId = estHeaderFk ? estHeaderFk : selectedItem ? selectedItem.EstHeaderFk : null;
		lineItemUomFk = lineItemUomFk ? lineItemUomFk : -1;
		assemblyUomFk = assemblyUomFk ? assemblyUomFk : -1;

		if (estLineItemId) {
			return this.http.post(
				this.configurationService.webApiBaseUrl + 'estimate/main/resource/docheckresourceallowtodelete?lineItemFk=' + estLineItemId + '&lineItemUomFk=' + lineItemUomFk + '&assemblyUomFk=' + assemblyUomFk + '&estHeaderId=' + estHeaderId,
				{},
			);
		} else {
			return of({});
		}
	}

	/**
	 * Link Boq Item by assembly
	 * @param assemblyId Id of assembly
	 * @param assemblyHeaderId Id of Assembly header
	 * @param lineItemHeaderFk Id of header
	 * @param projectId Id of project
	 */
	public linkBoqItemByAssembly(assemblyId: number, assemblyHeaderId: number, lineItemHeaderFk: number, projectId: number) : Observable<object>{
		if (assemblyId === undefined ||  assemblyHeaderId === undefined ||  lineItemHeaderFk === undefined ||  projectId === undefined) {
			return EMPTY;
		}
		return this.http.get<object>(
			this.configurationService.webApiBaseUrl + 'estimate/main/lineitem/linkboqitemtolineitem?assemblyId=' + assemblyId + '&assemblyHeaderId=' + assemblyHeaderId + '&lineItemHeaderFk=' + lineItemHeaderFk + '&projectId=' + projectId,
		);
	}

	/**
	 * Add project cost codes
	 * @param costCode Dynamic project costcode items
	 * @param modifiedPrjCostCodes modified project costcodes
	 */
	public addPrjCostCodes(costCode: IPrjCostCodesEntity, modifiedPrjCostCodes: IPrjCostCodesEntity[]) {
		const item = modifiedPrjCostCodes.find((item) => item.Id === costCode.Id);
		if (!item) {
			modifiedPrjCostCodes.push(costCode);
		}
	}

	/**
	 * Set project cost codes
	 * @param projectId Id of project
	 */
	public setPrjCostCodes(projectId: number) {
		if (projectId > 0) {
			this.http.get<IPrjCostCodesEntity[]>(this.configurationService.webApiBaseUrl + 'estimate/main/lineitem/prjcostcodes?projectId=' + projectId).subscribe((response:IPrjCostCodesEntity[]) => {
				// this.basicLookupDescriptiorServ?.removeData('estprjcostcodes');
				// if (response.data && response.data.length) {
				// 	this.basicLookupDescriptiorServ.updateData('estprjcostcodes', response.data);
				// }
			});
		}
	}

	private getFilterItemId(serviceName: string) {
		// let service = inject(serviceName);
		// if (service && service.getList()) {
		// 	let checkedItems = _.filter(service.getList(), { IsMarked: true });
		// 	if (checkedItems && checkedItems[0]) {
		// 		return checkedItems[0].Id;
		// 	}
		// }
		// return -1;
	}

	/**
	 * get resource type by assembly type
	 * @param assemblyType Type of assembly to process
	 */
	public getResourceTypeByAssemblyType(assemblyType: string) {
		// let defer = $q.defer();
		// inject(EstimateMainResourceTypeLookupService)
		// 	.getListAsync()
		// 	.subscribe((resourceTypes) =>{
		// 		let resourceType = resourceTypes.find(resourceType => resourceType.EstAssemblyTypeFk === assemblyType.Id && resourceType.EstAssemblyTypeLogicFk === assemblyType.EstAssemblyTypeLogicFk);
		// 		defer.resolve(resourceType);
		// 	});
		// return defer.promise;
	}

	/**
	 * Delete Procuerement Package
	 * @param item line item
	 * @param level type of item
	 */
	public deletePrcPackageAssignments(item: IEstLineItemEntity | IEstResourceToSave, level: string) {
		if (!item) {
			return;
		}
		const items = !Array.isArray(item) ? [item] : item;
		const data = {
			EstLineItems: level === 'LineItems' ? items : [],
			EstResources: level === 'Resources' ? items : [],
		};

		return this.http.post(this.configurationService.webApiBaseUrl + 'estimate/main/lineitem/deleteprcpackageassignment', data).subscribe(() => {
			return;
		});
	}

	/**
	 * Merge Cells
	 * @param item Resource Item
	 * @param gridId Grid id of container
	 */
	public setMergeCell(item: IEstResourceEntity, gridId: string) {
		// let mergeCells: IEstMergeCell[];
		// if (item !== null && item !== undefined) {
		// 	let colspanCount = 0;
		// 	const baseColumn: IEstBaseColumn = { BaseField: 'descriptioninfo' };
		// 	colspanCount = this.getColspanCount(baseColumn, gridId);
		// 	mergeCells = [{ Colid: baseColumn.BaseField, Colspan: colspanCount }];
		// 	// if (item.__rt$data) {
		// 	// 	this.platformGridAPI.cells.mergeCells(gridId, mergeCells, item);
		// 	// }
		// }
	}

	/**
	 * Merge Cells
	 * @param item Resource Item
	 * @param gridId Grid id of container
	 */
	public setCLMergeCell(item: IEstResourceEntity, gridId: string) {
		// let mergeCells: IEstMergeCell[]=[];
		// if (item !== null && item !== undefined) {
		// 	   const modelArray: string[];
		// 	let colspanCount = 0;
		// 	const baseColumn: IEstBaseColumn = { BaseField: 'quantitydetail' };
		// 	modelArray = [
		// 		'descriptioninfo',
		// 		'quantitydetail',
		// 		'quantity',
		// 		'quantityfactordetail1',
		// 		'quantityfactor1',
		// 		'quantityfactordetail2',
		// 		'quantityfactor2',
		// 		'quantityfactor3',
		// 		'quantityfactor4',
		// 		'productivityfactordetail',
		// 		'productivityfactor',
		// 		'efficiencyfactordetail1',
		// 		'efficiencyfactor1',
		// 		'efficiencyfactordetail2',
		// 		'efficiencyfactor2',
		// 		'quantityfactorcc',
		// 		'quantityreal',
		// 		'quantityinternal',
		// 		'quantityunittarget',
		// 		'quantitytotal',
		// 		'quantityoriginal',
		// 		'costfactordetail1',
		// 		'costfactor1',
		// 		'costfactordetail2',
		// 		'costfactor2',
		// 		'costfactorcc',
		// 		'islumpsum',
		// 		'isdisabled',
		// 		'isindirectcost',
		// 		'isdisabledprc',
		// 		'isgeneratedprc',
		// 		'isfixedbudget',
		// 		'isfixedbudgetunit',
		// 		'iscost',
		// 		'isbudget',
		// 		'isestimatecostcode',
		// 		'isrulemarkupcostcode',
		// 		'costunit',
		// 		'costunitsubitem',
		// 		'costunitlineitem',
		// 		'costunittarget',
		// 		'costunitoriginal',
		// 		'costtotal',
		// 		'costtotaloc',
		// 		'costtotalcurrency',
		// 		'hoursunit',
		// 		'hourfactor',
		// 		'hoursunitsubitem',
		// 		'hoursunitlineitem',
		// 		'hoursunittarget',
		// 		'hourstotal',
		// 		'riskcostunit',
		// 		'riskcosttotal',
		// 		'basecostunit',
		// 		'basecosttotal',
		// 		'dayworkrateunit',
		// 		'dayworkratetotal',
		// 		'packageassignments',
		// 		'prcstructurefk',
		// 		'basuomfk',
		// 		'lgmjobfk',
		// 	];
		// 	colspanCount = this.getColspanCount(baseColumn, gridId, modelArray);

			//mergeCells = [{ Colid: baseColumn.BaseField, Colspan: colspanCount }];
		}
		// TODO
		// if(item.__rt$data){
		// 	this.platformGridAPI.cells.mergeCells(gridId, mergeCells, item);
		// }


	/**
	 * Get Column count
	 */
	public getColspanCount(baseColumn: { BaseField: string }, gridId: string, modelArray?: string[]): number {
		this.gridApi =  ServiceLocator.injector.get(GridApiService).get(gridId);
		const cols = this.gridApi.columns;
		let allVisibleCols:string[] = [];
		if (cols !== null && cols !== undefined) {
			allVisibleCols = cols.map(col => col.id);
		}
		let colspanCount = 1;
		const sIndex = allVisibleCols.indexOf(baseColumn.BaseField);

		if (modelArray !== null ||  modelArray !== undefined) {
			for (let i = sIndex + 1; i <= allVisibleCols.length; i++) {
				if (modelArray && modelArray.indexOf(allVisibleCols[i]) > -1) {
					colspanCount++;
				} else {
					break;
				}
			}
		} else {
			for (let i = sIndex + 1; i <= sIndex + 6; i++) {
				colspanCount++;
			}
		}

		return colspanCount;
	}

	/**
	 * Get resource by line item ids
	 * @param lineItemIds Array of line items
	 * @param headerIds Array of header ids
	 */
	public getResourcesByLineItemIds(lineItemIds: number[], headerIds: number[]) {
		const postData = {
			lineItemIds: lineItemIds,
			headerIds: headerIds,
		};
		return this.http.post(this.configurationService.webApiBaseUrl + 'estimate/main/resource/GetResourcesByLineItemIds', postData);
	}
}
