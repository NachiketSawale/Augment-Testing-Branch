import {inject, Injectable} from '@angular/core';
import {FieldType, IEditorDialogResult, IFormConfig, UiCommonFormDialogService} from '@libs/ui/common';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';

import {EntityRuntimeData} from '@libs/platform/data-access';
import {ControllingActualsCostHeaderDataService} from '../../controlling-actuals-cost-header-data.service';
import {string} from "mathjs";



class FormEntity {
   public StartDate?: Date;
   public EndDate?: Date;
   public OnlyUnreadItems?:boolean;
}
@Injectable({
    providedIn: 'root'
})
export class ControllingActualsImportItwofinanceService {
    private readonly formDialogService = inject(UiCommonFormDialogService);
    private readonly http = inject(HttpClient);
    private readonly configService = inject(PlatformConfigurationService);
    private readonly controllingActualsCostHeaderDataService = inject(ControllingActualsCostHeaderDataService);
    private formEntity:FormEntity = {
        StartDate:undefined,
        EndDate:undefined,
        OnlyUnreadItems :false
    };
    public  showDialog():void{
       
        const runtimeInfo: EntityRuntimeData<FormEntity> = {
            readOnlyFields: [],
            validationResults: [],
            entityIsReadOnly: false
        };
        this.formDialogService
            .showDialog<FormEntity>({
                id: '1',
                headerText: 'controlling.actuals.synchronizeActualsFromFinance',
                formConfiguration: this.createFormConfig,
                entity: this.formEntity,
                runtime: runtimeInfo,
                customButtons: []
            })?.then((result: IEditorDialogResult<FormEntity>) => {
            if (result.closingButtonId === 'ok' && result.value) {
                if(this.formEntity.StartDate && this.formEntity.EndDate){
                    const parameter = 'startDate='+this.formEntity.StartDate.toJSON() +'&endDate='+this.formEntity.EndDate.toJSON() + '&onlyUnreadItems='+this.formEntity.OnlyUnreadItems;
                    this.http.post(`${this.configService.webApiBaseUrl}controlling/actuals/costheader/importfromfinance?`+parameter, null).subscribe(() => {
                        this.controllingActualsCostHeaderDataService.refreshAll();
                    });
                }

            }
        });
    }
    private createFormConfig: IFormConfig<FormEntity> = {
        formId:'1',
        showGrouping: false,
        groups:[{
            groupId: 'Detail'
        }],
        rows:[
            {
                id:'StartDate',
                type: FieldType.Date,
                label: {
                    text: 'from',
                    key:'from',
                },
                model:'StartDate',
                required: true,
                groupId: 'Detail'
            },
            {
                id:'EndDate',
                type: FieldType.Date,
                label: {
                    text: 'to',
                    key:'to'
                },
                model:'EndDate',
                required: true,
                groupId: 'Detail'
            },
            {
                id:'OnlyUnreadItems',
                type: FieldType.Boolean,
                label: {
                    text: 'controlling.actuals.synchronizeActualsFromFinanceOnlyUnreadItems',
                    key:'OnlyUnreadItems'
                },
                model:'OnlyUnreadItems',
                required: true,
                groupId: 'Detail'
            }
        ]
    };
}