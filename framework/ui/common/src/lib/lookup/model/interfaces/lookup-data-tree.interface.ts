/*
 * Copyright(c) RIB Software GmbH
 */

import {ILookupTreeConfig} from './lookup-options.interface';
import {IGridTreeConfiguration} from '../../../grid/model/grid-tree-configuration.interface';

/**
 * Lookup tree data extension, dealing with nested data.
 */
export interface ILookupDataTree<TItem extends object> {
    /**
     * Responsible for creating tree configuration for lookup grid
     */
    createTreeConfig(list: TItem[], config: ILookupTreeConfig<TItem>): IGridTreeConfiguration<TItem>;
}