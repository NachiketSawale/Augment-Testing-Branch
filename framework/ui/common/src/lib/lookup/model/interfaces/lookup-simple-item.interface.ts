/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * represent a simple LookupItem
 */
export interface ILookupSimpleItem {
    /**
     * Id
     */
    id: number;
    /**
     * the property which is used as valueMember
     */
    itemValue: number;
    /**
     * the property which is used as displayMember
     */
    displayValue: string;
    /**
     * sorting order
     */
    sorting?: number;
    /**
     * default entity
     */
    isDefault?: boolean;
    /**
     * flag for entity usage
     */
    isLive?: boolean;
    /**
     * Icon id
     */
    icon?: number;
    /**
     * will be mapped on the client
     */
    customIntProperty?: number;
    /**
     * will be mapped on the client
     */
    customIntProperty1?: number;
    /**
     * will be mapped on the client
     */
    customBoolProperty?: boolean;
    /**
     * will be mapped on the client
     */
    customBoolProperty1?: boolean;
    /**
     * will be mapped on the client
     */
    masterDataContextFk?: number;
}