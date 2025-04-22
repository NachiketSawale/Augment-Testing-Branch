/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IAdditionalReferenceEntity } from './additional-reference-entity.interface';

/**
 * Sidebar Notification Entity.
 */
export interface ISidebarNotificationEntity extends IEntityBase {
	Id: number;
	Name: string;
	NotificationStatusFk: number;
	NotificationStatus: string;
	Reference: number;
	Started: Date;
	ExpireDate: Date;
	EndTime: Date;
	UserFk: number;
	User: string;
	IconId: number;
	Version?: number;
	IsReport: boolean;
	NotificationTypeFk: number;
	NotificationType: string;
	IsUnseen: boolean;
	CurrentAction?: string;
	AdditionalReferencesEntities?: IAdditionalReferenceEntity[]
}
