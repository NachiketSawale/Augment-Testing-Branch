/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsProductionSubsetEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id: number;

/*
 * PpsFabricationUnitFk
 */
  PpsFabricationUnitFk?: number | null;

/*
 * PpsProductionSetFk
 */
  PpsProductionSetFk: number;

/*
 * UserDefined1
 */
  UserDefined1?: string | null;

/*
 * UserDefined2
 */
  UserDefined2?: string | null;

/*
 * UserDefined3
 */
  UserDefined3?: string | null;

/*
 * UserDefined4
 */
  UserDefined4?: string | null;

/*
 * UserDefined5
 */
  UserDefined5?: string | null;
}
