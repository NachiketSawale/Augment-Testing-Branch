/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData } from '@libs/platform/common';

export interface IClearAssignedObjectAttributesEntityGenerated {

/*
 * CostGroupDeletion
 */
  CostGroupDeletion?: IIdentificationData[] | null;

/*
 * controllingUnit
 */
  controllingUnit?: boolean | null;

/*
 * destination
 */
  destination?: 'FullModel' | 'SelectedSubtrees' | 'WithMeshOnly' | 'SelectionObjects' | null;

/*
 * location
 */
  location?: boolean | null;

/*
 * modelId
 */
  modelId?: number | null;

/*
 * objectIds
 */
  objectIds?: string | null;
}
