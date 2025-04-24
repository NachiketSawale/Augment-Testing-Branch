import {Component, inject, InjectionToken} from '@angular/core';
import {FieldType, IGridConfiguration, ScriptDefService} from '@libs/ui/common';
import {IEstRuleResultVEntity} from '@libs/estimate/interfaces';
import {
    IEntityBase,
    IEntityIdentification,
    PlatformConfigurationService
} from '@libs/platform/common';
import {EntityContainerBaseComponent} from '@libs/ui/business-base';
import {firstValueFrom} from 'rxjs';
import {get} from 'lodash';
import {HttpClient} from '@angular/common/http';


export const SCRIPT_EDITOR_ENTITY_TOKEN = new InjectionToken<IEstRuleResultVEntity>('script-editor-entity-option-token');
@Component({
    templateUrl: './output-partial.component.html',
    styleUrl: './output-partial.component.css'
})
export class OutputPartialComponent<T extends IEntityIdentification & IEntityBase> extends EntityContainerBaseComponent<T>{

    public actionItemsLink = null;
    public actionItemsLinkMessages = null;

    public status = '0/0';
    public percentage = 0;
    public sequence = 0;
    public hint = '';
    public information = '';

    public finished = 0;
    public total = 0;
    public warningAmount = 0;
    public errors = 0;
    public warnings = 0;
    public infos = 0;
    public messages = 0;
    public constructor() {
        super();
        // const customOption = inject(SCRIPT_EDITOR_ENTITY_TOKEN);
        // extend(this.options, customOption);
    }
    // public updateValueForMessageItem(id) {
    //     //updateValue(id, actionItemsLinkMessages);
    // }
    private readonly defService = inject(ScriptDefService);
    protected options: IEstRuleResultVEntity = {
        scriptField: 'ValidateScriptData',
        mainItemIdField: 'Id',
        ScriptProvider: this.defService,
        Id:0

    };
    public  dataList: IEstRuleResultVEntity[] = [];
    private readonly http = inject(HttpClient);


    private readonly configService = inject(PlatformConfigurationService);
    public async onLoadData(){
        const resp = await firstValueFrom(this.http.post(
            `${this.configService.webApiBaseUrl}estimate/ruleresult/list`,
            {}));

        this.dataList = get(resp, 'Main')! as IEstRuleResultVEntity[];
        this.gridConfig = {
            ...this.gridConfig,
            items: this.dataList
        };
    }
    public gridConfig: IGridConfiguration<IEstRuleResultVEntity> ={
        uuid: '8989297c1ce24515a2f81521bda937c7',
        columns:[
            {
                id: 'order',
                label: { key: 'estimate.main.Selected', text: 'Selected' },
                model: 'order',
                readonly: false,
                sortable: true,
                type: FieldType.Text,
                visible: true,
            },
            {
                id: 'category',
                label: { key: 'estimate.main.categoryruleExecutionOutput.category', text: 'category' },
                model: 'ErrorType',
                readonly: false,
                sortable: true,
                type: FieldType.Text,
                visible: true
            },
            {
                id: 'lineItemCode',
                label: { key: 'estimate.main.categoryruleExecutionOutput.generateItemCode', text: 'LineItem Code' },
                model: 'LineItemCode',
                readonly: false,
                sortable: true,
                type: FieldType.Text,
                visible: true,
            },
            {
                id: 'ruleCode',
                label: { key: 'estimate.main.categoryruleExecutionOutput.ruleCode', text: 'Rule Code' },
                model: 'RuleCode',
                readonly: false,
                sortable: true,
                type: FieldType.Text,
                visible: true
            },
            {
                id: 'description',
                label: { key: 'estimate.main.categoryruleExecutionOutput.description', text: 'Description' },
                model: 'Description',
                readonly: false,
                sortable: true,
                type: FieldType.Text,
                visible: true
            },
            {
                id: 'elementCode',
                label: { key: 'estimate.main.categoryruleExecutionOutput.elementCode', text: 'Element Code' },
                model: 'ElementCode',
                readonly: false,
                sortable: true,
                type: FieldType.Text,
                visible: true
            },
            {
                id: 'assignedStructureType',
                label: { key: 'estimate.main.assignedStructureType', text: 'AssignedStructureType' },
                model: 'AssignedStructureType',
                readonly: false,
                sortable: true,
                type: FieldType.Text,
                visible: true
            },
            {
                id: 'line',
                label: { key: 'estimate.main.categoryruleExecutionOutput.line', text: 'Line' },
                model: 'Line',
                readonly: false,
                sortable: true,
                type: FieldType.Text,
                visible: true
            },
            {
                id: 'column',
                label: { key: 'estimate.main.categoryruleExecutionOutput.column', text: 'Column' },
                model: 'Column',
                readonly: false,
                sortable: true,
                type: FieldType.Text,
                visible: true
            },
            {
                id: 'callStack',
                label: { key: 'estimate.main.categoryruleExecutionOutput.callStack', text: 'CallStack' },
                model: 'CallStack',
                readonly: false,
                sortable: true,
                type: FieldType.Text,
                visible: true
            },
        ]
    };
    // TODO : Wait for component 'platform-action-item-list' to be supported

   public messageList = {
        activeValue: '',
        items: [
            {
                id: 'messages',
                cssClass: 'btn-default jsExecution',
                iconClass: 'tlb-icons ico-filter-assigned-and-notassigned',
                type: 'radio',
                caption: this.getValueById('messages'),
                value: 'messages',
                visible: true,
                fn: function () {
                    // $scope.onItemChanged(1);
                    // actionItemsLinkMessages.update();
                }
            },
            {
                id: 'infos',
                cssClass: 'btn-default jsExecution',
                iconClass: 'tlb-icons ico-info',
                type: 'radio',
                caption: this.getValueById('infos'),
                value: 'infos',
                visible: true,
                fn: function () {
                    // $scope.onItemChanged(2);
                    // actionItemsLinkMessages.update();
                }
            },
            {
                id: 'warnings',
                cssClass: 'btn-default jsExecution',
                iconClass: 'tlb-icons ico-warning',
                type: 'radio',
                caption: this.getValueById('warnings'),
                value: 'warnings',
                visible: true,
                fn: function () {
                    // $scope.onItemChanged(3);
                    // actionItemsLinkMessages.update();
                }
            },
            {
                id: 'errors',
                cssClass: 'btn-default jsExecution',
                iconClass: 'tlb-icons ico-error',
                type: 'radio',
                caption: this.getValueById('errors'),
                value: 'errors',
                visible: true,
                fn: function () {
                   // $scope.onItemChanged(4);
                    //actionItemsLinkMessages.update();
                }
            }
        ]
    };
    public getValueById(id : string) {
        let toReturn = '';
        switch (id) {
            case 'pi':
                toReturn = 'Procedure Information' + ': ' + this.information;
                break;
            case 'seq':
                toReturn = 'Sequence' + ': ' + this.sequence;
                break;
            case 'ps':
                toReturn = 'Procedure Status(finished/total)' + ': ' +this.status;
                break;
            case 'hint':
                toReturn = 'Line Items Execution Information' + ': ' + this.hint;
                break;
            case 'messages':
                toReturn = this.messages + ' ' + 'Messages';
                break;
            case 'infos':
                toReturn = this.infos + ' ' + 'Infos';
                break;
            case 'warnings':
                toReturn = this.warnings + ' ' + 'Warnings';
                break;
            case 'errors':
                toReturn = this.errors + ' ' + 'Errors';
                break;
        }

        return toReturn;
    }
    public ruleResultList = {
        cssClass: 'row-2-groups',
        items: [
            {
                align: 'left',
                cssClass: 'margin-right-ld',
                id: 'pi',
                toolTip: '',
                type: 'text',
                caption: this.getValueById('pi'),
                visible: true
            },
            {
                align: 'left',
                cssClass: 'margin-right-ld',
                id: 'seq',
                toolTip: '',
                type: 'text',
                caption: this.getValueById('seq'),
                visible: true
            },
            {
                align: 'left',
                cssClass: 'margin-right-ld',
                id: 'ps',
                toolTip: '',
                type: 'text',
                caption: this.getValueById('ps'),
                visible: true
            },
            {
                align: 'left',
                cssClass: 'margin-right-ld',
                id: 'hint',
                toolTip: '',
                type: 'text',
                caption: this.getValueById('hint'),
                visible: true
            },
            {
                cssClass: 'btn btn-default button-md',
                id: 'cancel',
                toolTip: '',
                type: 'item',
                caption: 'estimate.main.ruleExecutionOutput.cancel',
                visible: true,
                fn: function () {
                    //$scope.stopProcedure();
                }
            }
        ]
    };
}