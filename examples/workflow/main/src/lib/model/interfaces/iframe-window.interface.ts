/*
 * Copyright(c) RIB Software GmbH
 */


/**
 * Used to extend window object for iframe
 */
export interface IFrameWindow extends Window {
	serviceMap: Map<string, object>;
}