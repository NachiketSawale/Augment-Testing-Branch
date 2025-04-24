/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
    IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import {IQtoDetailDocumentEntity} from '../model/entities/qto-detail-document-entity.interface';
import {IQtoMainDetailGridEntity} from '../model/qto-main-detail-grid-entity.class';
import {QtoMainDetailGridComplete} from '../model/qto-main-detail-grid-complete.class';
import {QtoMainDetailGridDataService} from '../services/qto-main-detail-grid-data.service';
import {DocumentDataLeafService} from '@libs/documents/shared';
import {QtoMainDetailDocumentValidationService} from './qto-main-detail-document-validation.service';
import {QtoMainDeatilDocumentComplete} from './qto-main-deatil-document-complete.class';
import {forEach} from 'lodash';
import {PlatformConfigurationService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class QtoMainDetailDocumentDataService extends DocumentDataLeafService<IQtoDetailDocumentEntity,IQtoMainDetailGridEntity, QtoMainDetailGridComplete >{
    private parentService: QtoMainDetailGridDataService;
    public dataValidationService ? :QtoMainDetailDocumentValidationService;
    private configService = inject(PlatformConfigurationService);
    private readonly http = inject(HttpClient);
    public constructor(QtoMainDetailGridDataService: QtoMainDetailGridDataService) {
        const options: IDataServiceOptions<IQtoDetailDocumentEntity>  = {
            apiUrl: 'qto/detail/document',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'listByParent',
                usePost: true,
                prepareParam: (ident) => {
                    return {PKey1: ident.pKey1};
                }
            },
            createInfo:<IDataServiceEndPointOptions>{
                endPoint:'create',
                usePost: true,
                prepareParam: (ident) => {
                    return {PKey1: ident.pKey1};
                }
            },
            deleteInfo: <IDataServiceEndPointOptions>{
                endPoint: 'delete'
            },
            roleInfo: <IDataServiceChildRoleOptions<IQtoDetailDocumentEntity,IQtoMainDetailGridEntity, QtoMainDetailGridComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'QtoDetailDocuments',
                parent: QtoMainDetailGridDataService
            }
        };

        super(options);
        this.parentService = QtoMainDetailGridDataService;
    }
    protected override provideLoadPayload() {
        const parentSelection = this.getSelectedParent();
        if (parentSelection) {
            return {
                mainItemId: parentSelection.Id
            };
        }
        return {
            mainItemId: -1
        };
    }
    protected override checkCreateIsAllowed(entities: IQtoDetailDocumentEntity[] | IQtoDetailDocumentEntity | null): boolean {
        return !this.isReadonly();
    }
    protected override checkDeleteIsAllowed(entities: IQtoDetailDocumentEntity[] | IQtoDetailDocumentEntity | null): boolean {
        return !this.isReadonly();
    }
    public override getSavedEntitiesFromUpdate(complete: QtoMainDeatilDocumentComplete): IQtoDetailDocumentEntity[] {
        if (complete && complete.QtoDetailDocumentsToSave) {
            return complete.QtoDetailDocumentsToSave;
        }
        if (complete && complete.QtoDetailDocumentsToDelete) {
            return complete.QtoDetailDocumentsToDelete;
        }
        return [];
    }
    public override  delete(entities: IQtoDetailDocumentEntity[] | IQtoDetailDocumentEntity) {
        super.delete(entities);
        // TODO: Temporarily commenting out to resolve eslint the error.
        // let temEntity: IQtoDetailDocumentEntity;
        if (Array.isArray(entities)) {
            // temEntity = entities[0];
            this.deleteEntities(entities);
        } else {
            // temEntity = entities;
        }
    }
    protected createDataValidationService() {
        return new QtoMainDetailDocumentValidationService(this);
    }
    public override uploadAndCreateDocs(){
        //todo : wait DocumentDataLeafService support
    }
    /**
     * Obtain information about the uploaded file
     * @protected
     */
    private fileUploaded(currItem : IQtoDetailDocumentEntity, fileInfo : object) {
        // todo : common logic is not available
        // let promise = !_.isEmpty(currItem) ? $q.when(currItem) : self.createItemWithoutSelection();
        // promise.then(function (docItem) {
        //     let documentType = serviceContainer.service.getDocumentType(fileInfo.fileName);
        //     if (!_.isNull(documentType) && _.has(documentType, 'Id')) {
        //         docItem.DocumentTypeFk = documentType.Id;
        //     }
        //     docItem.DocumentDate = moment.utc(Date.now());
        //     docItem.FileArchiveDocFk = fileInfo.FileArchiveDocId;
        //     docItem.OriginFileName = angular.isString(fileInfo.fileName) ? fileInfo.fileName.substring(0, 42) : '';
        //
        //     // re-validate
        //     let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
        //     let validationServ = $injector.get('platformValidationByDataService').getValidationServiceByDataService(self);
        //     _.each(['FileArchiveDocFk', 'QtoDetailDocumentTypeFk', 'OriginFileName'], function (fieldName) {
        //         platformRuntimeDataService.applyValidationResult(validationServ['validate'+fieldName](docItem, docItem[fieldName], fieldName), docItem, fieldName);
        //     });
        //     self.markItemAsModified(docItem);
        // });
    }
    /**
     * Create a new object when no data is selected
     * @protected
     */
    private createItemWithoutSelection(){
        //todo wait platformDataServiceSelectionExtension
        // let data = serviceContainer.data;
        // return $http.post(data.httpCreateRoute + data.endCreate, data.doPrepareCreate(data)).then(function (resp) {
        //     let newItem = resp.data;
        //     if(data.addEntityToCache){
        //         data.addEntityToCache(newItem, data);
        //     }
        //     data.itemList.push(newItem);
        //     platformDataServiceActionExtension.fireEntityCreated(data, newItem);
        //     return newItem;
    }
    /**
     * Delete data and delete uploaded files
     * @protected
     */
    private async deleteEntities(items : IQtoDetailDocumentEntity[]) {
        const collectionIds : number[] = [];
        forEach(items,function (item) {
            if(item.Version === 0 && item.FileArchiveDocFk !== 0){
                collectionIds.push(item.FileArchiveDocFk);
            }
        });

        // TODO: Temporarily commenting out to resolve eslint the error.
        // const resp = await firstValueFrom(this.http.post(
        //     `${this.configService.webApiBaseUrl}basics/common/document/deletefilearchivedoc`,
        //     collectionIds));

    }
    /**
     * Get parent entity  readonly status
     * @protected
     */
    private isReadonly(){
        const parentEntity = this.parentService.getSelectedEntity();
        if(parentEntity){
            return parentEntity.IsReadonlyStatus;
        } else {
            return  false;
        }
    }
}