/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IModelMeasurementPointEntity } from '../model/entities/model-measurement-point-entity.interface';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ModelMeasurementPointBehavior implements IEntityContainerBehavior<IGridContainerLink<IModelMeasurementPointEntity>, IModelMeasurementPointEntity> {
	public onCreate(containerLink: IGridContainerLink<IModelMeasurementPointEntity>): void {
	}
}