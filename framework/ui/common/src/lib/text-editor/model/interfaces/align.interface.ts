/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Used to stored align icons data.
 */
export interface IAlign {
    /**
     * For align center
     */
    center: string;

    /**
    * For align right
    */
    right: string;

    /**
     * for align justify
     */
    justify: string;

    /**
     * for align left
     */
    left?: string;
}