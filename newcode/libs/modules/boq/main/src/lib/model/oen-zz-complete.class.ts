/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOenZzVariantEntity } from './entities/oen-zz-variant-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';
import { IOenZzEntity } from './entities/oen-zz-entity.interface';

export class OenZzComplete implements CompleteIdentification<IOenZzEntity>{

 /*
  * OenZz
  */
  public OenZz?: IOenZzEntity | null;

 /*
  * OenZzVariantToDelete
  */
  public OenZzVariantToDelete?: IOenZzVariantEntity[] | null = [];

 /*
  * OenZzVariantToSave
  */
  public OenZzVariantToSave?: IOenZzVariantEntity[] | null = [];
}
