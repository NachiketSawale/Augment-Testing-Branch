/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';
import { IEstimateMainResourceList } from '../../model/interfaces/estimate-main-resource-list-interface';


@Injectable({
	providedIn: 'root'
})

/**
 * EstimateMainCommonCalculationService is the data service for estimate resource related common functionality.
 * Detail relate function are moved to EstimateMainDetailCalculationService
 */
export class EstimateMainCommonCalculationService{
	private resList: IEstResourceEntity[]|null = [];
	//Todo: Events would be implemented and tested once main entity container is available
	// public resourceItemModified : any; // = new PlatformMessenger();
	// public refreshData : any; // = new PlatformMessenger();
	// public getList : any; // = new PlatformMessenger();

	public setInfo(info: IEstimateMainResourceList){
		this.resList = info.resList;
	}

	/**
	 * @name markChildrenAsModified
	 * @methodOf EstimateMainCommonCalculationService
	 * @description Mark Children at all level as modified
	 * @param {object} parent IEstResourceEntity
	 */
	private markChildrenAsModified(parent: IEstResourceEntity) {
		// //Todo: This method would be completed once cloudCommonGridService and PlatformMessenger are available
		const children: IEstResourceEntity[] = [];
		//children = cloudCommonGridService.getAllChildren(parent, 'EstResources');
		if (Array.isArray(children) && children.length > 0) {
			children.forEach( res => {
				//this.resourceItemModified.fire(res);
			});
		}
	}

	/**
	 * @name markResourceAsModified
	 * @methodOf EstimateMainCommonCalculationService
	 * @description Mark Resource, Root Parent and Children at all level as modified
	 * @param {boolean} isPrjUpdate
	 * @param {object} res IEstResourceEntity selected resource item
	 * @param {array} resources IEstResourceEntity[] List of all Resources
	 */
	public markResourceAsModified (isPrjUpdate: boolean, res: IEstResourceEntity, resources: IEstResourceEntity[]|null = null) {
		// todo: pending test if isPrjUpdate is required or remove it (comment from AngularJs code)
		// //let resourceList = resources || this.resList;
		// if (res.EstResourceFk && res.EstResourceFk > 0) {
		// 	// get parent item and mark as modified
		// 	let rootParent: any;//Todo: cloudCommonGridService.getRootParentItem(res, resourceList, 'EstResourceFk');
		// 	if (rootParent) {
		// 		this.resourceItemModified.fire(rootParent);
		// 		this.markChildrenAsModified(rootParent); //Todo mark children modified at all level
		// 	}else{
		// 		this.resourceItemModified.fire(res);
		// 	}
		// }else{
		// 	this.resourceItemModified.fire(res);
		// 	if(res.HasChildren && res.EstResources && res.EstResources.length > 0){
		// 		// get all children and mark as modified
		// 		this.markChildrenAsModified(res);
		// 	}
		// }
	}

	/**
	 * @name markResAsModified
	 * @methodOf EstimateMainCommonCalculationService
	 * @description Mark all resources as modified
	 * @param {array} resources IEstResourceEntity[] List of all Resources
	 */
	public markResAsModified(resources: IEstResourceEntity[] ) {
		if(Array.isArray(resources) && resources.length > 0){
			resources.forEach(res => {
			//	this.resourceItemModified.fire(res);
			});
		}
	}

	/**
	 * @name calcResNLineItem
	 * @methodOf EstimateMainCommonCalculationService
	 * @description calculation of Resources and line items
	 * @param {array} resources IEstResourceEntity[] List of all Resources
	 * @param {object} lineItem IEstLineItemEntity lineitem item
	 * @param {boolean} isRef indicates whether Lineitem is reference or base
	 */
	public calcResNLineItem (resources: IEstResourceEntity[], lineItem: IEstLineItemEntity, isRef: boolean){
		//Todo estimateMainCommonService needs to be used once implemented
		// recalculate the lineitem
		//estimateMainCommonService.calculateLineItemAndResources(lineItem, resources);
		const isPrjUpdate: boolean = false;
		resources.forEach(res => {
			if(!isRef){
				this.markResourceAsModified(isPrjUpdate, res);
			}
		});
	}
}