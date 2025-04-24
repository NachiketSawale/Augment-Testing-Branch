/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { SaveCopyOptionsRequest, SaveCopyOptionsRequestData } from '../../model/interfaces/estimate-main-save-copy-options-request.interface';
import { Observable, of, tap } from 'rxjs';
import { EstimateMainContextService } from '@libs/estimate/shared';

@Injectable({ providedIn: 'root' })
export class EstimateMainCopySourceCopyOptionsDialogService {


    private readonly http = inject(HttpClient);
    private readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
    private readonly translate = inject(PlatformTranslateService);
    private readonly messageBoxService = inject(UiCommonMessageBoxService);
    private readonly configService = inject(PlatformConfigurationService);
    private readonly estimateMainContextService = inject(EstimateMainContextService);
    private saveCopyOptionsRequestData: SaveCopyOptionsRequestData | null = null;


    /**
     * Displays a dialog.
     */
    public showDialog() {
        const estHeaderId : number = this.estimateMainContextService.getSelectedEstHeaderId();
        const porjectId : number = this.estimateMainContextService.getSelectedProjectId();
        if (!(porjectId > 0) || !(estHeaderId > 0)) {
            this.messageBoxService.showMsgBox({
                headerText: this.translate.instant('estimate.main.copyOptions'),
                bodyText: this.translate.instant('estimate.main.noProjectOrEstimatePinned'),
                iconClass: 'ico-info'
            });
        }else {
            return this.fetchCopyOptionsRequestData(estHeaderId).subscribe(data => {
                const result = this.formDialogService
                    .showDialog<SaveCopyOptionsRequestData>({
                        id: 'updateEstimate',
                        headerText: 'estimate.main.updateItemsFromProject',
                        formConfiguration: this.prepareFormConfig<SaveCopyOptionsRequestData>(),
                        entity: data,
                        runtime: undefined,
                        customButtons: [],
                        topDescription: ''
                    })
                    ?.then((result) => {
                        if (result?.closingButtonId === StandardDialogButtonId.Ok) {
                            this.handleOk(result);
                        }
                    });
                return result;
            });
        }
        return of(null);
    }

    private fetchCopyOptionsRequestData(estHeaderId: number): Observable<SaveCopyOptionsRequestData> {
        if (this.saveCopyOptionsRequestData) {
            return of(this.saveCopyOptionsRequestData);
        } else {
            return this.http.get<SaveCopyOptionsRequestData>(this.configService.webApiBaseUrl + 'estimate/main/copyoption/getcopyoption?estHeaderId=' + estHeaderId).pipe(
                tap(data => this.saveCopyOptionsRequestData = data)
            );
        }
    }

    public ESTIMATE_SCOPE = {
        ALL_ESTIMATE: {
            value: 0,
            label: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.allEstimate',
        },
        RESULT_SET: {
            value: 1,
            label: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.resultSet',
        },
        RESULT_HIGHLIGHTED: {
            value: 2,
            label: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.Highlighted',
        },
    };

    /**
     * Prepares the form configuration for the specified entity.
     */
    private prepareFormConfig<SaveCopyOptionsRequestData extends object>(): IFormConfig<SaveCopyOptionsRequestData> {
        const formConfig: IFormConfig<SaveCopyOptionsRequestData> = {
            formId: 'estimate.main.copyOptions',
            showGrouping: true,
            groups: [
                {
                    groupId: 'copyResourceTo',
                    header: { key: 'estimate.main.copyResourceTo' },
                    open: true
                },
                {
                    groupId: 'copyLineItems',
                    header: { key: 'estimate.main.copyLineItems' },
                    open: true
                },
                {
                    groupId: 'copyLeadingStructures',
                    header: { key: 'estimate.main.copyLeadingStructures' },
                    open: true
                },
                {
                    groupId: 'copyResources',
                    header: { key: 'estimate.main.copyResources' },
                    open: true
                },

            ],
            rows: [
                {
                    groupId: 'copyResourceTo',
                    id: 'resultSet',
                    label: { key: 'estimate.main.updateMaterialPackageWizard.selectEstimateScope' },
                    type: FieldType.Radio,
                    model: 'CopyResourcesTo',
                    itemsSource: {
                        items: [
                            {
                                id: this.ESTIMATE_SCOPE.RESULT_HIGHLIGHTED.value,
                                displayName: this.ESTIMATE_SCOPE.RESULT_HIGHLIGHTED.label,
                            },
                            {
                                id: this.ESTIMATE_SCOPE.RESULT_SET.value,
                                displayName: { key: this.ESTIMATE_SCOPE.RESULT_SET.label },
                            },
                            {
                                id: this.ESTIMATE_SCOPE.ALL_ESTIMATE.value,
                                displayName: { key: this.ESTIMATE_SCOPE.ALL_ESTIMATE.label },
                            },
                        ],
                    },
                },
                {
                    groupId: 'copyLineItems',
                    id: 'quantity',
                    label: {
                        key: 'estimate.main.quantity',
                    },
                    type: FieldType.Boolean,
                    model: 'LiQuantity',
                    sortOrder: 1
                },
                {
                    groupId: 'copyLineItems',
                    id: 'allQuantityFactors',
                    label: {
                        key: 'estimate.main.allQuantityFactors',
                    },
                    type: FieldType.Boolean,
                    model: 'LiQuantityFactors',
                },
                {
                    groupId: 'copyLineItems',
                    id: 'allCostFactors',
                    label: {
                        key: 'estimate.main.allCostFactors',
                    },
                    type: FieldType.Boolean,
                    model: 'LiCostFactors',
                },
                {
                    groupId: 'copyLineItems',
                    id: 'budget',
                    label: {
                        key: 'estimate.main.budget',
                    },
                    type: FieldType.Boolean,
                    model: 'LiBudget',
                },
                {
                    groupId: 'copyLineItems',
                    id: 'resources',
                    label: {
                        key: 'estimate.main.resources',
                    },
                    type: FieldType.Boolean,
                    model: 'LiResources',
                },
                {
                    groupId: 'copyLineItems',
                    id: 'packageItemAssignment',
                    label: {
                        key: 'estimate.main.packageItemAssignment',
                    },
                    type: FieldType.Boolean,
                    model: 'LiPackageItemAssignment',
                },
                {
                    groupId: 'copyLineItems',
                    id: 'characteristics',
                    label: {
                        key: 'estimate.main.characteristics',
                    },
                    type: FieldType.Boolean,
                    model: 'LiCharacteristics',
                },
                {
                    groupId: 'copyLeadingStructures',
                    id: 'boqs',
                    label: {
                        key: 'estimate.main.boqContainer',
                    },
                    type: FieldType.Boolean,
                    model: 'LiBoq',
                },
                {
                    groupId: 'copyLeadingStructures',
                    id: 'activities',
                    label: {
                        key: 'estimate.main.activityContainer',
                    },
                    type: FieldType.Boolean,
                    model: 'LiActivity',
                },
                {
                    groupId: 'copyLeadingStructures',
                    id: 'controllingUnits',
                    label: {
                        key: 'estimate.main.mdcControllingUnitFk',
                    },
                    type: FieldType.Boolean,
                    model: 'LiControllingUnit',
                },
                {
                    groupId: 'copyLeadingStructures',
                    id: 'costGroups',
                    label: {
                        key: 'estimate.main.CostGroupContainer',
                    },
                    type: FieldType.Boolean,
                    model: 'LiCostGroup',
                },
                {
                    groupId: 'copyLeadingStructures',
                    id: 'projectCostGroups',
                    label: {
                        key: 'estimate.main.CostGrouptitle1',
                    },
                    type: FieldType.Boolean,
                    model: 'LiPrjCostGroup',
                },
                {
                    groupId: 'copyLeadingStructures',
                    id: 'procurementStructure',
                    label: {
                        key: 'estimate.main.createBoqPackageWizard.ProcurementStructure',
                    },
                    type: FieldType.Boolean,
                    model: 'LiProcurementStructure',
                },
                {
                    groupId: 'copyLeadingStructures',
                    id: 'locations',
                    label: {
                        key: 'estimate.main.locationContainer',
                    },
                    type: FieldType.Boolean,
                    model: 'LiLocation',
                },
                {
                    groupId: 'copyLeadingStructures',
                    id: 'wicboq',
                    label: {
                        key: 'estimate.main.lookupAssignWicItem',
                    },
                    type: FieldType.Boolean,
                    model: 'LiWicBoq',
                },
                {
                    groupId: 'copyResources',
                    id: 'quantity',
                    label: {
                        key: 'estimate.main.quantity',
                    },
                    type: FieldType.Boolean,
                    model: 'ResQuantity',
                },
                {
                    groupId: 'copyResources',
                    id: 'allQuantityFactors',
                    label: {
                        key: 'estimate.main.allQuantityFactors',
                    },
                    type: FieldType.Boolean,
                    model: 'ResQuantityFactors',
                },
                {
                    groupId: 'copyResources',
                    id: 'allCostFactors',
                    label: {
                        key: 'estimate.main.allCostFactors',
                    },
                    type: FieldType.Boolean,
                    model: 'ResCostFactors',
                },
                {
                    groupId: 'copyResources',
                    id: 'costUnit',
                    label: {
                        key: 'estimate.main.costUnit',
                    },
                    type: FieldType.Boolean,
                    model: 'ResCostUnit',
                },
                {
                    groupId: 'copyResources',
                    id: 'packageItemAssignment',
                    label: {
                        key: 'estimate.main.packageItemAssignment',
                    },
                    type: FieldType.Boolean,
                    model: 'ResPackageItemAssignment',
                },
                {
                    groupId: 'characteristics',
                    id: 'controllingUnits',
                    label: {
                        key: 'estimate.main.characteristics',
                    },
                    type: FieldType.Boolean,
                    model: 'ResCharacteristics',
                }
            ]
        };
        return formConfig;
    }

    /**
     * Method handles 'Ok' button functionality.
     */
    private handleOk(result: IEditorDialogResult<SaveCopyOptionsRequestData>): void {
        const estHeaderId : number = this.estimateMainContextService.getSelectedEstHeaderId();
        const porjectId : number = this.estimateMainContextService.getSelectedProjectId();
        if (!(porjectId > 0) || !(estHeaderId > 0)) {
            this.messageBoxService.showMsgBox({
                headerText: this.translate.instant('estimate.main.copyOptions'),
                bodyText: this.translate.instant('estimate.main.noProjectOrEstimatePinned'),
                iconClass: 'ico-info'
            });
        }else {
            if (result.value) {
                result.value.LiCharacteristics = !!result.value.LiCharacteristics;
                result.value.ResCharacteristics = !!result.value.ResCharacteristics;
            }
            const saveCopyOptionsRequest: SaveCopyOptionsRequest = {
                EstHeaderId: this.estimateMainContextService.getSelectedEstHeaderId(),
                EstCopyOptionData: result.value
            };

            this.http.post(this.configService.webApiBaseUrl + 'estimate/main/copyoption/savecopyoptions', saveCopyOptionsRequest).subscribe((result) => {
                this.setCurrentItem(result as SaveCopyOptionsRequestData);
            });
        }
    }

    /**
     * Set saveCopyOptionsRequestData
     */
    public getCurrentItem() {
        return this.saveCopyOptionsRequestData;
    }

    /**
     * Set SaveCopyOptionsRequestData
     */
    public setCurrentItem(data: SaveCopyOptionsRequestData) {
        this.saveCopyOptionsRequestData = data;
    }
}
