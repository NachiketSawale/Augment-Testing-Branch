/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContext, PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { ConcreteFieldOverload, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { PropertyValueType, ICosInsObjectTemplatePropertyEntity } from '@libs/constructionsystem/shared';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { BehaviorSubject } from 'rxjs';
import { PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';

/**
 * The construction system main object template property layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainObjectTemplatePropertyLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private defaultValueOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<ICosInsObjectTemplatePropertyEntity>>({
		type: FieldType.Description,
	});

	public async generateLayout(): Promise<ILayoutConfiguration<ICosInsObjectTemplatePropertyEntity>> {
		const pkLookupProvider = await this.lazyInjector.inject(PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN);

		return {
			suppressHistoryGroup: true,
			groups: [
				{
					gid: 'basicData',
					title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
					attributes: ['Value', 'BasUomFk', 'Formula', 'MdlPropertyKeyFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.master.', {
					Value: { key: 'entityValue', text: 'Value' },
					BasUomFk: { key: 'entityUomFk', text: 'UoM' },
					Formula: { key: 'entityFormula', text: 'Formula' },
					MdlPropertyKeyFk: { key: 'entityProperty', text: 'Property' },
				}),
			},
			overloads: {
				Value: {
					type: FieldType.Dynamic,
					overload: (ctx) => {
						this.updateDefaultValueOverload(ctx);
						return this.defaultValueOverloadSubject;
					},
				},
				BasUomFk: {
					...BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
					...{
						additionalFields: [
							{
								id: 'uomText',
								displayMember: 'DescriptionInfo.Translated',
								label: {
									key: 'constructionsystem.master.entityUomText',
									text: 'UoM Description',
								},
								column: true,
								singleRow: true,
							},
						],
					},
				},
				Formula: {
					//TODO: Formula overloads
				},
				MdlPropertyKeyFk: pkLookupProvider.generatePropertyKeyLookup({ showClearButton: true }),
			},
		};
	}

	public updateDefaultValueOverload(ctx: IEntityContext<ICosInsObjectTemplatePropertyEntity>) {
		let value: ConcreteFieldOverload<ICosInsObjectTemplatePropertyEntity>;

		if (ctx?.entity === undefined || ctx.entity === null) {
			value = { type: FieldType.Description };
			this.defaultValueOverloadSubject.next(value);
		}

		switch (ctx.entity?.ValueType) {
			case PropertyValueType.Text:
				value = { type: FieldType.Remark };
				ctx.entity.Value = ctx.entity.PropertyValueText;
				break;
			case PropertyValueType.Decimal:
				value = { type: FieldType.Decimal };
				ctx.entity.Value = ctx.entity.PropertyValueNumber;
				break;
			case PropertyValueType.Long:
				value = { type: FieldType.Integer };
				ctx.entity.Value = ctx.entity.PropertyValueLong;
				break;
			case PropertyValueType.Boolean:
				value = { type: FieldType.Boolean };
				ctx.entity.Value = ctx.entity.PropertyValueBool;
				break;
			case PropertyValueType.Date:
				value = { type: FieldType.DateUtc };
				ctx.entity.Value = ctx.entity.PropertyValueDate;
				break;
			default:
				value = { type: FieldType.Description };
				if (ctx.entity) {
					ctx.entity.Value = null;
				}
		}
		this.defaultValueOverloadSubject.next(value);
	}
}
