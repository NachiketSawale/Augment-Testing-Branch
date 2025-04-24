/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * The configuration object interface for dimension service
 */
export interface IDimensionServiceConfig {
    /**
     * Is dimension read only?
     */
    readonly?: boolean;
    /**
     * Where the dimension be used
     */
    objectUsageContract?: string;
    /**
     * Where to get dimension template
     */
    objectTemplateContract?: string;
    /**
     * Is header entity model object?
     */
    isHeaderModelObject?: boolean;
    /**
     * disable filtering by header entity selection
     */
    disableHeaderFilter?: boolean;
}