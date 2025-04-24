/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';

import {
    createLookup,
    FieldType,
    IGridDialogOptions, IYesNoDialogOptions, StandardDialogButtonId,
    UiCommonGridDialogService, UiCommonMessageBoxService
} from '@libs/ui/common';
import {ICostcodePriceListEntity} from '@libs/basics/interfaces';
import {
    BasicsSharedCurrencyLookupService, BasicsSharedCustomerAbcLookupService,
    CurrencyEntity
} from '@libs/basics/shared';
import {BusinessPartnerLookupService} from '@libs/businesspartner/shared';
import {PlatformConfigurationService, PlatformTranslateService} from '@libs/platform/common';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {
    ControllingGeneralContractorCostHeaderMap, CostControlWizardResultMap
} from '../model/interfaces/controlling-general-contractor-cost-header-map.interface';
import * as _ from 'lodash';


@Injectable({
    providedIn: 'root'
})
export class ControllingGeneralContractorCostControlWizardDialogService{
    private gridDialogService = inject(UiCommonGridDialogService);
    private http = inject(HttpClient);
    private readonly configurationService = inject(PlatformConfigurationService);
    private translateService = inject(PlatformTranslateService);
    private messageBoxService = inject(UiCommonMessageBoxService);
    public async onStartWizard() {
        const postData = {
            Filter: '',
            PrjBoqFk: -1,
            ProjectId: 1008169, // TODO: wait cloudDesktopPinningContextService
            IsFilterByConStatus: true
        };

        const url = this.configurationService.webApiBaseUrl + 'sales/contract/getlistforgcsalescontract';
        const response = await firstValueFrom(this.http.post(url, postData));
        if (response) {
            const gridDialogData: IGridDialogOptions<ControllingGeneralContractorCostHeaderMap> = {
                headerText: 'controlling.generalcontractor.CreateUpdateCostControlStructureWizard',
                width: '70%',
                windowClass: 'grid-dialog',
                gridConfig: {
                    uuid: '044C425CFD6B45018CBE61A3FDD2DD6D',
                    columns: [
                        {
                            id: 'checked',
                            model: 'Checked',
                            type: FieldType.Boolean,  //to do :the checkbox control the ok button
                            label: {
                                text: '',
                                key: 'basics.common.selected'
                            },
                            visible: true,
                            sortable: false,
                            readonly: true,
                        },
                        {
                            type: FieldType.Comment,
                            id: 'Comment',
                            model: 'Comment',
                            readonly: false,
                            maxLength: 16,
                            label: {
                                text: 'Comment',
                                key: 'controlling.generalcontractor.Comment',
                            },
                            visible: true,
                            sortable: true,
                        },
                        {
                            type: FieldType.Translation,
                            id: 'DescriptionInfo',
                            model: 'DescriptionInfo',
                            label: {
                                text: 'Description',
                                key: 'controlling.generalcontractor.Description',
                            },
                            visible: true,
                            sortable: true,
                            readonly: true
                        },
                        {
                            type: FieldType.Code,
                            id: 'Code',
                            model: 'Code',
                            label: {
                                text: 'Code',
                                key: 'controlling.generalcontractor.Code',
                            },
                            visible: true,
                            sortable: true,
                            readonly: true
                        },
                        {
                            type: FieldType.Lookup,
                            id: 'ordstatusfk',
                            model: 'OrdStatusFk',
                            lookupOptions: createLookup<ICostcodePriceListEntity, CurrencyEntity>({
                                dataServiceToken: BasicsSharedCurrencyLookupService,
                                displayMember: 'Currency',

                            }),
                            label: {
                                text: 'Status',
                                key: 'controlling.generalcontractor.entityOrdStatusFk',
                            },
                            visible: true,
                            sortable: true,
                            readonly: true
                        },
                        {
                            type: FieldType.Lookup,
                            id: 'businesspartnerfk',
                            model: 'BusinesspartnerFk',
                            lookupOptions: createLookup({
                                dataServiceToken: BusinessPartnerLookupService
                            }),
                            label: {
                                text: 'Businesspartner',
                                key: 'controlling.generalcontractor.entityBusinesspartnerFk',
                            },
                            visible: true,
                            sortable: true,
                            readonly: true
                        },
                        {
                            type: FieldType.Lookup,
                            id: 'customerfk',
                            model: 'CustomerFk',
                            lookupOptions: createLookup({
                                dataServiceToken: BasicsSharedCustomerAbcLookupService,
                                showClearButton: false
                            }),
                            label: {
                                text: 'Customer',
                                key: 'controlling.generalcontractor.entityCustomerFk',
                            },
                            visible: true,
                            sortable: true,
                            readonly: true
                        },
                        {
                            type: FieldType.Integer, // TODO - depends on project-change-dialog
                            id: 'prjchangefk',
                            model: 'PrjChangeFk',
                            label: {
                                text: 'Change Order',
                                key: 'controlling.generalcontractor.entityChangeOrder',
                            },
                            visible: true,
                            sortable: true,
                            readonly: true
                        }

                    ],
                    marker: false,
                    saveConfiguration: true,
                    showSearchPanel: false,
                    skipPermissionCheck: true,
                    idProperty: 'Id',
                },
                items: response ! as ControllingGeneralContractorCostHeaderMap[],
                selectedItems: [],
                buttons: [  // TODO: Disabled the ok button
                    {
                        id: StandardDialogButtonId.Ok,
                        caption: {key: 'cloud.common.ok'},
                        isDisabled: (info) => {
                            const dialog = info.dialog.items as ControllingGeneralContractorCostHeaderMap[];
                            return dialog.length <= 0;
                        },
                        autoClose: true
                    },
                    {id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}}
                ],
                resizeable: true,
                isReadOnly:true
            };
            this.gridDialogService.show(gridDialogData)?.then(async (result)=> {
                if (result.closingButtonId === StandardDialogButtonId.Ok && result.value ? result.value : null) {
                    const ids = result.value?.selectedItems;
                    const items = result.value?.items;
                    const contractHelperList:ControllingGeneralContractorCostHeaderMap[]  = [];

                    _.forEach(ids, (id) => {
                        const item = _.find(items, {Id: id}) ;
                        if (item !== null) {
                            const contractHelper ={
                                OrdHeaderFk:(item as ControllingGeneralContractorCostHeaderMap).Id,
                                Comment:(item as ControllingGeneralContractorCostHeaderMap).Comment
                            };
                            contractHelperList.push(contractHelper as ControllingGeneralContractorCostHeaderMap);
                        }
                    });
                    const  postParam ={
                        ContractHelper:contractHelperList,
                        ProjectFk:1008169
                    };

                    const  url2 = this.configurationService.webApiBaseUrl + 'Controlling/GeneralContractor/GCSalesContractsController/createCostControlStructure';
                    const  data = await firstValueFrom(this.http.post(url2, postParam)) as CostControlWizardResultMap;
                    if(data) {
                        const modalOptions: IYesNoDialogOptions = {
                            headerText: this.translateService.instant('cloud.common.informationDialogHeader'),
                            bodyText: '',
                            defaultButtonId: StandardDialogButtonId.Yes
                        };

                        if(data.timeStr){
                            console.log(data.timeStr);
                        }
                        if (data.result) {
                            if (data.noDefaultJob) {
                                modalOptions.bodyText = this.translateService.instant('controlling.generalcontractor.noDefaultJob').text;
                            } else {
                                modalOptions.bodyText = this.translateService.instant('controlling.generalcontractor.WizardResult').text;
                            }
                            this.messageBoxService.showMsgBox(modalOptions);
                        }
                    }
                }
            });
        }
    }

}