/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';

import { IJobEntity } from './entities/job-entity.interface';

/**
 * Services schedulerui job complete class
 */
export class ServicesSchedulerUIJobComplete implements CompleteIdentification<IJobEntity> {

	public Id: number = 0;

	public Datas: IJobEntity[] | null = [];


}
