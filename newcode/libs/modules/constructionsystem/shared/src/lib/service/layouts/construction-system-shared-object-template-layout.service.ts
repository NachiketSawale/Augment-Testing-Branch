/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { ConstructionSystemSharedDimensionTypeLookupService } from '../../service/lookup/construction-system-shared-dimension-type-lookup.service';
import { ICosObjectTemplateEntityBase } from '../../model/entities/cos-object-template-entity-base.interface';
import { ConstructionSystemSharedObjectTextureLookupService } from '../lookup/construction-system-shared-object-texture-lookup.service';

/**
 * The construction system master object template layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemSharedObjectTemplateLayoutService<T extends ICosObjectTemplateEntityBase> {
	public generateLayout(): ILayoutConfiguration<T> {
		return {
			suppressHistoryGroup: false,
			groups: [
				{
					gid: 'basicData',
					title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
					attributes: ['Description', 'MdlDimensionTypeFk', 'Height', 'Offset', 'Multiplier', 'IsComposite'],
				},
				{
					gid: 'color',
					title: { key: 'constructionsystem.master.color', text: 'Color' },
					attributes: ['PositiveColor', 'MdlObjectTexturePosFk', 'NegativeColor', 'MdlObjectTextureNegFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.master.', {
					MdlDimensionTypeFk: { key: 'entityDimensionType', text: 'Dimension Type' },
					Height: { key: 'entityHeight', text: 'Height' },
					Offset: { key: 'entityOffset', text: 'Offset' },
					Multiplier: { key: 'entityMultiplier', text: 'Multiplier' },
					PositiveColor: { key: 'entityPositiveColor', text: 'Positive Color' },
					MdlObjectTexturePosFk: { key: 'entityMdlObjectTexturePos', text: 'Positive Texture' },
					NegativeColor: { key: 'entityNegativeColor', text: 'Negative Color' },
					MdlObjectTextureNegFk: { key: 'entityMdlObjectTextureNeg', text: 'Negative Texture' },
					IsComposite: { key: 'entityIsComposite', text: 'Is Composite' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Description: { key: 'entityDescription', text: 'Description' },
				}),
			},
			overloads: {
				Height: {
					type: FieldType.Decimal,
					formatterOptions: {
						decimalPlaces: 3, // not working
					},
				},
				Offset: {
					type: FieldType.Decimal,
					formatterOptions: {
						decimalPlaces: 3, // not working
					},
				},
				Multiplier: {
					type: FieldType.Decimal,
					formatterOptions: {
						decimalPlaces: 6, // not working
					},
				},
				PositiveColor: {
					formatterOptions: {
						showHashCode: false,
					},
					editOptions: {
						showHashCode: false,
					},
				},
				NegativeColor: {
					formatterOptions: {
						showHashCode: false,
					},
				},
				MdlDimensionTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemSharedDimensionTypeLookupService,
					}),
				},
				MdlObjectTexturePosFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemSharedObjectTextureLookupService,
					}),
				},
				MdlObjectTextureNegFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({ dataServiceToken: ConstructionSystemSharedObjectTextureLookupService }),
				},
			},
		} as ILayoutConfiguration<T>;
	}
}
