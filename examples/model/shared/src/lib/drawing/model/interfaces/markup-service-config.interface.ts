/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * The configuration object interface for markup service
 */
export interface IMarkupServiceConfig {
    /**
     * Is markup read only?
     */
    readonly?: boolean;
    /**
     * Is header entity model object?
     */
    isHeaderModelObject?: boolean;
    /**
     * disable filtering by header entity selection
     */
    disableHeaderFilter?: boolean;
}