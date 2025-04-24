/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ISubmodules } from './sub-modules.interface';


/**
 * The interface for modules in a left-menubar.
 */
export interface IModules {
        /**
         * The Name.
         */
        name: string;

        /**
         * Submodules in a module.
         */
        subModules: ISubmodules[];
}

