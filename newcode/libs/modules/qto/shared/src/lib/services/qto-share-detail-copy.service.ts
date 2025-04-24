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
    PlatformConfigurationService, PlatformDateService,
    PlatformTranslateService
} from '@libs/platform/common';
import {IQtoDetailCreateInfoInterface} from '../model/interfaces/qto-detail-create-info.interface';
import {UiCommonMessageBoxService, StandardDialogButtonId} from '@libs/ui/common';
import {IQtoShareDetailCopyParameter} from '../model/interfaces/qto-share-detail-copy-parameter.interface';
import {IQtoShareDetailEntity} from '../model/entities/qto-share-detail-entity.interface';
import {QtoShareDetailGridComplete} from '../model/qto-share-detail-complete.class';
import {QtoShareDetailDataService} from '../services/qto-share-detail-data.service';
import {QtoShareBoqType} from '../model/enums/qto-share-boq-type.enum';
import {ILastLineAddressInterface, IQtoSheetInterface, QtoType} from '@libs/qto/interfaces';


@Injectable({
    providedIn: 'root'
})

/**
 * copy qto lines: copy button
 * drag/drop to copy
 * souce qto lines copy
 */
export class QtoShareDetailCopyService<T extends IQtoShareDetailEntity, U extends QtoShareDetailGridComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> {
    protected readonly translateService = inject(PlatformTranslateService);

    protected readonly http = inject(HttpClient);
    protected readonly configurationService = inject(PlatformConfigurationService);

    private readonly msgboxService = inject(UiCommonMessageBoxService);

    protected readonly platformDateService = inject(PlatformDateService);

    public constructor(protected dataService: QtoShareDetailDataService<T, U, PT, PU>) {
    }

    /**
     * copy qto lines
     * @param isDrag
     * @param dragItems
     * @param toTarget
     * @param toTargetItemId
     * @param selectedItem
     * @param PageNumber
     * @param QtoSheetFk
     * @param isSearchCopy
     * @param ordHeaderFk
     */
    public async copyPaste(copyParam: IQtoShareDetailCopyParameter<T>) {

       const isDrag: boolean = copyParam.isDrag, dragItems: T[] = copyParam.dragItems;

        // TODO: Temporarily commenting out to resolve eslint the error because it never used.
        // const toTarget: string = (_.isNil(copyParam.toTarget) ? '' : copyParam.toTarget) as string;
       // const toTargetItemId: number = (_.isNil(copyParam.toTargetItemId) ? null : copyParam.toTargetItemId) as number;
       // const selectedItem: T = (_.isNil(copyParam.selectedItem) ? null : copyParam.selectedItem) as T;
       // const PageNumber: number = (_.isNil(copyParam.PageNumber) ? null : copyParam.PageNumber) as number;
       // const QtoSheetFk: number = (_.isNil(copyParam.QtoSheetFk) ? null : copyParam.QtoSheetFk) as number;
       // const isSearchCopy: boolean = (_.isNil(copyParam.isSearchCopy) ? false : copyParam.isSearchCopy) as boolean;
       // const ordHeaderFk: number = (_.isNil(copyParam.ordHeaderFk) ? -1 : copyParam.isSearchCopy) as number;
       //
       //  const currentQtoHeader = this.dataService.getCurrentQtoHeader();

        //TODO: missing => moudles: package, pes, boq, bill and wip -lnt

        void (await this.dataService.getAllQtoDetailEntities());

        let selectItems: T[] = [];
        if (isDrag) {
            selectItems = dragItems;
        } else {
            selectItems = this.dataService.getSelection();
        }

        let copyItems: T[] = { ...selectItems };
        if (selectItems.length > 0) {
            // TODO: Temporarily commenting out to resolve eslint the error because it never used.
            // const isNotCpoyCostGrp = !!selectItems[0].IsNotCpoyCostGrp;
            const qtoHeaderId = selectItems[0].QtoHeaderFk;
            const qtoTypeFk = (_.isNil(selectItems[0].QtoTypeFk) ? 0 : selectItems[0].QtoTypeFk) as number;
            const postParam = this.prepareCreateItemPostParam(selectItems, copyItems, copyParam);
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

                let newItems: T[] = [];
                const isGeneratedNo = data.IsGeneratedNo;
                const qtoLines = data.QtoLines;
                // for multi lines type, return CopyItems >= copyItems
                if (data.CopyItems) {
                    copyItems = data.CopyItems;
                }

                // Darg: filter new lines for missing split no
                if (isDrag) {
                    let missingSplitNo = '';
                    _.each(qtoLines, (qtoLine) => {
                        if (qtoLine.SplitNo && qtoLine.SplitNo > 0) {
                            missingSplitNo += _.isEmpty(missingSplitNo) ? qtoLine.SplitNo : ',' + qtoLine.SplitNo;
                        } else {
                            newItems.push(qtoLine);
                        }
                    });

                    if (!_.isEmpty(missingSplitNo)) {
                        const msg = this.translateService.instant('qto.main.missSplitNoWarning', {
                            warning: missingSplitNo,
                        }).text;
                        this.msgboxService.showMsgBox(msg, 'qto.main.missSplitNoTitle', 'warning');
                    }
                } else {
                    newItems = qtoLines;
                }

                //TODO: missing => costgroup -lnt
                //var csotGroups = response.data.CostGroups;
                //basicsLookupdataLookupDescriptorService.updateData('QtoDetail2CostGroups', csotGroups);

                // copy qto details
                this.doCopyQtoDetails(copyParam, newItems, copyItems, isGeneratedNo, pageNumberList, targetItems);

                if (pageNumberList.length > 0) {
                    // create the qto sheets
                    void this.dataService.doCreateQtoSheets(qtoHeaderId, targetItems, pageNumberList, qtoTypeFk);
                } else {
                    //TODO: missing => not sure how to implement -lnt
                    // _.forEach(targetItems, function (item) {
                    // 	data.itemList.push(item);
                    // 	data.addEntityToCache(item, data);
                    // 	data.markItemAsModified(item, data);
                    //
                    // 	afterCopyDrag(item, data);
                    // });
                    //
                    // data.listLoaded.fire(null, data.itemList);
                    // void this.updateCalculation(true);
                    // service.setSelectedRowsAfterDrag(newItems);
                }
            }
        }
    }

    private prepareCreateItemPostParam(selectItems: T[], copyItems: T[], copyParam: IQtoShareDetailCopyParameter<T>) {

        const selectedItem: T = (_.isNil(copyParam.selectedItem) ? null : copyParam.selectedItem) as T;
        const isDrag: boolean = copyParam.isDrag, isSearchCopy: boolean = (_.isNil(copyParam.isSearchCopy) ? false : copyParam.isSearchCopy) as boolean;
        const PageNumber: number = (_.isNil(copyParam.PageNumber) ? null : copyParam.PageNumber) as number;
        const QtoSheetFk: number = (_.isNil(copyParam.QtoSheetFk) ? null : copyParam.QtoSheetFk) as number;

        const isNotCpoyCostGrp = selectItems[0].IsNotCpoyCostGrp;
        const qtoHeaderId = selectItems[0].QtoHeaderFk;
        const qtoTypeFk = selectItems[0].QtoTypeFk;
        const selectedQtoHeader = this.dataService.getCurrentQtoHeader();
        let postParam = {};
        if (selectedQtoHeader) {
            postParam = {
                QtoHeaderFk: qtoHeaderId,
                SelectedPageNumber: PageNumber,
                SelectItem: selectedItem,
                items: copyItems,
                QtoSheetFk: QtoSheetFk,
                basRubricCategoryFk: selectedQtoHeader.BasRubricCategoryFk,
                QtoTypeFk: qtoTypeFk,
                IsNotCpoyCostGrp: isNotCpoyCostGrp,
                IsDrag: isDrag,
                IsSearchCopy: isSearchCopy,
            };
        }

        return postParam;
    }

    /**
     * copy qto details
     * @param copyParam
     * @param newItems
     * @param copyItems
     * @param isGeneratedNo
     * @param pageNumberList
     * @param targetItems
     * @param isMulti
     * @param isSplit
     */
    public doCopyQtoDetails(copyParam: IQtoShareDetailCopyParameter<T>, newItems: T[], copyItems: T[], isGeneratedNo: boolean, pageNumberList: number[], targetItems: T[],
                            isMulti: boolean = false, isSplit: boolean = false) {

        // TODO: Temporarily commenting out to resolve eslint the error because it never used.
        // const selectedItem: T = (_.isNil(copyParam.selectedItem) ? null : copyParam.selectedItem) as T;
        // const toTargetItemId: number = (_.isNil(copyParam.toTargetItemId) ? null : copyParam.toTargetItemId) as number;
        // const toTarget: string = (_.isNil(copyParam.toTarget) ? '' : copyParam.toTarget) as string;
        // const QtoSheetFk: number = (_.isNil(copyParam.QtoSheetFk) ? null : copyParam.QtoSheetFk) as number;
        // const PageNumber: number = (_.isNil(copyParam.PageNumber) ? null : copyParam.PageNumber) as number;
        // const isSearchCopy: boolean = (_.isNil(copyParam.isSearchCopy) ? false : copyParam.isSearchCopy) as boolean;
        // const ordHeaderFk: number = (_.isNil(copyParam.ordHeaderFk) ? null : copyParam.ordHeaderFk) as number;

        for (let i = 0; i < newItems.length; i++) {
            const targetItem = newItems[i];
            const sourceItem = _.find(copyItems, { Id: targetItem.SourceQtoDetailId }) as T;
            targetItem.IsCopy = true;
            targetItem.IsCalculate = true;

            //TODO: missing => dynamic costgroups -lnt
            // copy the dynamic qto2costgroups
            // if (csotGroups && csotGroups.length > 0) {
            // 	targetItem.CostGroupsToCopy = _.filter(csotGroups, {'MainItemId': targetItem.Id});
            // }

            this.doCopyQtoDetail(copyParam, targetItem, sourceItem, isGeneratedNo);
            if (isMulti) {
                this.copyForMulti(sourceItem, targetItem);
            }

            if (isSplit) {
                this.copyForSplit(sourceItem, targetItem);
            }

            targetItem.ignoreScriptValidation = true;
            this.dataService.allQtoDetailEntities.push(targetItem);

            if (!isGeneratedNo) {
                //TODO: using the [] first -lnt
                this.getNewPageNumber(targetItem, [] /*qtoSheets*/);
            }
            //TODO: missing => qto sheets -lnt
            // let index1 = _.findIndex([] /*qtoSheets*/, { PageNumber: targetItem.PageNumber });
            // let index2 = pageNumberList.indexOf(targetItem.PageNumber);
            // if (index1 === -1 && index2 === -1) {
            // 	pageNumberList.push(targetItem.PageNumber);
            // }
            //
            // if (index1 !== -1) {
            // 	const qtoSheet = _.filter(qtoSheets, { PageNumber: targetItem.PageNumber });
            // 	if (qtoSheet && qtoSheet.length > 0) {
            // 		targetItem.QtoSheetFk = qtoSheet[0].Id;
            // 	}
            // }
            targetItems.push(targetItem);
        }
    }

    private copyForMulti(sourceItem: T, targetItem: T){
        targetItem.Remark1Text = null;
        targetItem.RemarkText = null;

        const version = (_.isNil(sourceItem.Version) ? 0 : sourceItem.Version) as number;
        const syncCostGroup = version > 0 && !sourceItem.IsBoqSplitChange && !sourceItem.IsBoqItemChange;

        this.dataService.syncQtoDetailGroupProperty(targetItem, sourceItem, syncCostGroup);
        targetItem.IsBoqSplitChange = sourceItem.IsBoqSplitChange;
        targetItem.IsBoqItemChange = sourceItem.IsBoqItemChange;
        if (sourceItem.Version === 0) {
            targetItem.IsSynced = false;
        }
    }

    private copyForSplit(sourceItem: T, targetItem: T){
        const updateItemReadOnlyStatus = function (item: T, IQReadonly: boolean, BQReadonly: boolean) {
            item.SplitItemIQReadOnly = IQReadonly;
            item.SplitItemBQReadOnly = BQReadonly;
        };

        // clear and reassign bill and wip
        if (this.dataService.boqType === QtoShareBoqType.WipBoq || (this.dataService.boqType !== QtoShareBoqType.WipBoq && sourceItem.WipHeaderFk !== null && sourceItem.BilHeaderFk === null)) {
            targetItem.IsBQ = false;
            targetItem.BilHeaderFk = null;
            targetItem.WipHeaderFk = sourceItem.WipHeaderFk;
            updateItemReadOnlyStatus(targetItem, false, true);

            sourceItem.IsIQ = false;
            sourceItem.WipHeaderFk = null;
            updateItemReadOnlyStatus(sourceItem, true, false);
        } else {
            targetItem.IsIQ = false;
            targetItem.WipHeaderFk = null;
            targetItem.IsBQ = sourceItem.IsBQ;
            targetItem.BilHeaderFk = sourceItem.BilHeaderFk;
            updateItemReadOnlyStatus(targetItem, true, false);

            sourceItem.IsBQ = false;
            sourceItem.BilHeaderFk = null;
            updateItemReadOnlyStatus(sourceItem, false, true);
        }

        targetItem.QtoDetailSplitFromReference = sourceItem.QtoDetailReference;
        targetItem.QtoDetailSplitFromFk = sourceItem.Id;
        sourceItem.IsSplitted = true;

        // copy fks from sourceItem to targetItem
        targetItem.OrdHeaderFk = sourceItem.OrdHeaderFk;
        targetItem.BillToFk = sourceItem.BillToFk;
        targetItem.IsReadonly = sourceItem.IsReadonly;

        this.dataService.setModified(sourceItem);
    }

    private getNewPageNumber(targetItem: T, qtoSheets: IQtoSheetInterface[]) {
        if (qtoSheets && qtoSheets.length > 0) {
            const qtoSheetsNotLock = _.filter(qtoSheets, { IsReadonly: false });
            if (qtoSheetsNotLock && qtoSheetsNotLock.length > 0) {
                const qtoSheetPageNumbers = _.orderBy(
                    _.filter(qtoSheetsNotLock, function (e) {
                        return e.PageNumber !== null;
                    }),
                    'PageNumber',
                );

                if (qtoSheetPageNumbers && qtoSheetPageNumbers.length > 0) {
                    const qtoSheetPageNumber = _.first(_.filter(qtoSheetPageNumbers, { PageNumber: targetItem.PageNumber }));
                    const firstPageNumber: number | null | undefined = qtoSheetPageNumbers[0]?.PageNumber;
                    const newPageNumberTemp = qtoSheetPageNumber ? targetItem.PageNumber : firstPageNumber;
                    if (newPageNumberTemp && newPageNumberTemp >= targetItem.PageNumber) {
                        targetItem.PageNumber = newPageNumberTemp;
                        return;
                    }
                } else {
                    const qtoSheetPages = _.filter(qtoSheetsNotLock, function (e) {
                        return !e.PageNumber && (!e.QtoSheets || e.QtoSheets.length === 0) && e.Description !== '0000-9999';
                    });

                    if (qtoSheetPages && qtoSheetPages.length > 0) {
                        let newPageNumberTemp = _.first(qtoSheetPages)?.From;
                        newPageNumberTemp = newPageNumberTemp === 0 ? 1 : newPageNumberTemp;
                        if (newPageNumberTemp && newPageNumberTemp >= targetItem.PageNumber) {
                            targetItem.PageNumber = newPageNumberTemp;
                            return;
                        }
                    }
                }

                this.dataService.getNotLockNewPageNumber(targetItem, qtoSheets);
            } else {
                const qtoSheetsHasNoChild = _.orderBy(
                    _.filter(qtoSheets, function (e) {
                        return !e.QtoSheets || e.QtoSheets.length === 0;
                    }),
                    'Description',
                );

                if (qtoSheetsHasNoChild && qtoSheetsHasNoChild.length > 0) {
                    const lastQtoSheet = _.last(qtoSheetsHasNoChild);
                    if (lastQtoSheet) {
                        if (lastQtoSheet.PageNumber) {
                            targetItem.PageNumber = lastQtoSheet.PageNumber + 1;
                        } else {
                            let newPageNumberTemp = lastQtoSheet.From;
                            newPageNumberTemp = !newPageNumberTemp || newPageNumberTemp === 0 ? 1 : newPageNumberTemp;
                            targetItem.PageNumber = newPageNumberTemp;
                        }
                    }
                }
            }
        }
    }

    private doCopyQtoDetail(copyParam: IQtoShareDetailCopyParameter<T>, targetItem: T, sourceItem: T, isGeneratedNo: boolean) {
        // TODO: Temporarily commenting out to resolve eslint the error because it never used.
        // const isSearchCopy: boolean = (_.isNil(copyParam.isSearchCopy) ? false : copyParam.isSearchCopy) as boolean;
        const QtoSheetFk: number = (_.isNil(copyParam.QtoSheetFk) ? null : copyParam.QtoSheetFk) as number;
        const PageNumber: number = (_.isNil(copyParam.PageNumber) ? null : copyParam.PageNumber) as number;
        const selectedItem: T = (_.isNil(copyParam.selectedItem) ? null : copyParam.selectedItem) as T;
        const ordHeaderFk: number = (_.isNil(copyParam.ordHeaderFk) ? null : copyParam.ordHeaderFk) as number;
        const toTarget: string = (_.isNil(copyParam.toTarget) ? '' : copyParam.toTarget) as string;
        const toTargetItemId: number = (_.isNil(copyParam.toTargetItemId) ? null : copyParam.toTargetItemId) as number;

        //TODO: the InsertedAt is readonly -lnt
        //const InsertedAt = sourceItem.InsertedAt; // copy date of creation

        if (!isGeneratedNo && !selectedItem && !QtoSheetFk) {
            let maxLineReference = this.getQtoDetailWithMaxmumLineReference(this.dataService.allQtoDetailEntities);
            if (maxLineReference) {
                const item = maxLineReference;
                const nexLineAddress = this.getNewLineAddress(item);
                maxLineReference = null;
                targetItem.PageNumber = PageNumber ? PageNumber : (_.isNil(nexLineAddress.PageNumber) ? 0 : nexLineAddress.PageNumber) as number;
                targetItem.LineReference = nexLineAddress.LineReference;
                targetItem.LineIndex = (_.isNil(nexLineAddress.LineIndex) ? 0 : nexLineAddress.LineIndex) as number;
            } else {
                targetItem.PageNumber = 1;
                targetItem.LineReference = 'A';
                targetItem.LineIndex = 0;
            }
        }

        this.doCopyQtoDetailAttribute(targetItem, sourceItem);

        // copy wip, bill and pes
        if (this.dataService.boqType === QtoShareBoqType.WipBoq || QtoShareBoqType.BillingBoq || QtoShareBoqType.PesBoq) {
            targetItem.WipHeaderFk = this.dataService.boqType === QtoShareBoqType.WipBoq ? sourceItem.WipHeaderFk : null;
            targetItem.BilHeaderFk = this.dataService.boqType === QtoShareBoqType.BillingBoq ? sourceItem.BilHeaderFk : null;
            targetItem.PesHeaderFk = this.dataService.boqType === QtoShareBoqType.PesBoq ? sourceItem.PesHeaderFk : null;
        } else {
            targetItem.WipHeaderFk = null;
            targetItem.BilHeaderFk = null;
            targetItem.PesHeaderFk = null;
        }

        if (toTarget === 'boqitem' && toTargetItemId) {
            targetItem.BoqItemFk = toTargetItemId;
        } else if (toTarget === 'Locations') {
            targetItem.PrjLocationFk = toTargetItemId;
        } else if (toTarget === 'qtoMainStructure' && toTargetItemId) {
            targetItem.QtoSheetFk = toTargetItemId;
        } else if (toTarget === 'BillTos') {
            targetItem.BillToFk = toTargetItemId;
            targetItem.OrdHeaderFk = ordHeaderFk;
        }

        // if boq item is same, set the split as last qto item.
        if (!targetItem.BoqSplitQuantityFk && targetItem.HasSplitQuantiy && sourceItem && targetItem.BoqItemFk === sourceItem.BoqItemFk) {
            targetItem.BoqSplitQuantityFk = sourceItem.BoqSplitQuantityFk;
        }

        targetItem.IsReadonly = false;
        //TODO: the InsertedAt is readonly -lnt
        //targetItem.InsertedAt = InsertedAt;
    }

    private getQtoDetailWithMaxmumLineReference(items: T[]) {
        let returnObj = null;
        if (!!items && !!items.length && items.length > 0) {
            returnObj = items[0];
            for (let i = 0; i < items.length; i++) {
                const currentItemLineReference = items[i].LineReference;
                const returnObjLineReference = returnObj.LineReference;

                if (items[i].PageNumber > returnObj.PageNumber || (items[i].PageNumber === returnObj.PageNumber && currentItemLineReference && returnObjLineReference && currentItemLineReference > returnObjLineReference)) {
                    returnObj = items[i];
                }
            }
        }
        return returnObj;
    }

    private getNewLineAddress(lastItem: T) {
        const lineAddress: ILastLineAddressInterface = {};
        if (!lastItem) {
            lineAddress.PageNumber = 1;
            lineAddress.LineIndex = 0;
            lineAddress.LineReference = 'A';
        } else {
            const pageNumber = lastItem.PageNumber;
            const lineIndex = lastItem.LineIndex;
            const lineReference = lastItem.LineReference;

            lineAddress.LineIndex = lineIndex;
            lineAddress.PageNumber = pageNumber;
            const nextLineReference = this.dataService.increaseChar(lineReference || ' ');
            if (nextLineReference === null) {
                lineAddress.PageNumber = pageNumber + 1;
                lineAddress.LineReference = 'A';
            } else {
                lineAddress.LineReference = nextLineReference;
            }
        }

        return lineAddress;
    }

    private doCopyQtoDetailAttribute(targetItem: T, sourceItem: T) {
        targetItem.QtoDetailReferenceFk = sourceItem.QtoDetailReferenceFk;

        targetItem.Factor = sourceItem.Factor;
        targetItem.Remark1Text = sourceItem.Remark1Text;
        targetItem.RemarkText = sourceItem.RemarkText;
        targetItem.QtoFormula = sourceItem.QtoFormula;
        targetItem.QtoFormulaFk = sourceItem.QtoFormulaFk;
        targetItem.Operator1 = sourceItem.Operator1;
        targetItem.Operator2 = sourceItem.Operator2;
        targetItem.Operator3 = sourceItem.Operator3;
        targetItem.Operator4 = sourceItem.Operator4;
        targetItem.Operator5 = sourceItem.Operator5;
        targetItem.Result = sourceItem.Result;
        targetItem.V = sourceItem.V;

        targetItem.Value1 = sourceItem.Value1;
        targetItem.Value2 = sourceItem.Value2;
        targetItem.Value3 = sourceItem.Value3;
        targetItem.Value4 = sourceItem.Value4;
        targetItem.Value5 = sourceItem.Value5;
        targetItem.Value1Detail = sourceItem.Value1Detail;
        targetItem.Value2Detail = sourceItem.Value2Detail;
        targetItem.Value3Detail = sourceItem.Value3Detail;
        targetItem.Value4Detail = sourceItem.Value4Detail;
        targetItem.Value5Detail = sourceItem.Value5Detail;
        targetItem.FormulaResult = sourceItem.FormulaResult;
        targetItem.PrjLocationReferenceFk = sourceItem.PrjLocationReferenceFk;
        targetItem.QtoDetailReferenceFk = sourceItem.QtoDetailReferenceFk;
        targetItem.BoqItemReferenceFk = sourceItem.BoqItemReferenceFk;
        targetItem.LineText = sourceItem.LineText;
        targetItem.QtoDetailGroupId = sourceItem.QtoDetailGroupId;

        targetItem.QtoLineTypeFk = sourceItem.QtoLineTypeFk;

        targetItem.QtoHeaderFk = sourceItem.QtoHeaderFk;
        targetItem.PrjLocationFk = sourceItem.PrjLocationFk;
        targetItem.BillToFk = sourceItem.BillToFk;
        targetItem.OrdHeaderFk = sourceItem.OrdHeaderFk;
        targetItem.PrjCostgroup1Fk = sourceItem.PrjCostgroup1Fk;
        targetItem.QtoDetailContinuationFk = sourceItem.QtoDetailContinuationFk;
        targetItem.QtoCommentFk = sourceItem.QtoCommentFk;

        targetItem.AssetMasterFk = sourceItem.AssetMasterFk;
        targetItem.BasBlobsFk = sourceItem.BasBlobsFk;
        targetItem.BasUomFk = sourceItem.BasUomFk;
        targetItem.BidHeaderFk = sourceItem.BidHeaderFk;
        targetItem.Blob = sourceItem.Blob;
        targetItem.BoqHeaderFk = sourceItem.BoqHeaderFk;
        targetItem.BoqItemFk = sourceItem.BoqItemFk;
        targetItem.BoqItemCode = sourceItem.BoqItemCode;
        targetItem.QtoSheetFk = sourceItem.QtoSheetFk;
        targetItem.BoqSubItemFk = sourceItem.BoqSubItemFk;
        targetItem.BoqSubitemReferenceFk = sourceItem.BoqSubitemReferenceFk;
        targetItem.BudgetCodeFk = sourceItem.BudgetCodeFk;
        targetItem.ClassificationFk = sourceItem.ClassificationFk;
        targetItem.IsEstimate = sourceItem.IsEstimate;
        targetItem.IsBlocked = sourceItem.IsBlocked;
        targetItem.WorkCategoryFk = sourceItem.WorkCategoryFk;
        targetItem.SpecialUse = sourceItem.SpecialUse;
        targetItem.MdcControllingUnitFk = sourceItem.MdcControllingUnitFk;
        targetItem.PrcStructureFk = sourceItem.PrcStructureFk;

        targetItem.PerformedDate = _.isString(targetItem.PerformedDate) ? this.platformDateService.formatUTC(targetItem.PerformedDate as string) : targetItem.PerformedDate;
    }

    /**
     * copy qto detail with drag
     * @param isDrag
     * @param dragItems
     * @param toTarget
     * @param toTargetItemId
     * @param selectedItem
     * @param PageNumber
     * @param QtoSheetFk
     * @constructor
     */
    public async CopyQtoDetailByDrag(copyParam: IQtoShareDetailCopyParameter<T>) {
        const selectedItem: T = (_.isNil(copyParam.selectedItem) ? null : copyParam.selectedItem) as T;
        const isDrag: boolean = copyParam.isDrag, dragItems: T[] = copyParam.dragItems;
        const toTarget: string = (_.isNil(copyParam.toTarget) ? '' : copyParam.toTarget) as string;
        const toTargetItemId: number = (_.isNil(copyParam.toTargetItemId) ? null : copyParam.toTargetItemId) as number;
        const PageNumber: number = (_.isNil(copyParam.PageNumber) ? null : copyParam.PageNumber) as number;
        const QtoSheetFk: number = (_.isNil(copyParam.QtoSheetFk) ? null : copyParam.QtoSheetFk) as number;

        if (selectedItem || QtoSheetFk) {
            // drag to sheet, when has range, should do validation.
            if (PageNumber && this.dataService.sheetAreaList && this.dataService.sheetAreaList.length > 0) {
                const index = _.indexOf(this.dataService.sheetAreaList, PageNumber);
                if (index === -1) {
                    const strTitle = this.translateService.instant('qto.main.detail.createQtoLineTilte').text;
                    const strContent = this.translateService.instant('qto.main.detail.addressOverflow').text;
                    this.msgboxService.showMsgBox(strContent, strTitle, 'info');
                    return;
                }
            }

            const selectedQtoHeader = this.dataService.getCurrentQtoHeader();
            const postParam = {
                QtoHeaderFk: selectedQtoHeader ? selectedQtoHeader.Id : -1,
                SelectedPageNumber: this.dataService.selectedPageNumber,
                SelectItem: selectedItem,
                QtoSheetFk: QtoSheetFk ? QtoSheetFk : null,
                IsInsert: isDrag,
            };
            const url = this.configurationService.webApiBaseUrl + 'qto/main/detail/getnextlineaddress';
            const response = await firstValueFrom(this.http.post(url, postParam));
            if (response) {
                const data = response as Record<string, ILastLineAddressInterface>;
                const copyParam: IQtoShareDetailCopyParameter<T> = {
                    isDrag: isDrag,
                    dragItems: dragItems,
                    toTarget: toTarget,
                    toTargetItemId: toTargetItemId,
                    selectedItem: selectedItem,
                    PageNumber: PageNumber,
                    QtoSheetFk: QtoSheetFk
                };
                if (data['ExistAddress'].LineReference) {
                    const strTitle = this.translateService.instant('qto.main.detail.createQtoLineTilte').text;
                    if (!isDrag) {
                        const lastSheet = this.dataService.qtoTypeFk === 1 ? '100000' : '10000';
                        const targetQtoDetailReference = (_.isNil(data['TargetAddress'].QtoDetailReference) ? '' : data['TargetAddress'].QtoDetailReference) as string;
                        const targetSheet = this.dataService.qtoTypeFk === QtoType.FreeQTO && targetQtoDetailReference ? targetQtoDetailReference.slice(0, 5) : targetQtoDetailReference.slice(0, 4);
                        if (targetSheet === lastSheet || data['TargetAddress'].IsOverflow) {
                            const strContent = this.translateService.instant('qto.main.detail.addressOverflow').text;
                            this.msgboxService.showMsgBox(strContent, strTitle, 'info');
                        } else {
                            const strContent1 = this.translateService.instant('qto.main.detail.createQtoLineWarning', {
                                value0: data['CurrenctAddress'].QtoDetailReference,
                                value1: data['ExistAddress'].QtoDetailReference,
                                value2: data['TargetAddress'].QtoDetailReference,
                            }).text;
                            this.msgboxService.showYesNoDialog(strContent1, strTitle)?.then((result) => {
                                if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
                                    this.copyPaste(copyParam);
                                }
                            });
                        }
                    }
                } else {
                    await this.copyPaste(copyParam);
                }
            }
        }
    }

    //TODO: missing => doCopySourceQtoLines -lnt
}