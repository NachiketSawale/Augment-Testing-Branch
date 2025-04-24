/*
 * Copyright(c) RIB Software GmbH
 */

import { ResponseStatus } from '../../enum';

export interface ICreateReminderDialogModel {
	CreateReminderEntity: ICreateReminderEntity,
	ResultStatus: ResponseStatus
	ResultMessage: string,
	Loading: boolean,
}

export interface ICreateReminderEntity {
	BatchId: string,
	BatchDate: Date,
	Email: boolean,
	Telefax: boolean,
}

