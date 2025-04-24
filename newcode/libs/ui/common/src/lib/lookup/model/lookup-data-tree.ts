/*
 * Copyright(c) RIB Software GmbH
 */

import {get} from 'lodash';
import {IIdentificationData} from '@libs/platform/common';
import {ILookupDataTree} from './interfaces/lookup-data-tree.interface';
import {IGridTreeConfiguration} from '../../grid/model/grid-tree-configuration.interface';
import {ILookupTreeConfig} from './interfaces/lookup-options.interface';

/**
 * Default lookup data tree extension class
 */
export class LookupDataTree<TItem extends object> implements ILookupDataTree<TItem> {

    /**
     * default constructor
     * @param identifier
     */
    public constructor(public identifier: (e: TItem) => IIdentificationData) {

    }

    public createTreeConfig(list: TItem[], config: ILookupTreeConfig<TItem>): IGridTreeConfiguration<TItem> {
        const identifier = this.identifier;

        return {
            parent(e: TItem) {
                const parentFk = get(e, config.parentMember);

                if (parentFk) {
                    return list.find(item => identifier(item).id === parentFk) || null;
                }

                return null;
            },
            children(e: TItem) {
                if (config.childMember) {
                    return get(e, config.childMember) as TItem[] || [];
                }

                const parentFk = get(e, config.parentMember);

                return list.reduce((result: TItem[], item) => {
                    if (identifier(item).id === parentFk) {
                        result.push(item);
                    }
                    return result;
                }, []) || [];
            },
            ...config
        };
    }
}