/*
 * Copyright(c) RIB Software GmbH
 */

import {Orientation} from '@libs/platform/common';
import {IGridConfiguration} from '@libs/ui/common';
import {IEntityList, IEntitySelection} from '@libs/platform/data-access';
import {IGridContainerLink} from './grid-container-link.interface';

/**
 * Split grid container splitter
 */
export interface ISplitGridSplitter {
    /**
     * Splitter direction
     */
    direction: Orientation;
    /**
     * Splitter area size, [left, right] or [top, bottom]
     */
    areaSizes: [number, number];
}

/**
 * Split grid container link
 */
export interface ISplitGridContainerLink<T extends object, TP extends object> extends IGridContainerLink<T> {
    /**
     * Interaction with splitter
     */
    splitter: ISplitGridSplitter;
    /**
     * Interaction with parent grid
     */
    readonly parentGrid: {
        /**
         * The parent grid uuid
         */
        readonly uuid: string;
        /**
         * Reference to parent config configuration
         */
        config: IGridConfiguration<TP>;
        /**
         * The data in the grid
         */
        data: TP[] | undefined;
        /**
         * The data service the container is linked to.
         */
        readonly entitySelection: IEntitySelection<TP>;
        /**
         * Provides access to list capabilities.
         * Note that this may be `undefined` if the data service does not implement this interface.
         */
        readonly entityList?: IEntityList<TP>;
    };
}