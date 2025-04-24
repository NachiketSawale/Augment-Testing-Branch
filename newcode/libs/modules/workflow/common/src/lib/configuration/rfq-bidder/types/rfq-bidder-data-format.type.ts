/*
 * Copyright(c) RIB Software GmbH
 */

import { Included } from './generic-wizard-included.type';

export type RfqBidderDataFormat = {
	Id: number,
	DataFormat: string,
	Isdefault: boolean,
} & Included;