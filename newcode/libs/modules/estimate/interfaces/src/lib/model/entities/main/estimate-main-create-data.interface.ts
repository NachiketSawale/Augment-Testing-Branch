/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstResourceEntity } from './estimate-resource-base-entity.interface';

export interface IEstimateCreationData {
	MainItemId: number;
	estHeaderFk: number;
	estLineItemFk: number;
	parentId?: number;
	currency1Fk?: number;
	currency2Fk?: number;
	parent?: IEstResourceEntity;
	projectId?: number | null;

	/*
	 * IsDisabled
	 */
	IsDisabled?: boolean | null;

	/*
	 * Currency1Fk
	 */
	Currency1Fk?: number | null;

	/*
	 * Currency2Fk
	 */
	Currency2Fk?: number | null;

	/*
	 * resourceItemId
	 */
	resourceItemId?: number;

	/*
	 * sortNo
	 */
	sortNo?: number;
}
