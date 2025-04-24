/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyPeriodEntity } from '@libs/basics/interfaces';
import { ICompanyPeriodCompleteEntity } from './company-period-complete-entity.interface';
import { ICompanyYearEntity } from '@libs/basics/interfaces';


export interface ICompanyYearCompleteEntityGenerated {

/*
 * MainItemId
 */
  MainItemId?: number | null;

/*
 * PeriodsToDelete
 */
  PeriodsToDelete?: ICompanyPeriodEntity[] | null;

/*
 * PeriodsToSave
 */
  PeriodsToSave?: ICompanyPeriodCompleteEntity[] | null;

/*
 * Year
 */
  Year?: ICompanyYearEntity | null;
}
