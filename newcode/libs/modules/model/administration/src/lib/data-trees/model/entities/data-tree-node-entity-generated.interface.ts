/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDataTreeNodeEntity } from './data-tree-node-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IDataTreeNodeEntityGenerated extends IEntityBase {

/*
 * BasUomFk
 */
  BasUomFk?: number | null;

/*
 * ChildDataTreeNodeEntities
 */
  ChildDataTreeNodeEntities?: IDataTreeNodeEntity[] | null;

/*
 * DataTreeFk
 */
  DataTreeFk: number;

/*
 * DataTreeLevelFk
 */
  DataTreeLevelFk?: number | null;

/*
 * DataTreeNodeFk
 */
  DataTreeNodeFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsUnset
 */
  IsUnset: boolean;

/*
 * ParentDataTreeNodeEntity
 */
  ParentDataTreeNodeEntity?: IDataTreeNodeEntity | null;

/*
 * Sorting
 */
  Sorting: number;

/*
 * ValueBool
 */
  ValueBool: boolean;

/*
 * ValueDate
 */
  ValueDate: string;

/*
 * ValueLong
 */
  ValueLong: number;

/*
 * ValueNumber
 */
  ValueNumber: number;

/*
 * ValueText
 */
  ValueText?: string | null;
}
