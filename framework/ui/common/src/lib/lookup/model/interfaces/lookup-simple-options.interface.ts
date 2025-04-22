/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Simple lookup options
 */
export interface ILookupSimpleOptions {
    /**
     * Custom property name
     */
    customIntegerProperty?: string;
    /**
     * Custom property name
     */
    customIntegerProperty1?: string;
    /**
     * Custom property name
     */
    customBoolProperty?: string;
    /**
     * Custom property name
     */
    customBoolProperty1?: string;
    /**
     *
     */
    isColorBackGround?: string;
    /**
     *
     */
    serverName?: string;
    /**
     * The property name of entity which stores value of customIntegerProperty
     */
    field?: string;
    /**
     * The property name of entity which stores value of customIntegerProperty1
     */
    field1?: string;
    /**
     * The property name of entity which stores value of customBoolProperty
     */
    fieldBool?: string;
    /**
     * The property name of entity which stores value of customBoolProperty1
     */
    fieldBool1?: string;
}