/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IModelMeasurementEntity } from '../model/entities/model-measurement-entity.interface';
import { Injectable } from '@angular/core';


@Injectable({
	providedIn: 'root'
})
export class ModelMeasurementBehavior implements IEntityContainerBehavior<IGridContainerLink<IModelMeasurementEntity>, IModelMeasurementEntity> {

	public onCreate(containerLink: IGridContainerLink<IModelMeasurementEntity>): void {
	}
}