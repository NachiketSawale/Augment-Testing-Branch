/*
 * Copyright(c) RIB Software GmbH
 */
import { ITranslatable } from '@libs/platform/common';

/**
 * Visibility Items Interface
 */
interface IVisibilityItems {
    /**
     * visibility items id
     */
    id:number,

    /**
     * visibility items display name
     */
    displayName:ITranslatable
}

/**
 * Visibility Items data
 */

export const visibilityItems:IVisibilityItems[] = [
    {
        id: 1,
        displayName: {
            text: '',
            key: 'basics.config.visibility.standardOnly',
        },
    },
    {
        id: 2,
        displayName: {
            text: '',
            key: 'basics.config.visibility.portalOnly',
        },
    },
    {
        id: 3,
        displayName: {
            text: '',
            key: 'basics.config.visibility.standardPortal',
        },
    },
];