/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, Injector, runInInjectionContext} from '@angular/core';
import {PlatformTranslateService} from '@libs/platform/common';
import {
    ColumnDef, createLookup,
    CustomStep, FieldType, GridStep,
    ICustomDialog,
    IDialogButtonEventInfo,
    MultistepDialog,
    MultistepTitleFormat,
    UiCommonMessageBoxService, UiCommonMultistepDialogService
} from '@libs/ui/common';
import {
    IBaseMaterialPriceOfQuoteNContrat,
    IPriceCondition,
    IPriceResult,
    IUpdatePriceDataComplete
} from '../../model/entities/project-material-update-price-complate.interface';
import {
    ProjectMaterialProjectMaterialUpdatePriceBasicOptionComponent
} from '../../components/project-material-update-price-basic-option/project-material-update-price-basic-option.component';
import {
    ProjectMaterialProjectMaterialUpdatePriceGroupComponent
} from '../../components/project-material-update-price-group/project-material-update-price-group.component';
import {ProjectMainDataService} from '@libs/project/shared';
import {IBasicsUomEntity} from '@libs/basics/interfaces';
import {BasicsSharedUomLookupService} from '@libs/basics/shared';
import {
    ProjectMaterialUpdatePriceByMaterialItemDataService
} from './project-material-update-price-by-material-item-data.service';
import {ProjectMaterialUpdatePriceFromCatalogMainService} from './project-material-update-price-from-catalog-main.service';
import * as _ from 'lodash';
import {
    ProjectMaterialUpdatePriceByMaterialItemListDataService
} from './project-material-update-price-by-material-item-list-data.service';
import {Observable} from 'rxjs';
import {
    ProjectMaterialUpdatePriceByMaterialCatalogDataService
} from './project-material-update-price-by-material-catalog-data.service';
import {ProjectMaterialUpdatePriceFromQuoteDataService} from './project-material-update-price-from-quote-date.service';
import {
    ProjectMaterialUpdatePriceFromContractDataService
} from './project-material-update-price-from-contract-data.service';
import {ProjectMaterialUpdatePriceResultDataService} from './project-material-update-price-result-data.service';
import {ValidationResult} from '@libs/platform/data-access';
import {
    ProjectMaterialUpdateResultFieldVarianceFormartService
} from './project-material-update-result-field-variance-formart.service';
import {FieldVarianceFormatterOptions} from '../../model/project-material-constants';

@Injectable({
    providedIn: 'root'
})
export class ProjectMaterialUpdatePriceWizardService {
    private readonly _injector = inject(Injector);
    private readonly uiCommonMsgBoxService = inject(UiCommonMessageBoxService);
    private readonly prjDataService = inject(ProjectMainDataService);
    private readonly translateService = inject(PlatformTranslateService);
    private readonly multistepService = inject<UiCommonMultistepDialogService>(UiCommonMultistepDialogService);
    private readonly updateByMaterialItemDataService = inject(ProjectMaterialUpdatePriceByMaterialItemDataService);
    private readonly updateByMaterialItemListDataService = inject(ProjectMaterialUpdatePriceByMaterialItemListDataService);
    private readonly projectMainUpdatePriceFromCatalogMainService = inject(ProjectMaterialUpdatePriceFromCatalogMainService);
    private readonly updateByMaterialCatalogDataService = inject(ProjectMaterialUpdatePriceByMaterialCatalogDataService);
    private co2Attr = 0;
    private readonly updateFromQouteDataService = inject(ProjectMaterialUpdatePriceFromQuoteDataService);
    private readonly updateFromContractDataService = inject(ProjectMaterialUpdatePriceFromContractDataService);
    private readonly updateResultDataService = inject(ProjectMaterialUpdatePriceResultDataService);
    private readonly projectMainUpdateResultFieldVarianceFormatter = inject(ProjectMaterialUpdateResultFieldVarianceFormartService);

    private _isLoading = false;

    public async showUpdatePriceDialog(){
        await this.translateService.load(['project.main', 'project.material']);

        const project = this.prjDataService.getSelectedEntity();
        if(!project){
            this.uiCommonMsgBoxService.showInfoBox(this.translateService.instant('project.main.noCurrentSelection').text,'info', true);
            return;
        }

        this.projectMainUpdatePriceFromCatalogMainService.ProjectId = project.Id;

        //todo: if open this dialog from resource summary, use other way to get project.

        const instance = runInInjectionContext(this._injector, ()=>{
            return new ProjectMaterialUpdatePriceWizardService();
        });

        return instance.showUpdatePriceDialogInternal();
    }
    
    private async showUpdatePriceDialogInternal(){
        const dataItem: IUpdatePriceDataComplete ={
            basicOption:{
                optionItem: {
                    canUpdateFromCatalog: true,
                    catalogSelect: 'byMaterialItem',
                    radioSelect: 'fromCatalog',
                }
            },
            priceResultSet: []
        };

        const stepTitle = this.translateService.instant('project.main.updateMaterialPricesTitle');

        const basicSetting = new CustomStep('basicSetting', stepTitle, ProjectMaterialProjectMaterialUpdatePriceBasicOptionComponent, [], 'basicOption');

        const groupSetting = new CustomStep('groupSetting', stepTitle, ProjectMaterialProjectMaterialUpdatePriceGroupComponent, [],'basicOption');

        const priceResultColumn: ColumnDef<IPriceResult>[] = [
            {
                id: 'checked',
                model: 'Checked',
                type: FieldType.Boolean,
                label: {
                    text: 'Selected',
                    key: 'basics.common.selected'
                },
                visible: true,
                sortable: false,
                readonly: true,
            },
            {
                id: 'CatalogCode',
                model: 'CatalogCode',
                type: FieldType.Code,
                label: {
                    text: 'Catalog Code',
                    key: 'project.main.catalogCode'
                },
                visible: true,
                sortable: false,
                readonly: true
            },
            {
                id: 'CatalogDescription',
                model: 'CatalogDescription',
                type: FieldType.Translation,
                label: {
                    text: 'Catalog Description',
                    key: 'project.main.catalogDescription'
                },
                visible: true,
                sortable: false,
                readonly: true
            },
            {
                id: 'resultJobCatalogCode',
                model: 'JobCode',
                type: FieldType.Code,
                label: {
                    text: 'Job Code',
                    key: 'project.main.updatePriceFromCatalogWizard.resultJobCode'
                },
                visible: true,
                sortable: false,
                readonly: true
            },
            {
                id: 'resultJobCatalogDesc',
                model: 'JobDescription',
                type: FieldType.Translation,
                label: {
                    text: 'Job Description',
                    key: 'project.main.updatePriceFromCatalogWizard.resultJobDesc'
                },
                visible: true,
                sortable: false,
                readonly: true
            },
            {
                id: 'MaterialCode',
                model: 'MaterialCode',
                type: FieldType.Code,
                label: {
                    text: 'Material Code',
                    key: 'project.main.materialCode'
                },
                visible: true,
                sortable: false,
                readonly: true
            },
            {
                id: 'MaterialDescription',
                model: 'MaterialDescription',
                type: FieldType.Translation,
                label: {
                    text: 'Material Description',
                    key: 'project.main.materialDescription'
                },
                visible: true,
                sortable: false,
                readonly: true
            },
            {
                id:'UomFk',
                model: 'UomFk',
                type: FieldType.Lookup,
                lookupOptions: createLookup<IPriceResult, IBasicsUomEntity>({
                    dataServiceToken: BasicsSharedUomLookupService
                }),
                label: {
                    text: 'UoM',
                    key: 'project.main.uoM'
                },
                visible: true,
                sortable: false,
                readonly: true
            },
            {
                id:'OldEstimatePrice',
                model: 'OldEstimatePrice',
                type: FieldType.Money,
                label: {
                    text: 'Old Estimate Price',
                    key: 'project.main.oldEstimatePrice'
                },
                visible: true,
                sortable: false,
                readonly: true
            },
            {
                id:'NewEstimatePrice',
                model: 'NewEstimatePrice',
                type: FieldType.Money,
                label: {
                    text: 'New Estimate Price',
                    key: 'project.main.newEstimatePrice'
                },
                visible: true,
                sortable: false,
                readonly: false,
                validator: info => {
                    if(info.value) {
                        info.entity.Variance = info.value as number - info.entity.OldEstimatePrice;
                    }
                    return new ValidationResult();
                }
            },
            {
                id:'resultVariance',
                model: 'Variance',
                type: FieldType.Decimal,
                label: {
                    text: 'Variance',
                    key: 'project.main.variance'
                },
                cssClass: 'text-right',
                visible: true,
                sortable: false,
                readonly: true
                // TODO: add function to support decimalPlaces
            },
            {
                id:'Source',
                model: 'Source',
                type: FieldType.Description,
                label: {
                    text: 'Source',
                    key: 'project.main.source'
                },
                visible: true,
                sortable: false,
                readonly: true
            },
            {
                id:'upComment',
                model: 'Comment',
                type: FieldType.Description,
                label: {
                    text: 'Comment',
                    key: 'project.main.comment'
                },
                visible: true,
                sortable: false,
                readonly: true
            },
            {
                id:'Co2Project',
                model: 'Co2Project',
                type: FieldType.Money,
                label: {
                    text: 'CO2/kg (Project)',
                    key: 'basics.material.record.entityCo2Project'
                },
                visible: true,
                sortable: false,
                readonly: true
            },
            {
                id:'Co2Source',
                model: 'Co2Source',
                type: FieldType.Money,
                label: {
                    text: 'CO2/kg (Source)',
                    key: 'basics.material.record.entityCo2Source'
                },
                visible: true,
                sortable: false,
                readonly: true
            }
        ];

        const priceResultDialog = new GridStep('priceRsult', stepTitle, {uuid:'8a8ec7241d66414e86b76a92e0308ac3', columns: priceResultColumn}, 'priceResultSet');

        const multistepDialog = new MultistepDialog(dataItem, [
            basicSetting
            ,groupSetting
            ,priceResultDialog
        ]);
        multistepDialog.titleFormat = MultistepTitleFormat.StepTitle;
        multistepDialog.hideIndicators = false;
        multistepDialog.dialogOptions.buttons = [
            {
                id: 'search', caption: {key: 'basics.common.button.search'},
                isVisible: (info)=> {
                    return info.dialog.value?.stepIndex === 1;
                },
                isDisabled: () => {
                    return this._isLoading;

                },
                fn: (event, info) => {
                    const optionItem = info.dialog.value?.dataItem.basicOption?.optionItem;
                    const emitKey = optionItem?.radioSelect === 'fromQuote' || optionItem?.radioSelect === 'fromContract'?'search-loadGrid'
                        : optionItem?.catalogSelect === 'byMaterialCatalog' ? 'load-material-catalog': 'load-material-item';
                    this.projectMainUpdatePriceFromCatalogMainService.CommonEvent.emit(emitKey);
                }
            },
            {
                id: 'previousStep', caption: {key: 'basics.common.button.previousStep'},
                isDisabled: (info) => {
                    return !this.canExecutePreviousButton(info);
                },
                fn: (event, info) => {
                    info.dialog.value?.goToPrevious();
                }
            },
            {
                id: 'nextBtn', caption: {key: 'basics.common.button.nextStep'},
                isVisible: (info)=> {
                    const value = info.dialog.value;
                    if(value?.stepIndex === 2){
                        return false;
                    }

                    return !(value?.stepIndex === 1 && value?.dataItem.basicOption?.optionItem.radioSelect === 'fromCatalog');


                },
                isDisabled: (info) => {
                    return !this.canExecuteNextButton(info);
                },
                fn: (event, info) => {
                    this.clickNext(info);
                }
            },
            {
                id: 'resetAll', caption: {key: 'project.main.resetAllWithBasePriceBtnText'},
                isVisible: (info)=> {
                    return info.dialog.value?.stepIndex === 1
                        && info.dialog.value.dataItem.basicOption?.optionItem.radioSelect === 'fromCatalog'
                            && info.dialog.value.dataItem.basicOption?.optionItem.catalogSelect === 'byMaterialItem';
                },
                isDisabled: () => {
                    return false;
                },
                fn:() => {
                    this.updateByMaterialItemDataService.chanageSourceOptionPriceVersionId();
                }
            },
            {
                id: 'update', caption: {key: 'project.main.update'},
                isVisible: (info)=> {
                    return (info.dialog.value?.stepIndex === 1 && info.dialog.value.dataItem.basicOption?.optionItem.radioSelect === 'fromCatalog')
                        || info.dialog.value?.stepIndex === 2;
                },
                isDisabled: (info) => {
                    return !this.canUpdateButton(info);
                },
                fn: (event, info) => {
                    this.Update(info);
                    this.close();
                },
                autoClose: true
            },
            {
                id: 'closeWin',
                caption: {key: 'basics.common.button.cancel'},
                fn: () => {
                    this.close();
                },
                autoClose: true
            },
        ];

        // multistepDialog.dialogOptions.width = '700px';

        const result = await this.multistepService.showDialog(multistepDialog);
        return result?.value;
    }

    private close(): void{
        this.updateResultDataService.clear();
        this.updateFromContractDataService.clear();
        this.updateFromQouteDataService.clear();
        this.updateByMaterialItemDataService.reset();
        this.updateByMaterialCatalogDataService.clear();
    }

    private clickNext(info: IDialogButtonEventInfo<ICustomDialog<MultistepDialog<IUpdatePriceDataComplete>, object>, void>) {

        const dialog = info.dialog.value;
        if (dialog) {
            if(dialog.stepIndex === 1
                && (dialog.dataItem.basicOption?.optionItem.radioSelect === 'fromQuote'
                    || dialog.dataItem.basicOption?.optionItem.radioSelect === 'fromContract')){
                const isFromQuote = dialog.dataItem.basicOption?.optionItem.radioSelect === 'fromQuote';

                const materialDependIds: number[] = [];

                if(isFromQuote){
                    _.forEach(this.updateFromQouteDataService.DataItems, function (item){
                       if(item.Checked){
                           materialDependIds.push(item.Id);
                       }
                    });
                }else{
                    _.forEach(this.updateFromContractDataService.DataItems, function (item){
                        if(item.Checked){
                            materialDependIds.push(item.Id);
                        }
                    });
                }

                const data = {
                    previousStep: isFromQuote ? 1 : 2,
                    quoteIds: materialDependIds,
                    prjId: this.projectMainUpdatePriceFromCatalogMainService.ProjectId,
                    estHeaderFk: null //TODO this value should be assign if open this wizard in resource summary
                };
                this.updateResultDataService.getResultGridData(data, this.updateResultDataService).subscribe(response => {
                    const resultDatas = response as IPriceResult[];
                    const priceConditions: IPriceCondition[] = [];
                    _.forEach(resultDatas, function (item){
                        item.UomFk = item.Uom;
                        item.Comment = item.CommentText;

                        priceConditions.push({
                            Id: item.Id,
                            PriceConditionFk: item.PriceConditionFk,
                            PriceConditions: item.PriceConditions
                        });
                    });

                    this.updateResultDataService.PriceConditions = priceConditions;
                    dialog.dataItem.priceResultSet = resultDatas;

                    dialog.goToNext();
                });

            }else {
                dialog.goToNext();
            }
        }
    }

    private Update(info: IDialogButtonEventInfo<ICustomDialog<MultistepDialog<IUpdatePriceDataComplete>, object>, void>) {

        const dialog = info.dialog.value;
        const dataItem = dialog?.dataItem;
        const usingInSummary = false;
        let countUpdatedData = 0;
        let bodyText = '';
        let observable: Observable<object> | undefined;
        const selectedProject = this.prjDataService.getSelectedEntity();
        if(dataItem?.basicOption?.optionItem.radioSelect === 'fromCatalog'){
            if(dataItem?.basicOption?.optionItem.catalogSelect === 'byMaterialItem'){
                const projectId = this.projectMainUpdatePriceFromCatalogMainService.ProjectId;
                const projectMaterialsToUpdate = this.updateByMaterialItemDataService.getListSelectedWidthModification(this.co2Attr);
                const anySelectedPrjMaterial = _.isArray(projectMaterialsToUpdate) ? projectMaterialsToUpdate.length > 0 : false;
                if (!anySelectedPrjMaterial) {
                    bodyText = this.translateService.instant('project.main.updatePriceFromCatalogWizard.noModifiedProjectMaterialSelectedDetail').text;
                    this.uiCommonMsgBoxService.showInfoBox(bodyText, 'info', true);
                    return;
                }

                const prjMatIds = _.map(projectMaterialsToUpdate, function (item) {
                    return item.Id;
                });
                const specifiedPrjMaterial2PriceList = this.updateByMaterialItemListDataService.getListByPrjMaterialIds(prjMatIds);
                const prjMaterial2SourceOption = this.updateByMaterialItemListDataService.getSourceOptionsByPrjMaterialIds(prjMatIds);
                const isValid = this.updateByMaterialItemListDataService.checkIsValid(specifiedPrjMaterial2PriceList);
                if (!isValid) {
                    this.uiCommonMsgBoxService.showInfoBox(this.translateService.instant('project.main.updatePriceFromCatalogWizard.updateDataNotCorrect').text, 'info', true);
                    return;
                }
                const data = {
                    ProjectId: projectId,
                    ProjectMaterialsToUpdate: projectMaterialsToUpdate,
                    SpecifiedPrjMaterial2PriceList: specifiedPrjMaterial2PriceList,
                    PrjMaterial2SourceOption: prjMaterial2SourceOption
                };
                observable = this.updateByMaterialItemDataService.updatePricesWithSpecifiedPriceList(data);
                countUpdatedData = projectMaterialsToUpdate.length;
            }else if(dataItem?.basicOption?.optionItem.catalogSelect === 'byMaterialCatalog'){
                const materialDatas: object[] = [];
                const itemList = this.updateByMaterialCatalogDataService.PriceByCatalogFlatList();
                const allSelectedItem = _.filter(itemList,{Checked:true});
                _.forEach(allSelectedItem, (item)=>{
                    if(item.Checked && item.MaterialCatalogFk){
                        const materialData = {
                            Id: item.Id,
                            ProjectId : this.projectMainUpdatePriceFromCatalogMainService.ProjectId,
                            MaterialPriceVersionFk: item.MaterialPriceVersionFk,
                            IsBase: item.MaterialPriceVersionFk === -1
                        };
                        materialDatas.push(materialData);
                    }
                });
                observable = this.updateByMaterialCatalogDataService.updateFromCatalogs(materialDatas);
                countUpdatedData = materialDatas.length;
            }
        }else if(dataItem?.basicOption?.optionItem.radioSelect === 'fromQuote'
            || dataItem?.basicOption?.optionItem.radioSelect === 'fromContract'){

            const isFromQuote = dataItem?.basicOption?.optionItem.radioSelect === 'fromQuote';

            const dataList: IBaseMaterialPriceOfQuoteNContrat[] = isFromQuote ? this.updateFromQouteDataService.DataItems : this.updateFromContractDataService.DataItems;
            const tempCo2Attr: IBaseMaterialPriceOfQuoteNContrat[] = _.filter(dataList,(item)=>{
                return 	item.Co2Project !== item.OldCo2Project || item.Co2Source !== item.OldCo2Source;
            });
            let tempDataModified = _.filter(dataList,  (item) => {
                return !(this.projectMainUpdateResultFieldVarianceFormatter.IsEqualToZero(item.Variance, FieldVarianceFormatterOptions.decimalPlaces)) &&!(
                    (item.Co2Project !== item.OldCo2Project) && (item.Co2Source !== item.OldCo2Source)
                );
            });
            let anyModified = _.isArray(tempDataModified) ? tempDataModified.length > 0 : false;
            if(tempCo2Attr.length>0){
                anyModified =  true;
                tempDataModified = tempCo2Attr;
            }
            if (!anyModified) {
                bodyText = this.translateService.instant('project.main.updatePriceFromCatalogWizard.noModifiedProjectMaterial').text;
                this.uiCommonMsgBoxService.showMsgBox(bodyText, this.translateService.instant('project.main.update').text, 'info');
                return;
            }
            const priceConditions = this.updateResultDataService.PriceConditions;
            const materialDatas = [];

            for (let i = 0; i < tempDataModified.length; i++) {
                const materialData = {
                    Id: tempDataModified[i].Id,
                    EstimatePrice: tempDataModified[i].NewEstimatePrice,
                    PriceConditionFk: 0,
                    CommentText: tempDataModified[i].Comment,
                    PriceConditions: {},
                    ProjectId: selectedProject ? selectedProject.Id : null,
                    MaterialCode: tempDataModified[i].MaterialCode,
                    Co2Project : tempDataModified[i].Co2Project,
                    Co2Source : tempDataModified[i].Co2Source
                };

                for (let k = 0; k < priceConditions.length; k++) {
                    if (tempDataModified[i].Id === priceConditions[k].Id) {
                        materialData.PriceConditionFk = priceConditions[k].PriceConditionFk;
                        materialData.PriceConditions = priceConditions[k].PriceConditions;
                    }
                }

                materialDatas.push(materialData);
            }

            observable = this.updateResultDataService.updateResult(materialDatas);
            countUpdatedData = materialDatas.length;
        }

        if(observable){
            observable.subscribe(response => {
                if (response.toString() === 'true') {
                    if (!usingInSummary) {
                        const permission = this.uiCommonMsgBoxService.showInfoBox(this.translateService.instant('project.main.updatePriceFromCatalogWizard.updateSuccessfulWithCount', {count: countUpdatedData}).text, 'info', true);
                        permission?.then((res) => {
                            if ('ok' in res && res.ok === true) {
                                this.prjDataService.deselect();
                                this.prjDataService.refreshAll().then(() => {
                                    this.prjDataService.select(selectedProject);
                                    //TODO this function isn't enhanced at framework
                                    //const gridId = '713B7D2A532B43948197621BA89AD67A';
                                    //platformGridAPI.rows.scrollIntoViewByItem(gridId, selectedProject);
                                });
                            }
                        });
                    } else {
                        //TODO enhance this if open in resource summary
                        // projectMainUpdatePricesWizardCommonService.onMaterialPriceDataSet.fire();
                    }
                }else {
                    if('status' in response){
                        const successCount = 'success' in response ? response['success'] : 0;
                        const failCount = 'fail' in response ? response['fail'] : 0;
                        const permission = this.uiCommonMsgBoxService.showInfoBox(this.translateService.instant('project.main.updatePriceFromCatalogWizard.updateSuccessfulOrFailWithCount', {successCount: successCount,failCount:failCount}).text, 'info', true);
                        permission?.then((res)=>{
                            if ('ok' in res && res.ok === true) {
                                this.prjDataService.deselect();
                                this.prjDataService.refreshAll().then(() => {
                                    this.prjDataService.select(selectedProject);
                                    //TODO this function isn't enhanced at framework
                                    //const gridId = '713B7D2A532B43948197621BA89AD67A';
                                    //platformGridAPI.rows.scrollIntoViewByItem(gridId, selectedProject);
                                });
                            }
                        });
                    }else {
                        this.uiCommonMsgBoxService.showMsgBox(this.translateService.instant('project.main.updateMaterialPricesFailed').text, this.translateService.instant('project.main.updateMaterialPricesTitle').text, 'ico-info'); // jshint ignore:line
                    }
                }
            });
        }
    }

    private canExecuteNextButton(info: IDialogButtonEventInfo<ICustomDialog<MultistepDialog<IUpdatePriceDataComplete>, object>, void>) {

        if (this._isLoading) {
            return false;
        }

        const dialog = info.dialog.value;

        if(dialog?.stepIndex === 2){
            return false;
        }

        if(dialog?.stepIndex === 1 && dialog?.dataItem.basicOption?.optionItem.radioSelect !== 'fromCatalog'){
            const isFromQuote = dialog?.dataItem.basicOption?.optionItem.radioSelect === 'fromQuote';

            const dataList: IBaseMaterialPriceOfQuoteNContrat[] = isFromQuote ? this.updateFromQouteDataService.DataItems : this.updateFromContractDataService.DataItems;

            return _.filter(dataList, {Checked: true}).length > 0;
        }

        return dialog?.stepIndex !== -1;

    }

    private canUpdateButton(info: IDialogButtonEventInfo<ICustomDialog<MultistepDialog<IUpdatePriceDataComplete>, object>, void>){
        if (this._isLoading) {
            return false;
        }

        const dialog = info.dialog.value;

        if(dialog?.stepIndex === 0){
            return false;
        }

        if(dialog?.stepIndex === 1 && dialog?.dataItem.basicOption?.optionItem.radioSelect === 'fromCatalog'){
            if(dialog?.dataItem.basicOption?.optionItem.catalogSelect === 'byMaterialItem'){
                const projectMaterialsToUpdate = this.updateByMaterialItemDataService.getListSelectedWidthModification();
                const prjMaterial = this.updateByMaterialItemDataService.getSelected();
                const list= this.updateByMaterialItemListDataService.PriceByItemPriceList;
                if(!_.isNil(prjMaterial)) {
                    if(prjMaterial.Checked) {
                        const modifications = _.filter(list, function (item) {
                            return item.Checked && item.MaterialId === prjMaterial.MaterialId;
                        });
                        if(modifications.length>0) {
                            for (let i = 0; i < modifications.length; i++) {
                                if (_.isNil(modifications[i].Co2Project)) {
                                    modifications[i].Co2Project = 0;
                                }
                                if (_.isNil(prjMaterial.Co2Project)) {
                                    prjMaterial.Co2Project = 0;
                                }
                                if (_.isNil(modifications[i].Co2Source)) {
                                    modifications[i].Co2Source = 0;
                                }
                                if (_.isNil(prjMaterial.Co2Source)) {
                                    prjMaterial.Co2Source = 0;
                                }
                                if (modifications[i].Co2Project !== prjMaterial.Co2Project || modifications[i].Co2Source !== prjMaterial.Co2Source || modifications[i].Co2SourceFk !== prjMaterial.Co2SourceFk) {
                                    this.co2Attr = modifications[i].MaterialId;
                                    break;
                                }else{
                                    this.co2Attr = 0;
                                }
                            }
                        }else{
                            this.co2Attr = 0;
                        }
                    }else{
                        this.co2Attr = 0;
                    }
                }else{
                    this.co2Attr = 0;
                }
                if(this.co2Attr !==0){
                    return true;
                }
                return  _.isArray(projectMaterialsToUpdate) && projectMaterialsToUpdate.length > 0;
            }else{
                const itemList = this.updateByMaterialCatalogDataService.PriceByCatalogList;
                if(itemList && itemList.length > 0){
                   const selectedItems = _.filter(itemList, {Checked: true});
                   for (let i = 0; i < selectedItems.length; i++) {
                       if('Children' in selectedItems[i]) {
                           if (!_.isNil(selectedItems[i].MaterialPriceVersionFk)) {
                               return true;
                           } else {
                               const childrenItems = selectedItems[i].Children;
                               if (childrenItems) {
                                   for (let i = 0; i < childrenItems.length; i++) {
                                       if (childrenItems[i].Checked && !_.isNil(childrenItems[i].MaterialPriceVersionFk)) {
                                           return true;
                                       }
                                   }
                               }
                           }
                       }else{
                           if (!_.isNil(selectedItems[i].MaterialPriceVersionFk)) {
                               return true;
                           }
                       }
                   }
               }
               return false;
            }
        }

        if(dialog?.stepIndex === 2){
            const isFromQuote = dialog.dataItem?.basicOption?.optionItem.radioSelect === 'fromQuote';

            const dataList: IBaseMaterialPriceOfQuoteNContrat[] = isFromQuote ? this.updateFromQouteDataService.DataItems : this.updateFromContractDataService.DataItems;
            const tempCo2Attr: IBaseMaterialPriceOfQuoteNContrat[] = _.filter(dataList,(item)=>{
                return 	item.Co2Project !== item.OldCo2Project || item.Co2Source !== item.OldCo2Source;
            });
            if(tempCo2Attr && tempCo2Attr.length > 0){
                return true;
            }
            const tempDataModified = _.filter(dataList,  (item) => {
                return !(this.projectMainUpdateResultFieldVarianceFormatter.IsEqualToZero(item.Variance, FieldVarianceFormatterOptions.decimalPlaces)) &&!(
                    (item.Co2Project !== item.OldCo2Project) && (item.Co2Source !== item.OldCo2Source)
                );
            });
            return _.isArray(tempDataModified) ? tempDataModified.length > 0 : false;
        }

        return false;
    }


    private canExecutePreviousButton(info: IDialogButtonEventInfo<ICustomDialog<MultistepDialog<IUpdatePriceDataComplete>, object>, void>) {

        const dialog = info.dialog.value;
        return dialog?.stepIndex !== 0 && !dialog?.currentStep.loadingMessage;
    }
}