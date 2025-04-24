/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMdcContrChartEntity } from './mdc-contr-chart-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IMdcContrChartCategoryEntityGenerated extends IEntityBase {

/*
 * BasChartTypeFk
 */
  BasChartTypeFk?: number | null;

/*
 * GroupKey
 */
  GroupKey?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * MdcContrChartEntity
 */
  MdcContrChartEntity?: IMdcContrChartEntity | null;

/*
 * MdcContrChartFk
 */
  MdcContrChartFk?: number | null;
}
