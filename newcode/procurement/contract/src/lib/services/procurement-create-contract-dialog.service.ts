/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
    IPrcCreateHeaderDialogEntity,
} from '@libs/procurement/common';
import {
    FieldType,
    IEditorDialogResult, IFieldValueChangeInfo,
    IFormConfig,
    UiCommonFormDialogService
} from '@libs/ui/common';
import {EntityRuntimeData} from '@libs/platform/data-access';
import {PrcSharedPrcConfigLookupService} from '@libs/procurement/shared';
import { BasicsSharedNumberGenerationService } from '@libs/basics/shared';

/**
 * Contract create popup dialog service
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementCreateContractDialogService  {
    private alternate: boolean = false;
    private genNumberSvc = inject(BasicsSharedNumberGenerationService);
    private prcConfigLookup = inject(PrcSharedPrcConfigLookupService);
    /**
     * form controls data.
     */
     //TODO:The open dialog can't display the default number value
    public dialogFormEntity: IPrcCreateHeaderDialogEntity = {
        BusinessPartnerFk: 1004548,
        Code: '',
        ConfigurationFk: 11,
        ContactFk: 1002965,
        ProjectFk: undefined,
        SubsidiaryFk: 1005530,
        SupplierFk: 1001013
    };
    /**
     * form runtime data.
     */
    private formRuntimeInfo: EntityRuntimeData<IPrcCreateHeaderDialogEntity> = {
        readOnlyFields: [],
        validationResults: [],
        entityIsReadOnly: false
    };

    /**
     * form configuration data.
     */
        //TODO: should show the lookup
    private formConfig: IFormConfig<IPrcCreateHeaderDialogEntity> = {
        formId: 'create-contract-dialog-form',
        showGrouping: false,
        groups: [
            {
                groupId: 'default',
                header: { text: 'Default Group' },
            },
        ],
        rows: [
            {
                groupId: 'default',
                id: 'configurationFk',
                label: {
                    text: 'Configuration',
                },
                type: FieldType.Integer,
                model: 'ConfigurationFk',
                sortOrder: 1,
                required: true,
                change:(info: IFieldValueChangeInfo<IPrcCreateHeaderDialogEntity>)  => {
                    this.validateConfigurationFk(info);
                }
            },
            {
                groupId: 'default',
                id: 'code',
                label: {
                    text: 'Code',
                },
                type: FieldType.Code,
                model: 'Code',
                sortOrder: 2,
            },
            {
                groupId: 'default',
                id: 'businessPartnerFk',
                label: {
                    text: 'Business Partner',
                },
                type: FieldType.Integer,
                model: 'BusinessPartnerFk',
                sortOrder: 3,
                required: true,
            },
            {
                groupId: 'default',
                id: 'subsidiaryFk',
                label: {
                    text: 'Branch',
                },
                type: FieldType.Integer,
                model: 'SubsidiaryFk',
                sortOrder: 4,
                required: false
            },
            {
                groupId: 'default',
                id: 'supplierFk',
                label: {
                    text: 'Supplier',
                },
                type: FieldType.Integer,
                model: 'SupplierFk',
                sortOrder: 5,
                required: false
            },
            {
                groupId: 'default',
                id: 'contactFk',
                label: {
                    text: 'Contact',
                },
                type: FieldType.Integer,
                model: 'ContactFk',
                sortOrder: 6,
                required: false
            },
        ],
    };

    protected validateConfigurationFk(info: IFieldValueChangeInfo<IPrcCreateHeaderDialogEntity>):void{
        this.alternate = !this.alternate;
        if (info.newValue && this.alternate && info.entity.ConfigurationFk !== undefined) {
            this.prcConfigLookup.getItemByKey({
                id: info.entity.ConfigurationFk
            }).subscribe(e => {
                if (e !== null) {
                    //TODO: set the code readonly if has config to auto generate code
                    //this.genNumberSvc.hasToGenerateForRubricCategory(result,info.value,0);
                    info.entity.Code = this.genNumberSvc.provideNumberDefaultText(e.RubricCategoryFk, 5);
                }
                if(info.entity.Code === '') {
                    this.formRuntimeInfo.validationResults.push(
                        {
                            field: 'Code',
                            result: {
                                valid: false,
                                error: 'Can not be empty!',
                            },
                        }
                    );
                }
            });
        }
    }

    /**
     * Dialog form config service.
     */
    private formDialogService = inject(UiCommonFormDialogService);

    /**
     * Method opens the form dialog.
     */
    public async openCreateDialogForm() {
        const result = await this.formDialogService.showDialog<IPrcCreateHeaderDialogEntity>({
            id: 'create-contract-dialog',
            headerText: 'Create Procurement Contract',
            formConfiguration: this.formConfig,
            entity: this.dialogFormEntity,
            runtime: this.formRuntimeInfo,
            customButtons: []
        });
        return result;
    }

    /**
     * Method handles 'Ok' button functionality.
     *
     * @param {IFormDialogResultInterface<IPrcCreateHeaderDialogEntity>} Dialog result.
     */
    private handleOk(result: IEditorDialogResult<IPrcCreateHeaderDialogEntity>): void {
        //TODO:Operations to be carried out on ok click.
        console.log(result);
    }

    /**
     * Method handles 'Cancel' button functionality.
     *
     * @param {IFormDialogResultInterface<IPrcCreateHeaderDialogEntity>} result Dialog result.
     */
    private handleCancel(result?: IEditorDialogResult<IPrcCreateHeaderDialogEntity>): void {
        //TODO:Operations to be carried out on ok click.
        console.log(result);
    }

}