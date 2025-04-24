/*
 * Copyright(c) RIB Software GmbH
 */
import { ITranslatable } from '@libs/platform/common';

export enum MasterRestrictionType {
	wicBoq = 1,
	prjBoq = 2,
	packageBoq = 3,
	material = 4,
	contractBoq = 5
}

/**
 * CopyType Items Interface
 */
interface ICopyTypeItems {
	/**
	 * CopyType items id
	 */
	id: number,

	/**
	 * CopyType items display name
	 */
	displayName: ITranslatable
}

/**
 * Procurement Common CopyType Items data
 */

export const PrcCommonCopyTypeItems: ICopyTypeItems[] = [
	{
		id: MasterRestrictionType.wicBoq,
		displayName: {
			text: 'WIC BoQ',
			key: 'procurement.common.copyTypeWicBoq',
		},
	},
	{
		id: MasterRestrictionType.prjBoq,
		displayName: {
			text: 'Project BoQ',
			key: 'procurement.common.copyTypePrjBoq',
		},
	},
	{
		id: MasterRestrictionType.packageBoq,
		displayName: {
			text: 'Package BoQ',
			key: 'procurement.common.copyTypePacBoq',
		},
	},
	{
		id: MasterRestrictionType.material,
		displayName: {
			text: 'Material',
			key: 'procurement.common.copyTypeMaterial',
		},
	},
	{
		id: MasterRestrictionType.contractBoq,
		displayName: {
			text: 'Procurement Contract BoQ',
			key: 'procurement.common.copyTypeConBoq',
		},
	}
];