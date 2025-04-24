/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IMtwoPowerbiItemEntity } from './mtwo-powerbiitem-entity.interface';

/**
 * Mtwo Control Tower Report complete class.
 */
export class MtwoControlTowerReportComplete implements CompleteIdentification<IMtwoPowerbiItemEntity>{

	public MainItemId : number = 0;

	public Data: IMtwoPowerbiItemEntity[] | null = [];
	
}
