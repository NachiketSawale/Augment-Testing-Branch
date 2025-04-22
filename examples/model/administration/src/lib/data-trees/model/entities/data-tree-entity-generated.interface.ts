/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IDataTree2ModelEntity } from './data-tree-2-model-entity.interface';
import { IDataTreeLevelEntity } from './data-tree-level-entity.interface';

export interface IDataTreeEntityGenerated extends IEntityBase {

/*
 * CompanyFk
 */
  CompanyFk: number;

/*
 * DataTree2ModelEntities
 */
  DataTree2ModelEntities?: IDataTree2ModelEntity[] | null;

/*
 * DataTreeLevelEntities
 */
  DataTreeLevelEntities?: IDataTreeLevelEntity[] | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * LevelCount
 */
  LevelCount?: number | null;

/*
 * NodeCount
 */
  NodeCount?: number | null;

/*
 * PropertyKeyNames
 */
  PropertyKeyNames?: string | null;

/*
 * RootCode
 */
  RootCode?: string | null;

/*
 * RootDescription
 */
  RootDescription?: string | null;

/*
 * UnsetText
 */
  UnsetText?: string | null;
}
