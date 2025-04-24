/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConcreteFieldOverload, createLookup, FieldOverloadSpec, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IEntityContext, IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { CosObjectTemplatePropertyEntityBase, PropertyValueType } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterUomLookupService } from '../lookup/construction-system-master-uom-lookup.service';
import { PropertyFormulaComponent } from '../../components/property-formula/property-formula.component';

/**
 * The construction system master object template property layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterObjectTemplatePropertyLayoutService<T extends CosObjectTemplatePropertyEntityBase> {
	private defaultValueOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<T>>({
		type: FieldType.Description,
	});

	public async generateLayout(ctx: IInitializationContext): Promise<ILayoutConfiguration<T>> {
		const pkLookupProvider = await ctx.lazyInjector.inject(PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					gid: 'basicData',
					title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
					attributes: ['MdlPropertyKeyFk', 'BasUomFk', 'Formula', 'Value'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.master.', {
					MdlPropertyKeyFk: { key: 'entityProperty', text: 'Property' },
					BasUomFk: { key: 'entityUomFk', text: 'UoM' },
					Formula: { key: 'entityFormula', text: 'Formula' },
					Value: { key: 'entityValue', text: 'Value' },
				}),
			},
			overloads: {
				MdlPropertyKeyFk: { ...pkLookupProvider.generatePropertyKeyLookup({ showClearButton: false }), ...{ required: true } },
				Formula: {
					type: FieldType.CustomComponent,
					componentType: PropertyFormulaComponent,
				},
				BasUomFk: this.createBasUomFkOverload(),
			} as { [key in keyof Partial<T>]: FieldOverloadSpec<T> },
			transientFields: [
				{
					id: 'Value',
					readonly: false,
					model: 'Value',
					type: FieldType.Dynamic,
					overload: (ctx) => {
						this.updateDefaultValueOverload(ctx);
						return this.defaultValueOverloadSubject;
					},
				},
			],
		};
	}

	public updateDefaultValueOverload(ctx: IEntityContext<T>) {
		let value: ConcreteFieldOverload<T>;

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
				value = {
					type: FieldType.Decimal,
				};
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

	private createBasUomFkOverload() {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ConstructionSystemMasterUomLookupService,
				showClearButton: true,
			}),
			additionalFields: [
				{
					id: 'uomText',
					displayMember: 'DescriptionInfo.Translated',
					label: {
						key: 'constructionsystem.master.entityUomText',
						text: 'Contract Description',
					},
					column: true,
					singleRow: true,
				},
			],
		} as FieldOverloadSpec<T>;
	}
}
