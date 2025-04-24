/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstColumnConfigDetailEntityGenerated extends IEntityBase {

/*
 * ColumnId
 */
  ColumnId?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstColumnConfigFk
 */
  EstColumnConfigFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsCustomProjectCostCode
 */
  IsCustomProjectCostCode?: boolean | null;

/*
 * LineType
 */
  LineType?: number | null;

/*
 * MaterialLineId
 */
  MaterialLineId?: number | null;

/*
 * MdcCostCodeFk
 */
  MdcCostCodeFk?: number | null;

/*
 * Project2mdcCstCdeFk
 */
  Project2mdcCstCdeFk?: number | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
