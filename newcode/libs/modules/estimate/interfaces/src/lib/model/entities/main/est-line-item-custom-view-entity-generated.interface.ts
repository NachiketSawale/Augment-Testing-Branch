/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEstLineItemCustomViewEntityGenerated extends IEntityBase {

/*
 * Description
 */
  Description?: string | null;

/*
 * FrmAccessRoleFk
 */
  FrmAccessRoleFk?: number | null;

/*
 * FrmUserFk
 */
  FrmUserFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsSystem
 */
  IsSystem?: boolean | null;

/*
 * ViewConfig
 */
  ViewConfig?: string | null;

/*
 * ViewType
 */
  ViewType?: number | null;
}
