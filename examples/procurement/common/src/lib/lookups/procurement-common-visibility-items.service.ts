/*
 * Copyright(c) RIB Software GmbH
 */
import { ITranslatable } from '@libs/platform/common';

/**
 * Visibility Items Interface
 */
interface IVisibilityItems {
	/**
	 * visibility items id
	 */
	id: number,

	/**
	 * visibility items display name
	 */
	displayName: ITranslatable
}

/**
 * Procurement Common Visibility Items data
 */

export const PrcCommonVisibilityItems: IVisibilityItems[] = [
	{
		id: 1,
		displayName: {
			text: 'Visible in Standard',
			key: 'procurement.common.visibilityOption.standardOnly',
		},
	},
	{
		id: 2,
		displayName: {
			text: 'Visible in Portal',
			key: 'procurement.common.visibilityOption.portalOnly',
		},
	},
	{
		id: 3,
		displayName: {
			text: 'Visible in Standard&Portal',
			key: 'procurement.common.visibilityOption.standardPortal',
		},
	},
];