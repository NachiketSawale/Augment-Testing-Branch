/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import {
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedSiteLookupService
} from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IPpsPhaseEntity } from '../../../model/process-configuration/pps-phase-entity.interface';
import { DATESHIFT_MODES_TOKEN } from '../../../constants/DateShiftModes';

/**
 * PPS Phase layout service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsPhaseLayoutService {
	private dateShiftModes = inject(DATESHIFT_MODES_TOKEN);

	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<IPpsPhaseEntity> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['PpsFormworkFk', 'PpsProductFk', 'PpsPhaseTypeFk', 'ActualStart', 'ActualFinish', 'PlannedStart', 'PlannedFinish', 'EarliestStart', 'LatestStart', 'EarliestFinish', 'LatestFinish', 'IsLockedStart', 'IsLockedFinish']
				},
				{
					gid: 'secondaryPhase',
					attributes: ['DateshiftMode']
				},
				{
					gid: 'location',
					attributes: ['BasSiteFk', 'PpsProductionPlaceFk']
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					baseGroup: { key: 'entityProperties', text: '*Basic Data' },
				}),

				...prefixAllTranslationKeys('productionplanning.common.', {
					PpsProductFk: { key: 'product.entity' },
					PlannedStart: { key: 'event.plannedStart' },
					PlannedFinish: { key: 'event.plannedFinish' },
					EarliestStart: { key: 'event.earliestStart' },
					LatestStart: { key: 'event.latestStart' },
					EarliestFinish: { key: 'event.earliestFinish' },
					LatestFinish: { key: 'event.latestFinish' },
					ActualStart: { key: 'event.actualStart' },
					ActualFinish: { key: 'event.actualFinish' },
					DateshiftMode: { key: 'event.dateshiftMode' },
					BasSiteFk: { key: 'header.basSiteFk' },

				}),
				...prefixAllTranslationKeys('productionplanning.processconfiguration.', {
					secondaryPhase: { key: 'secondaryPhase' },
					location: { key: 'location' },
					PpsPhaseTypeFk: { key: 'phaseTemplate.phaseType' },
					IsLockedStart: { key: 'phase.Islockedstart' },
					IsLockedFinish: { key: 'phase.Islockedfinish' },
					PpsProductionPlaceFk: { key: 'phase.PpsProdPlaceFk' },
				}),
				...prefixAllTranslationKeys('productionplanning.formwork.', {
					PpsFormworkFk: { key: 'entityFormwork' },
				}),
			},
			overloads: {
				PpsFormworkFk: {

				},
				PpsProductFk: {
					//todo: wait productionplanning finished: productionplanning-common-product-lookup-new
				},
				PpsPhaseTypeFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsPhaseTypeLookupOverload(false),
				DateshiftMode: {
					type: FieldType.Select,
					itemsSource: {
						items: this.dateShiftModes
					}
				},
				BasSiteFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedSiteLookupService,
						// clientSideFilter: {
						// 	execute(item: IBasicsCustomizeSiteEntity, context: ILookupContext<IBasicsCustomizeSiteEntity, IBasicsCustomizeSiteEntity>): boolean {
						// 		if (item) {
						// 			return (item as any).SiteTypeFk === 8; // Production Area
						// 		}
						// 		return false;
						// 	},
						// }
					})
				},
			}
		};
	}
}
