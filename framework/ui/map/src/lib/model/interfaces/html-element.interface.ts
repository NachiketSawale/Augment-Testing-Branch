/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that stores htmlElement object.
 */

export interface IHtmlElement extends HTMLElement{

    /**
     * leaflet flag.
     */
    _leaflet?:boolean;
}