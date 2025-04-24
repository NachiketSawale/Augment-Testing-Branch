/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyEntity } from './company-entity.interface';

export interface ICompanyActionEntity {
	Action?: number | null;
	Companies?: ICompanyEntity[] | null;
	WithChildren?: boolean | null
}
