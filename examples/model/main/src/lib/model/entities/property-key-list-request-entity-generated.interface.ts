/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IPropertyKeyListRequestEntityGenerated {

/*
 * idText
 */
  idText?: string | null;

/*
 * ids
 */
  ids?: number[] | null;

/*
 * ignoreAssignedUoM
 */
  ignoreAssignedUoM?: boolean | null;

/*
 * ignoreEmptyUoM
 */
  ignoreEmptyUoM?: boolean | null;

/*
 * mode
 */
  mode?: 'Model' | 'Objects' | 'Meshes' | 'Keys' | null;

/*
 * modelId
 */
  modelId?: number | null;
}
