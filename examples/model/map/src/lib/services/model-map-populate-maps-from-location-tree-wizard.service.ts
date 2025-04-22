/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ModelMapDataService } from './model-map-data.service';
import { FieldType, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService, createLookup } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IModelMapEntity } from '../model/entities/model-map-entity.interface';
import { ProjectLocationLookupService } from '@libs/project/shared';

@Injectable({
    providedIn: 'root'
})

/**
 *  ModelMapPopulateMapsFromLocationTreeWizardService
 *  This services for provides functionality for Location Tree
 */
export class ModelMapPopulateMapsFromLocationTreeWizardService {
    private http = inject(HttpClient);
    private readonly msgBoxService = inject(UiCommonMessageBoxService);
    private readonly modelMapDataService = inject(ModelMapDataService);
    public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
    private readonly configService = inject(PlatformConfigurationService);
    /**
     *  Location Tree
     */
    public async locationTreeModels() {
        const selMap = this.modelMapDataService.getSelectedEntity();
        if (!selMap) {
            return this.msgBoxService.showInfoBox('model.map.populateMapsFromLocationTreeWizard.noModelMapSelected', 'cloud.desktop.infoDialogHeader', true);
        }

        const result = await this.formDialogService
            .showDialog<IModelMapEntity>({
                width: '70%',
                id: 'populateMapsFromLocationTreeWizardService',
                headerText: { key: 'model.map.populateMapsFromLocationTreeWizard.title' },
                formConfiguration: this.spacedLevelsFormConfiguration,
                entity: this.locationTree,
                runtime: undefined,
                customButtons: [],
                topDescription: '',
            })
            ?.then((result) => {
                if (result?.closingButtonId === StandardDialogButtonId.Ok) {
                    this.http.post('model/map/populateMapsFromLocationTree', {
                      
                    }).subscribe((response) => {
                        
                    });
                }
            });

        return result;
    }

    private locationTree: IModelMapEntity = {
        CompoundId: '',
        selModelRole: '',
        ModelFk: 0,
        Id: 0,
        IsDefault: false,
    };

    /**
     * Form configuration data.
     */
    private spacedLevelsFormConfiguration: IFormConfig<IModelMapEntity> = {
        formId: 'populateMapsFromLocationTree',  
        showGrouping: false,
        groups: [
			{
				groupId: 'default',
			}
		],
        rows: [
            {
                groupId: 'default',
                id: 'projectLocation',
                label: {
                    key: 'model.map.populateMapsFromLocationTreeWizard.projectLocation',
                },
                type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProjectLocationLookupService,
					showDescription: true,
					descriptionMember: 'ProjectName',
					showClearButton: true,
				}),
                model: 'ProjectLocationFk',
                visible: true,
                
            }, {
                groupId: 'default',
                id: 'createAreasFromDepth',
                label: {
                    key: 'model.map.populateMapsFromLocationTreeWizard.createAreasFromDepth',
                },
                type: FieldType.Integer,
                model: 'AreasDepth',
                visible: true,
               
            }
            , {
                groupId: 'default',
                id: 'createLevelsFromDepth',
                label: {
                    key: 'model.map.populateMapsFromLocationTreeWizard.createLevelsFromDepth',
                },
                type: FieldType.Integer,
                model: 'LevelsDepth',
                visible: true,
                
            }
            , {
                groupId: 'default',
                id: 'descriptionPatternForAreas',
                label: {
                    key: 'model.map.populateMapsFromLocationTreeWizard.descriptionPatternForAreas',
                },
                type: FieldType.Description,
                model: 'AreasDescriptionPattern',
                visible: true,
               
            }
            , {
                groupId: 'default',
                id: 'descriptionPatternForLevels',
                label: {
                    key: 'model.map.populateMapsFromLocationTreeWizard.descriptionPatternForLevels',
                },
                type: FieldType.Description,
                model: 'LevelsDescriptionPattern',
                visible: true,
                
            }
            
        ],
    };
}