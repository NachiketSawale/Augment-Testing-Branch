/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { ICompanyNumberEntity } from './company-number-entity.interface';

export interface ICompanyNumberReserveEntity extends IEntityBase {
	CompanyNumberEntity?: ICompanyNumberEntity | null;
	CompanyNumberFk?: number | null;
	Id?: number | null;
	Numberstring?: string | null;
}
