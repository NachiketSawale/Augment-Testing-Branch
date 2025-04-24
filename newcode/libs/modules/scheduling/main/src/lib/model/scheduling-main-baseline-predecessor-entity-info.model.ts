/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IActivityRelationshipEntity } from '@libs/scheduling/interfaces';
import { SchedulingActivityLookupProviderService } from '../services/scheduling-activity-lookup-provider.service';
import { ILayoutConfiguration } from '@libs/ui/common';
import { SchedulingMainBaselinePredecessorRelationshipDataService } from '../services/scheduling-main-baseline-predecessor-relationship-data.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

export const SCHEDULING_MAIN_BASELINE_PREDECESSOR_ENTITY_INFO: EntityInfo = EntityInfo.create<IActivityRelationshipEntity> ({
	grid: {
		title: {key: 'scheduling.main' + '.baselinePredessorListTitle'},
		containerUuid: 'bd8f59c0ce154eb0a91d979ff62f28af'
	},
	form: {
		title: { key: 'scheduling.main' + '.baselinePredessorDetailTitle' },
		containerUuid: '97e74a25f2ad4b04beabd1ecda860c80'
	},
	dataService: ctx => ctx.injector.get(SchedulingMainBaselinePredecessorRelationshipDataService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Main', typeName: 'ActivityRelationshipDto'},
	permissionUuid: 'e4a4e97657ef4068bdf1367afca01375',
	layoutConfiguration:async ctx=> {
		const activityLookupProvider = ctx.injector.get(SchedulingActivityLookupProviderService);
		return <ILayoutConfiguration<IActivityRelationshipEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['RelationKindFk', 'PredecessorActivityFk', 'PredecessorDesc', 'PredecessorProjectNo', 'PredecessorProjectName', 'PredecessorSchedule', 'FixLagPercent', 'FixLagTime', 'VarLagPercent', 'VarLagTime', 'UseCalendar']
				}
			],
			overloads: {
				PredecessorActivityFk: activityLookupProvider.generateActivityLookup({
					readonly: true
				}),
				RelationKindFk: BasicsSharedLookupOverloadProvider.provideRelationKindReadonlyLookupOverload(),
			},
			labels: {
				...prefixAllTranslationKeys('scheduling.main.', {
					RelationKindFk: {key: 'kind'},
					PredecessorProjectNo: {key: 'PredecessorProjectNo'},
					PredecessorProjectName: {key: 'PredecessorProjectName'},
					PredecessorCode: {key: 'predecessor'},
					PredecessorDesc: {key: 'predecessorDesc'},
					FixLagPercent: {key: 'entityRelationFixLagPercent'},
					FixLagTime: {key: 'entityRelationFixLagTime'},
					VarLagPercent: {key: 'entityRelationVarLagPercent'},
					PredecessorSchedule: {key: 'predecessorSchedule'},
					UseCalendar: {key: 'entityRelationUseCalendar'}
				}),

			}
		};
	}
});