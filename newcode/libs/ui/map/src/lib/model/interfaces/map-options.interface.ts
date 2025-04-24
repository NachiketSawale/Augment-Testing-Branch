/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface that store map option object.
 */
export interface IMapOptions{
    /**
     * Map API loaded status.
     */
    loaded?: boolean;

    /**
     * Provider name.
     */
    Provider: string;

    /**
     * Bing map Key.
     */
    BingKey: string;

    /**
     * Google map Key.
     */
    GoogleKey: string;

    /**
     * Baidu map Key.
     */
    BaiduKey: string;

    /**
     * Map options status.
     */
    showByDefault?: boolean
}