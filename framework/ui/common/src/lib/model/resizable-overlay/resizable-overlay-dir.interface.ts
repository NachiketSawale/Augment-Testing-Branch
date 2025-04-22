/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IResizingPoints } from './resizing-points.interface';

/**
 * An interface  that stores resizable overlay object.
 */
export interface IResizableOverlayDir {
	/**
	 * Resizing points.
	 */
	resizingPoints: IResizingPoints;

	/**
	 * Overlay width.
	 */
	width: number;

	/**
	 * Overlay height.
	 */
	height: number;

	/**
	 * Resizing aspect ratio.
	 */
	aspectRatio?: number;
}
