/*
 * Copyright(c) RIB Software GmbH
 */

import { ICreateRequests } from '../../wizards/create-requests.interface';

export interface ICreateRequestsDialogModel {
	IsSuccess:boolean,
	HasError:boolean,
	UpdateDetail:string[],
	ErrorDetail:string,
	Loading:boolean,
}

export interface ICreateRequestsEntity extends ICreateRequests {
	CompanyFk?: number ,
}
