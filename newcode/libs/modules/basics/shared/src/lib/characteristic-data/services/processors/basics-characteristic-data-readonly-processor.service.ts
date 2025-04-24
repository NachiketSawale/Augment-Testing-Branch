/*
 * Copyright(c) RIB Software GmbH
 */
import {IEntityProcessor, IReadOnlyField} from '@libs/platform/data-access';
import { ICharacteristicDataEntity } from '@libs/basics/interfaces';
import { CompleteIdentification, IEntityIdentification, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedCharacteristicDataService } from '../basics-shared-characteristic-data.service';
import { BasicsSharedCharacteristicTypeHelperService } from '../../../services/basics-shared-characteristic-type-helper.service';

/**
 * Basics characteristic data entity readonly processor
 */
export class BasicsCharacteristicDataReadonlyProcessor<T extends ICharacteristicDataEntity,
	PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> implements IEntityProcessor<T> {

	private characteristicTypeHelperService = 	ServiceLocator.injector.get(BasicsSharedCharacteristicTypeHelperService);



	/**
	 *The constructor
	 */
	public constructor(protected dataService: BasicsSharedCharacteristicDataService<T, PT, PU>) {
	}

	/**
	 * Process characteristic data readonly logic
	 * @param item
	 */
	public process(item: T) {
		const readonlyFields: IReadOnlyField<T>[] = [
			{field: 'ValueText', readOnly: item.IsReadonly},
			{field: 'CharacteristicFk', readOnly: item.Version > 0}
		];

		this.dataService.setEntityReadOnlyFields(item, readonlyFields);

		if (this.characteristicTypeHelperService.isLookupType(item.CharacteristicTypeFk)) {
			item.ValueText = Number(item.ValueText);
		}
		 this.dataService.setEntityToReadonlyIfRootEntityIs(item);
		 //update description
		if(item.CharacteristicEntity) {
			item.Description = item.CharacteristicEntity.DescriptionInfo?.Description;
		}

	}

	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item: T) {
	}
}
