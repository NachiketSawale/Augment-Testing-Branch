/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityTags } from './entity-tags.interface';


/**
 * The interface for submodules in a left-menubar.
 */
export interface ISubmodules {
    /**
    * The Name.
    */
    name: string;

    /**
    * The Url for open API.
    */
    urls: string[];

    /**
    * name of a module.
    */
    entityTags: IEntityTags[];
}
