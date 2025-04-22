/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcPackageEntity } from '@libs/procurement/interfaces';

export interface INewBaseRequisitionResult {
	RequsitionId: number;
	Package: IPrcPackageEntity;
}
