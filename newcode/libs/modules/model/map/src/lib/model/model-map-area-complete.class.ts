import { CompleteIdentification } from '@libs/platform/common';
import { IModelMapAreaEntity } from './entities/model-map-area-entity.interface';

export class ModelMapAreaComplete implements CompleteIdentification<IModelMapAreaEntity>{

	public Id: number = 0;

	public Datas: IModelMapAreaEntity[] | null = [];

	
}
