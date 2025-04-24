/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
    createLookup,
    FieldType,
    IFormConfig,
    StandardDialogButtonId,
    UiCommonFormDialogService,
    UiCommonMessageBoxService
} from '@libs/ui/common';
import {
    ControllingGeneralContractorCostHeaderDataService
} from '../services/controlling-general-contractor-cost-header-data.service';
import { IGccAddExpenseEntity } from '../model/entities/gcc-add-expense-entity.interface';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService, PlatformTranslateService} from '@libs/platform/common';
import {
    CreateAdditionalExpenseResponseMap,
    IEstHeaderCompositeEntity,
    ProjectCostCodesEditableMap
} from '../model/interfaces/controlling-general-contractor-additional-expense-map.interface';
import {
    BasicsShareControllingUnitLookupService,
} from '@libs/basics/shared';
import {ProcurementPackageLookupService, ProcurementShareContractLookupService} from '@libs/procurement/shared';

//TODO: wait cloudDesktopPinningContextService， filter key and will be done in the future -JACK
@Injectable({
    providedIn: 'root'
})
export class ControllingGeneralContractorCreateAdditionalExpenseWizardDialogService{
    private projectContext?: object;
    private initDataItem: IGccAddExpenseEntity = {};
    private isEditable = true;

    private readonly parentService: ControllingGeneralContractorCostHeaderDataService = inject(ControllingGeneralContractorCostHeaderDataService);
    private readonly messageBoxService = inject(UiCommonMessageBoxService);
    private http = inject(HttpClient);
    private configurationService = inject(PlatformConfigurationService);
    private translateService = inject(PlatformTranslateService);
    public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);

    private resetToDefault(){
        // TODO:
        // projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
        const parentEntity = this.parentService.getSelectedEntity();
        this.initDataItem = {
            ProjectFk: null,
            MdcControllingUnitFk: null,
            Code:'',
            Description:'',
            Amount:null,
            PrcPackageFk:null,
            ConHeaderFk:null,
            Comment:'',
        };
        if(parentEntity){
            this.initDataItem.MdcControllingUnitFk = Math.abs(parentEntity.Id);
        }
        // TODO:
        // if(projectContext){
        //     initDataItem.ProjectFk = projectContext.id;
        // }
    }

    public async onStartWizard() {
        // TODO:
        // this.projectContext = _.find (cloudDesktopPinningContextService.getContext (), {token: 'project.main'});
        this.resetToDefault();
        const  parent = this.parentService.getSelectedEntity();
        if(!parent){
            this.messageBoxService.showMsgBox('controlling.generalcontractor.NoCostControlSelected', 'cloud.common.informationDialogHeader', 'ico-info', 'message', false);
            return;
        }else {
            const searchData = {
                // TODO:
                // ProjectId: projectContext ? projectContext.id : -1,
                FixRateCheckType: 2
            };
            const response = await firstValueFrom(this.http.post(this.configurationService.webApiBaseUrl + 'Controlling/GeneralContractor/GCAdditionalExpensesController/getProjectCostCodesIsEditable', searchData)) as ProjectCostCodesEditableMap;
            if(response){
                if(response.noGCCOrderSetting){
                    this.messageBoxService.showMsgBox('controlling.generalcontractor.noGCCOrderSetting', 'cloud.common.informationDialogHeader', 'ico-info', 'message', false);
                    return;
                } else if(!response.fixedRate){
                    this.isEditable = response.isEditableShow;
                    const responseData = await firstValueFrom(this.http.post(this.configurationService.webApiBaseUrl + 'Controlling/GeneralContractor/GCAdditionalExpensesController/getEstimateHeaderByProject', searchData)) as IEstHeaderCompositeEntity;

                    if(responseData){
                        if(responseData.IsReadOnly){
                            this.messageBoxService.showMsgBox('controlling.generalcontractor.estHeaderIsReadOnly', 'cloud.common.informationDialogHeader', 'ico-info', 'message', false);
                            return;
                        }

                        this.initDataItem.Code = this.translateService.instant('controlling.generalcontractor.CodeDefault').text;
                        const result = await this.formDialogService
                            .showDialog<IGccAddExpenseEntity>({
                                id: 'CreatePackagesStructureWizard',
                                headerText: 'controlling.generalcontractor.CreatePackagesStructureWizard',
                                formConfiguration: this.getFormConfig,
                                runtime: undefined,
                                customButtons: [],
                                topDescription: '',
                                entity: this.initDataItem,
                            })
                            ?.then((result) => {
                                if (result?.closingButtonId === StandardDialogButtonId.Ok) {
                                    if(result.value){
                                        const creationDatas: IGccAddExpenseEntity[] = [];
                                        const creationData: IGccAddExpenseEntity  = {
                                            MdcControllingUnitFk:result.value.MdcControllingUnitFk,
                                            Code: result.value.Code,
                                            Description: result.value.Description,
                                            Amount: result.value.Amount,
                                            PrcPackageFk: result.value.PrcPackageFk,
                                            ConHeaderFk: result.value.ConHeaderFk,
                                            Comment: result.value.Comment
                                        };
                                        creationDatas.push(creationData);
                                        const gccAddExpenseComplete = {
                                            // TODO:
                                            // ProjectId: projectContext ? projectContext.id : -1,
                                            ProjectId: 1008170,
                                            GccAddExpenseItemDtos: creationDatas
                                        };
                                        this.CreateAdditionalExpense(gccAddExpenseComplete);
                                    }
                                }
                            });

                        return result;
                    } else {
                        this.messageBoxService.showMsgBox('controlling.generalcontractor.NonexistentGCEstimateHeader', 'cloud.common.informationDialogHeader', 'ico-info', 'message', false);
                        return;
                    }
                } else {
                    this.messageBoxService.showMsgBox('controlling.generalcontractor.AdditionalExpenseIsFixRate', 'cloud.common.informationDialogHeader', 'ico-info', 'message', false);
                    return;
                }
            }
        }
    }

    private async CreateAdditionalExpense(creationDatas:{ProjectId: number,GccAddExpenseItemDtos: IGccAddExpenseEntity[]}){
        const response = await firstValueFrom(this.http.post(this.configurationService.webApiBaseUrl + 'Controlling/GeneralContractor/GCAdditionalExpensesController/createAdditionalExpenseStructure', creationDatas)) as CreateAdditionalExpenseResponseMap;
        if(response){
            if(response.NoDefaultJob){
                this.messageBoxService.showMsgBox('controlling.generalcontractor.noDefaultJob', 'cloud.common.informationDialogHeader', 'ico-info', 'message', false);
            }else {
                console.log(response.timeStr);
                this.messageBoxService.showMsgBox('controlling.generalcontractor.AdditionalExpenseWizardResult', 'cloud.common.informationDialogHeader', 'ico-info', 'message', false);
                // TODO: should reload it
                // $injector.get ('controllingGeneralcontractorCostControlDataService').refresh();
            }
        }
    }

    private getFormConfig: IFormConfig<IGccAddExpenseEntity> ={
        formId: 'controlling.generalcontractor.createAdditionalExpenseModal',
        showGrouping: false,
        rows: [
            {
                id: 'MdcControllingUnitFk',
                label: {
                    key: 'controlling.generalcontractor.ControllingUnitFk',
                },
                type: FieldType.Lookup,
                readonly:true,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsShareControllingUnitLookupService,
                    showClearButton: true,
                    showDescription: true,
                    descriptionMember: 'DescriptionInfo.Translated',
                    serverSideFilter: {
                        key: 'controlling-actuals-controlling-unit-filter',
                        execute: context => {
                            return {
                                ByStructure: true,
                                ExtraFilter: false,
                                CompanyFk: inject(PlatformConfigurationService).getContext().clientId,
                                FilterKey: 'controlling.structure.estimate.prjcontrollingunit.filterkey',
                                IsProjectReadonly: true,
                                IsCompanyReadonly: true
                            };
                        }
                    },
                }),
                model: 'MdcControllingUnitFk',
                sortOrder: 1
            },
            {
                id: 'code',
                model: 'Code',
                type: FieldType.Code,
                label: { text: 'Code', key: 'cloud.common.entityCode' },
                readonly: true,
                sortOrder: 2
            },
            {
                id: 'description',
                model: 'Description',
                type: FieldType.Description,
                label: { text: 'Description', key: 'cloud.common.entityDescription' },
                required: true,
                sortOrder: 3
            },
            {
                id: 'amount',
                model: 'Amount',
                type: FieldType.Money,
                label: { text: 'Amount', key: 'controlling.generalcontractor.Amount' },
                required: true,
                sortOrder: 4
            },
            {
                id: 'PrcPackageFk',
                label: {
                    key: 'controlling.generalcontractor.prcPackageFk',
                },
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: ProcurementPackageLookupService,
                    showDescription: true,
                    descriptionMember: 'Description',
                    serverSideFilter: {
                        key: '',
                        execute(context) {
                            const entity = context?.entity as IGccAddExpenseEntity;
                            return {
                                ProjectFk: entity?.ProjectFk
                            };
                        },
                    },
                }),
                model: 'PrcPackageFk',
                sortOrder: 5
            },
            {
                id: 'conheaderfk',
                label: {
                    key: 'controlling.generalcontractor.Contract',
                },
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: ProcurementShareContractLookupService,
                    showDescription: true,
                    descriptionMember: 'Description',
                    serverSideFilter: {
                        key: '',
                        execute(context) {
                            const entity = context?.entity as IGccAddExpenseEntity;
                            return {
                                ProjectFk: entity?.ProjectFk
                            };
                        },
                    },
                }),
                model: 'ConHeaderFk',
                sortOrder: 6
            },
            {
                id: 'comment',
                model: 'Comment',
                type: FieldType.Comment,
                label: { text: 'Comment', key: 'controlling.generalcontractor.Comment' },
                sortOrder: 7
            }
        ]
    };
}