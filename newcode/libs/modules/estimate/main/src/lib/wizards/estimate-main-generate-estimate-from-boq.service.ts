/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { FieldType, IEditorDialogResult, IFormConfig, IGridConfiguration, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { EstimateMainGenerateEstimateFromBoqComponent } from '../components/wizards/estimate-main-generate-estimate-from-boq/estimate-main-generate-estimate-from-boq.component';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { EstimateMainGenerateEstimateFromBoqWizardProcessService } from '../services/wizard/estimate-main-generate-estimate-from-boq-wizard-process.service';
import { IGenerateEstimateFrmBoqEntity } from '../model/interfaces/estimate-main-generate-estimate-from-reference-boq.interface';

interface IGenerateEstimateFrmBoqPostDataEntity {
    TargetProjectId: number;  
    TargetEstHeaderId: number;
    SelectedBoqs: boolean;  
    SearchCriteria: number;
    ExistingEstimate: number;
}

@Injectable({ providedIn: 'root' })

/**
 * Estimate main generate estimate from boq
 */
export class EstimateMainGenerateEstimateFrmBoqWizardService {
    public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
    private http: HttpClient = inject(HttpClient);
    private platformConfigurationService: PlatformConfigurationService = inject(PlatformConfigurationService);
    private readonly messageBoxService = inject(UiCommonMessageBoxService);
    public postData: IGenerateEstimateFrmBoqPostDataEntity = {} as IGenerateEstimateFrmBoqPostDataEntity;  // Initialize postData with a default value
    public resultData: IEstLineItemEntity[] = [];
    private readonly translateService = inject(PlatformTranslateService);
    private estimateMainGenerateEstimateFromBoqWizardProcessService = inject(EstimateMainGenerateEstimateFromBoqWizardProcessService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);

    /**
     * Method which Displays a wizard dialog for generate estimate from refernce boq
     */
    public async generateEstimateFrmBoq() {
        const result = await this.formDialogService
            .showDialog<IGenerateEstimateFrmBoqEntity>({
                id: 'generateEstimateFrmBoq',
                headerText: this.getDialogTitle(),
                formConfiguration: this.prepareFormConfig<IGenerateEstimateFrmBoqEntity>(),
                entity: this.defaultItem,
                runtime: undefined,
                customButtons: [],
                topDescription: ''
            })
            ?.then((result) => {
                if (result?.closingButtonId === StandardDialogButtonId.Ok && result.value) {  // Ensure result.value is defined
                    this.handleOk(result);
                }
            });

            return result;
    }

    /**
     * Prepares the form configuration for the specified entity.
     */
    public prepareFormConfig<TEntity extends object>(): IFormConfig<TEntity> {
        const formConfig: IFormConfig<TEntity> = {
            formId: 'estimate.main.generateEstimateFromBoq',
            showGrouping: true,
            groups: [
                {
                    groupId: 'searchCriteria',
                    header: { key: 'estimate.main.searchCriteria' },
                    open: true,
                },
                {
                    groupId: 'selectBoqs',
                    header: { key: 'estimate.main.selectBoqs' },
                    open: true
                },
                {
                    groupId: 'existingEstimate',
                    header: { key: 'estimate.main.existingEstimate' },
                    open: true
                },
            ],

            rows: [
                {
                    groupId: 'searchCriteria',
                    id: 'searchCriteria',
                    label: 'estimate.main.searchCriteria',
                    type: FieldType.Radio,
                    model: 'SearchCriteria',
                    sortOrder: 0,
                    itemsSource: {
                        items: [
                            {
                                id: 1,
                                displayName: 'estimate.main.refNo',
                            },
                            {
                                id: 2,
                                displayName: 'estimate.main.wic'
                            }
                        ]
                    }
                },

                {
                    groupId: 'selectBoqs',
                    id: 'selectBoqs',
                    type: FieldType.CustomComponent,
                    componentType: EstimateMainGenerateEstimateFromBoqComponent,
                    required: true,
                    sortOrder: 1
                },

                {
                    groupId: 'existingEstimate',
                    id: 'existingEstimate',
                    type: FieldType.Radio,
                    model: 'ExistingEstimate',
                    sortOrder: 2,
                    itemsSource: {
                        items: [
                            {
                                id: 1,
                                displayName: 'estimate.main.overwrite'
                            },
                            {
                                id: 2,
                                displayName: 'estimate.main.append'
                            },
                            {
                                id: 3,
                                displayName: 'estimate.main.ignore'
                            },
                        ],
                    },
                },
            ],
        };

        return formConfig;
    }

    /**
     * Handles the Ok button functionality for the main wizard dialog.
     * @param result - The result from the dialog.
     * @returns void
     */
    private handleOk(result: IEditorDialogResult<IGenerateEstimateFrmBoqEntity>): void {
        this.postData = {
            'TargetProjectId': this.estimateMainContextService.getSelectedProjectId(),
            'TargetEstHeaderId': this.estimateMainContextService.getSelectedEstHeaderId(),
            'SelectedBoqs': result.value!.SourceBoqItems,
            'SearchCriteria': result.value!.SearchCriteria,
            'ExistingEstimate': result.value!.ExistingEstimate
        };

        this.http.post<number>(this.platformConfigurationService.webApiBaseUrl + 'estimate/main/lineitem/generateEstimateFromBoq', this.postData).subscribe((response) => {
            if (response !== null && response !== undefined) {
                this.formDialogService
                    .showDialog<IGenerateEstimateFrmBoqEntity>({
                        id: 'generateEstFrmBoq',
                        headerText: this.setHeaderforNextWindow(),
                        formConfiguration: this.generateEstimateFromBoqCompletedDialog<IGenerateEstimateFrmBoqEntity>(),
                        entity: this.defaultItem,
                        runtime: undefined,
                        customButtons: [],
                        topDescription: this.getSuccessfulMessage(response),
                        showCancelButton: false
                    })
                    ?.then((dialogResult) => {
                        if (dialogResult?.closingButtonId === StandardDialogButtonId.Ok) {
                            this.handleOkForNextDialog();
                        }
                    });
            } else {
                this.messageBoxService.showMsgBox(this.translateService.instant({ key: 'estimate.main.projectWicSourceTargetErrMsg' }).text, this.translateService.instant({ key: 'estimate.main.warning' }).text, 'ico-warning');
            }
        });
    }

    /**
     * This method adds functionality to OK button for next dialog which will visible if estimate have boq
     */
    private handleOkForNextDialog() {
        return null;
    }

    /**
     * Set header for next dialog which will visible if estimate have boq
     */
    private setHeaderforNextWindow(): string {
        return 'estimate.main.generateEstimateSummaryTitle';
    }

    /**
     * Returns title of main wizard dialog
     */
    public getDialogTitle(): string {
        return 'estimate.main.generateEstimateFromBoq';
    }

    /**
     * Method to display grid on next dialog which will visible if estimate have boq
     */
    public generateEstimateFromBoqCompletedDialog<TEntity extends object>(): IFormConfig<TEntity> {
        const formConfig: IFormConfig<TEntity> = {
            showGrouping: true,

            rows: [
                {
                    id: 'estLineItems',
                    type: FieldType.Grid,
                    configuration: this.gridConfiguration as IGridConfiguration<object>,
                    height: 100,
                    model: 'estLineItems'
                },
            ],
        };

        return formConfig;
    }

    private gridConfiguration: IGridConfiguration<IEstLineItemEntity> = {
        uuid: '6f1b4d78935942dd8ba8a0f1d1568018',
        idProperty: 'Id',
        columns: [
            {
                id: 'code',
                model: 'Code',
                sortable: true,
                label: {
                    text: 'cloud.common.entityCode',
                },
                type: FieldType.Description,
                readonly: true,
                width: 100,
                visible: true
            },
            {
                id: 'desc',
                model: 'DescriptionInfo',
                sortable: true,
                label: {
                    text: 'cloud.common.entityDescription',
                },
                type: FieldType.Description,
                readonly: false,
                width: 100,
                visible: true
            },
        ],
        items: this.resultData,
    };

    private defaultItem: IGenerateEstimateFrmBoqEntity = {
        SearchCriteria: 0,
        SourceBoqItems: false,
        ExistingEstimate: 0
    };

    /**
     * Returns a success message based on the response count.
     * @param count - The number of successfully generated items.
     * @returns string - The success message.
     */
    private getSuccessfulMessage(count: number): string {
        if (count > 1) {
            return this.translateService.instant('estimate.main.multiLineItemAssigned', { count: count }).text;
        } else if (count === 1) {
            return this.translateService.instant('estimate.main.oneLineItemAssigned', { count: count }).text;
        }
        return '';
    }
}
