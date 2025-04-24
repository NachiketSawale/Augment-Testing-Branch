/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import { IPpsNotificationEntity } from '../../model/notification/pps-notification-entity.interface';
@Injectable({
	providedIn: 'root'
})
export class PpsNotificationGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsNotificationEntity>, IPpsNotificationEntity> {

}