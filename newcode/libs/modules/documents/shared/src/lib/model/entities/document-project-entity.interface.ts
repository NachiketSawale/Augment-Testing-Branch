/*
 * Copyright(c) RIB Software GmbH
 */

import { IDocumentEntityGenerated } from './document-entity-generated.interface';

export interface IDocumentProjectEntity extends IDocumentEntityGenerated {
    /**
     * Lowest additional level of database identifier of entity
     */
    readonly PKey1?: number

    /**
     * Middle additional level of database identifier of entity
     */
    readonly PKey2?: number

    /**
     * Highest additional level of database identifier of entity
     */
    readonly PKey3?: number
}
