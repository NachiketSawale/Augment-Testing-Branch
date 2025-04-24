/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface representing a build record.
 */
export interface IBuildRecord {

    /**
     * Unique identifier.
     */
    id:number | string,

    /**
     * Build number.
     */
    buildNr: string | number,

    /**
     * Module to which the build belongs.
     */
    module: string,

    /**
     * Build order of the record.
     */
    buildOrder: string | number,

    /**
     * timestamp when the record was inserted.
     */
    inserted: string |Date,

    /**
     * version number 
     */
    version: string |number,

    /**
     * who inserted information.
     */
    whoIsr: string,
}
