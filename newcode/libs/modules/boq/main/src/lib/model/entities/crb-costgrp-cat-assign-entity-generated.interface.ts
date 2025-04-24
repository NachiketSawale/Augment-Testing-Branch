/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBoqHeaderEntity } from '@libs/boq/interfaces';

export interface ICrbCostgrpCatAssignEntityGenerated extends IEntityBase {

/*
 * BasCostgroupCatFk
 */
  BasCostgroupCatFk: number;

/*
 * BoqHeader
 */
  BoqHeader?: IBoqHeaderEntity | null;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * Code
 */
  Code: string;

/*
 * Id
 */
  Id: number;

/*
 * IsProjectCatalog
 */
  IsProjectCatalog?: boolean | null;

/*
 * IsUsed
 */
  IsUsed?: boolean | null;

/*
 * Name
 */
  Name?: string | null;

/*
 * NewPrjCostgrpCatAssign
 */
  //NewPrjCostgrpCatAssign?: IPrjCostgrpCatAssignUnmappedEntity | null;

/*
 * PrjCostgrpcatAssignFk
 */
  PrjCostgrpcatAssignFk: number;

/*
 * Sorting
 */
  Sorting?: number | null;
}
