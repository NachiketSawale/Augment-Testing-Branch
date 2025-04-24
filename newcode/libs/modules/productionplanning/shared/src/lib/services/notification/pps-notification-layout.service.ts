/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IPpsNotificationEntity } from '../../model/notification/pps-notification-entity.interface';

/**
 * PPS Notification layout service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsNotificationLayoutService {

	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<IPpsNotificationEntity> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Source', 'Code', 'Description', 'Message']
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					baseGroup: { key: 'entityProperties', text: '*Basic Data' },
					Code: { key: 'entityCode', text: 'Code' },
					Description: { key: 'entityDescription', text: 'Description' },
				}),

				...prefixAllTranslationKeys('productionplanning.common.', {
					Source: { key: 'notification.source' },
					Message: { key: 'notification.message' },
				}),

			},
			overloads: {
				Source: {
					readonly: true
				},
				Code: {
					readonly: true
				},
				Description: {
					readonly: true
				},
				Message: {
					readonly: true
				},

			}
		};
	}
}
