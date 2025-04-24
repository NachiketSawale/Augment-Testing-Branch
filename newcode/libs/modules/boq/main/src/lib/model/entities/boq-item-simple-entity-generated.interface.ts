/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemSimpleEntity } from './boq-item-simple-entity.interface';
import { IDescriptionInfo } from '@libs/platform/common';

export interface IBoqItemSimpleEntityGenerated {

/*
 * BasUomFk
 */
  BasUomFk?: number | null;

/*
 * BoqDivisionTypeFk
 */
  BoqDivisionTypeFk?: number | null;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * BoqItemFk
 */
  BoqItemFk?: number | null;

/*
 * BoqItemFlagFk
 */
  BoqItemFlagFk?: number | null;

/*
 * BoqItems
 */
  BoqItems?: IBoqItemSimpleEntity[] | null;

/*
 * BoqLineTypeFk
 */
  BoqLineTypeFk: number;

/*
 * BoqWicCatFk
 */
  BoqWicCatFk?: number | null;

/*
 * BriefInfo
 */
  BriefInfo?: IDescriptionInfo | null;

/*
 * ExternalCode
 */
  ExternalCode?: string | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * Id
 */
  Id: number;

/*
 * Included
 */
  Included: boolean;

/*
 * PrjCharacter
 */
  PrjCharacter?: string | null;

/*
 * Quantity
 */
  Quantity: number;

/*
 * Reference
 */
  Reference?: string | null;

/*
 * Reference2
 */
  Reference2?: string | null;

/*
 * Userdefined1
 */
  Userdefined1?: string | null;

/*
 * Userdefined2
 */
  Userdefined2?: string | null;

/*
 * Userdefined3
 */
  Userdefined3?: string | null;

/*
 * Userdefined4
 */
  Userdefined4?: string | null;

/*
 * Userdefined5
 */
  Userdefined5?: string | null;

/*
 * WorkContent
 */
  WorkContent?: string | null;
}
