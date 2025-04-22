/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ModelAnnotationDataService } from '../services/model-annotation-data.service';
import { FieldType, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService, createLookup } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IModelAnnotationEntity } from '../model/entities/model-annotation-entity.interface';
import { ModelAnnotationLookupDataService } from './model-annotation-lookup-data.service';

@Injectable({
    providedIn: 'root'
})

/**
 *  ModelAnnotationBcfExportWizardService
 *  This services for provides functionality for BCF Export
 */
export class ModelAnnotationBcfExportWizardService {
    private http = inject(HttpClient);
    private readonly msgBoxService = inject(UiCommonMessageBoxService);
    private readonly modelAnnotationDataService = inject(ModelAnnotationDataService);
    public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
    private readonly configService = inject(PlatformConfigurationService);
    /**
     *  BCF Export
     */
    public async showDialog() {
        //TODO
       // const hasLoadedItems = (ModelAnnotationDataService.getList());
       // const hasSelection = hasLoadedItems && !_.isEmpty(modelAnnotationDataService.getSelectedEntities());

        const result = await this.formDialogService
            .showDialog<IModelAnnotationEntity>({
                width: '70%',
                id: 'populateMapsFromLocationTreeWizardService',
                headerText: { key: 'model.map.populateMapsFromLocationTreeWizard.title' },
                formConfiguration: this.bcfExportFormConfiguration,
                entity: this.locationTree,
                runtime: undefined,
                customButtons: [],
                topDescription: '',
            })
            ?.then((result) => {
                if (result?.closingButtonId === StandardDialogButtonId.Ok) {
                    this.http.post('model/annotation/bcf/exportfile', {
                      
                    }).subscribe((response) => {
                        
                    });
                }
            });

        return result;
    }

    private locationTree: IModelAnnotationEntity = {
        ModelFk: 0,
        Id: 0,
        EffectiveCategoryFk: 0,
        PriorityFk: 0,
        RawType: 0,
        Sorting: 0,
        StatusFk: 0
    };

    /**
     * Form configuration data.
     */
    private bcfExportFormConfiguration: IFormConfig<IModelAnnotationEntity> = {
        formId: 'model.annotation.bcfExport',  
        showGrouping: true,
        groups: [
			{
				groupId: 'default',
			}
		],
        rows: [
            {
				groupId: 'scope',
				id: 'source',
				label: {
					key : 'boq.main.renumberSelection',
				},
				type: FieldType.Radio,
				model: 'source',
				itemsSource: {
					items: [
						{
							id: 'a',
							displayName: 'model.annotation.bcf.sourceAll',
						},
						{
							id: 'p',
							displayName: 'model.annotation.bcf.sourcePage',
						},
                        {
							id: 's',
							displayName: 'model.annotation.bcf.sourcePage',
						},
					],
				},
			}, {
                groupId: 'default',
                id: 'bcfFileName',
                label: {
                    key: 'model.annotation.bcf.bcfFileName',
                },
                type: FieldType.Description,
                model: 'bcfFileName',
                visible: true,
               
            }
            ,{
                groupId: 'default',
                id: 'bcfVersion',
                label: {
                    key: 'model.annotation.bcf.bcfVersion',
                },
                type: FieldType.Lookup,
                readonly:true,
                lookupOptions: createLookup({
                    dataServiceToken:ModelAnnotationLookupDataService,
                    showClearButton: true,
                    showDescription: true,
                    descriptionMember: 'DescriptionInfo.Translated'

                }),
                model: 'bcfVersion',
                sortOrder: 2
            }
            
            
        ],
    };
}