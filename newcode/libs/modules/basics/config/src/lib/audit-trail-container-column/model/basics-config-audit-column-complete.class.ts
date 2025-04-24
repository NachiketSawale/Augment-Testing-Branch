/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';

import { IAudColumnEntity } from './entities/aud-column-entity.interface';

/**
 * Basics config audit trail column complete class.
 */
export class BasicsConfigAuditColumnComplete implements CompleteIdentification<IAudColumnEntity>{

	public MainItemId : number = 0;

	public Datas: IAudColumnEntity[] | null = [];

	
}
