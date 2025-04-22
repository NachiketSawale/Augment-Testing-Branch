/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IInvHeaderEntity } from './inv-header-entity.interface';

export interface IInvCertificateEntityGenerated extends IEntityBase {
	/*
	 * BPName1
	 */
	BPName1?: string | null;

	/*
	 * BpdCertificateFk
	 */
	BpdCertificateFk?: number | null;

	/*
	 * BpdCertificateTypeFk
	 */
	BpdCertificateTypeFk: number;

	/*
	 * BusinessPartnerFk
	 */
	BusinessPartnerFk?: number | null;

	/*
	 * Code
	 */
	Code?: string | null;

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * ExpirationDate
	 */
	ExpirationDate?: Date | string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvHeaderEntity
	 */
	InvHeaderEntity?: IInvHeaderEntity | null;

	/*
	 * InvHeaderFk
	 */
	InvHeaderFk: number;

	/*
	 * IsMandatory
	 */
	IsMandatory: boolean;

	/*
	 * IsMandatorySubSub
	 */
	IsMandatorySubSub: boolean;

	/*
	 * IsRequired
	 */
	IsRequired: boolean;

	/*
	 * IsRequiredSubSub
	 */
	IsRequiredSubSub: boolean;

	/*
	 * RequiredAmount
	 */
	RequiredAmount: number;

	/*
	 * RequiredBy
	 */
	RequiredBy?: Date | string | null;

	/*
	 * ValidFrom
	 */
	ValidFrom?: Date | string | null;

	/*
	 * ValidTo
	 */
	ValidTo?: Date | string | null;
}
