import { CompleteIdentification } from '@libs/platform/common';
import { IModelMapEntity } from './entities/model-map-entity.interface';

export class ModelMapComplete implements CompleteIdentification<IModelMapEntity>{

	public Id: number = 0;

	public Datas: IModelMapEntity[] | null = [];
}
