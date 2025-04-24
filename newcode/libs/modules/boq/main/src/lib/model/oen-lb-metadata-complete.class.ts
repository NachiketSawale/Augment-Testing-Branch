/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOenContactEntity } from './entities/oen-contact-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';
import { IOenLbMetadataEntity } from './entities/oen-lb-metadata-entity.interface';

export class OenLbMetadataComplete implements CompleteIdentification<IOenLbMetadataEntity>{

 /*
  * OenContactToDelete
  */
  public OenContactToDelete?: IOenContactEntity[] | null = [];

 /*
  * OenContactToSave
  */
  public OenContactToSave?: IOenContactEntity[] | null = [];

 /*
  * OenLbMetadata
  */
  public OenLbMetadata?: IOenLbMetadataEntity | null;
}
