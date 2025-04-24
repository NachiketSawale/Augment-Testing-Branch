/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { ConstructionSystemsSharedGlobalParameterGroupDataService, ICosGlobalParamGroupEntity, ICosHeaderEntity } from '@libs/constructionsystem/shared';
import { CompleteIdentification, ISearchResult } from '@libs/platform/common';
class GlobalParameterGroupComplete implements CompleteIdentification<ICosHeaderEntity> {}
/**
 * Global Parameter Group entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainGlobalParameterGroupDataService extends ConstructionSystemsSharedGlobalParameterGroupDataService<ICosGlobalParamGroupEntity, GlobalParameterGroupComplete> {
	protected constructor() {
		const options = {
			apiUrl: 'constructionsystem/main/instanceheaderparameter',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getglobalparamgroup',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<ICosGlobalParamGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'CosParameterGroupDto',
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};
		super(options);
		this.processor.addProcessor(this.imageHandleProcessor());
	}
	private imageHandleProcessor() {
		return {
			process: (item: ICosGlobalParamGroupEntity) => {
				if (item.HasChildren) {
					item.image = 'ico-folder-assemblies';
				}
			},
			revertProcess() {},
		};
	}
	public override createUpdateEntity(modified: ICosGlobalParamGroupEntity | null): GlobalParameterGroupComplete {
		return new GlobalParameterGroupComplete();
	}
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<ICosGlobalParamGroupEntity> {
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: [], // todo
			},
			dtos: loaded as ICosGlobalParamGroupEntity[],
		};
	}

	protected override provideLoadByFilterPayload(): object {
		return {};
	}
}
