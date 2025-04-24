import { CompleteIdentification } from '@libs/platform/common';
import { IActionEmployeeEntity, IActionEntity } from '@libs/project/interfaces';

export class ProjectMainActionComplete implements CompleteIdentification<IActionEntity>{

	public Id:number=0;
	public MainItemId: number =0;
	public ProjectId: number =0;
	public Action: IActionEntity | null =null;
	public ActionEmployeesToSave:IActionEmployeeEntity[] | null =[];
	public ActionEmployeesToDelete:IActionEmployeeEntity[] | null =[];


}
