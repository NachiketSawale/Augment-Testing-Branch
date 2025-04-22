/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvHeaderEntity } from './inv-header-entity.interface';
import { IDescriptionInfo } from '@libs/platform/common';
import { IInvStatus2externalEntity } from './inv-status-2-external-entity.interface';

export interface IInvStatusEntityGenerated {
	/*
	 * AccessRightDescriptorFk
	 */
	AccessRightDescriptorFk?: number | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * FrmAccessrightdescriptor1Fk
	 */
	FrmAccessrightdescriptor1Fk?: number | null;

	/*
	 * FrmAccessrightdescriptor2Fk
	 */
	FrmAccessrightdescriptor2Fk?: number | null;

	/*
	 * FrmAccessrightdescriptor3Fk
	 */
	FrmAccessrightdescriptor3Fk?: number | null;

	/*
	 * FrmAccessrightdescriptor4Fk
	 */
	FrmAccessrightdescriptor4Fk?: number | null;

	/*
	 * FrmAccessrightdescriptor5Fk
	 */
	FrmAccessrightdescriptor5Fk?: number | null;

	/*
	 * FrmAccessrightdescriptor6Fk
	 */
	FrmAccessrightdescriptor6Fk?: number | null;

	/*
	 * Icon
	 */
	Icon: number;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvHeaderEntities
	 */
	InvHeaderEntities?: IInvHeaderEntity[] | null;

	/*
	 * InvStatus2externalEntities
	 */
	InvStatus2externalEntities?: IInvStatus2externalEntity[] | null;

	/*
	 * IsCanceled
	 */
	IsCanceled: boolean;

	/*
	 * IsChained
	 */
	IsChained: boolean;

	/*
	 * IsDefault
	 */
	IsDefault: boolean;

	/*
	 * IsPosted
	 */
	IsPosted: boolean;

	/*
	 * IsReadOnly
	 */
	IsReadOnly: boolean;

	/*
	 * IsVerifedBL
	 */
	IsVerifedBL: boolean;

	/*
	 * IsVirtual
	 */
	IsVirtual: boolean;

	/*
	 * Islive
	 */
	Islive: boolean;

	/*
	 * Isstock
	 */
	Isstock: boolean;

	/*
	 * Isvalidatereference
	 */
	Isvalidatereference: boolean;

	/*
	 * Sorting
	 */
	Sorting: number;

	/*
	 * ToBeVerifiedBL
	 */
	ToBeVerifiedBL: boolean;
}
