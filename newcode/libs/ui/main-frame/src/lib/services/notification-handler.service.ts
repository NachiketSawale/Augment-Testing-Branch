/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { INotificationData } from '../model/interfaces/notification-data.interface';
@Injectable({
	providedIn: 'root',
})
export class NotificationHandlerService {
	public readonly SharingData = new Subject<INotificationData>();
}

