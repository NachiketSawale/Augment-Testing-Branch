import { InjectionToken } from '@angular/core';
import { HsqeChecklistCreationType } from '../enums/hsqe-checklist-creation-type';

export const CREATE_CHECKLIST_TOKEN = new InjectionToken<ICreateChecklistOption>('CREATE_CHECKLIST_TOKEN');
export interface ICreateChecklistOption {
	createType: HsqeChecklistCreationType;
	projectFk: number | null | undefined;
	createDistinctChecklist: boolean;
	hasCheckListTemplate: boolean;
}
