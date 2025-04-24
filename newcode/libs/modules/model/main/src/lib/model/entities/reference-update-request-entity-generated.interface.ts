/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IReferenceTypeUpdateEntity } from './reference-type-update-entity.interface';

export interface IReferenceUpdateRequestEntityGenerated {

/*
 * FromModelId
 */
  FromModelId?: number | null;

/*
 * ReferenceTypes
 */
  ReferenceTypes?: IReferenceTypeUpdateEntity[] | null;

/*
 * ToModelId
 */
  ToModelId?: number | null;
}
