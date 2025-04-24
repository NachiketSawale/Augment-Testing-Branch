/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { PlatformLazyInjectorService, prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMainInstanceStatusService } from '../construction-system-main-instance-status.service';
import { ConstructionSystemMainInstanceDataService } from '../construction-system-main-instance-data.service';
import { ICosJobEntity } from '../../model/entities/cos-job-entity.interface';

/**
 * The Construction System Main Instance layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainJobListLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly constructionSystemMainInstanceStatusService = ServiceLocator.injector.get(ConstructionSystemMainInstanceStatusService);
	private readonly instanceService = ServiceLocator.injector.get(ConstructionSystemMainInstanceDataService);

	private getProjectId() {
		return this.instanceService.getCurrentSelectedProjectId();
	}

	public async generateLayout(): Promise<ILayoutConfiguration<ICosJobEntity>> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['JobState', 'StartTime', 'EndTime', 'ProgressMessage', 'Description'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					JobState: { key: 'entityStatus', text: 'Status' },
				}),
				...prefixAllTranslationKeys('constructionsystem.main.', {
					StartTime: { key: 'entityStartTime', text: 'Start Time' },
					EndTime: { key: 'entityEndTime', text: 'End Time' },
					ProgressMessage: { key: 'entityProgress', text: 'Progress' },
					ErrorMessage: { key: 'entityError', text: 'Error' },
				}),
			},
			overloads: {
				JobState: {
					readonly: true,
					// 'grid': { //todo todo formatter function is not ready:DEV-15667
					//     'formatter': function (row, cell, value) {
					//         return $filter('constructionsystemMainJobStateFilter')(value);
					//     }
					// }
				},
				StartTime: {
					readonly: true,
				},

				EndTime: {
					readonly: true,
				},
				ProgressMessage: {
					readonly: true,
					// 'grid': { todo formatter function is not ready:DEV-15667
					//     'formatter': function (row, cell, value) {
					//         return $filter('constructionsystemMainJobProgressFilter')(value);
					//     }
					// }
				},
				Description: {
					readonly: true,
				},
			},
		};
	}
}
