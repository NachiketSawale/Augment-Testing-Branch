/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMdcAllowanceAreaEntityGenerated extends IEntityBase {

/*
 * AreaType
 */
  AreaType?: number | null;

/*
 * Code
 */
  Code: string;

/*
 * Description
 */
  Description?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * MdcAllowanceFk
 */
  MdcAllowanceFk?: number | null;
}
