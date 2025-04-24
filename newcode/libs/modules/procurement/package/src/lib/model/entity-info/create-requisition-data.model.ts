import { InjectionToken } from '@angular/core';
import { IProjectChangeEntity } from '@libs/procurement/shared';

export interface ICreateRequisitionData {
	hasContractItem: boolean;
	defaultChange: IProjectChangeEntity | null;
}

export const CREATE_REQUISITION_DATA_TOKEN = new InjectionToken<ICreateRequisitionData>('create-requisition-data-token');
