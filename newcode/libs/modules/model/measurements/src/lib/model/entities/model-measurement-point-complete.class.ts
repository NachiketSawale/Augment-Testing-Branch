// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CompleteIdentification } from '@libs/platform/common';
import { IModelMeasurementPointEntity } from './model-measurement-point-entity.interface';

export class ModelMeasurementPointComplete implements CompleteIdentification<IModelMeasurementPointEntity>{

	public Id: number = 0;

	public Datas: IModelMeasurementPointEntity[] | null = [];
}
