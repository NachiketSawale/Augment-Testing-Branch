import { HsqeChecklistCreationType } from '../enums/hsqe-checklist-creation-type';
import { HsqeChecklistCreationMode } from '../enums/hsqe-checklist-creation-mode';

export interface IChecklistCreationParams {
	projectId: number | null | undefined;
	checkListTemplateId: number | null;
	fromCheckListTemplate: HsqeChecklistCreationType;
	createCheckListFlg?: HsqeChecklistCreationMode;
	createDistinctChecklist?: boolean;
}
