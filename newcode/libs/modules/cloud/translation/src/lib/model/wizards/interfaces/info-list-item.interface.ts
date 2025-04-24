/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';


/**
 * Interface representing an InfoList  in a key-value pair list.
 */
export interface IInfoListItem {
    /**
     * Key for the information item.
     */
    key: Translatable ;

    /**
     * Value associated with the key.
     */
    value: Translatable 
}