/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';





/**
 * Used to store variable list
 */
export interface IVariableList {
    /**
     * code
     */
    Code: string;

    /**
     * is live
     */
    Islive: boolean;

    /**
     * Unique ID of the language
     */
    Id: number;

    /**
     * Description Info
     */
    DescriptionInfo?: IDescriptionInfo;


    /**
     * Sorting order
     */
    Sorting: number;

    /**
     * Whether the language is default or not
     */
    IsDefault: boolean;

    /**
     * Date and time when the language was inserted
     */
    InsertedAt: Date;

    /**
     * User ID of the person who inserted
     */
    InsertedBy: number;

    /**
     * Date and time of the latest updated
     */
    UpdatedAt: Date | null;

    /**
     * User ID of the person who performed the latest update
     */
    UpdatedBy: number | null;

    /**
     * Version of the item
     */
    Version: number;


}