/*
 * Copyright(c) RIB Software GmbH
 */

import {CompleteIdentification} from '@libs/platform/common';
import {IChildModificationRegistration} from './child-modification-registration.interface';

/**
 * Interface for child (sub) element data service
 * @typeParam T -  entity type handled by the data service
 * @typeParam PT - entity type handled by the parent data service
 * @typeParam PU - complete entity of the parent data service for storage of own (complete) entities
 */
export interface INodeRoleModificationRegistration<T extends object, U extends CompleteIdentification<T>,
    PT extends object, PU extends CompleteIdentification<PT>> extends IChildModificationRegistration<T, PT, PU> {

    registerNodeModificationsToParentUpdate(parentUpdate: PU, modified: U[], deleted: T[]): void
}


