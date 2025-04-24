import { ITranslatable } from '@libs/platform/common';

interface IPackageImportStatusItems {
	/**
	 * visibility items id
	 */
	id: number;

	/**
	 * visibility items display name
	 */
	displayName: ITranslatable;
}

export const PackageImportStatusItems: IPackageImportStatusItems[] = [
	{
		id: 1,
		displayName: {
			text: 'Canceled',
			key: 'procurement.package.lookup.canceled',
		},
	},
	{
		id: 2,
		displayName: {
			text: 'Succeed',
			key: 'procurement.package.lookup.succeed',
		},
	},
	{
		id: 3,
		displayName: {
			text: 'Failed',
			key: 'procurement.package.lookup.failed',
		},
	},
	{
		id: 4,
		displayName: {
			text: 'Warning',
			key: 'procurement.package.lookup.warning',
		},
	},
];
