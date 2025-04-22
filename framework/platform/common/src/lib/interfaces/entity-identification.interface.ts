/**
 * IEntityIdentification. Intended for the identifications of database entities on the client.
 * Simple keys and key combined from up to four integer values are supported.
 * The naming of the properties (Pascal Case) reflects the server side base of the entities.
 */

export interface IEntityIdentification {
    // ToDo Check if we need a more general concept (generic) due to string or other data types as ID

    /**
     * Basic level of database identifier of entity
     */
    readonly Id: number

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
