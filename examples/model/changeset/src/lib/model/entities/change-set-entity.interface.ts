/*
 * Copyright(c) RIB Software GmbH
 */

import { IChangeSetEntityGenerated } from './change-set-entity-generated.interface';

export interface IChangeSetEntity extends IChangeSetEntityGenerated {

    CompoundId: string;

    selModelRole: string;
 
}
