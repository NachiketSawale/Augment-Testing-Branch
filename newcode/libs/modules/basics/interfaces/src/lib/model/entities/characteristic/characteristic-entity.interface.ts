/*
 * Copyright(c) RIB Software GmbH
 */

import { ICharacteristicEntityGenerated } from './characteristic-entity-generated.interface';

export interface ICharacteristicEntity extends ICharacteristicEntityGenerated {
    /**
     * SectionId
     */
    SectionId?:number;
}
