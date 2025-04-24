/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IBoqStructureDetailEntityGenerated extends IEntityBase {

/*
 * BoqLineTypeFk
 */
  BoqLineTypeFk: number;

/*
 * BoqStructureFk
 */
  BoqStructureFk: number;

/*
 * DataType
 */
  DataType: number;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DiscountAllowed
 */
  DiscountAllowed: boolean;

/*
 * Id
 */
  Id: number;

/*
 * LengthReference
 */
  LengthReference: number;

/*
 * StartValue
 */
  StartValue?: string | null;

/*
 * Stepincrement
 */
  Stepincrement: number;
}
