/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IDataTreeEntity } from './data-tree-entity.interface';
import { IDataTree2ModelEntity } from './data-tree-2-model-entity.interface';
import { IDataTreeLevelEntity } from './data-tree-level-entity.interface';

export interface IDataTreeComplete extends CompleteIdentification<IDataTreeEntity>{

 /*
  * DataTree2ModelsToDelete
  */
  DataTree2ModelsToDelete?: IDataTree2ModelEntity[] | null;

 /*
  * DataTree2ModelsToSave
  */
  DataTree2ModelsToSave?: IDataTree2ModelEntity[] | null;

 /*
  * DataTreeLevelsToDelete
  */
  DataTreeLevelsToDelete?: IDataTreeLevelEntity[] | null;

 /*
  * DataTreeLevelsToSave
  */
  DataTreeLevelsToSave?: IDataTreeLevelEntity[] | null;

 /*
  * DataTrees
  */
  DataTrees?: IDataTreeEntity | null;

 /*
  * MainItemId
  */
  MainItemId?: number | null;
}
