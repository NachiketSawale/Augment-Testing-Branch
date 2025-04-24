/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IObjectSetCreationEntity } from './object-set-creation-entity.interface';

export interface IAssignObjects2ObjectSetEntityGenerated {

/*
 * destination
 */
  destination?: 'FullModel' | 'SelectedSubtrees' | 'WithMeshOnly' | 'SelectionObjects' | null;

/*
 * modelId
 */
  modelId?: number | null;

/*
 * objectIds
 */
  objectIds?: string | null;

/*
 * objectSetCreationParams
 */
  objectSetCreationParams?: IObjectSetCreationEntity | null;

/*
 * objectSetId
 */
  objectSetId?: number | null;

/*
 * projectId
 */
  projectId?: number | null;
}
