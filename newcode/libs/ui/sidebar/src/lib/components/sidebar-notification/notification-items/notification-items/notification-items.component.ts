/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, Inject } from '@angular/core';
import { ISidebarNotificationEntity } from '../../../../model/interfaces/notifications/sidebar-notification-entity.interface';
import { DatePipe } from '@angular/common';
import { IReportPreparedData, PlatformReportService } from '@libs/platform/common';

@Component({
	selector: 'ui-sidebar-notification-items',
	templateUrl: './notification-items.component.html',
	styleUrls: ['./notification-items.component.scss'],
})
/**
 * A class to display individual notification items.
 */
export class NotificationItemsComponent {

	public formattedStartDate: string = '';

	private readonly reportService = inject(PlatformReportService);

	public constructor(
		@Inject('currentNotification') public notification: ISidebarNotificationEntity,
		@Inject('unseenNotification') public isUnseenNotificationAvailable: boolean,
		private datePipe: DatePipe
	) {
		this.formattedStartDate = datePipe.transform(this.notification.Started, 'yyyy-MM-dd HH:mm:ss')!;
	}

	/**
	 * Function to provide status icon based on notification status.
	 * @returns status icon path.
	 */
	public notificationIcon(): string {
		const basePath = 'assets/ui/common/images/status-icons.svg';
		const notificationIcon = basePath + '#ico-status' + (this.notification.IconId < 10 ? 0 + '' + this.notification.IconId : this.notification.IconId);
		return notificationIcon;
	}

	/**
	 * Add "New" to notification "Name" if notification is unseen.
	 */
	public get notificationTitle(): string {
		return this.isUnseenNotificationAvailable
			? `${this.notification.Name} New`
			: this.notification.Name;
	}

	/**
	 * Show Report for current notification details.
	 */
	public showReport(): void {
		if (this.notification.AdditionalReferencesEntities && this.notification.AdditionalReferencesEntities?.length > 0) {
			const referenceEntity = this.notification.AdditionalReferencesEntities[0];
			const reportData: IReportPreparedData = {
				Name: referenceEntity.Uuid,
				Description: this.notification.Name,
				FileExtension: referenceEntity.FileExtension,
				ClientUrl: referenceEntity.ClientUrl,
				GenerationCompleted: true,
				subPath: null
			};
			this.reportService.show(reportData);
		}
	}

}
