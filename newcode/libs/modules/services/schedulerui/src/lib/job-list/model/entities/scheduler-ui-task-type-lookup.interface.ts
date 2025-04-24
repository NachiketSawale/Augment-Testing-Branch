/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IParameterList } from './parameter-list.interface';

/**
 * Schedulerui Task Type lookup entity
 */
export interface ISchedulerUITaskTypeLookup {
    /*
   * AllowChangeContext
   */
    AllowChangeContext?: boolean | null;

    /*
     * Description
     */
    Description?: string | null;

    /*
    * Id
    */
    Id?: string | null;

    /**
     * ParameterList
     */
    ParameterList: IParameterList[];

    /**
     * RunInUserContext
     */
    RunInUserContext: boolean;

    /**
     * TaskName
     */
    TaskName: string;

    /**
     * UiChangeable
     */
    UiChangeable: boolean;

    /**
     * UiCreate
     */
    UiCreate: boolean;

    /**
     * UiDelete
     */
    UiDelete: boolean
}