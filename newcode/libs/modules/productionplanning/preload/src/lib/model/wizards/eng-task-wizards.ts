import { IInitializationContext, IWizard } from '@libs/platform/common';

export const ENG_TASK_WIZARDS: IWizard[] = [
	{
		uuid: 'b454a7ec751c4ff389d97151c3dce7bb',
		name: 'changeEngineeringTaskStatus',
		execute(context: IInitializationContext) {
			return import('@libs/productionplanning/engineering').then((module) => new module.EngTaskWizard().changeStatus(context));
		},
	},
	{
		uuid: 'ac57e25c1fd5456599a86f36ecdcef4d',
		name: 'enableTask',
		execute: (context) => {
			return import('@libs/productionplanning/engineering').then((module) => new module.EngTaskWizard().enable(context));
		},
	},
	{
		uuid: 'beb395e1c60e4734a1d3bd16b795f707',
		name: 'disableTask',
		execute: (context) => {
			return import('@libs/productionplanning/engineering').then((module) => new module.EngTaskWizard().disable(context));
		},
	},
	{
		uuid: '6f6d5c81d4a64d6684eb993029329656',
		name: 'Change Status For Project document',
		execute(context) {
			return import('@libs/productionplanning/engineering').then((module) => new module.EngTaskWizard().changeDocumentProjectStatus(context));
		},
	},
];
