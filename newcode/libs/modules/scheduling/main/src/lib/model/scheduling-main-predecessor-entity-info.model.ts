/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ACTIVITY_LOOKUP_PROVIDER_TOKEN, IActivityRelationshipEntity } from '@libs/scheduling/interfaces';
import { SchedulingMainPredecessorRelationshipDataService } from '../services/scheduling-main-predecessor-relationship-data.service';
import { ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { SchedulingMainPredecessorRelationshipValidationService} from '../services/validations/scheduling-main-predecessor-relationship-validation.service';

export const SCHEDULING_MAIN_PREDECESSOR_ENTITY_INFO: EntityInfo = EntityInfo.create<IActivityRelationshipEntity> ({
	grid: {
		title: {key: 'scheduling.main' + '.listPredecessorTitle'},
	},
	form: {
		title: { key: 'scheduling.main' + '.detailPredecessorTitle' },
		containerUuid: 'e65b9fddd0a7404c9cbf6c111e1dac81',
	},
	dataService: ctx => ctx.injector.get(SchedulingMainPredecessorRelationshipDataService),
	validationService: ctx => ctx.injector.get(SchedulingMainPredecessorRelationshipValidationService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Main', typeName: 'ActivityRelationshipDto'},
	permissionUuid: 'e4a4e97657ef4068bdf1367afca01375',
	layoutConfiguration:async ctx=> {
		const activityLookupProvider = await ctx.lazyInjector.inject(ACTIVITY_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IActivityRelationshipEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['RelationKindFk', 'PredecessorActivityFk', 'PredecessorDesc', 'PredecessorProjectNo', 'PredecessorProjectName', 'PredecessorSchedule', 'FixLagPercent', 'FixLagTime', 'VarLagPercent', 'VarLagTime', 'UseCalendar']
				}
			],
			overloads: {
				PredecessorActivityFk: activityLookupProvider.generateActivityLookup(),
				RelationKindFk: BasicsSharedLookupOverloadProvider.provideRelationKindLookupOverload(true),
				PredecessorDesc: {readonly: true},
				PredecessorSchedule: {readonly: true},
				PredecessorProjectNo: {readonly: true},
				PredecessorProjectName: {readonly: true},
			},
			labels: {
				...prefixAllTranslationKeys('scheduling.main.', {
					RelationKindFk: {key: 'kind'},
					PredecessorActivityFk: {key: 'predecessor'},
					PredecessorProjectNo: {key: 'PredecessorProjectNo'},
					PredecessorProjectName: {key: 'PredecessorProjectName'},
					PredecessorDesc: {key: 'predecessorDesc'},
					FixLagPercent: {key: 'entityRelationFixLagPercent'},
					FixLagTime: {key: 'entityRelationFixLagTime'},
					VarLagPercent: {key: 'entityRelationVarLagPercent'},
					PredecessorSchedule: {key: 'predecessorSchedule'},
					UseCalendar: {key: 'entityRelationUseCalendar'},
					VarLagTime: {key: 'entityRelationVarLagTime'}
				})
			}
		};
	}
});