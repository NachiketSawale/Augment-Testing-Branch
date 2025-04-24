import { CompleteIdentification } from '@libs/platform/common';
import { IActionEmployeeEntity } from './action-employee-entity.interface';
import { IActionEntity } from './action-entity.interface';

export interface IProjectMainActionComplete extends CompleteIdentification<IActionEntity>{

	MainItemId: number | null;
	ProjectId: number | null;
	Action: IActionEntity | null;
	ActionEmployeesToSave:IActionEmployeeEntity[] | null;
	ActionEmployeesToDelete:IActionEmployeeEntity[] | null;

}
