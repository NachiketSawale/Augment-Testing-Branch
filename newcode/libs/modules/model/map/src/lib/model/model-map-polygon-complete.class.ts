import { CompleteIdentification } from '@libs/platform/common';
import { IModelMapPolygonEntity } from './entities/model-map-polygon-entity.interface';

export class ModelMapPolygonComplete implements CompleteIdentification<IModelMapPolygonEntity>{

	public Id: number = 0;

	public Datas: IModelMapPolygonEntity[] | null = [];

	
}
