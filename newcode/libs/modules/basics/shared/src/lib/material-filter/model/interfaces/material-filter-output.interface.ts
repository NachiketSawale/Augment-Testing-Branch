/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialSearchEntity } from '../../../material-search';
import { IEntityFilterOutput } from '../../../entity-filter';

/**
 * Interface representing the output for material filtering.
 */
export interface IMaterialFilterOutput extends IEntityFilterOutput<IMaterialSearchEntity> {

	// todo: we should use general properties from IEntityFilterOutput after backend is updated to general solution.
	/** Material count found */
	MaterialsFound: number;

	/** Material entities */
	Materials: IMaterialSearchEntity[];

	/**
	 * Whether it has more materials
	 */
	HasMoreMaterials?: boolean;
	// todo: we should use general properties from IEntityFilterOutput after backend is updated to general solution.
}
