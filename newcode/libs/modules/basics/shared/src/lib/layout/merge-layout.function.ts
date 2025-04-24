/*
 * Copyright(c) RIB Software GmbH
 */

import {mergeWith, isArray} from 'lodash';
import {ILayoutConfiguration, ILayoutGroup} from '@libs/ui/common';

export function mergeLayout<T extends object>(...layoutConfigs: Partial<ILayoutConfiguration<T>>[]) : ILayoutConfiguration<T> {
    let result: ILayoutConfiguration<T> = {
        groups: []
    };

    layoutConfigs.forEach(layoutConfig => {
        result = mergeWith(result, layoutConfig, (objValue, srcValue, key) => {
            if (key === 'groups' && isArray(objValue) && isArray(objValue)) {
                // merge groups
                return mergeGroup(objValue, srcValue);
            }

            // merging is handled by the method instead
            return undefined;
        });
    });

    return result;
}

export function mergeGroup<T extends object>(objValue: ILayoutGroup<T>[], srcValue: ILayoutGroup<T>[]) {
    const mergedGroups = [...objValue];
    srcValue.forEach(group => {
        const sameGroup = objValue.find(e => e.gid === group.gid);

        if (sameGroup) {
            const mergedIndex = objValue.indexOf(sameGroup);
            const mergedGroup = mergeWith(sameGroup, group, (objValue, srcValue, key) => {
                if (key === 'attributes' && isArray(objValue) && isArray(objValue)) {
                    return objValue.concat(srcValue);
                }
                // merging is handled by default merge method instead
                return undefined;
            });
            mergedGroups.splice(mergedIndex, 1, mergedGroup);
        } else {
            mergedGroups.push(group);
        }
    });
    return mergedGroups;
}