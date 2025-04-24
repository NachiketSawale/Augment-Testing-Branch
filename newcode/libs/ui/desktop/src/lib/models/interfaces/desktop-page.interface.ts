/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDefaultPage } from "./default-page.interface";

/** 
 * An interface for desktopTileList accumulator
 */
export interface IDesktopPage {

    /**
     * To store IDefaultPage objects with dynamic keys.
     */
    [key: string]: IDefaultPage

}