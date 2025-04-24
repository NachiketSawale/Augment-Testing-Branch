/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IOenAkzEntityGenerated extends IEntityBase {

/*
 * Description
 */
  Description: string;

/*
 * Id
 */
  Id: number;

/*
 * Nr
 */
  Nr: string;

/*
 * OenLvHeaderFk
 */
  OenLvHeaderFk: number;
}
