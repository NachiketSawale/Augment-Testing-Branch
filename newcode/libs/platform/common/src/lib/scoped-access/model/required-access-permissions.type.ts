/*
 * Copyright(c) RIB Software GmbH
*/

import { Permissions } from '../../model';

/**
 * Object type used to retrieve all descriptors for each permission item
 * along with descriptor and permission data for each acces scope.
 */
export type AccessPermissionData = RequiredAccessPermission & AllDescriptorsData;


/**
 * Object type used to specify descriptor and permission data for each acces scope
 */
export type RequiredAccessPermission = {
    u: Record<string, Permissions>[];
    r: Record<string, Permissions>[];
    g: Record<string, Permissions>[];
    p: Record<string, Permissions>[];
}

/**
 * Object type used to retrieve all descriptors for each permission item.
 */
export type AllDescriptorsData = {
    allDescriptors: Array<string>;
}
