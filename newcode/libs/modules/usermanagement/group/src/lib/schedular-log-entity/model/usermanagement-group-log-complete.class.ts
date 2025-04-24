/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IJobEntity } from './entities/job-entity.interface';

/**
 * Usermanagement Group Log complete class
 */
export class UsermanagementGroupLogComplete implements CompleteIdentification<IJobEntity>{

	public Id: number = 0;

	public Datas: IJobEntity[] = [];

	
}
