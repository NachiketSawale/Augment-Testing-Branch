/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import {EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo} from '@libs/basics/shared';
import * as _ from 'lodash';
import {IQtoShareDetailEntity} from '../../model/entities/qto-share-detail-entity.interface';
import {QtoShareDetailGridComplete} from '../../model/qto-share-detail-complete.class';
import {QtoShareDetailDataService} from '../../services/qto-share-detail-data.service';
import {QtoShareFormulaType} from '../../model/enums/qto-share-formula-type.enum';
import {QtoShareTargetType} from '../../model/enums/qto-share-target-type.enum';
import {QtoShareLineType} from '../../model/enums/qto-share-line-type.enum';
import {QtoShareBoqType} from '../../model/enums/qto-share-boq-type.enum';
import {IQtoShareFormulaEntity} from '../../model/entities/qto-share-formula-entity.interface';

export class QtoShareDetailReadonlyProcessor<T extends IQtoShareDetailEntity, U extends QtoShareDetailGridComplete,
    PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends EntityReadonlyProcessorBase<T> {

    private readonly modelScriptArray: string[] = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5'];

    private readonly modelArray: string[]  = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5',
        'Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'
    ];

    /**
     *The constructor
     */
    public constructor(protected dataService: QtoShareDetailDataService<T, U, PT, PU>) {
        super(dataService);
    }

    public generateReadonlyFunctions(): ReadonlyFunctions<T> {
        return {
            WipHeaderFk: {
                shared: [],
                readonly: this.readonlyWipHeader
            },
            BilHeaderFk: {
                shared: [],
                readonly: this.readonlyBilHeader
            },
            OrdHeaderFk: {
                shared: ['BillToFk'],
                readonly: this.readonlyOrdHeader
            },
            PesHeaderFk:  e=> {
                let isReadOnly: boolean = true;
                const qtoHeader = this.dataService.currentQtoHeader;
                if (qtoHeader && qtoHeader.QtoTargetType === QtoShareTargetType.PrcPes) {
                    isReadOnly = false;
                }
                return isReadOnly;
            },
            IsOK:  e=> {
                let isReadOnly: boolean = false;
                const qtoDetailStatus = _.find(this.dataService.qtoDetailStatus, {Id: e.item.QtoDetailStatusFk});
                if (qtoDetailStatus && !qtoDetailStatus.IsDisable) {
                    isReadOnly = true;
                }
                return isReadOnly;
            },
            IsBlocked: e=> {
                let isReadOnly: boolean = false;
                const qtoDetailStatus = _.find(this.dataService.qtoDetailStatus, {Id: e.item.QtoDetailStatusFk});
                if (qtoDetailStatus && !qtoDetailStatus.IsOk) {
                    isReadOnly = true;
                }
                return isReadOnly;
            },
            LineText: e => {
                return e.item.QtoFormula?.QtoFormulaTypeFk === QtoShareFormulaType.FreeInput;
            },
            IsWQ: {
                shared: ['IsAQ'],
                readonly: this.readonlyIsWqAq
            },
            IsIQ: {
                shared: [],
                readonly: this.readonlyIsIq
            },
            IsBQ: {
                shared: [],
                readonly: this.readonlyIsBq
            },
            BoqSplitQuantityFk: e => {
                return this.readonlyBoqSplitQuantityFk(e.item);
            },
            PageNumber: {
                shared: ['LineReference', 'LineIndex'],
                readonly: this.readonlyAddress
            },
            QtoFormulaFk: e => {
                const qtoLineType = e.item.QtoLineTypeFk;
                /* set the QtoFormulaFk readonly
                * CommentLine
                * When line type=5-R-Reference or 6-L-Reference  or 7-I- Reference formula should be null and read only
                * */
                return qtoLineType === QtoShareLineType.CommentLine || qtoLineType >= QtoShareLineType.LRefrence;
            },
            Value1: {
                shared: ['Value2', 'Value3', 'Value4', 'Value5', 'Value1Detail', 'Value2Detail', 'Value3Detail', 'Value4Detail', 'Value5Detail',
                    'Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'],
                readonly: this.readonlyIsWqAq
            },
            BoqItemReferenceFk: {
                shared: ['QtoDetailReferenceFk'],
                readonly: this.readonlyIsWqAq
            },
            V: e => {
                let isReadOnly = false;

                if (this.dataService.boqType === QtoShareBoqType.QtoBoq) {
                    const qtoHeader = this.dataService.currentQtoHeader;
                    isReadOnly = qtoHeader?.BasRubricCategoryFk === 6;
                } else {
                    isReadOnly = true;
                }

                return isReadOnly;
            },
            BoqItemFk: e => {
                return this.dataService.boqType !== QtoShareBoqType.QtoBoq;
            }
        };
    }

    /**
     * if qto status is readonly, will set qto detail as redonly
     * set readonly by qto status
     * @param item
     */
    protected override readonlyEntity(item: T): boolean {
        let isReadOnly: boolean = false;

        if (item.QtoStatusItem && item.QtoStatusItem.IsReadOnly){
            isReadOnly =  true;
        } else if (item.IsReadonly || item.IsCopySource){
            isReadOnly = true;
        }

        if (!isReadOnly){
            const qtoDetailStatus = _.find(this.dataService.qtoDetailStatus, {Id: item.QtoDetailStatusFk});
            //TODO: protal not ready
            if (qtoDetailStatus && ((!qtoDetailStatus.IsCoreData /*&& not protal*/) || (!qtoDetailStatus.IsCoreDataExt /*&& is protal*/))) {
                isReadOnly = true;
            }
        }

        return isReadOnly;
    }

    /**
     * set wipHeader column readonly
     * @param item
     */
    protected readonlyWipHeader(info: ReadonlyInfo<T>) {
        let isReadOnly: boolean = this.notSalesWipBill();

        if (this.dataService.boqType === QtoShareBoqType.QtoBoq) {
            const item = info.item;
            const isSplitItemIq = this.isSplitItemIQ(item);

            isReadOnly = isSplitItemIq ? isSplitItemIq : isReadOnly;
        } else {
            isReadOnly = true;
        }

        return isReadOnly;
    }

    /**
     * set BilHeader column readonly
     * @param item
     */
    protected readonlyBilHeader(info: ReadonlyInfo<T>) {
        let isReadOnly: boolean = this.notSalesWipBill();

        if (this.dataService.boqType === QtoShareBoqType.QtoBoq) {
            const item = info.item;
            const isSplitItemBq = this.isSplitItemBQ(item);

            isReadOnly = isSplitItemBq ? isSplitItemBq : isReadOnly;
        } else {
            isReadOnly = true;
        }

        return isReadOnly;
    }

    private notSalesWipBill(){
        let isReadOnly: boolean = true;
        const qtoHeader = this.dataService.currentQtoHeader;
        if (qtoHeader && qtoHeader.QtoTargetType === QtoShareTargetType.SalesWipBill) {
            isReadOnly = false;
        }

        return isReadOnly;
    }

    /**
     * set OrdHeader column readonly
     * @param item
     */
    protected readonlyOrdHeader(info: ReadonlyInfo<T>) {
        let isReadOnly: boolean = false;

        if (this.dataService.boqType === QtoShareBoqType.QtoBoq) {
            const qtoHeader = this.dataService.currentQtoHeader;
            if (qtoHeader && qtoHeader.QtoTargetType === QtoShareTargetType.SalesWipBill) {
                isReadOnly = true;
            } else if (qtoHeader && qtoHeader.OrdHeaderFk) {
                isReadOnly = true;
            }
        } else {
            isReadOnly = true;
        }

        return isReadOnly;
    }

    /**
     * set IsWq and IsAq column readonly
     * @param item
     */
    protected readonlyIsWqAq(info: ReadonlyInfo<T>) {
        const item = info.item;
        let isReadOnly: boolean = false;

        if (this.dataService.boqType === QtoShareBoqType.QtoBoq) {
            const qtoHeader = this.dataService.currentQtoHeader;
            if (qtoHeader && (qtoHeader.QtoTargetType === QtoShareTargetType.prcWqAq || qtoHeader.QtoTargetType === QtoShareTargetType.SalesWqAq)) {
                isReadOnly = true;
            }

            const isSplitItemBq = this.isSplitItemBQ(item);

            isReadOnly = isSplitItemBq ? isSplitItemBq : isReadOnly;
        }

        return !isReadOnly;
    }

    private isSplitItemBQ(item: T){
        let isReadOnly: boolean = false;
        if (this.dataService.boqType === QtoShareBoqType.WipBoq &&
            (item.IsReadonly || (item.IsSplitted || (item.QtoDetailSplitFromFk && item.QtoDetailSplitFromFk > 0)))){
            isReadOnly = true;
        }
        return isReadOnly;
    }

    /**
     * set IsIQ column readonly
     * @param item
     */
    protected readonlyIsIq(info: ReadonlyInfo<T>) {
        let isReadOnly: boolean = this.isIqBq();

        if (this.dataService.boqType === QtoShareBoqType.WipBoq || this.dataService.boqType === QtoShareBoqType.PesBoq) {
            isReadOnly = true;
        } else {
            const item = info.item;
            const isSplitItemIq = this.isSplitItemIQ(item);

            isReadOnly = isSplitItemIq ? isSplitItemIq : isReadOnly;
        }

        return isReadOnly;
    }

    /**
     * set IsBQ column readonly
     * @param item
     */
    protected readonlyIsBq(info: ReadonlyInfo<T>) {
        let isReadOnly: boolean = false;

        if (this.dataService.boqType !== QtoShareBoqType.BillingBoq) {
            isReadOnly = this.isIqBq();

            const item = info.item;
            const isSplitItemBq = this.isSplitItemBQ(item);

            isReadOnly = isSplitItemBq ? isSplitItemBq : isReadOnly;
        } else {
            isReadOnly = true;
        }

        return isReadOnly;
    }

    private isIqBq(){
        let isReadOnly: boolean = true;

        /* if PrcPes and SalesWipBill, will not readonly */
        const qtoHeader = this.dataService.currentQtoHeader;
        if (qtoHeader && (qtoHeader.QtoTargetType === QtoShareTargetType.PrcPes || qtoHeader.QtoTargetType === QtoShareTargetType.SalesWipBill)) {
            isReadOnly = false;
        }

        return isReadOnly;
    }

    private isSplitItemIQ(item: T){
        let isReadOnly: boolean = false;
        if (this.dataService.boqType === QtoShareBoqType.QtoBoq &&
            (item.QtoDetailSplitFromFk && item.QtoDetailSplitFromFk > 0) && item.SplitItemIQReadOnly){
            isReadOnly = true;
        }
        return isReadOnly;
    }

    /**
     * set IsBQ column readonly
     * @param item
     */
    protected readonlyValues(info: ReadonlyInfo<T>){
        let isReadonly: boolean = false;
        const item = info.item;
        const field: string = info.field;
        const qtoLineType: number = item.QtoLineTypeFk;
        let qtoFormulaTypeFk: number = -1;
        switch (qtoLineType){
            case QtoShareLineType.Standard:
            case QtoShareLineType.Hilfswert:
            case QtoShareLineType.Subtotal:
            case QtoShareLineType.ItemTotal:
                qtoFormulaTypeFk = item.QtoFormula ? item.QtoFormula.QtoFormulaTypeFk : -1;
                if (field !== 'Value1Detail' && qtoFormulaTypeFk === QtoShareFormulaType.FreeInput){
                    isReadonly = true;
                } else if(item.QtoFormulaFk){
                    const editableList = this.getReadyOnlyListForPredefine(item);
                    if (Object.keys(editableList).length > 0) {
                        if (this.modelArray.indexOf(field) !== -1){
                            isReadonly = editableList[field];
                        } else if (field.includes('Detail')){
                            isReadonly = editableList[field.replace('Detail', '')];
                        }
                    }
                }

                break;
            case QtoShareLineType.CommentLine:
                isReadonly = true;
                break;
            case QtoShareLineType.LRefrence:
            case QtoShareLineType.RRefrence:
            case QtoShareLineType.IRefrence:
                isReadonly = field !== 'Value1Detail';
                break;
        }
        return isReadonly;
    }

    private getReadyOnlyListForPredefine(item: T): Record<string, boolean>{
        let editableList: Record<string, boolean> = {};
        if (item.QtoFormula) {
            editableList = this.getDetailReadyOnlyListFromQtoFormaul(item.QtoFormula);
        }

        return editableList;
    }

    /**
     * get Detail ReadyOnly List From QtoFormaul
     * @param qtoFormual
     */
    public getDetailReadyOnlyListFromQtoFormaul(qtoFormual: IQtoShareFormulaEntity): Record<string, boolean>{
        const editableList: Record<string, boolean> = {};
        _.forEach(this.modelArray, (itemName) => {
            let editable: boolean = true;
            switch (itemName) {
                case 'Value1' :
                    editable = qtoFormual.Value1IsActive;
                    break;
                case 'Operator1' :
                    editable = qtoFormual.Value1IsActive && !!qtoFormual.Operator1;
                    break;
                case 'Value2':
                    editable = qtoFormual.Value2IsActive;
                    break;
                case 'Operator2' :
                    editable = qtoFormual.Value2IsActive && !!qtoFormual.Operator2;
                    break;
                case 'Value3':
                    editable = qtoFormual.Value3IsActive;
                    break;
                case 'Operator3' :
                    editable = qtoFormual.Value3IsActive && !!qtoFormual.Operator3;
                    break;
                case 'Value4':
                    editable = qtoFormual.Value4IsActive;
                    break;
                case 'Operator4' :
                    editable = qtoFormual.Value4IsActive && !!qtoFormual.Operator4;
                    break;
                case 'Value5':
                    editable = qtoFormual.Value5IsActive;
                    break;
                case 'Operator5' :
                    editable = qtoFormual.Value5IsActive && !!qtoFormual.Operator5;
                    break;
            }
            editableList[itemName] = editable;
        });

        return editableList;
    }

    /**
     * readonly BoqSplitQuantityFk
     * @param entity
     * @private
     */
    private readonlyBoqSplitQuantityFk(entity: T){
        let isReadOnly: boolean = !entity.HasSplitQuantiy;

        if (!isReadOnly) {
            const itemList = this.dataService.getList();

            const mapSplitItemList = _.filter(itemList, function (item) {
                return item.Version && item.Version > 0 && item.BoqItemFk === entity.BoqItemFk && item.BoqSplitQuantityFk;
            });

            const mapItemList = _.filter(itemList, function (item) {
                return item.Version && item.Version > 0 && item.BoqItemFk === entity.BoqItemFk;
            });

            isReadOnly = !(mapSplitItemList.length > 0 || (mapItemList.length === 0 && entity.Version === 0) || mapItemList.length === 1);
        }

        return isReadOnly;
    }

    /**
     * read only for address: sheet, line and index
     * @param info
     * @private
     */
    private readonlyAddress(info: ReadonlyInfo<T>){
        let isReadOnly = false;

        if (info.field === 'PageNumber' && info.item.IsSheetReadonly) {
            isReadOnly = true;
        }

        if (!isReadOnly){
            const groups = this.dataService.getQtoLineGroups([info.item]);
            if (Object.keys(groups).length > 0){
                const group = groups[0];
                isReadOnly = group.length > 1;
            }
        }

        return isReadOnly;
    }
}