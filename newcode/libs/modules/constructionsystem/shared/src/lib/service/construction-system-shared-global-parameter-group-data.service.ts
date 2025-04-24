/*
 * Copyright(c) RIB Software GmbH
 */
import { DataServiceHierarchicalRoot, IDataServiceOptions } from '@libs/platform/data-access';
import { ICosGlobalParamGroupEntity } from '../model/entities/cos-global-param-group-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';

/**
 * Global Parameter Group entity data service
 */
export class ConstructionSystemsSharedGlobalParameterGroupDataService<T extends ICosGlobalParamGroupEntity, U extends CompleteIdentification<T>> extends DataServiceHierarchicalRoot<ICosGlobalParamGroupEntity, U> {
	protected constructor(dataServiceOptions: object) {
		super(dataServiceOptions as IDataServiceOptions<ICosGlobalParamGroupEntity>);
		this.refreshAllLoaded();
	}

	public override childrenOf(element: ICosGlobalParamGroupEntity): ICosGlobalParamGroupEntity[] {
		return element.CosGlobalParamGroupChildren ?? [];
	}

	public override parentOf(element: ICosGlobalParamGroupEntity): ICosGlobalParamGroupEntity | null {
		if (element.CosGlobalParamGroupFk === undefined) {
			return null;
		}

		const parentId = element.CosGlobalParamGroupFk;
		const foundParent = this.flatList().find((candidate) => candidate.Id === parentId);

		if (foundParent === undefined) {
			return null;
		}

		return foundParent;
	}
	public override provideCreatePayload() {
		return {};
	}

	public override provideCreateChildPayload() {
		const selectedEntity = this.getSelectedEntity();
		if (selectedEntity) {
			return {
				CosGlobalParamGroupFk: selectedEntity.Id,
				parent: selectedEntity,
				parentId: selectedEntity.Id,
			};
		}
		throw new Error('There should be a selected parent global param group');
	}

	protected override onCreateSucceeded(created: ICosGlobalParamGroupEntity): ICosGlobalParamGroupEntity {
		return created;
	}
}
