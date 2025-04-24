/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration, createLookup } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { EstimateProjectEstTypeLookupService } from '@libs/basics/shared';
import { IEstimateCompositeEntity } from '@libs/estimate/shared';

/**
 * The layout service for contract entity container
 */
@Injectable({ providedIn: 'root' })

/**
 * Estimate Project Header Layout Service
 */
export class EstimateProjectHeaderLayoutService {
	public async generateLayout(): Promise<ILayoutConfiguration<IEstimateCompositeEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					attributes: [],
					additionalAttributes: [
						'EstHeader.Code',
						'EstHeader.EstTypeFk',
						'EstHeader.EstStatusFk',
						'EstHeader.DescriptionInfo.Description',
						'EstHeader.RubricCategoryFk',
						'EstHeader.LgmJobFk',
						'EstHeader.IsActive',
						'EstHeader.IsControlling',
						'EstHeader.Currency1Fk',
						'EstHeader.Currency2Fk',
						'EstHeader.Hint',
						'EstHeader.LevelFk',
						'EstHeader.PsdActivityFk',
						'EstHeader.Duration',
						'EstHeader.VersionNo',
						'EstHeader.VersionDescription',
						'EstHeader.VersionComment'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'EstHeader.EstStatusFk': { key: 'entityStatus', text: 'EstStatusFk' },
					'EstHeader.Code': { key: 'entityCode', text: 'Code' },
					'EstHeader.DescriptionInfo.Description': { key: 'entityDescription', text: 'DescriptionInfo' },
					'EstHeader.RubricCategoryFk': { key: 'entityBasRubricCategoryFk', text: 'RubricCategoryFk Date' }
				}),

				...prefixAllTranslationKeys('estimate.main.', {
					'EstHeader.EstTypeFk': { key: 'estType', text: 'EstTypeFk' },
					'EstHeader.Currency1Fk': { key: 'currency1Fk', text: 'Currency1Fk' },
					'EstHeader.Currency2Fk': { key: 'currency2Fk', text: 'Currency2Fk' },
					'EstHeader.Hint': { key: 'hint', text: 'Hint' },
					'EstHeader.LevelFk': { key: 'levelfk', text: 'LevelFk' },
					'EstHeader.Duration': { key: 'duration', text: 'Duration' },
					'EstHeader.PsdActivityFk': { key: 'psdActivityFk', text: 'PsdActivityFka' }
				}),

				...prefixAllTranslationKeys('estimate.project.', {
					'EstHeader.LgmJobFk': { key: 'lgmJobFk', text: 'LgmJobFk' },
					'EstHeader.IsControlling': { key: 'isControlling', text: 'IsControlling' },
					'EstHeader.VersionNo': { key: 'versionNo', text: 'VersionNo' },
					'EstHeader.VersionDescription': { key: 'versionDesc', text: 'VersionDescription' },
					'EstHeader.VersionComment': { key: 'versionComment', text: 'VersionComment' }
				}),
				...prefixAllTranslationKeys('project.main.', {
					'EstHeader.IsActive': { key: 'entityIsActive', text: 'IsActive' }
				}),
			},
			additionalOverloads: {
				'EstHeader.EstTypeFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateProjectEstTypeLookupService
					}),
				},
			},
		};
	}
}
