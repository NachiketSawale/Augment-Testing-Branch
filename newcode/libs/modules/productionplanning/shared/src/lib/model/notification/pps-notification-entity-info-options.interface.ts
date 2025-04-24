/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { IInitializationContext, Translatable } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';


export interface IPpsNotificationEntityInfoOptions<PT extends object> {
	containerUuid: string;
	permissionUuid: string;
	apiUrl: string; // maybe 'transportplanning/route/' or 'transportplanning/requisition/'
	parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>;
	gridTitle: Translatable; // maybe {key:'transportplanning.transport.notificationListTitle'} or {key:'transportplanning.requisition.notificationListTitle'}
}

export interface IPpsNotificationEntityDataServiceInitializeOptions<PT extends object> {
	apiUrl: string; // maybe 'transportplanning/route/' or 'transportplanning/requisition/'
	parentService: IEntitySelection<PT>;
}