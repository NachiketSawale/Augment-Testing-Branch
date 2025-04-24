/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { LazyInjectionToken } from '@libs/platform/common';
import { IParentChildLookupDialog } from './interfaces/lookup-parent-child.interface';

/**
 * Defines an injection token for lazy injection of `IGenericTwoGridLookup`.
 * This token can be used to provide configuration for generic grid lookups.
 */
export const PARENT_CHILD_LOOKUP_DIALOG_TOKEN = new InjectionToken<LazyInjectionToken<IParentChildLookupDialog>>('parentChildLookupDialogToken');


