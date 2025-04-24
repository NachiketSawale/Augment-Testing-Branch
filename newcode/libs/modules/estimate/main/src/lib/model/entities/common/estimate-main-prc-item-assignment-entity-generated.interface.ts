/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPrcItemAssignmentEntity } from './estimate-main-prc-item-assignment-entity.interface';
import { IPrcPackageEntity } from './estimate-main-prc-package-entity.interface';

export interface IPrcItemAssignmentEntityGenerated {
	/*
	 * Item1
	 */
	Item1?: IPrcPackageEntity[] | null;

	/*
	 * Item2
	 */
	Item2?: IPrcItemAssignmentEntity[] | null;
}
