/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IModelAnnotationReferenceEntity } from '../model/entities/model-annotation-reference-entity.interface';
import { ModelAnnotationDataService } from './model-annotation-data.service';
import { IModelAnnotationEntity } from '../model/entities/model-annotation-entity.interface';
import { IModelAnnotationCompleteEntity } from '../model/entities/model-annotation-complete-entity.interface';
export const MODEL_ANNOTATION_REFERENCE_DATA_TOKEN = new InjectionToken<ModelAnnotationReferenceDataService>('modelAnnotationReferenceDataToken');

@Injectable({
	providedIn: 'root'
})

export class ModelAnnotationReferenceDataService extends DataServiceFlatLeaf<IModelAnnotationReferenceEntity,IModelAnnotationEntity, IModelAnnotationCompleteEntity> {

	public constructor(private modelAnnotationDataService: ModelAnnotationDataService) {
		const options: IDataServiceOptions<IModelAnnotationReferenceEntity> = {
			apiUrl: 'model/annotation/ref/',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
                    return { mainItemId : ident.pKey1};
                }
			},
			
			roleInfo: <IDataServiceChildRoleOptions<IModelAnnotationReferenceEntity,IModelAnnotationEntity,IModelAnnotationCompleteEntity>>{
                role: ServiceRole.Leaf,
                itemName: 'Transaction',
                parent: modelAnnotationDataService
            }
		};

		super(options);
	}
	
}





		
			





