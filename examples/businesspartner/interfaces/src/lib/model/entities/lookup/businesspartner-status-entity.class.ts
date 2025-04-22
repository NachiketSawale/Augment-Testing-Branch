/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export class BusinessPartnerStatusEntity {
	public Selected?: boolean;
	public Id!: number;
	public Icon!: number;
	public AccessRightDescriptor2Fk?: number | null;
	public AccessRightDescriptor3Fk?: number | null;
	public EditName!: boolean;
	public MessageInfo!: IDescriptionInfo;
	public IsReadonly!: boolean;
	public AccessRightDescriptor4Fk?: number | null;
	public IsApproved!: boolean;
	public Description?: string | null;
}
