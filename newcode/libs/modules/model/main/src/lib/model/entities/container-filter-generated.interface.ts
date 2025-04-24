/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModelElementIdEntity } from './model-element-id-entity.interface';

export interface IContainerFilterGenerated {

/*
 * ContainerIds
 */
  ContainerIds?: number[] | null;

/*
 * ModelId
 */
  ModelId?: number | null;

/*
 * ObjectFks
 */
  ObjectFks?: IModelElementIdEntity[] | null;

/*
 * ObjectIds
 */
  ObjectIds?: IModelElementIdEntity[] | null;
}
