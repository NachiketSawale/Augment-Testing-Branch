/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstAllowanceBaseEntity extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsActive
 */
  IsActive?: boolean | null;

/*
 * IsBalanceFp
 */
  IsBalanceFp?: boolean | null;

/*
 * IsOneStep
 */
  IsOneStep?: boolean | null;

/*
 * MarkUpAm
 */
  MarkUpAm?: number | null;

/*
 * MarkUpAmSc
 */
  MarkUpAmSc?: number | null;

/*
 * MarkUpGa
 */
  MarkUpGa?: number | null;

/*
 * MarkUpGaSc
 */
  MarkUpGaSc?: number | null;

/*
 * MarkUpRp
 */
  MarkUpRp?: number | null;

/*
 * MarkUpRpSc
 */
  MarkUpRpSc?: number | null;

/*
 * MdcAllAreaGroupTypeFk
 */
  MdcAllAreaGroupTypeFk?: number | null;

/*
 * MdcAllowanceTypeFk
 */
  MdcAllowanceTypeFk?: number | null;

/*
 * MdcMarkUpCalcTypeFk
 */
  MdcMarkUpCalcTypeFk?: number | null;

/*
 * QuantityTypeFk
 */
  QuantityTypeFk?: number | null;

/*
 * mdcAllowanceFk
 */
  mdcAllowanceFk?: number | null;
}
