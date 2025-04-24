import { CompleteIdentification } from '@libs/platform/common';
import { IGeneralEntity } from '@libs/project/interfaces';

export class ProjectMainGeneralComplete implements CompleteIdentification<IGeneralEntity>{

	public Id: number = 0;

	public Datas: IGeneralEntity[] | null = [];


}
