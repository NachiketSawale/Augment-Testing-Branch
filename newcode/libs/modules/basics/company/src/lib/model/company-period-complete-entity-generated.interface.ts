/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyPeriodEntity } from '@libs/basics/interfaces';
import { ICompanyTransheaderEntity } from '@libs/basics/interfaces';
import { ICompanyTransheaderCompleteEntity } from './company-transheader-complete-entity.interface';


export interface ICompanyPeriodCompleteEntityGenerated {

/*
 * MainItemId
 */
  MainItemId?: number | null;

/*
 * Periods
 */
  Periods?: ICompanyPeriodEntity | null;

/*
 * TransheaderToDelete
 */
  TransheaderToDelete?: ICompanyTransheaderEntity[] | null;

/*
 * TransheaderToSave
 */
  TransheaderToSave?: ICompanyTransheaderCompleteEntity[] | null;
}
