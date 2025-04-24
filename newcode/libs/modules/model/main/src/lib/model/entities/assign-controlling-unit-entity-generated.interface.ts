/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IAssignControllingUnitEntityGenerated {

/*
 * controllingUnitId
 */
  controllingUnitId?: number | null;

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
}
