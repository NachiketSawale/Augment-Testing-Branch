/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData } from '@libs/platform/common';

export interface IAssignCostGroupsEntityGenerated {

/*
 * CostGroupAssignments
 */
  CostGroupAssignments?: IIdentificationData[] | null;

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
