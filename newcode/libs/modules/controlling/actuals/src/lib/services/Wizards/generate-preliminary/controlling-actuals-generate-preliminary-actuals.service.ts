import {inject, Injectable} from '@angular/core';
import {
    createLookup,
    FieldType,
    IEditorDialogResult,
    IFormConfig,
    UiCommonFormDialogService,
    UiCommonLookupDataFactoryService
} from '@libs/ui/common';
import {
    ControllingActualsGeneratePreliminaryActualsDetail
} from './controlling-actuals-generate-preliminary-actuals.detail.class';
import {EntityRuntimeData} from '@libs/platform/data-access';
import {PlatformConfigurationService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import {ControllingActualsCostHeaderDataService} from '../../controlling-actuals-cost-header-data.service';
import {
    ControllingCommonCompanyPeriodLookupService,
    ControllingCommonCompanyYearLookupService
} from '@libs/controlling/common';

@Injectable({
    providedIn: 'root'
})
export class ControllingActualsGeneratePreliminaryActualsService{
    private readonly formDialogService = inject(UiCommonFormDialogService);
    private readonly lookupServiceFactory = inject(UiCommonLookupDataFactoryService);
    private readonly http = inject(HttpClient);
    private readonly configService = inject(PlatformConfigurationService);
    private readonly controllingActualsCostHeaderDataService = inject(ControllingActualsCostHeaderDataService);
    public  showDialog():void{
        const entity = new ControllingActualsGeneratePreliminaryActualsDetail();
        const costHeaderEntity = this.controllingActualsCostHeaderDataService.getSelectedEntity();
        if(costHeaderEntity !== null){
            entity.CompanyPeriodFk = costHeaderEntity.CompanyPeriodFk;
            entity.CompanyPeriodFkEndDate = costHeaderEntity.CompanyPeriodFkEndDate;
            entity.CompanyPeriodFkStartDate = costHeaderEntity.CompanyPeriodFkStartDate;
            entity.CompanyYearFk = costHeaderEntity.CompanyYearFk;
            entity.CompanyYearFkEndDate = costHeaderEntity.CompanyYearFkEndDate;
            entity.CompanyYearFkStartDate = costHeaderEntity.CompanyYearFkEndDate;
        }

        const runtimeInfo: EntityRuntimeData<ControllingActualsGeneratePreliminaryActualsDetail> = {
            readOnlyFields: [],
            validationResults: [],
            entityIsReadOnly: false
        };
        this.formDialogService
            .showDialog<ControllingActualsGeneratePreliminaryActualsDetail>({
                id: '1',
                headerText: 'controlling.actuals.wizard.actuals.title',
                formConfiguration: this.createFormConfig,
                entity: entity,
                runtime: runtimeInfo,
                customButtons: []
            })?.then((result: IEditorDialogResult<ControllingActualsGeneratePreliminaryActualsDetail>) => {
            if (result.closingButtonId === 'ok' && result.value) {
                this.http.post(`${this.configService.webApiBaseUrl}controlling/actuals/wizard/generatepreliminaryactuals`, entity).subscribe(() => {
                    this.controllingActualsCostHeaderDataService.refreshAll();
                });
            }
        });
    }
    private createFormConfig: IFormConfig<ControllingActualsGeneratePreliminaryActualsDetail> = {
        formId:'PreliminaryActualsDetail',
        showGrouping: false,
        groups:[{
            groupId: 'PreliminaryActualsDetail'
        }],
        rows:[{
                id:'CompanyYearFk',
                type: FieldType.Lookup,
                label:'Company Year',
                model:'CompanyYearFk',
                lookupOptions: createLookup({
                    dataServiceToken: ControllingCommonCompanyYearLookupService,
                })
            },
            {
                id:'companyYearFkStartDate',
                type: FieldType.Description,
                label: {
                    text: 'controlling.actuals.entityStartDate',
                    key:'controlling.actuals.entityStartDate'
                },
                model:'CompanyYearFkStartDate',
                required: true,
                groupId: 'PreliminaryActualsDetail'
            },
            {
                id:'companyYearFkEndDate',
                type: FieldType.Description,
                label: {
                    text: 'controlling.actuals.entityEndDate',
                    key:'controlling.actuals.entityEndDate'
                },
                model:'CompanyPeriodFkStartDate',
                required: true,
                groupId: 'PreliminaryActualsDetail'
            },
            {
                id:'CompanyPeriodFk',
                type: FieldType.Lookup,
                label:'Company Period',
                model:'CompanyYearFk',
                lookupOptions: createLookup({
                    dataServiceToken: ControllingCommonCompanyPeriodLookupService,
                })

            },
            {
                id:'companyPeriodFkStartDate',
                type: FieldType.Description,
                label: {
                    text: 'controlling.actuals.entityStartDate',
                    key:'controlling.actuals.entityStartDate'
                },
                model:'CompanyPeriodFkStartDate',
                required: true,
                groupId: 'PreliminaryActualsDetail'
            },
            {
                id:'companyPeriodFkEndDate',
                type: FieldType.Description,
                label: {
                    text: 'controlling.actuals.entityEndDate',
                    key:'controlling.actuals.entityEndDate'
                },
                model:'CompanyPeriodFkEndDate',
                required: true,
                groupId: 'PreliminaryActualsDetail'
            },
            {
                id:'IsSuccess',
                type: FieldType.Boolean,
                label: {
                    text: 'controlling.actuals.wizard.isSuccess',
                    key:'controlling.actuals.wizard.isSuccess'
                },
                model:'IsSuccess',
                required: true,
                groupId: 'PreliminaryActualsDetail'
            },
            {
                id:'IsDelete',
                type: FieldType.Boolean,
                label: {
                    text: 'controlling.actuals.wizard.isDelete',
                    key:'controlling.actuals.wizard.isDelete'
                },
                model:'IsDelete',
                required: true,
                groupId: 'PreliminaryActualsDetail'
            }
        ]
    };
}