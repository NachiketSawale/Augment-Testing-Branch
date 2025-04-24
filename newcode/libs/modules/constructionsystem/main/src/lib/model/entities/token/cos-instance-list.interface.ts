/*
 * Copyright(c) RIB Software GmbH
 */
import { InjectionToken } from '@angular/core';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';

export const COS_INSTANCE_LIST_TOKEN = new InjectionToken<ICosInstanceList>('COS_INSTANCE_LIST_TOKEN');

export interface ICosInstanceList {
	instances: ICosInstanceEntity[] | [];
}
