/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { DataServiceHierarchicalRoot, EntityArrayProcessor, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { ISearchResult } from '@libs/platform/common';
import { IFilterResponse } from '@libs/basics/shared';
import { BasicsCharacteristicGroupComplete } from '../model/basics-characteristic-group-complete.class';
import { ICharacteristicGroupEntity } from '@libs/basics/interfaces';

interface ICharacteristicGroupLoadedEntity {
	CharacteristicGroup: ICharacteristicGroupEntity[];
	FilterResult: IFilterResponse;
}

/**
 * characteristic group entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicGroupDataService extends DataServiceHierarchicalRoot<ICharacteristicGroupEntity, BasicsCharacteristicGroupComplete> {
	public constructor() {
		const options: IDataServiceOptions<ICharacteristicGroupEntity> = {
			apiUrl: 'basics/characteristic/group',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'treefiltered',
				usePost: true,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete', //'delete',
			},
			roleInfo: <IDataServiceRoleOptions<ICharacteristicGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'Group',
			},
			entityActions: { createSupported: true, deleteSupported: true },
			processors: [new EntityArrayProcessor<ICharacteristicGroupEntity>(['Groups'])], //todo
		};

		super(options);
	}

	protected override onLoadByFilterSucceeded(loaded: ICharacteristicGroupLoadedEntity): ISearchResult<ICharacteristicGroupEntity> {
		const fr = loaded.FilterResult;
		return {
			FilterResult: {
				ExecutionInfo: fr.ExecutionInfo,
				RecordsFound: fr.RecordsFound,
				RecordsRetrieved: fr.RecordsRetrieved,
				ResultIds: fr.ResultIds,
			},
			dtos: loaded.CharacteristicGroup,
		};
	}

	public override createUpdateEntity(modified: ICharacteristicGroupEntity | null): BasicsCharacteristicGroupComplete {
		const complete = new BasicsCharacteristicGroupComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Group = modified;
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: BasicsCharacteristicGroupComplete): ICharacteristicGroupEntity[] {
		if (complete.Group === null) {
			return [];
		}

		return [complete.Group];
	}

	protected override checkCreateIsAllowed(entities: ICharacteristicGroupEntity[] | ICharacteristicGroupEntity | null): boolean {
		return entities !== null;
	}

	public override childrenOf(element: ICharacteristicGroupEntity): ICharacteristicGroupEntity[] {
		return element.Groups ?? [];
	}

	public override parentOf(element: ICharacteristicGroupEntity): ICharacteristicGroupEntity | null {
		if (element.CharacteristicGroupFk === undefined) {
			return null;
		}

		const parentId = element.CharacteristicGroupFk;
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
				GroupId: selectedEntity?.Id,
			};
		}
		throw new Error('There should be a selected parent Characteristic Group');
	}

	protected override onCreateSucceeded(created: ICharacteristicGroupEntity): ICharacteristicGroupEntity {
		return created;
	}
	//todo: update function does not work well.
}
