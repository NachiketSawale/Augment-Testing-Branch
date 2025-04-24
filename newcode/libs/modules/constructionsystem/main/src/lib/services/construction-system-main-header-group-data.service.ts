import { Injectable } from '@angular/core';
import { ICosGroupEntity, ICosHeaderEntity } from '@libs/constructionsystem/shared';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { CompleteIdentification, ISearchResult } from '@libs/platform/common';
import { IFilterResponse } from '@libs/basics/shared';

class GroupComplete extends CompleteIdentification<ICosHeaderEntity> {}

interface ICosMainHeaderGroupResponse {
	FilterResult: IFilterResponse;
	dtos: ICosGroupEntity[];
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainHeaderGroupDataService extends DataServiceHierarchicalRoot<ICosGroupEntity, GroupComplete> {
	public constructor() {
		const options: IDataServiceOptions<ICosGroupEntity> = {
			apiUrl: 'constructionsystem/master/group',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<ICosGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'ConstructionSystemMaster',
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};
		super(options);
		this.processor.addProcessor(this.imageHandleProcessor());
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

	public override createUpdateEntity(modified: ICosGroupEntity | null): GroupComplete {
		return new GroupComplete();
	}

	public override parentOf(element: ICosGroupEntity): ICosGroupEntity | null {
		if (element.CosGroupFk == null) {
			return null;
		}

		const parentId = element.CosGroupFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	public override childrenOf(element: ICosGroupEntity): ICosGroupEntity[] {
		return element.GroupChildren ?? [];
	}

	protected override provideLoadByFilterPayload(): object {
		return {};
	}

	protected override onLoadByFilterSucceeded(loaded: ICosMainHeaderGroupResponse): ISearchResult<ICosGroupEntity> {
		const fr = loaded.FilterResult;
		return {
			FilterResult: {
				ExecutionInfo: fr.ExecutionInfo,
				RecordsFound: fr.RecordsFound,
				RecordsRetrieved: fr.RecordsRetrieved,
				ResultIds: fr.ResultIds,
			},
			dtos: loaded.dtos,
		};
	}
}

/// todo setShowHeaderAfterSelectionChanged
/// todo filter by ratebookestimateProjectRateBookConfigDataService.initData()
/// todo clipboard
