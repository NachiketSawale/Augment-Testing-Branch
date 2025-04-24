/*
 * Copyright(c) RIB Software GmbH
 */
import { InjectionToken } from '@angular/core';
export const CREATE_DEFECT_TOKEN = new InjectionToken<ICreateDefectOption>('CREATE_DEFECT_TOKEN');
export interface ICreateDefectOption {
	projectFk: number | null;
}
