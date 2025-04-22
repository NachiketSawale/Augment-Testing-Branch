/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IObjectSet2ObjectEntity } from './entities/object-set-2object-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';
import { IObjectSetEntity } from './entities/object-set-entity.interface';

export class ObjectSetComplete implements CompleteIdentification<IObjectSetEntity>{

 /*
  * MainItemId
  */
  public MainItemId?: number | null = 10;

 /*
  * ObjectSet
  */
  public ObjectSet?: IObjectSetEntity | null = {
    Id: 0,
    ObjectSetStatusFk: 0,
    ObjectSetTypeFk: 0,
    ProjectFk: 0,
    CompoundId: '',
    selModelRole: ''
  };

 /*
  * ObjectSet2ObjectToDelete
  */
  public ObjectSet2ObjectToDelete?: IObjectSet2ObjectEntity[] | null = [];

 /*
  * ObjectSet2ObjectToSave
  */
  public ObjectSet2ObjectToSave?: IObjectSet2ObjectEntity[] | null = [];
}
