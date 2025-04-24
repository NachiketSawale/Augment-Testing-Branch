/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import { ContainerDefinition } from '@libs/ui/container-system';
import { ModelSharedDrawingContainerComponent } from '../components/drawing-container/drawing-container.component';
import { DrawingViewerOptionsToken, IDrawingViewerOptions } from './interfaces';

/**
 * Drawing container definition configuration
 */
interface DrawingContainerDefinitionConfig {
	/**
	 * Container UUID
	 */
	uuid: string;
	/**
	 * Container title
	 */
	title?: Translatable;
}

/**
 * Drawing container definition generator
 */
export class DrawingContainerDefinition {
	/**
	 * Create PDF viewer container
	 * @param config
	 * @param viewerOptions
	 */
	public static createPDFViewer(config: DrawingContainerDefinitionConfig, viewerOptions?: IDrawingViewerOptions): ContainerDefinition {
		config.title = config.title || {
			text: 'PDF Viewer',
			key: 'model.wdeviewer.pdfTitle',
		};

		return this.createDrawingContainer(config, viewerOptions);
	}

	/**
	 * Create 2D viewer container
	 * @param config
	 * @param viewerOptions
	 */
	public static create2DModelViewer(config: DrawingContainerDefinitionConfig, viewerOptions?: IDrawingViewerOptions): ContainerDefinition {
		config.title = config.title || {
			text: '2D Viewer',
			key: 'model.wdeviewer.title',
		};

		return this.createDrawingContainer(config, viewerOptions);
	}

	private static createDrawingContainer(config: DrawingContainerDefinitionConfig, viewerOptions?: IDrawingViewerOptions): ContainerDefinition {
		return new ContainerDefinition({
			id: 'model.wdeviewer.ige',
			containerType: ModelSharedDrawingContainerComponent,
			title: config.title!,
			uuid: config.uuid,
			permission: '7b1f2a36a94245ecb03dd964e79d2254',
			providers: viewerOptions
				? [
						{
							provide: DrawingViewerOptionsToken,
							useValue: viewerOptions,
						},
					]
				: undefined,
		});
	}
}
