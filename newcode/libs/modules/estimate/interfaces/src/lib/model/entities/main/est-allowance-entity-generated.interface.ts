/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IEstHeaderEntity } from './est-header-base-entity.interface';

export interface IEstAllowanceEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code: string;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstHeaderEntity
 */
  EstHeaderEntity?: IEstHeaderEntity | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * Id
 */
  Id: number;

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
  MdcAllowanceTypeFk: number;

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
