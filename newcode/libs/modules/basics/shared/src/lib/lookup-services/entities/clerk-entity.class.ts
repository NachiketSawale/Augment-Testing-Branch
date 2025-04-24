/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase} from '@libs/platform/common';

export class ClerkEntity implements IEntityBase {
	public Description?: string | null;
	public TitleFk?: number | null;
	public FamilyName?: string | null;
	public FirstName?: string | null;
	public ValidFrom?: Date | null;
	public ValidTo?: Date | null;
	public Title?: string | null;
	public Department?: string | null;
	public Signature?: string | null;
	public Email?: string | null;
	public PrivatEmail?: string | null;
	public readonly InsertedAt?: Date;
	public readonly InsertedBy?: number;
	public readonly UpdatedAt?: Date;
	public readonly UpdatedBy?: number;
	public readonly Version?: number;

	public constructor(public Id: number, public Code: string) {
	}
}
