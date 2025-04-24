/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { ConstructionSystemSharedDimensionTypeLookupService, ConstructionSystemSharedObjectTextureLookupService, ICosInsObjectTemplateEntity } from '@libs/constructionsystem/shared';
import { BasicsShareControllingUnitLookupService } from '@libs/basics/shared';
import { ProjectLocationLookupService } from '@libs/project/shared';
import { ConstructionSystemMainInstanceDataService } from '../construction-system-main-instance-data.service';

/**
 * The construction system main object template layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainObjectTemplateLayoutService {
	private readonly dataService = inject(ConstructionSystemMainInstanceDataService);

	public generateLayout(): ILayoutConfiguration<ICosInsObjectTemplateEntity> {
		const projectId = this.dataService.getCurrentSelectedProjectId();
		return {
			suppressHistoryGroup: true,
			groups: [
				{
					gid: 'basicData',
					title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
					attributes: ['Description', 'IsComposite', 'MdlDimensionTypeFk', 'Height', 'Offset', 'Multiplier', 'PrjLocationFk', 'MdcControllingUnitFk'],
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
					MdcControllingUnitFk: { key: 'entityControllingUnit', text: 'Controlling Unit' },
				}),
				...prefixAllTranslationKeys('model.main.', {
					PrjLocationFk: { key: 'entityLocation', text: 'Location' },
				}),
			},
			overloads: {
				Height: {
					type: FieldType.Decimal,
					formatterOptions: {
						decimalPlaces: 3,
					},
				},
				Offset: {
					type: FieldType.Decimal,
					formatterOptions: {
						decimalPlaces: 3,
					},
				},
				Multiplier: {
					type: FieldType.Decimal,
					formatterOptions: {
						decimalPlaces: 6,
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
				MdcControllingUnitFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsShareControllingUnitLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
						serverSideFilter: {
							key: 'basics.masterdata.controllingunit.filterkey',
							execute() {
								return {
									ProjectFk: projectId,
								};
							},
						},
					}),
				},
				PrjLocationFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectLocationLookupService,
						showClearButton: true,
						serverSideFilter: {
							key: '',
							execute() {
								return {
									ProjectId: projectId,
								};
							},
						},
					}),
				},
			},
		};
	}
}
