/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvAccountAssignmentEntity } from './inv-account-assignment-entity.interface';

export interface IInvAccountAssignmentCreateParameterGenerated {
	/*
	 * CompanyFk
	 */
	CompanyFk: number;

	/*
	 * ConHeaderFk
	 */
	ConHeaderFk?: number | null;

	/*
	 * CurrentDtos
	 */
	CurrentDtos?: IInvAccountAssignmentEntity[] | null;

	/*
	 * InvHeaderFk
	 */
	InvHeaderFk: number;

	/*
	 * ItemNO
	 */
	ItemNO: number;
}
