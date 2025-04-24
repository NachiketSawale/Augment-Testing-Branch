/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOenGraphicEntity } from '@libs/boq/interfaces';
import { IOenLbMetadataEntity } from './entities/oen-lb-metadata-entity.interface';
import { OenLbMetadataComplete } from './oen-lb-metadata-complete.class';
import { OenLvHeaderComplete } from './oen-lv-header-complete.class';
import { CompleteIdentification } from '@libs/platform/common';
import { IBlobStringEntity } from '@libs/basics/shared';
import { IOenBoqItemEntity } from './entities/oen-boq-item-entity.interface';

export class OenBoqItemCompleteExtension implements CompleteIdentification<IOenBoqItemEntity>{

 /*
  * BlobsCommentToSave
  */
  public BlobsCommentToSave?: IBlobStringEntity | null;

 /*
  * BlobsLbChangeToSave
  */
  public BlobsLbChangeToSave?: IBlobStringEntity | null;

 /*
  * OenGraphicToDelete
  */
  public OenGraphicToDelete?: IOenGraphicEntity[] | null = [];

 /*
  * OenGraphicToSave
  */
  public OenGraphicToSave?: IOenGraphicEntity[] | null = [];

 /*
  * OenLbMetadataToDelete
  */
  public OenLbMetadataToDelete?: IOenLbMetadataEntity[] | null = [];

 /*
  * OenLbMetadataToSave
  */
  public OenLbMetadataToSave?: OenLbMetadataComplete[] | null = [];

 /*
  * OenLvHeaderToSave
  */
  public OenLvHeaderToSave?: OenLvHeaderComplete[] | null = [];
}
