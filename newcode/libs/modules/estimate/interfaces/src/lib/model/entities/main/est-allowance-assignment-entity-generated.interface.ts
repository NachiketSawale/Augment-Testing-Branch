/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAllowanceConfigEntity } from './est-allowance-config-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEstAllowanceAssignmentEntityGenerated extends IEntityBase {

/*
 * EstAllowanceConfigEntity
 */
  EstAllowanceConfigEntity?: IEstAllowanceConfigEntity | null;

/*
 * EstAllowanceConfigFk
 */
  EstAllowanceConfigFk?: number | null;

/*
 * Id
 */
  Id: number ;

/*
 * IsActive
 */
  IsActive?: boolean | null;

/*
 * MdcAllowanceFk
 */
  MdcAllowanceFk?: number | null;
}
