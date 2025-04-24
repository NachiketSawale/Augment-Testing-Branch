/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { IHsqCheckList2ActivityEntity } from '@libs/hsqe/interfaces';
import { ACTIVITY_LOOKUP_PROVIDER_TOKEN, SCHEDULE_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { HsqeChecklistDataService } from '../hsqe-checklist-data.service';

/**
 * The checklist activity layout service
 */
@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistActivityLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly checklistDataService = inject(HsqeChecklistDataService);

	private getProjectId() {
		if (!this.checklistDataService.hasSelection()) {
			return null;
		}
		return this.checklistDataService.getSelectedEntity()?.PrjProjectFk;
	}

	public async generateLayout(): Promise<ILayoutConfiguration<IHsqCheckList2ActivityEntity>> {
		const activityLookupProvider = await this.lazyInjector.inject(ACTIVITY_LOOKUP_PROVIDER_TOKEN);
		const scheduleLookupProvider = await this.lazyInjector.inject(SCHEDULE_LOOKUP_PROVIDER_TOKEN);
		const projectId = this.getProjectId();
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['PsdScheduleFk', 'PsdActivityFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('hsqe.checklist.', {
					PsdScheduleFk: {
						key: 'activity.entitySchedule',
						text: 'Schedule',
					},
					PsdActivityFk: {
						key: 'activity.entityActivity',
						text: 'Activity',
					},
				}),
			},
			overloads: {
				PsdScheduleFk: {
					...scheduleLookupProvider.generateScheduleLookup({
						projectId: projectId ? projectId : undefined, /// todo seems project filter is not working in schedule lookup
					}),
					...{
						additionalFields: [
							{
								displayMember: 'Description',
								label: {
									key: 'hsqe.CheckList.Schedule.description',
								},
								column: true,
								singleRow: true,
							},
						],
					},
				},
				PsdActivityFk: {
					...activityLookupProvider.generateActivityLookup(), //todo should filter by scheduleId,seems current activity look up is not ready,
					...{
						additionalFields: [
							/// seems not working well
							{
								displayMember: 'Description',
								label: {
									key: 'hsqe.CheckList.activity.description',
								},
								column: true,
								singleRow: true,
							},
							{
								displayMember: 'PlannedStart',
								label: {
									key: 'hsqe.CheckList.activity.plannedStart',
								},
								column: true,
								singleRow: true,
							},
							{
								displayMember: 'PlannedFinish',
								label: {
									key: 'hsqe.CheckList.activity.plannedFinish',
								},
								column: true,
								singleRow: true,
							},
							{
								displayMember: 'ActualStart',
								label: {
									key: 'hsqe.CheckList.activity.actualStart',
								},
								column: true,
								singleRow: true,
							},
							{
								displayMember: 'ActualFinish',
								label: {
									key: 'hsqe.CheckList.activity.actualFinish',
								},
								column: true,
								singleRow: true,
							},
						],
					},
				},
			},
		};
	}
}
