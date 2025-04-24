/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as _ from 'lodash';
import { firstValueFrom } from 'rxjs';
import {
    CompleteIdentification,
    IEntityIdentification,
    PlatformConfigurationService,
    PlatformTranslateService
} from '@libs/platform/common';
import {IMessageBoxOptions, StandardDialogButtonId, UiCommonMessageBoxService} from '@libs/ui/common';
import {IQtoDetailCreateInfoInterface} from '../model/interfaces/qto-detail-create-info.interface';
import {IReadOnlyField} from '@libs/platform/data-access';
import {IQtoShareDetailCopyParameter} from '../model/interfaces/qto-share-detail-copy-parameter.interface';
import {IQtoShareDetailEntity} from '../model/entities/qto-share-detail-entity.interface';
import {QtoShareDetailGridComplete} from '../model/qto-share-detail-complete.class';
import {QtoShareDetailDataService} from '../services/qto-share-detail-data.service';
import {QtoShareBoqType} from '../model/enums/qto-share-boq-type.enum';
import {IQtoShareHeaderEntity} from '../model/entities/qto-share-header-entity.interface';
import {ILastLineAddressInterface, QtoType} from '@libs/qto/interfaces';


@Injectable({
    providedIn: 'root'
})

/**
 * create qto line service: button create: append, insert and split
 * create multi qto lines
 * create qto line with select boq item
 */
export class QtoShareDetailCreateService<T extends IQtoShareDetailEntity, U extends QtoShareDetailGridComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> {
    protected readonly translateService = inject(PlatformTranslateService);

    protected readonly http = inject(HttpClient);
    protected readonly configurationService = inject(PlatformConfigurationService);

    private readonly msgboxService = inject(UiCommonMessageBoxService);

    public constructor(protected dataService: QtoShareDetailDataService<T, U, PT, PU>) {
    }

    /**
     * create qto line: append
     * @param qtoTypeFk
     */
    public createItem(qtoTypeFk: number){
        //TODO: missing => not sure how to use
        //createItemDefer = $q.defer();

        this.dataService.deleteTemporaryQtos();

        const isInsert = this.dataService.isInsert;
        const selectItem = this.dataService.getSelectedEntity();
        const itemList = this.dataService.getOrderedList([]);

        const strTitle = this.translateService.instant('qto.main.detail.createQtoLineTilte').text;
        const lastItem = itemList && itemList.length > 0 ? itemList[itemList.length - 1] : null;

        const isCreate: boolean = this.isCanCreateQtoLine(selectItem, strTitle, itemList);

        if (isCreate) {
            const lastNumber = qtoTypeFk === 1 ? 99999 : 9999;
            if ((!isInsert && selectItem && selectItem.PageNumber === lastNumber && selectItem.LineReference === 'Z') || (!isInsert && !selectItem && lastItem && lastItem.PageNumber === lastNumber && lastItem.LineReference === 'Z')) {
                const strContent = this.translateService.instant('qto.main.detail.addressOverflow').text;
                this.msgboxService.showMsgBox(strContent, strTitle, 'info');
            } else {
                //TODO: mising => others modules save, package, pes...
            }
        }
    }

    /**
     * to check the status, create or not
     * @param selectItem
     * @param strTitle
     * @param itemList
     * @private
     */
    private isCanCreateQtoLine(selectItem: T | null, strTitle: string, itemList: T[]) {
        let isCanCreate: boolean = true;
        if (selectItem && selectItem.QtoFormula && selectItem.QtoFormula.IsMultiline) {
            let strContent: string = '';
            const referencedLines = this.dataService.getReferencedDetails(selectItem);
            const lastReferencedLine = referencedLines.length > 0 ? referencedLines[referencedLines.length - 1] : null;

            if (selectItem.QtoFormula.MaxLinenumber && (_.isEmpty(lastReferencedLine) || selectItem.Id !== lastReferencedLine.Id || !this.dataService.checkOperator(selectItem))) {
                if (referencedLines.length >= selectItem.QtoFormula.MaxLinenumber) {
                    strContent = this.translateService.instant('qto.main.detail.outOfMaxLineNumber', {
                        value0: selectItem.QtoFormula.Code,
                        value1: selectItem.QtoFormula.MaxLinenumber,
                    }).text;
                    this.msgboxService.showMsgBox(strContent, strTitle, 'info');
                    this.dataService.isInsert = false;
                    isCanCreate = false;
                }
            }

            const selectedBoqItemFk = this.dataService.getSelectedBoqItemId();
            const selectedLocationFk = this.dataService.getselectedPrjLocationId();

            if (selectedBoqItemFk > 0 || selectedLocationFk > 0) {
                const selectedItemIdx = _.indexOf(itemList, selectItem);
                const releatedItem = selectedItemIdx < 0 ? null : this.dataService.isInsert ? itemList[selectedItemIdx - 1] : itemList[selectedItemIdx + 1];

                if (releatedItem && releatedItem.QtoDetailGroupId === selectItem.QtoDetailGroupId && ((selectedBoqItemFk > 0 && selectItem.BoqItemFk !== selectedBoqItemFk) || (selectedLocationFk > 0 && selectItem.PrjLocationFk !== selectedLocationFk))) {
                    strContent = this.translateService.instant('qto.main.createQtoDetainWithDiffAssignment').text;
                    this.msgboxService.showMsgBox(strContent, strTitle, 'info');
                    this.dataService.isInsert = false;
                    isCanCreate = false;
                }
            }
        }

        return isCanCreate;
    }

    /**
     * create qto line: insert
     */
    public insertItem(qtoTypeFk: number) {
        const selectItem = this.dataService.getSelectedEntity();
        this.dataService.deleteTemporaryQtos();
        // select item to insert and can not insert at 0001A0
        if (selectItem && !(selectItem.PageNumber === 1 && selectItem.LineReference === 'A' && selectItem.LineIndex === 0)) {
            this.dataService.isInsert = true;
            this.createItem(qtoTypeFk);
        }
    }

    /**
     * create multi qto lines
     * @param toCreateEntities
     * @param toSaveEntities
     * @param selectedItem
     */
    public async createMultiItems(toCreateEntities: T[], toSaveEntities: T[], selectedItem: T) {
        await this.dataService.getAllQtoDetailEntities();
        const postParam = this.prepareCreateMultiItemsPostParam(toCreateEntities, selectedItem);
        const url = this.configurationService.webApiBaseUrl + 'qto/main/detail/createitems';
        const response = await firstValueFrom(this.http.post(url, postParam));
        if (response) {
            const data = response as IQtoDetailCreateInfoInterface<T>;
            const isOverflow = data.IsOverflow;
            if (isOverflow) {
                const strTitle = this.translateService.instant('qto.main.detail.createQtoLineTilte').text;
                const strContent = this.translateService.instant('qto.main.detail.addressOverflow').text;
                this.msgboxService.showMsgBox(strContent, strTitle, 'info');
                return;
            }

            const targetItems: T[] = [];
            const pageNumberList: number[] = [];

            const isGeneratedNo = data.IsGeneratedNo;
            const newItems = data.QtoLines;
            //TODO: costgroup not ready -lnt
            // var csotGroups = response.data.CostGroups;
            // basicsLookupdataLookupDescriptorService.updateData('QtoDetail2CostGroups', csotGroups);
            // copy qto details

            const copyParam: IQtoShareDetailCopyParameter<T> = {
                isDrag: false,
                dragItems: []
            };
            this.dataService.copyItemService.doCopyQtoDetails(copyParam, newItems, toCreateEntities, isGeneratedNo, pageNumberList, targetItems, true);

            if (postParam.QtoTypeFk !== QtoType.OnormQTO) {
                this.generateInsertedEntitiesRef(targetItems, toSaveEntities);
            }
        }
    }

    private prepareCreateMultiItemsPostParam(toCreateEntities: T[], selectedItem: T) {
        //TODO: other module parentService not ready -lnt
        //var parentHeader = parentService.getSelected();
        const selectedQtoHeader = this.dataService.getCurrentQtoHeader();

        const postParam = {
            QtoHeaderFk: selectedQtoHeader ? selectedQtoHeader.Id : -1,
            SelectedPageNumber: undefined,
            SelectItem: selectedItem,
            IsInsert: true,
            //BoqHeaderFk: parentHeader.BoqHeaderFk, //TODO: other module parentService not ready -lnt
            items: toCreateEntities,
            QtoSheetFk: null,
            basRubricCategoryFk: selectedQtoHeader ? selectedQtoHeader.BasRubricCategoryFk : -1,
            QtoTypeFk: selectedQtoHeader ? selectedQtoHeader.QtoTypeFk : null,
            IsNotCpoyCostGrp: undefined,
            IsFromUserForm: true,
            IsPrjBoq: this.dataService.boqType === QtoShareBoqType.PrjBoq,
            IsPrcBoq: this.dataService.boqType === QtoShareBoqType.PrcBoq,
            IsBillingBoq: this.dataService.boqType === QtoShareBoqType.BillingBoq,
            IsWipBoq: this.dataService.boqType === QtoShareBoqType.WipBoq,
            IsPesBoq: this.dataService.boqType === QtoShareBoqType.PesBoq,
            IsQtoBoq: this.dataService.boqType === QtoShareBoqType.QtoBoq,
        };

        if (this.dataService.boqType === QtoShareBoqType.WipBoq || this.dataService.boqType === QtoShareBoqType.BillingBoq || this.dataService.boqType === QtoShareBoqType.PesBoq) {
            //TODO: other module parentService not ready -lnt
            // postParam.BoqHeaderFk = parentService.getSelected().BoqItemPrjBoqFk;
        }

        //TODO: boq split not ready -lnt
        // var boqSplitQuantityService = service.getBoqSplitQuantityService(boqType);
        // var splitItem = boqSplitQuantityService.getSelected();
        // postParam.BoqSplitQuantityFk = splitItem ? splitItem.Id : null;

        return postParam;
    }

    private generateInsertedEntitiesRef(toInsertEntities: T[], toSaveEntities: T[]){
        const lastSelectedEntity = toSaveEntities[toSaveEntities.length - 1];
        const firstSelectedDetail = toSaveEntities[0];
        const allEntities = _.sortBy(this.dataService.allQtoDetailEntities, ['PageNumber', 'LineReference', 'LineIndex']);

        if (_.isNull(toInsertEntities) || _.isUndefined(lastSelectedEntity) || toInsertEntities.length < 1) {
            return;
        }

        const index = _.indexOf(allEntities, lastSelectedEntity);

        if (index === allEntities.length - toInsertEntities.length - 1) {
            return;
        } else if(index > -1 && index < allEntities.length - toInsertEntities.length - 1) {
            const nextEntity = allEntities[index + 1],
                nextEntityLineIndex = nextEntity.LineIndex,
                nextEntityLineReference = nextEntity.LineReference as string,
                nextEntityPageNumber = nextEntity.PageNumber;

            // TODO: Temporarily commenting out to resolve eslint the error because it never used.
            // const lastEntity = allEntities[allEntities.length - toInsertEntities.length - 1];
            // lastEntityLineIndex = lastEntity.LineIndex,
            // lastEntityLineReference = lastEntity.LineReference as string,
            // lastEntityPageNumber = lastEntity.PageNumber;

            const firstSelectedDetailLineIndex = firstSelectedDetail.LineIndex,
                firstSelectedDetailLineReference = firstSelectedDetail.LineReference as string,
                firstSelectedDetailPageNumber = firstSelectedDetail.PageNumber;

            const lastSelectedEntityLineIndex = lastSelectedEntity.LineIndex,
                lastSelectedEntityLineReference = lastSelectedEntity.LineReference as string,
                lastSelectedEntityPageNumber = lastSelectedEntity.PageNumber;

            const distinctByLR = (nextEntityPageNumber - lastSelectedEntityPageNumber) * 26 + (nextEntityLineReference.charCodeAt(0) - lastSelectedEntityLineReference.charCodeAt(0)) - 1;
            const distinctByLI = (nextEntityPageNumber - lastSelectedEntityPageNumber) * 260 + (nextEntityLineReference.charCodeAt(0) - lastSelectedEntityLineReference.charCodeAt(0)) * 10 + (nextEntityLineIndex - lastSelectedEntityLineIndex) - 1;
            const distinctByFirstLR = (nextEntityPageNumber - firstSelectedDetailPageNumber) * 260 + (nextEntityLineReference.charCodeAt(0) - firstSelectedDetailLineReference.charCodeAt(0)) * 10 + (nextEntityLineIndex - firstSelectedDetailLineIndex) - 1;

            //TODO: qtoMainRenumberDetailDataService not ready -lnt
            //var renumberService = $injector.get('qtoMainRenumberDetailDataService');

            // TODO: Temporarily commenting out to resolve eslint the error because it never used.
            // let lineIndex: number = 0;
            // let lineReference: string | null = null;
            // let pageNumber: number = 0;
            // let increment: number = 0;
            // let toGenerateRefItems: T[] = [];

            // todo: in this case, lineIndex need to follow lastSelectedDetail?
            // TODO: Temporarily commenting out to resolve eslint the error because it never used.
            if (toInsertEntities.length <= distinctByLR) {
                // lineIndex = lastSelectedEntityLineIndex;
                // lineReference = this.dataService.increaseChar(lastSelectedEntityLineReference || ' ');
                // pageNumber = lastSelectedEntityPageNumber;
                // increment = 10;
                //
                // toGenerateRefItems = toInsertEntities;
            } else if (toInsertEntities.length <= distinctByLI) {
                // const lastIndex = this.dataService.qtoTypeFk === 1 ? 99 : 9;
                // lineIndex = lastSelectedEntityLineIndex === lastIndex ? 0 : lastSelectedEntityLineIndex + 1;
                // lineReference = lastSelectedEntityLineIndex === lastIndex ? this.dataService.increaseChar(lastSelectedEntityLineReference || ' ') : lastSelectedEntityLineReference;
                // pageNumber = lastSelectedEntityPageNumber;
                // increment = 1;
                //
                // toGenerateRefItems = toInsertEntities;
            } else if (toInsertEntities.length <= distinctByFirstLR) {
                // lineIndex = 0;
                // lineReference = firstSelectedDetailLineReference;
                // pageNumber = firstSelectedDetailPageNumber;
                // increment = 1;
                //
                // toGenerateRefItems = toSaveEntities.concat(toInsertEntities);
            } else {
                // lineIndex = lastEntityLineIndex;
                // lineReference = this.dataService.increaseChar(lastEntityLineReference);
                // pageNumber = lastEntityPageNumber;
                // increment = 10;
                //
                // toGenerateRefItems = toSaveEntities.concat(toInsertEntities);

                const warningModalOptions: IMessageBoxOptions = {
                    headerText: 'qto.main.detail.userForm',
                    bodyText: 'qto.main.detail.userFormError.addressAreaTooSmall',
                    iconClass: 'ico-warning',
                    defaultButtonId: 'cancel',
                    buttons: [
                        { id: StandardDialogButtonId.Yes },
                        { id: StandardDialogButtonId.Cancel },
                    ]
                };

                this.msgboxService.showMsgBox(warningModalOptions);
            }

            //renumberService.renumberSelectQtoDetails(allEntities, toGenerateRefItems, pageNumber, lineReference, lineIndex, increment);
        }
    }

    /**
     * create for split qto line
     */
    public splitIsBqIqQtoLine(){
        const warningModalOptions: IMessageBoxOptions = {
            headerText: 'qto.main.detail.gridTitle',
            bodyText: 'qto.main.detail.splitQTOLineInfo',
            iconClass: 'ico-info',
            buttons: [
                { id: StandardDialogButtonId.Yes },
                { id: StandardDialogButtonId.Cancel },
            ]
        };

        this.msgboxService.showMsgBox(warningModalOptions)?.then((result) => {
            if(result && result.closingButtonId === StandardDialogButtonId.Yes){

                this.dataService.getAllQtoDetailEntities().then(async () => {
                    const selectItems: T[] = this.dataService.getSelection();
                    let toCopyItems: T[] = [];
                    let checkedQtoLinesWithMutlilineFormula: T[] = [];
                    toCopyItems = toCopyItems.concat(_.filter(selectItems, function (item) {
                        return !item.QtoFormula || !item.QtoFormula.IsMultiline;
                    }));

                    const qtoLinesWithMutlilineFormula = _.filter(selectItems, function (item) {
                        return item.QtoFormula && item.QtoFormula.IsMultiline;
                    }) as T[];

                    function checkQtoLines(entities: T[]): boolean {
                        for (let i = 0; i < entities.length; i++) {
                            const entity = entities[i];
                            if (!entity.IsBQ || !entity.IsIQ || entity.IsReadonly) {
                                return false;
                            }
                        }

                        return true;
                    }

                    _.forEach(qtoLinesWithMutlilineFormula, (qtoLine) => {
                        if (_.find(checkedQtoLinesWithMutlilineFormula, {Id: qtoLine.Id})) {
                            return;
                        }

                        const referencedQtoLines = this.dataService.getReferencedDetails(qtoLine);
                        checkedQtoLinesWithMutlilineFormula = checkedQtoLinesWithMutlilineFormula.concat(referencedQtoLines);

                        if (checkQtoLines(referencedQtoLines)) {
                            toCopyItems = toCopyItems.concat(referencedQtoLines);
                        }
                    });

                    const copyItems = {...toCopyItems};
                    if (copyItems.length > 0) {
                        const copyItem = copyItems[0];
                        const isNotCpoyCostGrp = !!copyItem.IsNotCpoyCostGrp;
                        const selectedQtoHeaderId = copyItem.QtoHeaderFk;
                        const qtoTypeFk = (_.isNil(copyItem.QtoTypeFk) ? 0 : copyItem.QtoTypeFk) as number;

                        const postParam = {
                            QtoHeaderFk: selectedQtoHeaderId,
                            items: copyItems,
                            QtoSheetFk: null,
                            basRubricCategoryFk: -1,
                            IsNotCpoyCostGrp: isNotCpoyCostGrp,
                            QtoTypeFk: qtoTypeFk
                        };

                        const url = this.configurationService.webApiBaseUrl + 'qto/main/detail/createitems';
                        const response = await firstValueFrom(this.http.post(url, postParam));
                        if (response) {
                            const responseData = response as IQtoDetailCreateInfoInterface<T>;
                            const isOverflow = responseData.IsOverflow;
                            if (isOverflow) {
                                const strTitle = this.translateService.instant('qto.main.detail.createQtoLineTilte').text;
                                const strContent = this.translateService.instant('qto.main.detail.addressOverflow').text;
                                this.msgboxService.showMsgBox(strContent, strTitle, 'info');
                                return;
                            }

                            const targetItems: T[] = [];
                            const pageNumberList: number[] = [];
                            const newItems = responseData.QtoLines;
                            //TODO: dynamic CostGroup columns not ready -lnt
                            //let csotGroups = data.CostGroups;
                            const isGeneratedNo = responseData.IsGeneratedNo;

                            //TODO: dynamic CostGroup columns not ready -lnt
                            //basicsLookupdataLookupDescriptorService.updateData('QtoDetail2CostGroups', csotGroups);

                            const copyParam: IQtoShareDetailCopyParameter<T> = {
                                isDrag: false,
                                dragItems: []
                            };
                            this.dataService.copyItemService.doCopyQtoDetails(copyParam, newItems, toCopyItems, isGeneratedNo, pageNumberList, targetItems, false, true);

                            const handleSplitDone = (splittedItems: T[]) => {
                                _.forEach(splittedItems, (item) => {
                                    this.dataService.append(item);
                                    //TODO: not sure how to use -lnt
                                    //this.addEntityToCache(item, data);
                                    this.dataService.setModified(item);
                                    this.afterCopyDrag(item);

                                    const readonlyFields: IReadOnlyField<T>[] = [
                                        { field: 'IsBQ', readOnly: !!item.SplitItemBQReadOnly },
                                        { field: 'BilHeaderFk', readOnly: !!item.SplitItemBQReadOnly },
                                    ];
                                    if ( this.dataService.boqType === QtoShareBoqType.WipBoq) {
                                        this.dataService.setEntityReadOnlyFields(item, readonlyFields);
                                    } else {
                                        const readonlyFieldIQs: IReadOnlyField<T>[] = [
                                            { field: 'IsIQ', readOnly: !!item.SplitItemIQReadOnly },
                                            { field: 'WipHeaderFk', readOnly: !!item.SplitItemIQReadOnly },
                                        ];
                                        this.dataService.setEntityReadOnlyFields(item, readonlyFieldIQs);

                                        if ( this.dataService.boqType !== QtoShareBoqType.BillingBoq) {
                                            const sourceItem = _.find(toCopyItems, { Id: item.SourceQtoDetailId }) as T;
                                            if (sourceItem) {
                                                this.dataService.setEntityReadOnlyFields(sourceItem, readonlyFields);
                                            }
                                        }
                                    }
                                });
                                this.dataService.updateCalculation(true);

                                const itemList =  this.dataService.getList();
                                if ( this.dataService.boqType === QtoShareBoqType.BillingBoq ||  this.dataService.boqType === QtoShareBoqType.WipBoq) {
                                    const toCopyItemIds: number[] = _.uniqBy(
                                        _.map(toCopyItems, (item) => item.Id),
                                        (id) => id,
                                    );
                                    _.remove(itemList, function (item) {
                                        return _.includes(toCopyItemIds, item.Id);
                                    });
                                }

                                //TODO: not sure how to use -lnt
                                //data.listLoaded.fire(null, data.itemList);
                                this.dataService.setSelectedRowsAfterDrag(toCopyItems);
                            };

                            if (pageNumberList.length > 0) {
                                //TODO: missing => create qto sheet logic -lnt
                            } else {
                                handleSplitDone(targetItems);
                            }
                        }
                    }

                });

            }
        });
    }

    private afterCopyDrag(newItem: T) {
        //TODO: missing => not ready -lnt
        //platformDataServiceDataProcessorExtension.doProcessItem(newItem, data);

        const sortProperty = ['PageNumber', 'LineReference', 'LineIndex'];
        this.dataService.getList().sort( this.dataService.sortDetail(sortProperty));
        this.dataService.allQtoDetailEntities.sort( this.dataService.sortDetail(sortProperty));

        if (newItem.QtoFormula && newItem.QtoFormula.QtoFormulaTypeFk === 2) {
            const readonlyFields: IReadOnlyField<T>[] = [
                { field: 'Value1', readOnly: true },
                { field: 'Value2', readOnly: true },
                { field: 'Value3', readOnly: true },
                { field: 'Value4', readOnly: true },
                { field: 'Value5', readOnly: true },
                { field: 'Operator1', readOnly: true },
                { field: 'Operator2', readOnly: true },
                { field: 'Operator3', readOnly: true },
                { field: 'Operator4', readOnly: true },
                { field: 'Operator5', readOnly: true },
                { field: 'Value1Detail', readOnly: true },
                { field: 'Value2Detail', readOnly: true },
                { field: 'Value3Detail', readOnly: true },
                { field: 'Value4Detail', readOnly: true },
                { field: 'Value5Detail', readOnly: true },
            ];
            this.dataService.setEntityReadOnlyFields(newItem, readonlyFields);
        }
    }

    /**
     * create qto line with boqItem selected
     */
    public createQtoItemByBoqItemChange() {
        let selectItem = this.dataService.getSelectedEntity();
        const itemList = this.dataService.getList();
        selectItem = itemList && itemList.length > 0 ? itemList[itemList.length - 1] : selectItem;
        if (selectItem) {
            void this.createQtoLine(selectItem, false, true);
        }
    }

    private async createQtoLine(selectItem: T, isInsert: boolean, fromBoqChanged: boolean) {
        const strTitle = this.translateService.instant('qto.main.detail.createQtoLineTilte').text;

        const headerItem = this.dataService.getCurrentQtoHeader();
        const multiLines: T[] = [];
        if (headerItem) {
            const postParam = this.prepareGetNextLineAddressPostParam(selectItem, multiLines, headerItem);
            const url = this.configurationService.webApiBaseUrl + 'qto/main/detail/getnextlineaddress';
            const response = await firstValueFrom(this.http.post(url, postParam));
            if (response) {
                const data = response as Record<string, ILastLineAddressInterface>;

                const lastSheet: string = headerItem.QtoTypeFk === 1 ? '100000' : '10000';
                const qtoDetailReference = data['TargetAddress'].QtoDetailReference;
                const targetQtoDetailReference = (_.isNil(qtoDetailReference) ? '' : qtoDetailReference) as string;
                const targetSheet = headerItem.QtoTypeFk === QtoType.FreeQTO ? targetQtoDetailReference.slice(0, 5) : targetQtoDetailReference.slice(0, 4);

                if (data['ExistAddress'].LineReference) {
                    if (!isInsert) {
                        if (data['TargetAddress'].IsOverflow || targetSheet === lastSheet) {
                            const strContent = this.translateService.instant('qto.main.detail.addressOverflow').text;
                            this.msgboxService.showMsgBox(strContent, strTitle, 'info');
                            this.dataService.finishCreatingItem();
                        } else {
                            const strContent1 = this.translateService.instant('qto.main.detail.createQtoLineWarning', {
                                value0: data['CurrenctAddress'].QtoDetailReference,
                                value1: data['ExistAddress'].QtoDetailReference,
                                value2: data['TargetAddress'].QtoDetailReference,
                            }).text;

                            this.msgboxService.showYesNoDialog(strContent1, strTitle)?.then((result) => {
                                if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
                                    this.dataService.lineAddress = data['TargetAddress'];
                                    this.dataService.baseCteate();
                                } else {
                                    this.dataService.finishCreatingItem();
                                }
                            });
                        }
                    } else {
                        const strContent2 = this.translateService.instant('qto.main.detail.insertQtoLineWarning', {
                            value0: data['CurrenctAddress'].QtoDetailReference,
                            value1: data['ExistAddress'].QtoDetailReference,
                        }).text;
                        this.msgboxService.showMsgBox(strContent2, strTitle, 'info');
                        this.dataService.finishCreatingItem();
                    }
                } else {
                    if (data['TargetAddress'] && (data['TargetAddress'].IsOverflow || targetSheet === lastSheet)) {
                        const strContentOver = this.translateService.instant('qto.main.detail.addressOverflow').text;
                        this.msgboxService.showMsgBox(strContentOver, strTitle, 'info');
                        this.dataService.finishCreatingItem();
                    } else {
                        this.dataService.lineAddress = data['TargetAddress'];
                        await this.dataService.baseCteate();
                    }
                }

                this.dataService.isInsert = false;
            }
        }
    }

    private prepareGetNextLineAddressPostParam(selectItem: T, multiLines: T[], headerItem: IQtoShareHeaderEntity) {
        if (selectItem && selectItem.QtoFormula && selectItem.QtoFormula.IsMultiline) {
            multiLines = this.dataService.getReferencedDetails(selectItem);
        }

        return {
            QtoHeaderFk: this.dataService.boqType === QtoShareBoqType.QtoBoq ? headerItem.Id : null,
            SelectedPageNumber: this.dataService.selectedPageNumber,
            SelectItem: selectItem,
            IsInsert: this.dataService.isInsert,
            BoqHeaderFk: headerItem.BoqHeaderFk,
            IsPrjBoq: this.dataService.boqType === QtoShareBoqType.PrjBoq,
            IsPrcBoq: this.dataService.boqType === QtoShareBoqType.PrcBoq,
            IsBillingBoq: this.dataService.boqType === QtoShareBoqType.BillingBoq,
            IsWipBoq: this.dataService.boqType === QtoShareBoqType.WipBoq,
            IsPesBoq: this.dataService.boqType === QtoShareBoqType.PesBoq,
            IsQtoBoq: this.dataService.boqType === QtoShareBoqType.QtoBoq,
            MultiLines: multiLines,
        };

        //TODO: missing => wip, billing and pes boq service -lnt
        // if (this.boqType === QtoShareBoqType.WipBoq || this.boqType === QtoShareBoqType.BillingBoq || this.boqType === QtoShareBoqType.PesBoq) {
        //     postParam.BoqHeaderFk = this.parentService.getSelectedEntity().BoqItemPrjBoqFk;
        // }

        //return postParam;
    }
}