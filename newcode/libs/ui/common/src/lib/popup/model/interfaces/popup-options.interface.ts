/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ElementRef, StaticProvider } from '@angular/core';

/**
 * Popup options interface
 */
export interface IPopupOptions {
	/**
	 * Custom providers for popup
	 */
	providers?: StaticProvider[];
	/**
	 * decimal value, default 0, popup window width.
	 */
	width?: number | string;
	/**
	 * decimal value, default 0, popup window height
	 */
	height?: number | string;
	/**
	 * decimal value, default 0, popup window min-width.
	 */
	minWidth?: number;
	/**
	 * decimal value, default 0, popup window width.
	 */
	maxWidth?: number;
	/**
	 * decimal value, default 0, popup window min-height
	 */
	minHeight?: number;
	/**
	 * decimal value, default 0, popup window height
	 */
	maxHeight?: number;

	// element, footer content for popup window.
	//footer?: HTMLElement;

	// string | HTMLElement | component, footer content
	// footerContent?: any;

	// element, popup window will open under this element.
	// focusedElement?: ElementRef | HTMLElement,

	/**
	 * element, stop closing popup window if event 'click' occurs in this element and its content.
	 */
	relatedElement?: ElementRef;

	// function, callback after stop resizing.
	// resizeStop?: Function;

	// function, callback to clear external resource after closing popup window.
	// clear?: Function;

	// boolean, default false, if it is true, then resize feature and footer will be disabled,
	// popup window will be similar to standard combo popup window
	//plainMode?: boolean; // replace with options resizable and showFooter

	/**
	 * is allowed to resize popup or not
	 */
	resizable?: boolean;
	/**
	 * show header or not
	 */
	showHeader?: boolean;
	/**
	 * show footer or not
	 */
	showFooter?: boolean,
	/**
	 * allow opening multi popup window.
	 */
	multiPopup?: boolean;
	/**
	 * popup window level, will affect z-index of popup element
	 */
	level?: number;

	/**
	 * popup alignment, 'vertical' | 'horizontal'
	 */
	alignment?: string;

	/**
	 * z-index for popup
	 */
	zIndex?: number;
	/**
	 * Popup container css class
	 */
	containerClass?: string;
	/**
	 * boolean, optional, default false, if it is true, service will save popup window size to local storage after resize
	 * window, then next time open window it will have size the same as last time resize.
	 */
	showLastSize?: boolean;
	/**
	 * has same width with owner element or not.
	 */
	hasDefaultWidth?: boolean;

	/**
	 * Base point of popup window, used for open popup menu.
	 */
	basePoint?: { pageX: number, pageY: number };
}

export interface IPopupConfig extends IPopupOptions {
	/**
	 * required, show header or not
	 */
	showHeader: boolean;
	/**
	 * required, show footer or not
	 */
	showFooter: boolean,
	/**
	 * required, popup alignment, 'vertical' | 'horizontal'
	 */
	alignment: string;
}