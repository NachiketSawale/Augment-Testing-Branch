/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ACTIVITY_LOOKUP_PROVIDER_TOKEN, IActivityRelationshipEntity } from '@libs/scheduling/interfaces';
import { SchedulingMainSuccessorRelationshipDataService } from '../services/scheduling-main-successor-relationship-data.service';
import { ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { SchedulingMainSuccessorRelationshipValidationService } from '../services/validations/scheduling-main-successor-relationship-validation.service';

export const SCHEDULING_MAIN_SUCCESSOR_ENTITY_INFO: EntityInfo = EntityInfo.create<IActivityRelationshipEntity> ({
	grid: {
		title: {key: 'scheduling.main' + '.listRelationship'},
		containerUuid: 'd28c62b0d3d74790950a0b7085953f80',
	},
	form: {
		title: { key: 'scheduling.main' + '.detailRelationshipTitle' },
		containerUuid: '0510f6cc64d24047b5413d20aa1d5b02',
	},
	dataService: ctx => ctx.injector.get(SchedulingMainSuccessorRelationshipDataService),
	validationService: ctx => ctx.injector.get(SchedulingMainSuccessorRelationshipValidationService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Main', typeName: 'ActivityRelationshipDto'},
	permissionUuid: 'e4a4e97657ef4068bdf1367afca01375',
	layoutConfiguration:async ctx=> {
		const activityLookupProvider = await ctx.lazyInjector.inject(ACTIVITY_LOOKUP_PROVIDER_TOKEN);

		return <ILayoutConfiguration<IActivityRelationshipEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['RelationKindFk', 'ChildActivityFk', 'SuccessorDesc', 'SuccessorProjectNo',
						'SuccessorProjectName', 'SuccessorSchedule', 'FixLagPercent', 'FixLagTime',
						'VarLagPercent', 'VarLagTime', 'UseCalendar']
				}
			],
			overloads: {
				ChildActivityFk: activityLookupProvider.generateActivityLookup(),
				RelationKindFk: BasicsSharedLookupOverloadProvider.provideRelationKindLookupOverload(true),
				SuccessorDesc: {readonly: true},
				SuccessorSchedule: {readonly: true},
				SuccessorProjectNo: {readonly: true},
				SuccessorProjectName: {readonly: true}
			},
			labels: {
				...prefixAllTranslationKeys('scheduling.main.', {
					RelationKindFk: {key: 'kind'},
					ChildActivityFk: {key: 'entityRelationChild'},
					SuccessorProjectNo: {key: 'SuccessorProjectNo'},
					SuccessorProjectName: {key: 'SuccessorProjectName'},
					SuccessorDesc: {key: 'successorDesc'},
					FixLagPercent: {key: 'entityRelationFixLagPercent'},
					FixLagTime: {key: 'entityRelationFixLagTime'},
					VarLagPercent: {key: 'entityRelationVarLagPercent'},
					SuccessorSchedule: {key: 'successorSchedule'},
					UseCalendar: {key: 'entityRelationUseCalendar'},
					VarLagTime: {key: 'entityRelationVarLagTime'}
				}),
			}
		};
	}
});