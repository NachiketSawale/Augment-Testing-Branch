/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOenZzVariantEntity } from './oen-zz-variant-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IOenZzEntityGenerated extends IEntityBase {

/*
 * Description
 */
  Description?: string | null;

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

/*
 * OenZzVariants
 */
  OenZzVariants?: IOenZzVariantEntity[] | null;
}
