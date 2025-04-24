/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { ISidebarNotificationEntity } from '../../model/interfaces/notifications/sidebar-notification-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class SidebarNotificationService {

	private readonly httpService = inject(PlatformHttpService);
	public constructor() { }

	/**
	 * get all notifications.
	 * @returns
	 */
	public getNotificationsList(): Promise<ISidebarNotificationEntity[]> {
		return this.httpService.get<ISidebarNotificationEntity[]>('basics/common/notification/getMyNotifications');
	}

	/**
	 * Get unseen Notifications
	 * @returns
	 */
	public getUnseenNotifications(): Promise<ISidebarNotificationEntity[]> {
		return this.httpService.get<ISidebarNotificationEntity[]>('basics/common/notification/getMyUnseenNotifications');
	}

	/**
	 * Updates the notifications as seen.
	 * @param sidebarNotificationIds
	 * @returns
	 */
	public updateNotificationViewState(sidebarNotificationIds: number[]): Promise<boolean> {
		return this.httpService.post<boolean>('basics/common/notification/updateNotificationViewState', sidebarNotificationIds);
	}

	/**
	 * Delete notifications.
	 * @param ids
	 * @returns
	 */
	public removeNotifications(ids: number[]): Promise<boolean> {
		return this.httpService.post<boolean>('basics/common/notification/removeNotifications', ids);
	}
}
