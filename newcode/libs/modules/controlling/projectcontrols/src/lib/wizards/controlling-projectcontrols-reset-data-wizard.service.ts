/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {
    FieldType,
    IEditorDialogResult, IFormConfig,
    UiCommonFormDialogService,
    UiCommonLookupDataFactoryService
} from '@libs/ui/common';

import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';
import {EntityRuntimeData} from '@libs/platform/data-access';
import {
    MdcContrFormulaPropDefEntity
} from '../model/entities/mdc-contr-formula-prop-def-entity.class';

import {MdcContrConfigCompleteEntity} from '../model/entities/mdc-contr-config-complete-entity.class';
import {firstValueFrom} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ControllingProjectcontrolsResetDataWizardService {
    public formDialogService = inject(UiCommonFormDialogService);
    public lookupServiceFactory = inject(UiCommonLookupDataFactoryService);
    private readonly http = inject(HttpClient);
    private readonly configService = inject(PlatformConfigurationService);

    // Open dialog laod data
    public async showDialog(){

        const result = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'controlling/configuration/contrheader/getconfigcomplete'));

        const formulaProps :IFormConfig<MdcContrFormulaPropDefEntity> = {rows : []};

        const entitys = result as MdcContrConfigCompleteEntity;
        const formulaPropDefEntity = entitys.MdcContrFormulaPropDefs;
        formulaPropDefEntity.forEach((formula)=>{
            if(formula.IsEditable){
                formulaProps.rows.push(
                    {
                        id:formula?.Id?.toString() ?? 'defaultId',
                        type: FieldType.Boolean,
                        label:formula.DescriptionInfo ? formula.DescriptionInfo.Description : formula.Code,
                        model:formula.Code,
                    }
                );
            }
        });

        const runtimeInfo: EntityRuntimeData<MdcContrFormulaPropDefEntity> = {
            readOnlyFields: [],
            validationResults: [],
            entityIsReadOnly: false
        };
        this.formDialogService
            .showDialog<MdcContrFormulaPropDefEntity>({
                id: '1',
                headerText: 'controlling.projectcontrols.resetdata',
                formConfiguration: {
                    formId:'resetdata',
                    showGrouping: false,
                    groups:[{
                        groupId: 'baseGroup'
                    }],
                    rows:formulaProps.rows
                },
                entity: new MdcContrFormulaPropDefEntity(),
                runtime: runtimeInfo,
                customButtons: []
            })?.then((result: IEditorDialogResult<MdcContrFormulaPropDefEntity>)=>{

        });

    }
}


