/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo, IEntityBase} from '@libs/platform/common';

export interface IQtoFormulaScriptTransEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * ValidationText
 */
  ValidationText?: IDescriptionInfo | null;
}
