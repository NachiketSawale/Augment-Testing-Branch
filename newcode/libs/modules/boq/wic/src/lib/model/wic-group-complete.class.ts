/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { IWicGroup2ClerkEntity } from './entities/wic-group-2clerk-entity.interface';
import { IWicGroupEntity } from './entities/wic-group-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';
import { IBoqParentCompleteEntity } from '@libs/boq/main';
import { IWicBoqCompositeEntity } from '@libs/boq/interfaces';

//Generated with Schematics
export class WicGroupComplete implements CompleteIdentification<IWicGroupEntity>, IBoqParentCompleteEntity {

 /*
  * ClerksToDelete
  */
  public ClerksToDelete: IWicGroup2ClerkEntity[] | null = [];

 /*
  * ClerksToSave
  */
  public ClerksToSave: IWicGroup2ClerkEntity[] | null = [];

 /*
  * WicBoqCompositeToDelete
  */
  public WicBoqCompositeToDelete: IWicBoqCompositeEntity[] | null = [];

 /*
  * WicBoqCompositeToSave
  */
  public WicBoqCompositeToSave: IWicBoqCompositeEntity[] | null = [];

 /*
  * WicGroups
  */
  public WicGroups: IWicGroupEntity[] | null = [];
}
