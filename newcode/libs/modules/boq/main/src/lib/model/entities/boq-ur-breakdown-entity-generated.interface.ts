/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IBoqUrBreakdownEntityGenerated extends IEntityBase {

  /*
	 * Id
	 */
  Id?: number;

  /*
	 * DescriptionInfo
	 */
  DescriptionInfo?: IDescriptionInfo;

  /*
	 * Sorting
	 */
  Sorting?: number;
}
