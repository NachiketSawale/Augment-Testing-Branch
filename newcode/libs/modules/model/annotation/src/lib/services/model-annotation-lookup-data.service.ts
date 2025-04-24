/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IModelAnnotationEntity } from '../model/entities/model-annotation-entity.interface';

/**
 * The lookup data service for model annotations.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAnnotationLookupDataService<T extends object> extends UiCommonLookupTypeDataService<IModelAnnotationEntity, T> {

	public constructor() {
		super('ModelAnnotation', {
			uuid: 'fce3520fe4414774ac7e39a0a9af7b31',
			displayMember: 'DescriptionInfo.Translated',
			valueMember: 'Id'
		});
	}
}
