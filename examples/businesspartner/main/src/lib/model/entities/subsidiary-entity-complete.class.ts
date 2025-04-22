/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ISubsidiaryEntity } from '@libs/businesspartner/interfaces';

export class SubsidiaryEntityComplete implements CompleteIdentification<ISubsidiaryEntity> {
	public MainItemId: number = 0;
	public Subsidiary: ISubsidiaryEntity | null = null;
}