import { CompleteIdentification } from '@libs/platform/common';
import { IChangeEntity } from './models';

export class ModelChangeComplete implements CompleteIdentification<IChangeEntity>{

	public Id: number = 0;

	public Datas: IChangeEntity[] | null = [];

	
}
