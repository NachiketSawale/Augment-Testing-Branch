/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModelObjectEntityGenerated } from './model-object-entity-generated.interface';

export interface IModelObjectEntity extends IModelObjectEntityGenerated {

    CompoundId: string;

    selModelRole: string;
}
