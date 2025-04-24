import { ConcreteFieldOverload, createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { IPropertyFilterEntity } from '../../model/entities/selection-statement/property-filter-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { Injectable } from '@angular/core';
import { ConstructionSystemCommonPropertyNameLookupService, ModelPropertyKeyHeader } from '../lookup/constuction-system-common-property-name-lookup.service';
import { ConstructionSystemCommonPropertyFilterOperationLookupService, CosCommonPropertyOperation, OperationType } from '../lookup/construction-system-common-property-filter-operation-lookup.service';
import { BehaviorSubject } from 'rxjs';
import { CosCommonPropertyFilterValueType } from '../../model/enums/cos-common-property-filter-value-type.enum';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemCommonSelectionStatementPropertyFilterLayout<T extends IPropertyFilterEntity> {
	private readonly defaultValueOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<IPropertyFilterEntity>>({
		type: FieldType.Comment,
	});

	public updateDefaultValueOverload(entity?: IPropertyFilterEntity) {
		let value: ConcreteFieldOverload<IPropertyFilterEntity>;
		switch (entity?.ValueType) {
			case CosCommonPropertyFilterValueType.Decimal:
				value = {
					type: FieldType.Decimal,
				};
				break;
			case CosCommonPropertyFilterValueType.Integer:
				value = {
					type: FieldType.Integer,
				};
				break;
			case CosCommonPropertyFilterValueType.Boolean:
				value = {
					type: FieldType.Boolean,
				};
				break;
			case CosCommonPropertyFilterValueType.DateTime:
				value = {
					type: FieldType.DateTime,
				};
				break;
			default:
				value = {
					type: FieldType.Comment,
				};
				break;
		}

		this.defaultValueOverloadSubject.next(value);
	}

	public generateLayout(): ILayoutConfiguration<T> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['PropertyId', 'ValueType', 'Operation', 'PropertyValue'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.master.', {
					PropertyId: { key: 'entityPropertyName', text: 'Property Id' },
					PropertyValue: { key: 'entityValue', text: 'Value' },
				}),
				...prefixAllTranslationKeys('model.main.', {
					ValueType: { key: 'propertyValueType', text: 'Value Type' },
				}),
				...prefixAllTranslationKeys('constructionsystem.common.', {
					Operation: { key: 'filterGrid.operator', text: 'Operator' },
				}),
			},
			overloads: {
				PropertyId: {
					width: 200,
					type: FieldType.Lookup,
					lookupOptions: createLookup<T, ModelPropertyKeyHeader>({
						dataServiceToken: ConstructionSystemCommonPropertyNameLookupService,
						descriptionMember: 'Description',
					}),
					searchable: true,
				},
				ValueType: {
					width: 150,
					searchable: true,
					readonly: true,
					// formatter: 'lookup', /// todo formatter do not support yet
					// formatterOptions: {
					// 	dataServiceName: 'constructionsystemCommonPropertyValueTypeService',
					// 	displayMember: 'description'
					// },
				},
				Operation: {
					width: 120,
					searchable: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup<T, CosCommonPropertyOperation>({
						dataServiceToken: ConstructionSystemCommonPropertyFilterOperationLookupService,
						clientSideFilter: {
							execute(item: CosCommonPropertyOperation, context: ILookupContext<CosCommonPropertyOperation, IPropertyFilterEntity>): boolean {
								if (item.OpType === OperationType.Common) {
									return true;
								}
								if (context.entity?.ValueType && typeof context.entity?.ValueType === 'number') {
									const opForValueType = Math.pow(2, context.entity?.ValueType);
									return (item.OpType & opForValueType) === opForValueType;
								}
								return true;
							},
						},
					}),
				},
				PropertyValue: {
					width: 150,
					type: FieldType.Dynamic,
					overload: (ctx) => {
						this.updateDefaultValueOverload(ctx.entity);
						return this.defaultValueOverloadSubject;
					},
				},
			},
		} as ILayoutConfiguration<T>;
	}
}
