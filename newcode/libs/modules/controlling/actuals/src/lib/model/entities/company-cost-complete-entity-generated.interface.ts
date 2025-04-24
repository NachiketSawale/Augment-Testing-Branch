/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyCostHeaderEntity } from './company-cost-header-entity.interface';
import { ICompanyCostDataEntity } from './company-cost-data-entity.interface';


export interface ICompanyCostCompleteEntityGenerated {

/*
 * ControllingActualsCostHeader
 */
  ControllingActualsCostHeader?: ICompanyCostHeaderEntity | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * controllingActualsCostDataToDelete
 */
  controllingActualsCostDataToDelete?: ICompanyCostDataEntity[] | null;

/*
 * controllingActualsCostDataToSave
 */
  controllingActualsCostDataToSave?: ICompanyCostDataEntity[] | null;
}
