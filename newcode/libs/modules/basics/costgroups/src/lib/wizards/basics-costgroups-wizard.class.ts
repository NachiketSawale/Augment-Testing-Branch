/*
 * Copyright(c) RIB Software GmbH
 */

import {
    IInitializationContext, PlatformConfigurationService,
    PlatformTranslateService,
} from '@libs/platform/common';
import {BasicsCostGroupDataService} from '../services/basics-cost-group-data.service';
import {
    ICustomDialogOptions,
    IYesNoDialogOptions,
    StandardDialogButtonId,
    UiCommonDialogService,
    UiCommonMessageBoxService
} from '@libs/ui/common';
import {ICostGroupEntity} from '../model/entities/cost-group-entity.interface';
import * as _ from 'lodash';
import {
    BasicsCostgroupsCrbBkpCopyrightComponent
} from '../components/basics-costgroups-crb-bkp-copyright/basics-costgroups-crb-bkp-copyright.component';
import {
    BasicsCostgroupsCrbBkpImportComponent
} from '../components/basics-costgroups-crb-bkp-import/basics-costgroups-crb-bkp-import.component';
import {HttpClient} from '@angular/common/http';
import {BasicsCostGroupCatalogDataService} from '../services/basics-cost-group-catalog-data.service';

/**
 * Implement costgroups wizard.
 */
export class BasicsCostgroupsWizard {

    public importCrbBkp(context: IInitializationContext): void {
        const dialogService = context.injector.get(UiCommonDialogService);
        const translateService = context.injector.get(PlatformTranslateService);
        const copyrightModalOptions: ICustomDialogOptions<ICostGroupEntity, BasicsCostgroupsCrbBkpCopyrightComponent> = {
            headerText: 'Copyright',
            // showOkButton:     true,
            height:           '560px',
            width:            '560px',
            bodyComponent: BasicsCostgroupsCrbBkpCopyrightComponent
        };
        const http = context.injector.get(HttpClient);
        const configurationService = context.injector.get(PlatformConfigurationService);

        dialogService.show(copyrightModalOptions)?.then(() => {
            const bkpImportModalOptions: ICustomDialogOptions<ICostGroupEntity, BasicsCostgroupsCrbBkpImportComponent> =
                {
                    headerText: translateService.instant('basics.costgroups.bkpImport'),
                    resizeable: true,
                    height: '500px',
                    width: '250px',
                    minWidth: '250px',
                    bodyComponent: BasicsCostgroupsCrbBkpImportComponent,
                    buttons: [
                        {
                            id: StandardDialogButtonId.Ok,
                            caption: {key: 'cloud.common.ok'},
                            isDisabled: info => {
                                return !info.dialog.body.selectedBKPVersion || info.dialog.body.selectedBKPVersion === '';
                            },
                            autoClose: true,
                            fn: (event, info) => {
                                const dialogBody = info.dialog.body;
                                // Starts the import
                                http.post(configurationService.webApiBaseUrl + 'basics/costgroupcat/importcrbbkp',
                                    {
                                        BkpType:    dialogBody.selectedBKPType,
                                        BkpVersion: dialogBody.selectedBKPVersion
                                    }).subscribe(() => {
                                        const basicsCostGroupCatalogDataService = context.injector.get(BasicsCostGroupCatalogDataService);
                                        basicsCostGroupCatalogDataService.refreshAllLoaded();
                                    });
                            }
                        },
                        { id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'} }
                    ]
                };
            dialogService.show(bkpImportModalOptions);
        });
    }

    public importCostGroups(context: IInitializationContext): void {
        // todo: ...
        // basicsCommonImportDataService.execute(basicsCostGroupDataService, moduleName);
    }
    public disableRecord(context: IInitializationContext): void {
        const dataService = context.injector.get(BasicsCostGroupDataService);
        const list = dataService.getList();
        if(list !== null && list.length > 0) {
            this.provideInstance(context, dataService, 'Disable Record', 'cloud.common.disableRecord', 'Code',
                'basics.costgroups.disableDone', 'basics.costgroups.alreadyDisabled', 'code',
                'cloud.common.questionDisableSelection', false);
        }
    }

    public enableRecord(context: IInitializationContext): void {
        const dataService = context.injector.get(BasicsCostGroupDataService);
        const list = dataService.getList();
        if(list !== null && list.length > 0) {
            this.provideInstance(context, dataService, 'Enable Record', 'cloud.common.enableRecord', 'Code',
                'basics.costgroups.enableDone', 'basics.costgroups.alreadyEnabled', 'code',
                'cloud.common.questionEnableSelection', true);
        }
    }

    private provideInstance(context: IInitializationContext, dataService: BasicsCostGroupDataService, caption: string, captionTR: string, codeField: string, doneMsg: string, nothingToDoMsg: string, placeHolder: string, questionSelectionMsg: string, enable: boolean): void {
        const translateService = context.injector.get(PlatformTranslateService);
        const selectedEntities: ICostGroupEntity[] = dataService.getSelection();
        const selected: ICostGroupEntity | null = selectedEntities && selectedEntities[0] ? selectedEntities[0] : null;

        const modalOptions: IYesNoDialogOptions = {
            headerText: translateService.instant(captionTR),
            bodyText: '',
            // iconClass: 'ico-info',
            defaultButtonId: StandardDialogButtonId.Yes
        };
        const messageBoxService = context.injector.get(UiCommonMessageBoxService);
        if(selectedEntities && selectedEntities.length >= 2){
            const expandedEntities: ICostGroupEntity[] = [];
            const collapsedEntities: ICostGroupEntity[] = this.collapseEntities(context, selectedEntities);
            this.expandEntities(context, selectedEntities, expandedEntities);
            modalOptions.bodyText = this.prepareMessageText(context, questionSelectionMsg, expandedEntities, codeField, 'sel');
            const doneSelection: ICostGroupEntity[] = [];
            const notDoneSelection: ICostGroupEntity[] = [];


            messageBoxService.showYesNoDialog(modalOptions)?.then( (result) => {
                if(result && result.closingButtonId === StandardDialogButtonId.Yes){
                    _.forEach(collapsedEntities, (sel) => {
                        this.recordIsLive(context, sel, modalOptions, doneMsg, nothingToDoMsg, codeField, placeHolder, doneSelection, notDoneSelection, enable);
                    });
                    modalOptions.bodyText = '';
                    if(doneSelection && doneSelection.length >0) {
                        modalOptions.bodyText = this.prepareMessageText(context, doneMsg, doneSelection, codeField, placeHolder);
                    }
                    if(notDoneSelection && notDoneSelection.length >0){
                        modalOptions.bodyText += this.prepareMessageText(context, nothingToDoMsg, notDoneSelection, codeField, placeHolder);
                    }
                    messageBoxService.showMsgBox(modalOptions);
                }
            });

        } else if(selected && selected.Id > 0) {
            this.recordData(context, selected, modalOptions, doneMsg, nothingToDoMsg, codeField, placeHolder, enable);
        } else {
            modalOptions.bodyText = this.prepareMessageText(context, 'cloud.common.noCurrentSelection', null, null, null);
            messageBoxService.showMsgBox(modalOptions);
        }
    }

    private prepareMessageText(context: IInitializationContext, msgTextID: string, entities: ICostGroupEntity[] | null, codeField: string | null, placeHolder: string | null): string {
        let msgText: string = '';
        if (entities && _.isArray(entities)) {
            if (placeHolder && codeField) {
                msgText = this.getCollection(context, msgTextID, entities, codeField, placeHolder);
            }
        } else {
            const translateService = context.injector.get(PlatformTranslateService);
            if (placeHolder && codeField) {
                const param = {};
                _.set(param, placeHolder, _.get(entities, codeField) as unknown as string);
                msgText = translateService.instant(msgTextID, param).text;
            } else {
                msgText = translateService.instant(msgTextID).text;
            }
        }

        return msgText;
    }

    private getCollection(context: IInitializationContext, msgTextID: string, entities: ICostGroupEntity[], codeField: string, placeHolder: string): string {
        let msgText: string = '';
        let collection: string = '';

        _.forEach(entities, function (ent) {
            const field = _.get(ent, codeField) as unknown as string;
            collection += collection.length > 0 ? ', ' + field : field;
        });

        if (placeHolder && codeField) {
            const param = {};
            _.set(param, placeHolder, collection);
            const translateService = context.injector.get(PlatformTranslateService);
            msgText = translateService.instant(msgTextID, param).text;
        }

        return msgText;
    }

    private recordData(context: IInitializationContext, selected: ICostGroupEntity, modalOptions: IYesNoDialogOptions, doneMsg: string, nothingToDoMsg: string, codeField: string, placeHolder: string, enable: boolean): void{
        const doneSelection: ICostGroupEntity[] = [];
        const notDoneSelection: ICostGroupEntity[] = [];
        this.recordIsLive(context, selected, modalOptions, doneMsg, nothingToDoMsg, codeField, placeHolder, doneSelection, notDoneSelection, enable);
        const messageBoxService = context.injector.get(UiCommonMessageBoxService);

        if (doneSelection && doneSelection.length) {
            modalOptions.bodyText = this.prepareMessageText(context, doneMsg, doneSelection, codeField, placeHolder);
            messageBoxService.showMsgBox(modalOptions);
        }
        if (notDoneSelection && notDoneSelection.length) {
            modalOptions.bodyText = this.prepareMessageText(context, doneMsg, notDoneSelection, codeField, placeHolder);
            messageBoxService.showMsgBox(modalOptions);
        }
    }
    private recordIsLive(context: IInitializationContext, selected: ICostGroupEntity, modalOptions: IYesNoDialogOptions, doneMsg: string, nothingToDoMsg: string, codeField: string, placeHolder: string, doneSelection: ICostGroupEntity[], notDoneSelection: ICostGroupEntity[], enable: boolean): void{

        if(selected.IsLive !== enable) {
            selected.IsLive = enable;
            const dataService = context.injector.get(BasicsCostGroupDataService);
            dataService.setModified(selected);
            doneSelection.push(selected);
        } else {
            notDoneSelection.push(selected);
        }
        if(selected.ChildItems && selected.ChildItems.length > 0) {
            _.forEach(selected.ChildItems, (item) => {
                this.recordIsLive(context, item, modalOptions, doneMsg, nothingToDoMsg, codeField, placeHolder, doneSelection, notDoneSelection, enable);
            });
        }
    }
    private expandEntities(context: IInitializationContext, entities: ICostGroupEntity[], expandedEntities: ICostGroupEntity[]): void {
        _.forEach(entities, (entity) => {
            if (!_.find(expandedEntities, {Id: entity.Id})) {
                expandedEntities.push(entity);
            }
            if(entity.ChildItems && entity.ChildItems.length > 0) {
                this.expandEntities(context, entity.ChildItems, expandedEntities);
            }
        });
    }
    private collapseEntities(context: IInitializationContext, entities: ICostGroupEntity[]): ICostGroupEntity[] {
        let items: ICostGroupEntity[] = [];
        const parentIds: number[] = [];
        function getParentId(costgroups: ICostGroupEntity[], parentsId: number[]) {
            _.forEach(costgroups, function(costgroup) {
                if (costgroup.HasChildren) {
                    parentIds.push(costgroup.Id);
                    if(costgroup.ChildItems){
                        getParentId(costgroup.ChildItems, parentsId);
                    }
                }
            });
        }
        if (entities.length > 1) {
            getParentId(entities, parentIds);
            _.forEach(entities, function(item) {
                if (!item.CostGroupFk) {
                    items.push(item);
                } else if (item.CostGroupFk && parentIds.indexOf(item.CostGroupFk) === -1) {
                    items.push(item);
                }
            });
        } else {
            items = entities;
        }
        return items;
    }
}