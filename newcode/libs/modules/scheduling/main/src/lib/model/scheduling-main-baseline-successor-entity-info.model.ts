/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IActivityRelationshipEntity } from '@libs/scheduling/interfaces';
import { SchedulingActivityLookupProviderService } from '../services/scheduling-activity-lookup-provider.service';
import { ILayoutConfiguration } from '@libs/ui/common';
import { SchedulingMainBaselineSuccessorRelationshipDataService } from '../services/scheduling-main-baseline-successor-relationship-data.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

export const SCHEDULING_MAIN_BASELINE_SUCCESSOR_ENTITY_INFO: EntityInfo = EntityInfo.create<IActivityRelationshipEntity> ({
	grid: {
		title: {key: 'scheduling.main' + '.baselineSuccessorListTitle'},
		containerUuid: 'e2766e30b5064e028583b54222deaf24'
	},
	form: {
		title: { key: 'scheduling.main' + '.baselineSuccessorDetailTitle' },
		containerUuid: 'cb88f8457c3944929145ce4c1e933d51'
	},
	dataService: ctx => ctx.injector.get(SchedulingMainBaselineSuccessorRelationshipDataService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Main', typeName: 'ActivityRelationshipDto'},
	permissionUuid: 'e4a4e97657ef4068bdf1367afca01375',
	layoutConfiguration:async ctx=> {
		const activityLookupProvider = ctx.injector.get(SchedulingActivityLookupProviderService);
		return <ILayoutConfiguration<IActivityRelationshipEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['RelationKindFk', 'ParentActivityFk', 'SuccessorDesc', 'SuccessorProjectNo',
						'SuccessorProjectName', 'SuccessorSchedule', 'FixLagPercent', 'FixLagTime',
						'VarLagPercent', 'VarLagTime', 'UseCalendar']
				}
			],
			overloads: {
				ParentActivityFk: activityLookupProvider.generateActivityLookup({
					readonly: true
				}),
				RelationKindFk: BasicsSharedLookupOverloadProvider.provideRelationKindReadonlyLookupOverload()
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