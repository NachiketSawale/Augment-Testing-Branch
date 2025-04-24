/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IModelAnnotationDocumentEntity } from '../model/entities/model-annotation-document-entity.interface';
import { IModelAnnotationEntity } from '../model/entities/model-annotation-entity.interface';
import { IModelAnnotationCompleteEntity } from '../model/entities/model-annotation-complete-entity.interface';
import { ModelAnnotationDataService } from './model-annotation-data.service';

export const MODEL_ANNOTATION_DOCUMENT_DATA_TOKEN = new InjectionToken<ModelAnnotationDocumentDataService>('modelAnnotationDocumentDataToken');

@Injectable({
	providedIn: 'root'
})

export class ModelAnnotationDocumentDataService extends DataServiceFlatLeaf<IModelAnnotationDocumentEntity,IModelAnnotationEntity, IModelAnnotationCompleteEntity> {

	public constructor(private modelAnnotationDataService: ModelAnnotationDataService) {
		const options: IDataServiceOptions<IModelAnnotationDocumentEntity> = {
			apiUrl: 'model/annotation/doc/',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
                    return { mainItemId : ident.pKey1};
                }
			},
			roleInfo: <IDataServiceChildRoleOptions<IModelAnnotationDocumentEntity,IModelAnnotationEntity,IModelAnnotationCompleteEntity>>{
                role: ServiceRole.Leaf,
                itemName: 'Transaction',
                parent: modelAnnotationDataService
            }
		};

		super(options);
	}
	

}





		
			





