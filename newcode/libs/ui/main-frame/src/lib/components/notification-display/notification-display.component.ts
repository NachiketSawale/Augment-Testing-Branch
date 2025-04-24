/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input } from '@angular/core';
import { NotificationHandlerService } from '../../services/notification-handler.service';
import { INotificationData } from '../../model/interfaces/notification-data.interface';

@Component({
	selector: 'ui-main-frame-notification-display',
	templateUrl: './notification-display.component.html',
	styleUrls: ['./notification-display.component.scss']
})
export class UiMainFrameNotificationDisplayComponent {
	@Input()
	public NotificationData: INotificationData = { message: '', notification_class: '' };

	/**
	 * To choose font family for label and status count
	 */
	@Input()
	public fontFamily?: string;

	/**
	 * To set font weight to label and status count
	 */
	@Input()
	public fontWeight!: number;

	public constructor(private dataServiceService: NotificationHandlerService) {
		this.dataServiceService.SharingData.subscribe((res: INotificationData) => {
			this.NotificationData = res;
		});
	}
}
