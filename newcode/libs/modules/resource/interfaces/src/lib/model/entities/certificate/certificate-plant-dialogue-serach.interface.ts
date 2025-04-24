/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICertificatePlantSearchEntity extends IEntityBase {
	/*
	* Id
	*/
	Id: number;

	/*
	* ValidFrom
	*/
	ValidFrom?: string | null;

	/*
	 * ValidTo
	 */
	ValidTo?: string | null;

	/*
	* CertificateFk
	*/
	CertificateFk?: number | null;

	/*
	* PlantFk
	*/
	PlantFk?: number | null;

	/*
	* PlantFk
	*/
	PlantKindFk?: number | null;

	/*
	 * ValidTo
	 */
	Comment?: string | null;

	/*InsertedAt?: string | null;

	UpdatedAt?: string | null;

	InsertedBy?: number | null;

	UpdatedBy?: number | null;*/

}
