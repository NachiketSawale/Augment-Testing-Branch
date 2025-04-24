import { CompleteIdentification } from '@libs/platform/common';
import { IKeyFigureEntity } from '@libs/project/interfaces';

export class ProjectMainKeyFigureComplete implements CompleteIdentification<IKeyFigureEntity>{

	public Id: number = 0;

	public Datas: IKeyFigureEntity[] | null = [];


}
