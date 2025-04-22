/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PlatformHttpService } from '@libs/platform/common';
import {
	ConcreteFieldOverload,
	FieldType,
	TypedConcreteFieldOverload
} from '@libs/ui/common';
import { ModelPropertyValueBaseType } from '@libs/model/interfaces';

interface IValueTypeMappingItemEntity {

	Ids: number[];

	ValueType: number;
}

/**
 * Provides utilities to work with model property key value types.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationValueTypeUtilityService {

	private readonly httpSvc = inject(PlatformHttpService);

	/**
	 * Loads a mapping of model property value types (customizeable by users) and their
	 * underlying base value types (fixed).
	 *
	 * @returns A promise that is resolved to a two-way mapping.
	 */
	public async getBasicValueTypeMapping(): Promise<{
		typeToBaseType: Map<number, ModelPropertyValueBaseType>,
		baseTypeToType: Map<ModelPropertyValueBaseType, number[]>
	}> {
		const mappingItems = await this.httpSvc.get<IValueTypeMappingItemEntity[]>('basics/customize/modelvaluetype/vtmapping');

		const result = {
			typeToBaseType: new Map<number, ModelPropertyValueBaseType>(),
			baseTypeToType: new Map<ModelPropertyValueBaseType, number[]>()
		};

		for (const item of mappingItems) {
			const bvt = item.ValueType as ModelPropertyValueBaseType;
			result.baseTypeToType.set(bvt, item.Ids);
			for (const id of item.Ids) {
				result.typeToBaseType.set(id, bvt);
			}
		}

		return result;
	}

	/**
	 * Helps to generate a field overload based on a property value type ID.
	 *
	 * @returns A promise that is resolved to an object that stores a value type ID.
	 *   When the value type ID changes, an observable emits a suitable field overload.
	 */
	public async generatePropertyValueFieldOverload<T extends object>(): Promise<{
		valueTypeId: number
		readonly valueOverload: Observable<ConcreteFieldOverload<T>>
	}> {
		const typeMapping = await this.getBasicValueTypeMapping();

		const overload = new Subject<ConcreteFieldOverload<T>>();
		let currentId = 0;

		return {
			get valueTypeId(): number {
				return currentId;
			},
			set valueTypeId(value: number) {
				if (currentId !== value) {
					currentId = value;
					const baseValueTypeId = typeMapping.typeToBaseType.get(value);
					const fieldOverload = ModelAdministrationValueTypeUtilityService.generateFieldOverloadForType<T>(baseValueTypeId);
					if (fieldOverload) {
						overload.next(fieldOverload);
					}
				}
			},
			valueOverload: overload
		};
	}

	private static generateFieldOverloadForType<T extends object>(bvt?: ModelPropertyValueBaseType): TypedConcreteFieldOverload<T> | null {
		switch (bvt) {
			case ModelPropertyValueBaseType.Boolean:
				return {
					type: FieldType.Boolean
				};
			case ModelPropertyValueBaseType.Text:
				return {
					type: FieldType.Remark
				};
			case ModelPropertyValueBaseType.Integer:
				return {
					type: FieldType.Integer
				};
			case ModelPropertyValueBaseType.Float:
				return {
					type: FieldType.Decimal
				};
			case ModelPropertyValueBaseType.Date:
				return {
					type: FieldType.DateUtc
				};
			default:
				return null;
		}
	}
}
