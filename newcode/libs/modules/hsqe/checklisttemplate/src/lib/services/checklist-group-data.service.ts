/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { ISearchResult, ServiceLocator } from '@libs/platform/common';
import { IFilterResponse, MainDataDto } from '@libs/basics/shared';
import { CheckListGroupComplete, IHsqCheckListGroupEntity } from '@libs/hsqe/interfaces';
import { CheckListTemplateHeaderDataService } from './checklist-template-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class CheckListGroupDataService extends DataServiceHierarchicalRoot<IHsqCheckListGroupEntity, CheckListGroupComplete> {
	private checkedCheckListGroupIds = new Set<number>();

	public constructor() {
		const options: IDataServiceOptions<IHsqCheckListGroupEntity> = {
			apiUrl: 'hsqe/checklisttemplate/group',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: true,
			},
			createInfo: {
				endPoint: 'createdto',
				usePost: true,
			},
			deleteInfo: {
				endPoint: 'deletedto',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<IHsqCheckListGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'HsqCheckListGroup',
			},
		};

		super(options);
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IHsqCheckListGroupEntity> {
		const dto = new MainDataDto<IHsqCheckListGroupEntity>(loaded);
		const fr = dto.getValueAs<IFilterResponse>('FilterResult')!;

		return {
			FilterResult: {
				ExecutionInfo: fr.ExecutionInfo,
				RecordsFound: fr.RecordsFound,
				RecordsRetrieved: fr.RecordsRetrieved,
				ResultIds: fr.ResultIds,
			},
			dtos: dto.getValueAs<IHsqCheckListGroupEntity[]>('dtos')!,
		};
	}

	public override createUpdateEntity(modified: IHsqCheckListGroupEntity | null): CheckListGroupComplete {
		const complete = new CheckListGroupComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Group = modified;
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: CheckListGroupComplete): IHsqCheckListGroupEntity[] {
		if (complete.Group === null) {
			return [];
		}

		return [complete.Group];
	}

	/**
	 * Triggers when the checked state of the group item changes.
	 * @param changedGroup
	 * @param newValue
	 */
	public fireGroupCheckedChanged(changedGroup: IHsqCheckListGroupEntity, newValue: boolean) {
		changedGroup.IsChecked = newValue;
		this.checkedCheckListGroupIds.clear();
		if (changedGroup.IsChecked) {
			this.updateFilteredGroupIds(changedGroup);
		}

		const checkListTemplateHeaderDataService = ServiceLocator.injector.get(CheckListTemplateHeaderDataService);
		checkListTemplateHeaderDataService.onGroupCheckChanged(changedGroup);
	}

	/**
	 * Get filter checklist group ids
	 */
	public getFilteredGroupIds(): number[] {
		return [...this.checkedCheckListGroupIds];
	}

	/**
	 * Update filter by checked checklist group
	 * @param group
	 */
	private updateFilteredGroupIds(group: IHsqCheckListGroupEntity) {
		this.checkedCheckListGroupIds.add(group.Id);
		if (group.HasChildren) {
			const groupIds = this.collectionChildGroupItems(group);
			this.checkedCheckListGroupIds = new Set([...this.checkedCheckListGroupIds, ...groupIds]);
		}
	}

	/**
	 * Also filter by checked checklist group children items
	 * @param group
	 */
	private collectionChildGroupItems(group: IHsqCheckListGroupEntity): Set<number> {
		const groupIds = new Set<number>();

		const traverse = (currentGroup: IHsqCheckListGroupEntity) => {
			if (currentGroup?.HsqChecklistgroupChildren) {
				currentGroup.HsqChecklistgroupChildren.forEach((child: IHsqCheckListGroupEntity) => {
					groupIds.add(child.Id);
					if (child.HasChildren) {
						traverse(child);
					}
				});
			}
		};

		traverse(group);
		return groupIds;
	}

	public override childrenOf(element: IHsqCheckListGroupEntity): IHsqCheckListGroupEntity[] {
		return element.HsqChecklistgroupChildren ?? [];
	}

	public override parentOf(element: IHsqCheckListGroupEntity): IHsqCheckListGroupEntity | null {
		if (element.HsqCheckListGroupFk === undefined) {
			return null;
		}

		const parentId = element.HsqCheckListGroupFk;
		const foundParent = this.flatList().find((candidate) => candidate.Id === parentId);

		if (foundParent === undefined) {
			return null;
		}

		return foundParent;
	}
}
