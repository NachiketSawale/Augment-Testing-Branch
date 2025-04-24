/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICheckBoxCategories {
    /**
    * Indicates whether the checkbox is checked.
    */
    isChecked: boolean,

    /**
    * The text associated with the checkbox category.
    */
    text: string,

    /**
    * Information about the category item.
    */
    item: {
        /**
        * The description of the category item.
        */
        Description: string;

        /**
        * The ID of the category item.
        */
        Id: number;
    }
}