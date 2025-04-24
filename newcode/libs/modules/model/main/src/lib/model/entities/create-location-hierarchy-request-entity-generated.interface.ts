/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICreateDataTreeLevelRequestEntity } from './create-data-tree-level-request-entity.interface';

export interface ICreateLocationHierarchyRequestEntityGenerated {

/*
 * AssignLocations
 */
  AssignLocations?: boolean | null;

/*
 * DataTreeId
 */
  DataTreeId?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Levels
 */
  Levels?: ICreateDataTreeLevelRequestEntity[] | null;

/*
 * ModelId
 */
  ModelId?: number | null;

/*
 * NullValueText
 */
  NullValueText?: string | null;

/*
 * OverwriteLocations
 */
  OverwriteLocations?: boolean | null;

/*
 * RootCode
 */
  RootCode?: string | null;

/*
 * RootDescription
 */
  RootDescription?: string | null;
}
