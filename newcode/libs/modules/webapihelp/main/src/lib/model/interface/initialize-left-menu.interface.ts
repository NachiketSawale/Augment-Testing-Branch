/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModules } from './modules.interface';

/**
 * The interface for Initilized the sidebar data.
 */
export interface IInitializeLeftMenu {
    /**
     * The Api routes
     */
    apiRoutes : string[];

    /**
     * The Initialized
     */
    initialized : boolean;

    /**
     * The modules for Left sidebar
     */
    modules : IModules[];

    /**
     * The Swagger ui need Init
     */
    swaggerUINeedInit : boolean;
}