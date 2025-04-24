/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot, ServiceRole } from '@libs/platform/data-access';

import { IModelAnnotationEntity } from '../model/entities/model-annotation-entity.interface';
import { IModelAnnotationCompleteEntity } from '../model/entities/model-annotation-complete-entity.interface';

/**
 * The data service for model annotations.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAnnotationDataService extends DataServiceFlatRoot<IModelAnnotationEntity, IModelAnnotationCompleteEntity> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super({
			apiUrl: 'model/annotation',
			readInfo: {
				endPoint: 'filtered',
				usePost: true
			},
			roleInfo: {
				role: ServiceRole.Root,
				itemName: 'ModelAnnotations'
			}
		});
	}

	protected override checkDeleteIsAllowed(entities: IModelAnnotationEntity[] | IModelAnnotationEntity | null): boolean {
		if (entities) {
			const delItems = Array.isArray(entities) ? entities : [entities];

			if (delItems.some(a => a.RawType !== 0)) {
				return false;
			}
		}

		return super.checkDeleteIsAllowed(entities);
	}
}





