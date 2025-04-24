/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface representing information about additional components.
 */
export interface IOtherComponentsRecord {
   
    /**
     * Name of the component.
     */
    componentName : string,

    /**
     * The build number of the component.
     */
    buildNr: number | string,

    /**
     * Build version of the component.
     */
    buildVersion:string,

    /**
     * Build date of the component.
     */
    buildDate: Date | string,

    /**
     * Additional Info about componants
     */
    additionalInfo: string,   
}
