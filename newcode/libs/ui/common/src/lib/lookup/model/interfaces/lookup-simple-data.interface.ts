/*
 * Copyright(c) RIB Software GmbH
 */

import {ILookupSimpleItem} from './lookup-simple-item.interface';

/**
 * Simple lookup data
 */
export interface ILookupSimpleData {
    /**
     * the name of the entity which is used for lookup
     */
    lookupModuleQualifier: string;
    /**
     * the property which is used as displayMember
     */
    displayProperty: string;
    /**
     * the property which is used as valueMember
     */
    valueProperty: string;
    /**
     * Custom Property of type int for getting addtional infomation e.g. a Lookup Items foreign Key
     */
    customIntegerProperty: string;
    /**
     * Custom Property of type int for getting addtional infomation e.g. a Lookup Items foreign Key
     */
    customIntegerProperty1: string;
    /**
     * Custom Property of type int for getting addtional infomation e.g. a Lookup Items foreign Key
     */
    customBoolProperty: string;
    /**
     * Custom Property of type int for getting addtional infomation e.g. a Lookup Items foreign Key
     */
    customBoolProperty1: string;
    /**
     * the lookup items from db
     */
    items: ILookupSimpleItem[];
}