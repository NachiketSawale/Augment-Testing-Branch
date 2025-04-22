/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IAssignLocationEntityGenerated {

/*
 * destination
 */
  destination?: 'FullModel' | 'SelectedSubtrees' | 'WithMeshOnly' | 'SelectionObjects' | null;

/*
 * locationId
 */
  locationId?: number | null;

/*
 * modelId
 */
  modelId?: number | null;

/*
 * objectIds
 */
  objectIds?: string | null;
}
