import { IIdentificationData } from '@libs/platform/common';
import { IIdentificationDataConverter } from '../interface/identification-data-converter.interface';

/**
 * Implementation of  IIdentificationDataConverterInterface for simple case of ID column
 * @typeParam T - entity type handled by the data service
 */
export class SimpleIdIdentificationDataConverter<T> implements IIdentificationDataConverter<T> {

	/**
	 * convert
	 * @param entity
	 */
	public convert(entity: T, isParentEntity?: boolean): IIdentificationData | null {

		if (entity === null || entity === undefined) {
			return null;
		}

		type EntityKey = keyof typeof entity;
		let identificationData: IIdentificationData | null = { id: 0 };

		if (isParentEntity === undefined) {
			identificationData = { id: 0, pKey1: entity['Id' as EntityKey] as number };
		}

		if (typeof isParentEntity === 'boolean' && isParentEntity) {
			identificationData = { id: entity['Id' as EntityKey] as number };
		}

		return identificationData;
	}

	/**
	 * convertWithKey
	 * @param entity
	 * @param key
	 */
	public convertWithKey(entity: T, key: string): IIdentificationData | null {
		type EntityKey = keyof typeof entity;
		return entity !== null && entity !== undefined && entity[key as EntityKey] as number ? { id: 0, pKey1: entity[key as EntityKey] as number } : null;
	}
}