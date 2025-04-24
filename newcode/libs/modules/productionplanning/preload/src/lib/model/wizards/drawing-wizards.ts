/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

export const DRAWING_WIZARDS: IWizard[] = [
	{
		uuid: 'dea77d3e3d7b4db4b2ec0983b56cb46c',
		name: 'enableDrawing',
		execute: (context) => {
			return import('@libs/productionplanning/drawing').then((module) => {
				const service = context.injector.get(module.DrawingEnableWizardService);
				service.onStartEnableWizard();
			});
		},
	},
	{
		uuid: 'e1c699c1d7724f5bb3795e630c0a5155',
		name: 'disableDrawing',
		execute: (context) => {
			return import('@libs/productionplanning/drawing').then((module) => {
				const service = context.injector.get(module.DrawingDisableWizardService);
				service.onStartDisableWizard();
			});
		},
	},
	{
		uuid: 'fd40c676504e465e8d53aa205265877a',
		name: 'changeDrawingStatus',
		execute(context) {
			return import('@libs/productionplanning/drawing').then((module) => {
				const service = context.injector.get(module.DrawingChangeStatusWizardService);
				service.onStartChangeStatusWizard();
			});
		},
	},
	{
		uuid: '95119eb4a47749b5a032cc225e2fdd11',
		name: 'enableComponent',
		execute: (context) => {
			return import('@libs/productionplanning/drawing').then((module) => {
				const service = context.injector.get(module.DrawingComponentEnableWizardService);
				service.onStartEnableWizard();
			});
		},
	},
	{
		uuid: '8c6b8fce25154b8d957b62934aaac0c7',
		name: 'disableComponent',
		execute: (context) => {
			return import('@libs/productionplanning/drawing').then((module) => {
				const service = context.injector.get(module.DrawingComponentDisableWizardService);
				service.onStartDisableWizard();
			});
		},
	},
	{
		uuid: 'e423a477ef5a4512837a4b31560223ab',
		name: 'changeComponentStatus',
		execute(context) {
			return import('@libs/productionplanning/drawing').then((module) => {
				const service = context.injector.get(module.DrawingComponentChangeStatusWizardService);
				service.onStartChangeStatusWizard();
			});
		},
	},
	{
		uuid: 'bf459791761a43a8bb6fd4d2294bd0d4',
		name: 'enableDrawingProductTemplate',
		execute(context) {
			return import('@libs/productionplanning/drawing').then((module) => {
				const service = context.injector.get(module.DrawingProductTempateEnableWizardService);
				service.onStartEnableWizard();
			});
		},
	},
	{
		uuid: 'e0dde0445cc545c7b8a6ca9fab10ad71',
		name: 'disableDrawingProductTemplate',
		execute(context) {
			return import('@libs/productionplanning/drawing').then((module) => {
				const service = context.injector.get(module.DrawingProductTemplateDisableWizardService);
				service.onStartDisableWizard();
			});
		},
	},
];
