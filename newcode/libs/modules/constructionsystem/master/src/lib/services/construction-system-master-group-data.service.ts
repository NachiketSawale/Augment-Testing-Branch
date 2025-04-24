/*
 * Copyright(c) RIB Software GmbH
 */

import { minBy, includes } from 'lodash';
import { inject, Injectable } from '@angular/core';

import { ISearchResult, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedNewEntityValidationProcessorFactory, IFilterResponse, MainDataDto } from '@libs/basics/shared';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole, IDataServiceOptions } from '@libs/platform/data-access';
import { ICosGroupEntity, CosGroupComplete } from '../model/models';
import { ConstructionSystemMasterHeaderDataService } from './construction-system-master-header-data.service';
import { ConstructionSystemMasterGroupValidationService } from './validations/construction-system-master-group-validation.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterGroupDataService extends DataServiceHierarchicalRoot<ICosGroupEntity, CosGroupComplete> {
	private checkedCosGroupIds = new Set<number>();

	public constructor() {
		const options: IDataServiceOptions<ICosGroupEntity> = {
			apiUrl: 'constructionsystem/master/group',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: true,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<ICosGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'CosGroup',
			},
		};

		super(options);
		this.processor.addProcessor([this.imageHandleProcessor(), this.provideNewEntityValidationProcessor()]);
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<ICosGroupEntity> {
		// todo-allen: update it after the SelectionMode button available.
		const filterIds = this.getFilteredGroupIds();
		const multiSelect = false; // todo-allen: how to get the state of the SelectionMode toolbar button?
		if (filterIds.length > 0) {
			const filterItem = this.flatList().filter((item) => {
				return multiSelect ? includes(filterIds, item.Id) : item.Id === filterIds[0];
			});

			if (filterItem.length > 0) {
				filterItem.forEach((item) => {
					item.IsChecked = true;
				});
				//todo this function isn't enhanced at framework
				// platformGridAPI.rows.scrollIntoViewByItem(gridId, filterItem[0]);
				this.select(filterItem[0]).then();
			}
		}
		// todo-allen: constructionSystemMainInstanceService.onContextUpdated is not ready.
		// const cosMainInstanceDataService = ServiceLocator.injector.get(ConstructionSystemMainInstanceDataService);
		// setTimeout(() => {
		// 	constructionSystemMainInstanceService.onContextUpdated.fire();
		// });

		const dto = new MainDataDto<ICosGroupEntity>(loaded);
		const fr = dto.getValueAs<IFilterResponse>('FilterResult') as IFilterResponse;
		return {
			FilterResult: {
				ExecutionInfo: fr.ExecutionInfo,
				RecordsFound: fr.RecordsFound,
				RecordsRetrieved: fr.RecordsRetrieved,
				ResultIds: fr.ResultIds,
			},
			dtos: dto.getValueAs<ICosGroupEntity[]>('dtos') as ICosGroupEntity[],
		};
	}

	public override createUpdateEntity(modified: ICosGroupEntity | null): CosGroupComplete {
		const complete = new CosGroupComplete();
		if (modified !== null) {
			complete.CosGroup = modified;
			complete.MainItemId = modified.Id;
			complete.EntitiesCount += 1;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: CosGroupComplete): ICosGroupEntity[] {
		return complete.CosGroup ? [complete.CosGroup] : [];
	}

	protected override provideCreatePayload(): object {
		return { parent: null, parentId: null, CosGroupFk: null };
	}

	protected override provideCreateChildPayload() {
		const selectedEntity = this.getSelectedEntity();
		return { parent: selectedEntity, parentId: selectedEntity?.Id, CosGroupFk: selectedEntity?.CosGroupFk };
	}

	public override onCreateSucceeded(created: object) {
		return created as ICosGroupEntity;
	}

	public override childrenOf(element: ICosGroupEntity): ICosGroupEntity[] {
		return element.GroupChildren ?? [];
	}

	public override parentOf(element: ICosGroupEntity): ICosGroupEntity | null {
		if (!element.CosGroupFk) {
			return null;
		}
		const parentId = element.CosGroupFk;
		const foundParent = this.flatList().find((candidate) => candidate.Id === parentId);
		if (foundParent === undefined) {
			return null;
		}
		return foundParent;
	}

	private imageHandleProcessor() {
		return {
			process: (item: ICosGroupEntity) => {
				if (item.HasChildren) {
					item.image = 'ico-folder-assemblies';
				}
			},
			revertProcess() {},
		};
	}

	private provideNewEntityValidationProcessor() {
		const newEntityValidationProcessorFactory = inject(BasicsSharedNewEntityValidationProcessorFactory);
		return newEntityValidationProcessorFactory.createProcessor(ConstructionSystemMasterGroupValidationService, { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosGroupDto' });
	}

	/**
	 * Get filter cos master group ids
	 */
	public getFilteredGroupIds(): number[] {
		return [...this.checkedCosGroupIds];
	}

	/**
	 * Triggers when the checked state of the group item changes.
	 * @param cosGroup
	 * @param newValue
	 */
	public fireGroupCheckedChanged(cosGroup: ICosGroupEntity, newValue: boolean) {
		// todo-allen: Because the Filter field does not support multi-selection mode, the following old code was commented out.
		//  The following bug exists (Wait the framework to fix it):
		//    1. In single-selection mode, when selecting the Filter field of a new entity,
		//       the value of the Filter field for the old entity is not updated.
		//    2. When the Filter field of an entity is selected for the first time,
		//       it triggers the update method of group container, causing the group container UI to refresh.
		//       This will cause the selected filter to become unselected,
		//       and sometimes the selected filter will revert to the previously selected filter.

		// const checkedCosGroups = this.flatList().filter((value) => value.IsChecked);
		//
		// if (newValue) {
		// 	checkedCosGroups.push(cosGroup);
		// }
		//
		// if (checkedCosGroups.length > 0) {
		// 	this.clearFilteredGroupIds();
		// 	this.updateFilteredGroupIds(checkedCosGroups);
		//
		// 	const cosHeaderDataService = ServiceLocator.injector.get(ConstructionSystemMasterHeaderDataService);
		// 	cosHeaderDataService.refreshAll().then();
		// }

		cosGroup.IsChecked = newValue;
		this.clearFilteredGroupIds();
		if (cosGroup.IsChecked) {
			this.updateFilteredGroupIds([cosGroup]);

			const cosHeaderDataService = ServiceLocator.injector.get(ConstructionSystemMasterHeaderDataService);
			cosHeaderDataService.refreshAll().then();
		}
	}

	/**
	 * Update filter by checked cos master group
	 * @param groups
	 */
	private updateFilteredGroupIds(groups: ICosGroupEntity[]) {
		for (const group of groups) {
			this.checkedCosGroupIds.add(group.Id);
			if (group.HasChildren) {
				const groupIds = this.collectionChildGroupItems(group);
				this.checkedCosGroupIds = new Set([...this.checkedCosGroupIds, ...groupIds]);
			}
		}
	}

	public clearFilteredGroupIds() {
		this.checkedCosGroupIds.clear();
	}

	/**
	 * Also filter by checked cos master group children items
	 * @param group
	 */
	private collectionChildGroupItems(group: ICosGroupEntity): Set<number> {
		const groupIds = new Set<number>();

		const traverse = (currentGroup: ICosGroupEntity) => {
			if (currentGroup?.GroupChildren) {
				currentGroup.GroupChildren.forEach((child: ICosGroupEntity) => {
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

	public getDefaultGroup() {
		let defaultGroup = this.getList().find((item) => item.IsDefault === true);
		if (!defaultGroup) {
			defaultGroup = minBy(this.getList(), 'Id');
		}
		return defaultGroup;
	}
}
