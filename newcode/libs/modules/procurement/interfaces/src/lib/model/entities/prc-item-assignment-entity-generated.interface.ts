/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IPrcItemAssignmentEntity} from './prc-item-assignment-entity.interface';
import {IEntityBase} from '@libs/platform/common';

export interface IPrcItemAssignmentEntityGenerated extends IEntityBase {

	/*
	 * BoqHeaderFk
	 */
	BoqHeaderFk?: number | null;

	/*
	 * BoqHeaderReference
	 */
	BoqHeaderReference?: string | null;

	/*
	 * BoqItemFk
	 */
	BoqItemFk?: number | null;

	/*
	 * EstHeaderFk
	 */
	EstHeaderFk: number;

	/*
	 * EstLineItemFk
	 */
	EstLineItemFk: number;

	/*
	 * EstResourceFk
	 */
	EstResourceFk?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsContracted
	 */
	IsContracted?: boolean | null;

	/*
	 * IsPackageStatusContracted
	 */
	IsPackageStatusContracted?: boolean | null;

	/*
	 * PackageCode
	 */
	PackageCode?: string | null;

	/*
	 * PackageStatusFk
	 */
	PackageStatusFk?: number | null;

	/*
	 * PrcItemAssignmentFk
	 */
	PrcItemAssignmentFk?: number | null;

	/*
	 * PrcItemAssignments
	 */
	PrcItemAssignments?: IPrcItemAssignmentEntity[] | null;

	/*
	 * PrcItemDescription1
	 */
	PrcItemDescription1?: string | null;

	/*
	 * PrcItemFk
	 */
	PrcItemFk?: number | null;

	/*
	 * PrcItemMaterialCode
	 */
	PrcItemMaterialCode?: string | null;

	/*
	 * PrcPackageFk
	 */
	PrcPackageFk: number;
}
