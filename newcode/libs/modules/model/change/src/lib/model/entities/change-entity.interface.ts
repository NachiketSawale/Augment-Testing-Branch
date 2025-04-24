/*
 * Copyright(c) RIB Software GmbH
 */

import { IChangeEntityGenerated } from './change-entity-generated.interface';

export interface IChangeEntity extends IChangeEntityGenerated {
    ValueCmp: string;
    Value: string;
    CompoundId: string;

}
