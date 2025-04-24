/*
 * Copyright(c) RIB Software GmbH
 */
import { InjectionToken } from '@angular/core';

export const COS_IMAGE_TOKEN = new InjectionToken<ICreateDefectOption>('COS_IMAGE_TOKEN');

export interface ICreateDefectOption {
	instanceId: number | null;
	instanceHeaderFk: number | null;
}
