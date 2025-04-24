import { CompleteIdentification } from '@libs/platform/common';
import { IModelObjectEntity } from './models';

export class ModelObjectHierarchicalComplete implements CompleteIdentification<IModelObjectEntity>{

    public Id: number = 0;

	public Datas: IModelObjectEntity[] | null = [];
}