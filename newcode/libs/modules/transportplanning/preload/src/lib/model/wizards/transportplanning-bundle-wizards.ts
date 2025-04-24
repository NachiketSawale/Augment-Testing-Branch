import { IWizard } from '@libs/platform/common';

export const TRANSPORTPLANNING_BUNDLE_WIZARDS: IWizard[] = [
	{
		uuid: '5d16a3c4313c4ac5aac5081ed158fd74',
		name: 'changeBundleStatus',
		execute(context): Promise<void> | undefined {
			return import('@libs/transportplanning/bundle').then((module) => new module.TransportPlanningBundleWizard().changeBundleStatus(context));
		},
	},
	{
		uuid: '71971307faea44bba2746ce521c41647',
		name: 'enableBundle',
		execute: async (context) => {
			const module = await import('@libs/transportplanning/bundle');
			return new module.TransportPlanningBundleWizard().enableBundle(context);
		},
	},
	{
		uuid: 'e272c441c313404c80eed31aeb529ee4',
		name: 'disableBundle',
		execute: async (context) => {
			const module = await import('@libs/transportplanning/bundle');
			return new module.TransportPlanningBundleWizard().disableBundle(context);
		},
	},
];
