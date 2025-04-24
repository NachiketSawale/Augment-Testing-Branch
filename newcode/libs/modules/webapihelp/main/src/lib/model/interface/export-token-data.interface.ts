/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * The Interface for provide data for check api call.
 */

export interface IExportToken { 
    /**
     * Export token 
     */
    exportToken : string;
    
    /**
     * Search Input
     */
    SearchFilter:string; 
}