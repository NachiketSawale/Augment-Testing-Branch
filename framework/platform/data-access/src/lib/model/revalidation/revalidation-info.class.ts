import { ValidationInfo } from '../validation/validation-info.class';
import { IEntityIdentification, PropertyType } from '@libs/platform/common';

export class RevalidationInfo<T extends object> extends ValidationInfo<T>{
	/**
	 * @param entity the entity to validate
	 * @param value the value of the field for validation
	 * @param field the name of the field where the value is applied when
	 * @param entities all client side loaded entities of that container
	 * which is validated on
	 */
	public constructor(entity: T, value: PropertyType | undefined, field: string, public readonly entities: T[]) {
		super(entity, value, field);
	}
	/**
	 * create out of an existing ValidationInfo and entites a RevalidationInfo
	 * @param info that is comming from
	 * @param entities all client side loaded entities of coresponding container
	 * which is validated on
	 */
	public static NewRevalidationInfo<T extends object  & IEntityIdentification>(info: ValidationInfo<T>, entities: T[]){
		return new RevalidationInfo(info.entity, info.value, info.field, entities);
	}
}