/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { CheckListGroupComplete, IHsqCheckListGroupEntity } from '@libs/hsqe/interfaces';
import { Injectable } from '@angular/core';
import { IFilterResponse, MainDataDto } from '@libs/basics/shared';
import { ISearchResult } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class CheckListGroupTemplateDataService extends DataServiceHierarchicalRoot<IHsqCheckListGroupEntity, CheckListGroupComplete> {

	public constructor() {
		const options: IDataServiceOptions<IHsqCheckListGroupEntity> = {
			apiUrl: 'hsqe/checklisttemplate/group',
			roleInfo: <IDataServiceRoleOptions<IHsqCheckListGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'HsqCheckListGroup',
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};
		super(options);
		this.processor.addProcessor(this.imageHandleProcessor());
		this.refreshAll().then();
	}

	private imageHandleProcessor() {
		return {
			process: (item: IHsqCheckListGroupEntity) => {
				if (item.HasChildren) {
					item.image = 'ico-folder-assemblies';
				}
			},
			revertProcess() {},
		};
	}

	/**
	 * Get children
	 * @param element
	 */
	public override childrenOf(element: IHsqCheckListGroupEntity): IHsqCheckListGroupEntity[] {
		return element.HsqChecklistgroupChildren ?? [];
	}

	/**
	 * Get parent
	 * @param element
	 */
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
		return new CheckListGroupComplete();
	}
}
