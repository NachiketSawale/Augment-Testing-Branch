/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';

export class ProductionplanningStrandpatternEntity implements IEntityIdentification {
	public Id!: number;
	public Code!: string;
	public Description!: string;
	public CadCode!: string;
	public BasBlobsFk!: number;
	public Sorting!: number;

	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}
