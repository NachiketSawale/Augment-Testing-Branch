/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IDataTreeEntity } from './data-tree-entity.interface';
import { IPropertyKeyEntity } from '../../../property-keys/model/entities/property-key-entity.interface';

export interface IDataTreeLevelEntityGenerated extends IEntityBase {

/*
 * CodePattern
 */
  CodePattern?: string | null;

/*
 * DataTreeEntity
 */
  DataTreeEntity?: IDataTreeEntity | null;

/*
 * DataTreeFk
 */
  DataTreeFk: number;

/*
 * DescriptionPattern
 */
  DescriptionPattern?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * LevelIndex
 */
  LevelIndex?: number | null;

/*
 * PropertyKeyEntity
 */
  PropertyKeyEntity?: IPropertyKeyEntity | null;

/*
 * PropertyKeyFk
 */
  PropertyKeyFk: number;

/*
 * Sorting
 */
  Sorting: number;
}
