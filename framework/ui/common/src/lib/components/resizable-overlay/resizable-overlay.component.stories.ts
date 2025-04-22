/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Meta, moduleMetadata } from '@storybook/angular';
import { ResizableOverlayComponent } from './resizable-overlay.component';
import { ResizableOverlayContentComponent } from '../resizable-overlay-content/resizable-overlay-content.component';

export default {
	title: 'ResizableOverlayComponent',
	component: ResizableOverlayComponent,
	decorators: [
		moduleMetadata({
			imports: [],
			declarations: [ResizableOverlayContentComponent],
			providers: [],
		}),
	],
} as Meta<ResizableOverlayComponent>;

export const resizeWithTopLeft = {
	render: (args: ResizableOverlayComponent) => ({
		props: args,
	}),
	args: {
		dragDirection: 'topLeft',
	},
};

export const resizeWithTopRight = {
	render: (args: ResizableOverlayComponent) => ({
		props: args,
	}),
	args: {
		dragDirection: 'topRight',
	},
};
