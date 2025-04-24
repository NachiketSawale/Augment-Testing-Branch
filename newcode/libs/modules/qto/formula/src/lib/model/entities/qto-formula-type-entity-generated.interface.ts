/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IQtoFormulaEntity } from './qto-formula-entity.interface';
import {IDescriptionInfo, IEntityBase} from '@libs/platform/common';

export interface IQtoFormulaTypeEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * QtoFormulaEntities
 */
  QtoFormulaEntities?: IQtoFormulaEntity[] | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
