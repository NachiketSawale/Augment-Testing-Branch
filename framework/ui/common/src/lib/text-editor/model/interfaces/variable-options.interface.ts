/*
 * Copyright(c) RIB Software GmbH
 */

import { IVariableList } from './variable-list.interface';



/**
 * used to store variable dropdown options
 */
export interface IVariableOptions {
    /**
     * current variable list
     */
    current: IVariableList | null;

    /**
     * variable list
     */
    list: IVariableList[];

    /**
     * is visible
     */
    visible: boolean;
}

