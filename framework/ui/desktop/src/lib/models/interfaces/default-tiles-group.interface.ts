/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ITileGroup } from "./tile-group.interface";

/** 
 * An interface for tileGroupList accumulator
 */
export interface IDefaultTilesGroup {
    /**
     * To store ITileGroup objects with dynamic keys.
     */
    [key:string]: ITileGroup;

}