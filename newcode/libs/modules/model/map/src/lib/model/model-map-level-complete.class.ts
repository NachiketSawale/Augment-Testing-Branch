import { CompleteIdentification } from '@libs/platform/common';
import { IModelMapLevelEntity } from './entities/model-map-level-entity.interface';

export class ModelMapLevelComplete implements CompleteIdentification<IModelMapLevelEntity>{

	public Id: number = 0;

	public Datas: IModelMapLevelEntity[] | null = [];

	
}
