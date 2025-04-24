/*
 * Copyright(c) RIB Software GmbH
*/

import { AccessScope } from './access-scope.enum';

/**
 * Object type used for check access rights result.
 */
export type CheckAccessRightsResult = {
    [AccessScope.User]: boolean;
    [AccessScope.Role]: boolean;
    [AccessScope.Global]: boolean;
};