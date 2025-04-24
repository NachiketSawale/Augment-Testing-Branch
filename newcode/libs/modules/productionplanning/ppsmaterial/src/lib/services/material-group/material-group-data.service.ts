// remark: current file is copied from basics-material-material-group-data.service in basics.material, 
// should be replaced by other way(like LazyInjectionToken from basics.material module) in the future
/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedTreeDataHelperService, IMaterialCatalogEntity, IMaterialGroupEntity, MainDataDto } from '@libs/basics/shared';
import {
	CompleteIdentification, /*, ServiceLocator*/
	ServiceLocator
} from '@libs/platform/common';
import { DataServiceHierarchicalLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { Subscription } from 'rxjs';
import { PpsMaterialCatalogDataService } from '../material-catalog/material-catalog-data.service';
import { PpsMaterialRecordDataService } from '../material/material-record-data.service';

/**
 * Material group data service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsMaterialGroupDataService extends DataServiceHierarchicalLeaf<IMaterialGroupEntity, IMaterialCatalogEntity, CompleteIdentification<IMaterialCatalogEntity>> {
	private readonly treeDataHelper = inject(BasicsSharedTreeDataHelperService);
	private checkedGroupIds = new Set<number>();
	private subscription: Subscription[] = [];

	/**
	 * The constructor
	 */
	public constructor(private catalogService: PpsMaterialCatalogDataService) {
		const options: IDataServiceOptions<IMaterialGroupEntity> = {
			apiUrl: 'basics/materialcatalog/group',
			roleInfo: <IDataServiceChildRoleOptions<IMaterialGroupEntity, IMaterialCatalogEntity, CompleteIdentification<IMaterialCatalogEntity>>>{
				role: ServiceRole.Leaf,
				itemName: 'MaterialMaterialGroup',
				parent: catalogService,
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false,
			},
			readInfo: {
				endPoint: 'tree',
			},
		};
		super(options);
	}

	public subScribeEvents() {
		this.subscription.push(this.catalogService.onFilterChanged.subscribe((changedCatalog) => this.onCatalogCheckChanged(changedCatalog)));
	}

	public unSubScribeEvents() {
		this.subscription.forEach((sub) => sub.unsubscribe());
		this.subscription = [];
	}

	/**
	 * Get children
	 * @param element
	 */
	public override childrenOf(element: IMaterialGroupEntity): IMaterialGroupEntity[] {
		return element.ChildItems ?? [];
	}

	/**
	 * Get parent
	 * @param element
	 */
	public override parentOf(element: IMaterialGroupEntity): IMaterialGroupEntity | null {
		if (element.MaterialGroupFk === undefined) {
			return null;
		}

		const parentId = element.MaterialGroupFk;
		const foundParent = this.flatList().find((candidate) => candidate.Id === parentId);

		if (foundParent === undefined) {
			return null;
		}

		return foundParent;
	}

	protected override provideLoadPayload(): object {
		const catalog = this.catalogService.getSelectedEntity();
		return {
			mainItemId: catalog!.Id,
		};
	}

	protected override onLoadSucceeded(loaded: object): IMaterialGroupEntity[] {
		const entities = (loaded as MainDataDto<IMaterialGroupEntity>).Main;

		//TODO: need framework enhancement for the call back after the list is set into the data list.
		this.doUpdateFilter(this.treeDataHelper.flatTreeArray(entities, (e) => e.ChildItems));
		return entities;
	}

	/**
	 * Get checked group ids
	 */
	public getFilteredGroupIds(): number[] {
		//TODO: need to consider the partial check for the group node\root
		return [...this.checkedGroupIds];
	}

	/**
	 * Update checked group status
	 * @param groupIds
	 */
	public updateFilter(groupIds: Set<number>) {
		this.checkedGroupIds = new Set([...this.checkedGroupIds, ...groupIds]);

		this.doUpdateFilter(this.flatList());
	}

	private doUpdateFilter(groupList: IMaterialGroupEntity[]) {
		//reset the filter
		groupList.forEach((e) => (e.IsChecked = false));
		//update the filter
		groupList.filter((e) => this.checkedGroupIds.has(e.Id)).forEach((e) => this.updateFilterForParent(e, groupList, true));
	}

	private updateFilterForParent(group: IMaterialGroupEntity, groupList: IMaterialGroupEntity[], isChecked: boolean) {
		//TODO: need to consider the partial check for the group node\root
		group.IsChecked = isChecked;
		//Can't call this.parentOf here because this method will be also called before the data is assign to the data service.
		const parent = groupList.find((e) => e.Id === group.MaterialGroupFk);
		if (parent) {
			this.updateFilterForParent(parent, groupList, isChecked);
		}
	}

	/**
	 * React on the check state of catalog changed
	 * @param changedCatalog
	 */
	public onCatalogCheckChanged(changedCatalog: IMaterialCatalogEntity) {
		const selectedCatalog = this.catalogService.getSelectedEntity();
		if (selectedCatalog && selectedCatalog.Id !== changedCatalog.Id) {
			const listChangedSubscribe = this.listChanged$.subscribe((data) => {
				if (data.length && data[0].MaterialCatalogFk === changedCatalog.Id) {
					listChangedSubscribe.unsubscribe();
					this.catalogCheckChanged(changedCatalog);
				}
			});
		} else {
			this.catalogCheckChanged(changedCatalog);
		}
	}

	/**
	 * React on the check state of group changed
	 * @param changedGroup
	 * @param newValue
	 */
	public fireFilterChanged(changedGroup: IMaterialGroupEntity, newValue: boolean) {
		const groupFlatList = this.flatList();
		changedGroup.IsChecked = newValue;

		this.updateParentGroupsCheckStatus(changedGroup, newValue);
		this.updateChildGroupsCheckStatus(changedGroup, newValue);
		this.updateCheckGroupIds();

		this.fireGroupCheckedChangedForMaterial();
		this.fireGroupCheckedChangedForCatalog(!groupFlatList.every((e) => !e.IsChecked));

		this.entitiesUpdated(this.flatList());
	}


	/**
	 * Updates the `checkedGroupIds` set based on the `IsChecked` status of items in the flat list.
	 * By Removing the unchecked groups and adding the checked groups
	 */
	private updateCheckGroupIds() {
		const idsToRemove = new Set<number>();
		this.checkedGroupIds = new Set(
			this.flatList().reduce((acc, e) => {
				if (e.IsChecked) {
					acc.push(e.Id);
				} else {
					idsToRemove.add(e.Id);
				}
				return acc;
			}, [...this.checkedGroupIds])
		);
		this.checkedGroupIds = new Set([...this.checkedGroupIds].filter(id => !idsToRemove.has(id)));
	}

	private catalogCheckChanged(changedCatalog: IMaterialCatalogEntity) {
		const newValue = changedCatalog.IsChecked ?? false;

		this.flatList()
			.filter((e) => e.MaterialCatalogFk === changedCatalog.Id)
			.forEach((group) => {
				group.IsChecked = newValue;
			});

		this.updateCheckGroupIds();
		this.fireGroupCheckedChangedForMaterial();
		this.entitiesUpdated(this.flatList());
	}

	private fireGroupCheckedChangedForMaterial() {
		const ppsMaterialRecordDataService = ServiceLocator.injector.get(PpsMaterialRecordDataService);
		ppsMaterialRecordDataService.onGroupCheckChanged();
	}

	private fireGroupCheckedChangedForCatalog(check: boolean) {
		this.catalogService.onGroupCheckChanged(check);
	}

	private updateChildGroupsCheckStatus(group: IMaterialGroupEntity, newValue: boolean) {
		const groupFlatList = this.flatList();
		groupFlatList
			.filter((e) => e.MaterialGroupFk === group.Id)
			.forEach((child) => {
				child.IsChecked = newValue;
				this.updateChildGroupsCheckStatus(child, newValue);
			});
	}

	private updateParentGroupsCheckStatus(group: IMaterialGroupEntity, newValue: boolean) {
		const groupFlatList = this.flatList();
		const parentGroup = groupFlatList.find((e) => e.Id === group.MaterialGroupFk);

		if (parentGroup) {
			//partial check is not considered. Only uncheck parent when all children are unchecked.
			parentGroup.IsChecked = groupFlatList.some((e) => e.MaterialGroupFk === parentGroup.Id && e.IsChecked);
			this.updateParentGroupsCheckStatus(parentGroup, newValue);
		}
	}

	public override isParentFn(parentKey: IMaterialCatalogEntity, entity: IMaterialGroupEntity): boolean {
		return entity.MaterialCatalogFk === parentKey.Id;
	}
}
