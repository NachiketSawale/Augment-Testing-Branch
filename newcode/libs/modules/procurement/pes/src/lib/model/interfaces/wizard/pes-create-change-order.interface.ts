/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { IPrcConHeaderEntity } from '@libs/procurement/interfaces';

export interface IChangeHeader {
	Description: string;
	ProjectChangeFk?: number;
	ProjectFk?: number;
	ConHeaderFk: number;
	ConStatusFk?: number;
}

export interface IPESCreateChangeOrderInitData {
	changeOrderContracts: IPrcConHeaderEntity[];
	changeHeader: IChangeHeader;
	changeShowItems: IChangeItems[];
	contract: IPrcConHeaderEntity;
	createCOContractWithDefaultStatus?: number;
	isLinkFrameworkContract?: boolean;
}

export interface IPESCreateChangeOrderOptions {
	projectChangeFk?: number;
	changeOrderContractDesc?: string;
	contractStatus?: number;
}

export interface IChangeItems {
	Id: number;
	QuantityDelivered: number;
	QuantityContracted: number;
	Variance: number;
	UomFK: number;
	MdcMaterialFk?: number;
	Description1: string;
	BoqReference: string;
	BoqBrief: string;
}

/**
 * injection token of create InterCompany bill wizard dialog parameter
 */
export const PES_CREATE_CHANGE_ORDER_PARAM = new InjectionToken<IPESCreateChangeOrderInitData>('PES_CREATE_CHANGE_ORDER_PARAM');
