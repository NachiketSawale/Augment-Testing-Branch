import { CompleteIdentification } from '@libs/platform/common';
import { IChangeSetEntity } from './models';

export class ModelChangeSetComplete implements CompleteIdentification<IChangeSetEntity>{

	public Id: number = 0;

	public Datas: IChangeSetEntity[] | null = [];

	
}
