/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ModelMapAreaDataService } from './model-map-area-data.service';
import { FieldType, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IModelMapAreaEntity } from '../model/entities/model-map-area-entity.interface';

@Injectable({
    providedIn: 'root'
})

/**
 *  ModelChangeSetRepeatComparisonWizardService
 *  This services for provides functionality for Space Level
 */
export class ModelMapSpacedLevelsWizardService {
    private http = inject(HttpClient);
    private readonly msgBoxService = inject(UiCommonMessageBoxService);
    private readonly mapareaDataService = inject(ModelMapAreaDataService);
    public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
    private readonly configService = inject(PlatformConfigurationService);

    /**
     *  Space Level Models
     */
    public async spaceLevelModels() {
        const selMapArea = this.mapareaDataService.getSelectedEntity();
        if (!selMapArea) {
            return this.msgBoxService.showInfoBox('model.map.level.spacedWizard.messageBoxes.noMapAreaSelected', 'cloud.desktop.infoDialogHeader', true);
        }

        const result = await this.formDialogService
            .showDialog<IModelMapAreaEntity>({
                width: '70%',
                id: 'generateSpacedLevels',
                headerText: { key: 'model.map.level.spacedWizard.generateSpacedLevels' },
                formConfiguration: this.spacedLevelsFormConfiguration,
                entity: this.spaceLevel,
                runtime: undefined,
                customButtons: [],
                topDescription: '',
            })
            ?.then((result) => {
                if (result?.closingButtonId === StandardDialogButtonId.Ok) {
                    this.http.post('model/map/level/createSpacedLevels', {
                      
                    }).subscribe((response) => {
                        
                    });
                }
            });

        return result;
    }

    private spaceLevel: IModelMapAreaEntity = {
        CompoundId: '',
        selModelRole: '',
        ModelFk: 0,
        Id: 0,
        MapFk: 0,
        LocationFk: 0
    };

    /**
     * Form configuration data.
     */
    private spacedLevelsFormConfiguration: IFormConfig<IModelMapAreaEntity> = {
        formId: 'generateSpacedLevels',  

        showGrouping: true,
        groups: [
			{
				groupId: 'default',
				header: { key: 'model.map.level.spacedWizard.default' },
				open: false
			}, {
				groupId: 'namingGroup',
				header: { key: 'model.map.level.spacedWizard.namingGroup' },
				open: false
			}
		],
        rows: [
            {
                groupId: 'default',
                id: 'numberOfLevels',
                label: {
                    key: 'model.map.level.spacedWizard.numberOfLevels',
                },
                type: FieldType.Integer,
                model: 'numberOfLevels',
                visible: true,
                sortOrder: 0,
            }, {
                groupId: 'default',
                id: 'levelHeight',
                label: {
                    key: 'model.map.level.spacedWizard.levelHeight',
                },
                type: FieldType.Decimal,
                model: 'levelHeight',
                visible: true,
                sortOrder: 10,
            }
            , {
                groupId: 'default',
                id: 'spacing',
                label: {
                    key: 'model.map.level.spacedWizard.spacing',
                },
                type: FieldType.Decimal,
                model: 'spacing',
                visible: true,
                sortOrder: 20,
            }
            , {
                groupId: 'default',
                id: 'zCoordinate',
                label: {
                    key: 'model.map.level.spacedWizard.zCoordinate',
                },
                type: FieldType.Decimal,
                model: 'zCoordinate',
                visible: true,
                sortOrder: 30,
            }
            , {
                groupId: 'default',
                id: 'downward',
                label: {
                    key: 'model.map.level.spacedWizard.downward',
                },
                type: FieldType.Boolean,
                model: 'downward',
                visible: true,
                sortOrder: 40,
            }
            , {
                groupId: 'namingGroup',
                id: 'firstLevelNumber',
                label: {
                    key: 'model.map.level.spacedWizard.firstLevelNumber',
                },
                type: FieldType.Integer,
                model: 'firstLevelNumber',
                visible: true,
                sortOrder: 50,
            }
            , {
                groupId: 'namingGroup',
                id: 'descriptionPattern',
                label: {
                    key: 'model.map.level.spacedWizard.descriptionPattern',
                },
                type: FieldType.Description,
                model: 'descriptionPattern',
                visible: true,
                sortOrder: 60,
            }
        ],
    };
}