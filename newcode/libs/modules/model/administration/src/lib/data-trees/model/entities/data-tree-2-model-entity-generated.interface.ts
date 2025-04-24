/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IDataTreeEntity } from './data-tree-entity.interface';

export interface IDataTree2ModelEntityGenerated extends IEntityBase {

/*
 * AssignLocations
 */
  AssignLocations: boolean;

/*
 * DataTreeEntity
 */
  DataTreeEntity?: IDataTreeEntity | null;

/*
 * DataTreeFk
 */
  DataTreeFk: number;

/*
 * Id
 */
  Id: number;

/*
 * ModelFk
 */
  ModelFk: number;

/*
 * OverwriteLocations
 */
  OverwriteLocations: boolean;
}
