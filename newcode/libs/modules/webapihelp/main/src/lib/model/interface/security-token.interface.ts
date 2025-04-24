/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * The Interface for provide data for Initialization api for download document.
 */

export interface ISecurityToken { 
    /**
     * Security token for download document
     */
    SecurityToken : string;
    
    /**
     * Search Input
     */
    SearchFilter:string; 
}