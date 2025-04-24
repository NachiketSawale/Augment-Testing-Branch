/*
 * Copyright(c) RIB Software GmbH
 */

import {
	DataServiceHierarchicalLeaf,
	IDataServiceChildRoleOptions, IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import {IBusinessPartner2PrcStructureEntity, IBusinessPartnerEntity, IProcurementStructureSelectionDialogResult} from '@libs/businesspartner/interfaces';
import {BusinessPartnerEntityComplete} from '../model/entities/businesspartner-entity-complete.class';
import {BusinesspartnerMainHeaderDataService} from './businesspartner-data.service';
import {BusinessPartnerMainSubsidiaryDataService} from './subsidiary-data.service';
import {Injectable} from '@angular/core';
import {lastValueFrom, map} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {CollectionHelper, PlatformConfigurationService, ServiceLocator} from '@libs/platform/common';
import {
	BusinesspartnerMainProcurementStructureSelectionDialogComponent
} from '../components/procurement-structure-selection-dialog/procurement-structure-selection-dialog.component';
import {PrcStructureLookupEntity} from '@libs/basics/shared';
import {HttpClient} from '@angular/common/http';
import * as _ from 'lodash';
import {ProcurementStructureTreeHelper} from '../model/helper/procurement-structure-tree-helper';
import {TreeInfo} from '../model/types/TreeInfo';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerPrcStructureDataService extends DataServiceHierarchicalLeaf<IBusinessPartner2PrcStructureEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete> {

	private dictionaryCache: { [key: number]: IBusinessPartner2PrcStructureEntity[] } = {};
	private readonly dialog: MatDialog;
	private prcStructuresToCreate: PrcStructureLookupEntity[] = [];
	private treeInfo: TreeInfo;

	public constructor(public businessPartnerDataService: BusinesspartnerMainHeaderDataService, public subsidiaryDataService: BusinessPartnerMainSubsidiaryDataService) {
		const options: IDataServiceOptions<IBusinessPartner2PrcStructureEntity> = {
			apiUrl: 'businesspartner/main/bp2prcstructure',
			readInfo: {
				endPoint: 'tree',
				usePost: true
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createstructure',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IBusinessPartner2PrcStructureEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'BusinessPartner2PrcStructure',
				parent: businessPartnerDataService
			}
		};
		super(options);
		this.subsidiaryDataService.selectionChanged$.subscribe(selection => {
			const bpSelection = this.getSelectedParent();
			if (bpSelection) {
				this.loadSubEntities({id: 0, pKey1: bpSelection.Id});
			}
		});
		this.dialog = ServiceLocator.injector.get(MatDialog);
		this.treeInfo = {
			parentProp: 'PrcStructure.PrcStructureFk',
			childProp: 'ChildItems',
			idProp: 'PrcStructure.Id'
		};
	}

	protected override onLoadSucceeded(loaded: object): IBusinessPartner2PrcStructureEntity[] {
		if (loaded) {
			return loaded as unknown as IBusinessPartner2PrcStructureEntity[];
		}
		return [];
	}

	protected override provideLoadPayload(): object {
		const branchIds = this.getNoCacheBranchIds();
		return {
			Value: branchIds
		};
	}

	public override childrenOf(element: IBusinessPartner2PrcStructureEntity): IBusinessPartner2PrcStructureEntity[] {
		return element.ChildItems || [];
	}

	public createHttp(data: PrcStructureLookupEntity[]) {
		const http = ServiceLocator.injector.get(HttpClient);
		const configService = ServiceLocator.injector.get(PlatformConfigurationService);
		return lastValueFrom(http.post<IBusinessPartner2PrcStructureEntity[]>(configService.webApiBaseUrl + 'businesspartner/main/bp2prcstructure/createstructure', data));
	}

	public createItem() {
		const dialogRef = this.dialog.open(BusinesspartnerMainProcurementStructureSelectionDialogComponent, {});
		dialogRef.afterClosed().subscribe((result: IProcurementStructureSelectionDialogResult) => {
			if (!result) {
				return;
			}
			this.prcStructuresToCreate = result.data || [];
			if (this.prcStructuresToCreate.length > 0) {
				const http = ServiceLocator.injector.get(HttpClient);
				const configService = ServiceLocator.injector.get(PlatformConfigurationService);
				http.post<IBusinessPartner2PrcStructureEntity[]>(configService.webApiBaseUrl + 'businesspartner/main/bp2prcstructure/createstructure',
					this.prcStructuresToCreate)
					.pipe(map((result) => {
						this.append(result);
						this.setModified(result);
					}));
				this.prcStructuresToCreate = [];
			}
		});
	}

	public createResponeHandle(newItems: IBusinessPartner2PrcStructureEntity[]) {
		const selectedBpItems = this.businessPartnerDataService.getSelection();
		if (selectedBpItems.length === 0) {
			return;
		}
		const selectedBpItem = selectedBpItems[0];
		const multipleSelectBranchIds= this.getMultipleSelectBranchIds();
		const dictionaryFlattenTree = this.getFlattenTreeDictionary();
		ProcurementStructureTreeHelper.iterate(newItems, this.treeInfo, newItem => {

			if (dictionaryFlattenTree[newItem.PrcStructureFk]) {
				const data = dictionaryFlattenTree[newItem.PrcStructureFk];
				for (const branchId of multipleSelectBranchIds) {
					if (!data.find(e => e === branchId)) {
						newItem.BpdSubsidiaryFk = branchId;
						data.push(branchId);
						break;
					}
				}
			} else {
				dictionaryFlattenTree[newItem.PrcStructureFk] = [multipleSelectBranchIds[0]];
				newItem.BpdSubsidiaryFk = multipleSelectBranchIds[0];
			}

			newItem.BusinessPartnerFk = selectedBpItem.Id;
			this.setModified(newItem);

			if (!Array.isArray(newItem.ChildItems)) {
				newItem.ChildItems = [];
			}

			// TODO chi: how to deal with runtime data
			// if (!newItem.__rt$data) {
			// 	newItem.__rt$data = {};
			// }
		});

		const tree = this.rootEntities();
		const list = CollectionHelper.Flatten(tree, this.childrenOf);
		const firstItems = this.buildTree(newItems);
		firstItems.forEach(item => {
			if (item.ParentPrcStructureFk) {
				const parent = list.find(e => e.PrcStructureFk ===  item.ParentPrcStructureFk && e.BpdSubsidiaryFk === item.BpdSubsidiaryFk);
				if (parent) {
					this.appendTo(item, parent);
				} else {
					this.append(item);
				}
			} else {
				this.append(item);
			}
		});
	}

	public getPrcStructures() {
		const arraySelectBranchIds = this.getMultipleSelectBranchIds();
		const dictionaryFlattenTree: {[key: number]: number[]} = {};
		const treeData = this.rootEntities();
		let finalTreeData = [];
		if (arraySelectBranchIds.length > 1) {
			this.flattenTreeToDictionary(treeData, dictionaryFlattenTree);
			// show data don't need to clean,no show data will clean
			const showStructureIds = this.getPrcStructuresToShow(arraySelectBranchIds, dictionaryFlattenTree);
			if (showStructureIds && showStructureIds.length > 0) {
				finalTreeData = [...treeData];
				this.flattenTreeToClean(finalTreeData, showStructureIds);
			} else {
				finalTreeData = treeData;
			}
		} else {
			finalTreeData = treeData;
		}
		const mapFn = function (oldItem: IBusinessPartner2PrcStructureEntity) {
			/** @namespace oldItem.PrcStructure */
			return oldItem.PrcStructure;
		};
		return ProcurementStructureTreeHelper.map(finalTreeData, this.treeInfo, mapFn);
	}

	public getRebuildSelectItems(selectedItems: PrcStructureLookupEntity[]) {
		const multipleSelectBranchIds = this.getMultipleSelectBranchIds();
		if (multipleSelectBranchIds.length <= 1) {
			return selectedItems;
		}

		const dictionaryFlattenTree = this.getFlattenTreeDictionary();
		// Remove superfluous selectItems and prc structures added to the selected branch.
		selectedItems = selectedItems.filter(selectItem => {
			let deleteSwitch = false;
			// Check if the item has been selected
			if (!this.checkSelect(selectItem)) {
				deleteSwitch = true;
			}
			// Check if the selected number exceeds the limit
			if (dictionaryFlattenTree[selectItem.Id] && multipleSelectBranchIds.length <= dictionaryFlattenTree[selectItem.Id].length) {
				deleteSwitch = true;
			}
			return !deleteSwitch;  // Keep only those items that are not marked for deletion
		});

		// add missing items
		const missingItems: PrcStructureLookupEntity[] = [];
		selectedItems.forEach(selectItem => {
			// calculate how many items are missing, then add to the selected items for creation
			let missingCount = multipleSelectBranchIds.length;
			if (dictionaryFlattenTree[selectItem.Id]) {
				missingCount = multipleSelectBranchIds.length - dictionaryFlattenTree[selectItem.Id].length;
			}
			if (missingCount > 0) {
				for (let i = 0; i < missingCount; i++) {
					missingItems.push(selectItem);
				}
			}
		});

		selectedItems.push(...missingItems);

		return selectedItems;
	}

	public reloadData(){
		this.clearModifications();
		return this.loadSubEntities(null);
	}
	private checkSelect(selectItem: PrcStructureLookupEntity) {
		if (selectItem.HasChildren) {
			const childrenCount = selectItem.ChildItems ? selectItem.ChildItems.length : 0;
			for (let i = 0; i < childrenCount || 0; i++) {
				if (selectItem.ChildItems) {
					if (this.checkSelect(selectItem.ChildItems[i])) {
						return true;
					}
				}
			}
		}

		return selectItem.IsSelected;
	}

	private buildTree(items: IBusinessPartner2PrcStructureEntity[]) {
		const firstItem: IBusinessPartner2PrcStructureEntity[] = [];
		items.forEach(item => {
			if (item.ParentPrcStructureFk) {
				const parent = items.find(e => e.PrcStructureFk === item.ParentPrcStructureFk && e.BpdSubsidiaryFk === item.BpdSubsidiaryFk);
				if (parent) {
					parent.ChildItems?.push(item);
					parent.HasChildren = true;
				} else {
					firstItem.push(item);
				}
			} else {
				firstItem.push(item);
			}
		});
		return firstItem;
	}

	private flattenTreeToClean(finalTreeDatas: IBusinessPartner2PrcStructureEntity[], showStructureIds: number[]) {
		let i = 0;
		while (i < finalTreeDatas.length) {
			const finalTreeData = finalTreeDatas[i];

			if (finalTreeData.HasChildren) {
				// Recursively clean the child items
				this.flattenTreeToClean(finalTreeData.ChildItems || [], showStructureIds);
				i++;  // Continue with the next item
			} else {
				// If the structure is in showStructureIds, remove it
				if (showStructureIds.includes(finalTreeData.PrcStructureFk)) {
					finalTreeDatas.splice(i, 1);  // Remove current item
					// Do not increment i because the next item shifts into the current index
				} else {
					i++;  // Only increment if the item is not removed
				}
			}
		}
	}

	private flattenTreeToDictionary(originTreeDataList: IBusinessPartner2PrcStructureEntity[], dictionaryFlattenTree: {[key: number]: number[]}) {
		originTreeDataList.forEach(originTreeData => {
			if (originTreeData.HasChildren) {
				this.flattenTreeToDictionary(originTreeData.ChildItems || [], dictionaryFlattenTree);
			}

			if (dictionaryFlattenTree[originTreeData.PrcStructureFk]) {
				const index = _.indexOf(dictionaryFlattenTree[originTreeData.PrcStructureFk], originTreeData.BpdSubsidiaryFk);
				if (index < 0) {
					dictionaryFlattenTree[originTreeData.PrcStructureFk].push(originTreeData.BpdSubsidiaryFk);
				}
			} else {
				dictionaryFlattenTree[originTreeData.PrcStructureFk] = [originTreeData.BpdSubsidiaryFk];
			}
		});
	}

	private getFlattenTreeDictionary() {
		const dictionaryFlattenTree: {[key: number]: number[]} = {};
		this.flattenTreeToDictionary(this.getList(),dictionaryFlattenTree);
		return dictionaryFlattenTree;
	}

	private getMultipleSelectBranchIds() {
		const selection = this.getSelection();
		return selection.map(item => {
			return item.Id;
		});
	}

	private getNoCacheBranchIds(): number[] {
		const subsidiarySelection = this.subsidiaryDataService.getSelection();
		const noCacheBranchIds: number[] = [];
		const cache = this.dictionaryCache;
		subsidiarySelection.forEach(function (item) {
			if (!cache[item.Id]) {
				noCacheBranchIds.push(item.Id);
			}
		});
		return noCacheBranchIds;
	}


	private getPrcStructuresToShow(arraySelectBrancheIds: number[], dictionaryFlattenTree: {[key: number]: number[]}) {
		const showStructureIds = [];
		for (const key in dictionaryFlattenTree) {
			if (dictionaryFlattenTree[key].length !== arraySelectBrancheIds.length) {
				showStructureIds.push(+key);
			}
		}
		return showStructureIds;
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IBusinessPartner2PrcStructureEntity): boolean {
		return entity.PrcStructureFk === parentKey.Id;
	}
	// private flatten(item: IBusinessPartner2PrcStructureEntity, children: IBusinessPartner2PrcStructureEntity[],
	// 				childrenOf: (data: IBusinessPartner2PrcStructureEntity) => IBusinessPartner2PrcStructureEntity[]) {
	// 	const list = childrenOf(item);
	// 	children.push(...list);
	// 	list.forEach(child => {
	// 		this.flatten(child, children, childrenOf);
	// 	});
	// }
}