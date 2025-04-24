/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOenAkzEntity } from './entities/oen-akz-entity.interface';
import { IOenContactEntity } from './entities/oen-contact-entity.interface';
import { IOenServicePartEntity } from './entities/oen-service-part-entity.interface';
import { IOenZzEntity } from './entities/oen-zz-entity.interface';
import { OenZzComplete } from './oen-zz-complete.class';
import { CompleteIdentification } from '@libs/platform/common';
import { IOenLvHeaderEntity } from './entities/oen-lv-header-entity.interface';

export class OenLvHeaderComplete implements CompleteIdentification<IOenLvHeaderEntity>{

 /*
  * OenAkzToDelete
  */
  public OenAkzToDelete?: IOenAkzEntity[] | null = [];

 /*
  * OenAkzToSave
  */
  public OenAkzToSave?: IOenAkzEntity[] | null = [];

 /*
  * OenContactToDelete
  */
  public OenContactToDelete?: IOenContactEntity[] | null = [];

 /*
  * OenContactToSave
  */
  public OenContactToSave?: IOenContactEntity[] | null = [];

 /*
  * OenLvHeader
  */
  public OenLvHeader?: IOenLvHeaderEntity | null;

 /*
  * OenServicePartToDelete
  */
  public OenServicePartToDelete?: IOenServicePartEntity[] | null = [];

 /*
  * OenServicePartToSave
  */
  public OenServicePartToSave?: IOenServicePartEntity[] | null = [];

 /*
  * OenZzToDelete
  */
  public OenZzToDelete?: IOenZzEntity[] | null = [];

 /*
  * OenZzToSave
  */
  public OenZzToSave?: OenZzComplete[] | null = [];
}
