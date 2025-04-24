/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * qto address map
 */
export interface QtoShareAddressMap {
    IsUnique: boolean;
    IsSheetReadonly: boolean,
    ErrorSheet: boolean;
    ErrorIndex: boolean;
    ErrorLine: boolean;
    IsLiveOrReadable: boolean;
}