/*
 * Copyright(c) RIB Software GmbH
 */

import {Orientation} from '@libs/platform/common';


/**
 * Split grid container splitter
 */
export interface ISplitGridParentChildSplitter {
    /**
     * Splitter direction
     */
    direction: Orientation;
    /**
     * Splitter area size, [left, right] or [top, bottom]
     */
    areaSizes: [number, number];
}

