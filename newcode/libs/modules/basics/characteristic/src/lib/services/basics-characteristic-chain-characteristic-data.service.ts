import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ICharacteristicChainEntity, ICharacteristicEntity } from '@libs/basics/interfaces';
import { BasicsCharacteristicComplete } from '../model/basics-characteristic-complete.class';
import { BasicsCharacteristicCharacteristicDataService } from './basics-characteristic-characteristic-data.service';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicChainCharacteristicDataService extends DataServiceFlatLeaf<ICharacteristicChainEntity, ICharacteristicEntity, BasicsCharacteristicComplete> {
	public constructor(basicsCharacteristicDataService: BasicsCharacteristicCharacteristicDataService) {
		const options: IDataServiceOptions<ICharacteristicChainEntity> = {
			apiUrl: 'basics/characteristic/chain',
			roleInfo: <IDataServiceChildRoleOptions<ICharacteristicChainEntity, ICharacteristicEntity, BasicsCharacteristicComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CharacteristicChain',
				parent: basicsCharacteristicDataService,
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1 };
				},
			},
			entityActions: { createSupported: true, deleteSupported: true },
		};
		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: BasicsCharacteristicComplete, modified: ICharacteristicChainEntity[], deleted: ICharacteristicChainEntity[]) {
		if (modified && modified.length > 0) {
			parentUpdate.CharacteristicChainToSave = modified;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: BasicsCharacteristicComplete): ICharacteristicChainEntity[] {
		if (complete && complete.CharacteristicChainToSave) {
			return complete.CharacteristicChainToSave;
		}
		return [];
	}

	public override isParentFn(parentKey: ICharacteristicEntity, entity: ICharacteristicChainEntity): boolean {
		return entity.CharacteristicFk === parentKey.Id;
	}
}
