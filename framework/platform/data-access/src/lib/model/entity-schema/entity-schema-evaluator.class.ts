import { IEntityBase } from '@libs/platform/common';
import { IEntitySchema } from './entity-schema.interface';
import { IEntitySchemaProperty } from './entity-schema-property.interface';
import { EntityDomainType } from './entity-domain-type.enum';


export interface ISchemaProperty< T extends IEntityBase > {
	name: keyof T;
	property: IEntitySchemaProperty;
}

/**
 * Class providing functions for evaluation of entity schemes
 */
export class EntitySchemaEvaluator {

	public static EvaluateMandatoryFields<T extends IEntityBase>(entitySchema: IEntitySchema<T>): ISchemaProperty<T>[]{
		const fields = [] as ISchemaProperty<T>[];
		for(const prop in entitySchema.properties){
			const fieldInfo = entitySchema.properties[prop];
			if(fieldInfo.mandatory){
				fields.push({
					name: prop,
					property: fieldInfo
				});
			}
		}
		return fields;
	}

	public static EvaluateDateFields<T extends IEntityBase>(entitySchema: IEntitySchema<T>): ISchemaProperty<T>[]{
		const fields = [] as ISchemaProperty<T>[];
		for(const prop in entitySchema.properties){
			const fieldInfo = entitySchema.properties[prop];
			if(this.domainIsDate(fieldInfo.domain)) {
				fields.push({
					name: prop,
					property: fieldInfo
				});
			}
		}
		return fields;
	}

	private static domainIsDate(domain: string): boolean {
		let res = false;

		switch(domain) {
			case EntityDomainType.DateUtc: res = true; break;
			case EntityDomainType.Date: res = true; break;
			case EntityDomainType.DateTime: res = true; break;
			case EntityDomainType.DateTimeUtc: res = true; break;
		}
		return res;
	}

	public static EvaluateTimeFields<T extends IEntityBase>(entitySchema: IEntitySchema<T>): ISchemaProperty<T>[]{
		const fields = [] as ISchemaProperty<T>[];
		for(const prop in entitySchema.properties){
			const fieldInfo = entitySchema.properties[prop];
			if(fieldInfo.domain === EntityDomainType.Time){
				fields.push({
					name: prop,
					property: fieldInfo
				});
			}
		}
		return fields;
	}

	public static EvaluateDateAndTimeFields<T extends IEntityBase>(entitySchema: IEntitySchema<T>): ISchemaProperty<T>[]{
		const fields = this.EvaluateDateFields(entitySchema);
		fields.push(... this.EvaluateTimeFields(entitySchema));

		return fields;
	}
}