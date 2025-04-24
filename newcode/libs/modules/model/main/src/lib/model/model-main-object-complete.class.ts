import { CompleteIdentification } from '@libs/platform/common';
import { IModelObjectEntity } from './models';

export class ModelObjectComplete implements CompleteIdentification<IModelObjectEntity>{

	public Id: number = 0;

	public Datas: IModelObjectEntity[] | null = [];

	
}