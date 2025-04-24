import { CompleteIdentification } from '@libs/platform/common';
import { IActionEmployeeEntity } from '@libs/project/interfaces';

export class ProjectMainActionEmployeeComplete implements CompleteIdentification<IActionEmployeeEntity>{

	public Id: number = 0;

	public Datas: IActionEmployeeEntity[] | null = [];


}
