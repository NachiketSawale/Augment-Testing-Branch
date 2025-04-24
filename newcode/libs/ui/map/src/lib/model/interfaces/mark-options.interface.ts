
/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface that store mark option object.
 */
export interface IMarkOptions{

    /**
     * Address latitude.
     */
    latitude: number | null;

    /**
     * Address longitude.
     */
	longitude: number | null;

    /**
     * Address.
     */
	address: string;

    /**
     * Mark center status.
     */
    disableSetCenter?:boolean
}