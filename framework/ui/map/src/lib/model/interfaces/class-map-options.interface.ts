/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that stores map options object.
 */
export interface IClassMapOptions{
    /**
     * ShowScalebar.
     */
    showScalebar: boolean;

    /**
     *CustomizeOverlays.
     */
    customizeOverlays: boolean;

    /**
     * ShowBreadcrumb.
     */
    showBreadcrumb: boolean;

    /**
     * ShowDashboard.
     */
    showDashboard?: boolean;
}