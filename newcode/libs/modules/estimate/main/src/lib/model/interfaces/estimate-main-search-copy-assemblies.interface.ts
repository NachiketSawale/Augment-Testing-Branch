/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity } from '@libs/estimate/assemblies';

/**
 * Interface representing the main search assemblies for an estimate.
 */
export interface IEstimateMainSerachCopyAssemblies {
	/*
	 * is header entity selected
	 */
	ProjectId: number;
	/*
	 * FromAssembly
	 */
	FromAssembly: string;
	/*
	 * IsLookAtCopyOptions
	 */
	IsLookAtCopyOptions: boolean;
	/*
	 * EstHeaderFk
	 */
	EstHeaderFk: number;
	/*
	 * LineItems
	 */
	LineItems: IEstLineItemEntity[];
}
