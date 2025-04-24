/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ISwaggerInformation } from './swagger-info.interface';


/**
 * The interface for swagger Documentation.
 */
export interface ISwaggerData {

    /**
     * Version of swagger
     */
    swagger: string;

    /**
     * Total number of pages
     */
    RIBDocTotalPage: number;

    /**
     * Current index number of swagger document
     */
    RIBDocCurrentPageIndex: number;

    /**
     * Document information
     */
    info: ISwaggerInformation;

    /**
     * Host name
     */
    host: string;

    /**
     * The Base path of a swagger
     */
    basePath: string;

    /**
     * schemas 
     */
    schemes: string[];

    /**
     * APi Paths 
     */
    paths: object;

    /**
     * Defination
     */
    definitions: object;
}