/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken, ProviderToken } from '@angular/core';
import { DrawingDisplayMode } from '../enums';
import { IDimensionService } from './dimension-service.interface';
import { IMarkupService } from './markup-service.interface';

/**
 * Drawing viewer configuration
 */
export interface IDrawingViewerConfig {
	/**
	 * Default display mode
	 */
	displayMode: DrawingDisplayMode;

	/**
	 * Set viewer to read only.
	 */
	readonly: boolean;
	/**
	 * Can show dimension on the viewer
	 */
	canShowDimension?: boolean;

	/**
	 * Can edit dimension on the viewer
	 */
	canEditDimension?: boolean;

	/**
	 * Dimension service, if viewer is expected to handle dimension, it should be passed outside
	 */
	dimensionService?: ProviderToken<IDimensionService>;

	/**
	 * Enable 3D feature
	 */
	enable3D?: boolean;

	/**
	 * Markup service, if viewer is expected to handle markup, it should be passed outside
	 */
	markupService?: ProviderToken<IMarkupService>;

	/**
	 * Ignore pinning model or not when container initializes
	 */
	ignorePinningModel?: boolean;
}

export type IDrawingViewerOptions = Partial<IDrawingViewerConfig>;

export const DrawingViewerOptionsToken = new InjectionToken<IDrawingViewerOptions>('drawing-viewer-options');
