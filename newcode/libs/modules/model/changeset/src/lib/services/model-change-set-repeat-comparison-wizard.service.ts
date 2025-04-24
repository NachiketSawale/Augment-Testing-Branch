/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ModelChangeSetDataService } from './model-change-set-data.service';
import { FieldType, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService, createLookup } from '@libs/ui/common';
import { IChangeSetEntity } from '../model/models';
import { PlatformHttpService } from '@libs/platform/common';

@Injectable({
    providedIn: 'root'
})

/**
 *  ModelChangeSetRepeatComparisonWizardService
 *  This services for provides functionality for Repeat Comparison
 */
export class ModelChangeSetRepeatComparisonWizardService {
    private readonly http = inject(PlatformHttpService);
    private readonly msgBoxService = inject(UiCommonMessageBoxService);
    private readonly changesetDataService = inject(ModelChangeSetDataService);
    public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);

    /**
     *  recompareModels
     */
    public async recompareModels() {
        const selComparison = this.changesetDataService.getSelectedEntity();

        if (!selComparison) {
            return this.msgBoxService.showInfoBox('model.changeset.changeSetSummary.noSelection', 'cloud.desktop.infoDialogHeader', true);
        }

        const result = await this.formDialogService
            .showDialog<IChangeSetEntity>({
                width: '70%',
                id: 'model.changeset.recompare',
                headerText: { key: 'model.changeset.recompare' },
                formConfiguration: this.reCompareFormConfiguration,
                entity: this.reComapre,
                runtime: undefined,
                customButtons: [],
                topDescription: '',
            })
            ?.then((result) => {
                if (result?.closingButtonId === StandardDialogButtonId.Ok) {
                    console.log('---', result);
                    this.http.post('model/changeset/recompare', {
                        Model1Id: selComparison.ModelFk,
                        ChangeSetId: selComparison.Id,
                        Description: result.value?.DescriptionInfo,
                        LoggingLevel: result.value?.LoggingLevel
                    }).then((response) => {
                        // return this.changesetDataService.addChangeSet(response);
                    });
                }
            });

        return result;
    }

    private reComapre: IChangeSetEntity = {
        CompoundId: '',
        selModelRole: '',
        ChangeCount: 0,
        ChangeSetStatusEntity: {
            unfinishedComparisons: [],
            activeConsumerCount: 0,
            updateRequest: null,
            waitingRequests: []
        },
        ChangeSetStatusFk: 0,
        CompareModelColumns: false,
        CompareObjectLocations: false,
        CompareObjects: false,
        CompareProperties: false,
        DescriptionInfo: {
            Description: '',
            DescriptionTr: 0,
            DescriptionModified: false,
            Translated: '',
            VersionTr: 0,
            Modified: false,
            OtherLanguages: []
        },
        ExcludeOpenings: false,
        Id: 0,
        LoggingLevel: 0,
        ModelCmpFk: 0,
        ModelFk: 0,
        SearchPattern: '',
    };

    /**
     * Form configuration data.
     */
    private reCompareFormConfiguration: IFormConfig<IChangeSetEntity> = {
        formId: 'model.changeset.recompare',  //TODO Need to check 

        showGrouping: true,
        rows: [
            {
                id: 'modelDescription',
                label: {
                    key: 'model.changeset.changeSetSummary.modelDescription',
                },
                type: FieldType.Code,
                model: 'DescriptionInfo',
                visible: true,
                sortOrder: 10,
            }, {
                id: 'log',
                label: {
                    key: 'model.changeset.logLevel',
                },
                type: FieldType.Lookup,
                model: 'LoggingLevel',
                lookupOptions: createLookup({
                    //dataServiceToken: BasicsCompanyLookupService //TODO Need to call Log level lookup. ticket: DEV-17387
                }),
            }
        ],
    };
}