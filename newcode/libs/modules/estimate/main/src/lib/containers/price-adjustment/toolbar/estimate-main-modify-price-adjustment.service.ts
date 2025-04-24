import { inject, Injectable } from '@angular/core';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { PriceAdjustModifyComponent } from '../../../components/price-adjust-modify/price-adjust-modify.component';
import { EstimatePriceAdjustmentDataService } from '../estimate-price-adjustment.data.service';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { extend, filter, findIndex, forEach, get, isFunction, set, slice } from 'lodash';
import { EstimatePriceAdjustmentCalculatorService } from '../../../services/calculation/estimate-price-adjustment-calculator.service';
import { IEstPriceAdjustmentItemData } from '@libs/estimate/interfaces';
import { ModifyAdjustPriceType } from './estimate-main-modify-adjust-price.type';
import { ResetFieldType } from './estimate-main-reset-field.type';

Injectable({
    providedIn: 'root',
});

export class EstimateMainModifyPriceAdjustmentService {
    private readonly estimateMainContextService = inject(EstimateMainContextService);
    private readonly http = inject(HttpClient);
    private readonly modalDialogService = inject(UiCommonDialogService);
    private readonly configService = inject(PlatformConfigurationService);
    private readonly translateService = inject(PlatformTranslateService);
    private readonly dataService = inject(EstimatePriceAdjustmentDataService);

    public async showDialog() {
        const dialogOption: ICustomDialogOptions<ModifyAdjustPriceType, PriceAdjustModifyComponent> = {
            headerText: this.translateService.instant({ key: 'estimate.main.priceAdjust.title' }),
            minWidth: '600px',
            width: '940px',
            buttons: [
                {
                    id: StandardDialogButtonId.Ok,
                    fn: (evt, info) => {
                        this.validateModifyOption(info.dialog.body.modifyOption);
                        info.dialog.close(StandardDialogButtonId.Ok);
                    },
                },
                {
                    id: StandardDialogButtonId.Cancel,
                    fn: (evt, info) => {
                        info.dialog.close(StandardDialogButtonId.Cancel);
                    },
                },
            ],
            resizeable: true,
            showCloseButton: true,
            bodyComponent: PriceAdjustModifyComponent,
        };
        await this.modalDialogService.show(dialogOption);
    }

    private modifyOption: ModifyAdjustPriceType = {} as ModifyAdjustPriceType;

    public validateModifyOption(modify: ModifyAdjustPriceType) {
        this.modifyOption = modify;
        return this.modifyAdjustment(modify).then((result: unknown) => {
            return extend({ valid: true }, result);
        });
    }

    public getPrevEntity() {
        return this.modifyOption;
    }

    public modifyAdjustmentPrice(boqItems: IEstPriceAdjustmentItemData[], func: (boqItem: IEstPriceAdjustmentItemData) => void) {
        return this.dataService
          .checkPriceAdjustment(boqItems)
          .then(function () {
              forEach(boqItems, func);
          })
          .then(function () {
              // TODO: missing markEntitiesAsModified function
              //estimateMainPriceAdjustmentDataService.markEntitiesAsModified(boqItems);
              //estimateMainPriceAdjustmentDataService.update();
          });
    }

    public recalculate(boqItem: IEstPriceAdjustmentItemData, field: string, value: number | null) {
        const urbs = this.dataService.getReadOnlyURBFiledName(boqItem);
        const calculator = new EstimatePriceAdjustmentCalculatorService(boqItem, field, value, urbs);
        calculator.recalculate();
    }

    public modifyAdjustment(modifyOption: ModifyAdjustPriceType) {
        let rate = 0; // aq/wq
        let factor = 0; // factor
        let sourceField = ''; // base unit rate
        let targetField = ''; // target price
        const overwrite = modifyOption.OverwriteExistPrices;

        let comment = '';

        const resetField: ResetFieldType[] = [];

        const boqItems = this.getAreaBoqItems(); // estimateMainPriceAdjustmentDataService.getSelectedEntities();

        if (!boqItems || boqItems.length === 0) {
            return Promise.resolve({
                valid: false,
                msg: 'No BoqItem Change',
            });
        }

        const modifyPrice = (boqItem: IEstPriceAdjustmentItemData) => {
            const sourceValue = get(boqItem, sourceField);
            const targetValue = get(boqItem, targetField);
            if (factor > 0 && sourceField && sourceValue !== null) {
                if (overwrite || targetValue === null) {
                    if (this.modifyOption.BaseUnitRateType === 3 && boqItem.UrAdjustment !== null) {
                        sourceField = 'UrAdjustment';
                    }
                    set(boqItem, targetField, sourceValue * factor);

                    if (rate !== 0) {
                        boqItem.AqQuantity = (boqItem.WqQuantity ?? 0) * rate;
                    }

                    addComment(boqItem);
                    this.recalculate(boqItem, targetField, get(boqItem, targetField));
                } else if (rate !== 0) {
                    modifyAqQuantity(boqItem);
                }
            } else if (this.modifyOption.AqFromWqQuantity && rate !== 0) {
                modifyAqQuantity(boqItem);
            }
        };

        const modifyAqQuantity = (boqItem: IEstPriceAdjustmentItemData) => {
            boqItem.AqQuantity = (boqItem.WqQuantity ?? 0) * rate;

            addComment(boqItem);
            this.recalculate(boqItem, 'AqQuantity', boqItem.AqQuantity ?? 0);
        };

        const resetAdjustPrice = (boqItem: IEstPriceAdjustmentItemData) => {
            forEach(resetField, (r) => {
                if (isFunction(r.value)) {
                    set(boqItem, r.field, r.value(boqItem));
                } else {
                    set(boqItem, r.field, r.value);
                }
                if (r.field !== 'Comment') {
                    this.recalculate(boqItem, r.field, get(boqItem, r.field));
                }
            });
        };

        const addComment = (boqItem: IEstPriceAdjustmentItemData) => {
            boqItem.Comment = boqItem.Comment ? boqItem.Comment : '';
            if (this.modifyOption.AddComment && (boqItem.Comment + comment).length < 2000) {
                boqItem.Comment += comment;
            }
        };

        if (this.modifyOption.SelectAreaType === 1) {
            // AQ update
            if (this.modifyOption.AqFromWqQuantity) {
                rate = this.modifyOption.AqDivWq as number;
            }

            // price update
            if (this.modifyOption.Prices) {
                factor = this.modifyOption.Factor as number;

                comment += this.translateService.instant('estimate.main.priceAdjust.baseUnitRate');
                comment += ':';

                switch (this.modifyOption.BaseUnitRateType) {
                    case 1:
                        sourceField = 'UrEstimated';
                        comment += this.translateService.instant('estimate.main.priceAdjust.estimatePriceOnly');
                        break;
                    case 2:
                        sourceField = 'UrAdjustment';
                        comment += this.translateService.instant('estimate.main.priceAdjust.adjustPriceOnly');
                        break;
                    case 3:
                        sourceField = 'UrEstimated';
                        comment += this.translateService.instant('estimate.main.priceAdjust.adjustOrEstPrice');
                        break;
                    case 4:
                        sourceField = 'UrTender';
                        comment += this.translateService.instant('estimate.main.priceAdjust.tenderPriceOnly');
                        break;
                }

                if (factor > 0) {
                    comment += ',' + this.translateService.instant('estimate.main.priceAdjust.factor') + '=' + this.modifyOption.Factor;
                }

                switch (this.modifyOption.TargetUnitRateType) {
                    case 1:
                        if ([1, 2].includes(this.modifyOption.BaseUnitRateType)) {
                            targetField = 'UrAdjustment';
                            comment += ',' + this.translateService.instant('estimate.main.priceAdjust.targetUnitRate') + ':' + this.translateService.instant('estimate.main.priceAdjust.adjustPrices');
                        }
                        break;
                    case 2:
                        targetField = 'UrTender';
                        comment += ',' + this.translateService.instant('estimate.main.priceAdjust.targetUnitRate') + ':' + this.translateService.instant('estimate.main.priceAdjust.tenderPrices');
                        break;
                }
                if (this.modifyOption.OverwriteExistPrices) {
                    comment += ',' + this.translateService.instant('estimate.main.priceAdjust.overwriteExistPrices');
                }
                if (this.modifyOption.AqFromWqQuantity) {
                    comment += ',' + this.translateService.instant('estimate.main.priceAdjust.aqFromWqQuantity') + '=' + this.modifyOption.AqDivWq;
                }
                comment += ';';
                return this.modifyAdjustmentPrice(boqItems, modifyPrice);
            } else if (!this.modifyOption.Prices && this.modifyOption.AqFromWqQuantity) {
                comment += this.translateService.instant('estimate.main.priceAdjust.aqFromWqQuantity') + ': ' + this.modifyOption.AqDivWq;
                return this.modifyAdjustmentPrice(boqItems, modifyAqQuantity);
            }
        } else if (this.modifyOption.SelectAreaType === 2) {
            // detele adjustment price
            if (this.modifyOption.DelAdjustPrices) {
                resetField.push({ field: 'UrAdjustment', value: null });
            }

            // delete tender price
            if (this.modifyOption.DelTenderPrices) {
                resetField.push({ field: 'UrTender', value: null });
            }

            // delete comment
            if (this.modifyOption.DelComment) {
                resetField.push({ field: 'Comment', value: null });
            }

            // reset AqQuantity
            if (this.modifyOption.ResetAqToWqQuantity) {
                resetField.push({
                    field: 'AqQuantity',
                    value: (e) => {
                        return e.WqQuantity;
                    },
                });
            }
            if (this.modifyOption.ResetAqFromBoqAqQuantity) {
                resetField.push({
                    field: 'AqQuantity',
                    value: (e) => {
                        return e.QuantityAdj;
                    },
                });
            }

            const promises = [];

            promises.push(this.modifyAdjustmentPrice(boqItems, resetAdjustPrice));
            // reset fixed price
            if (this.modifyOption.DelFixedPriceFlag) {
                promises.push(this.updateAdjustmentFixedPrice(boqItems));
            }

            return Promise.all(promises);
        }

        return Promise.resolve(true);
    }

    public updateAdjustmentFixedPrice(boqItems: IEstPriceAdjustmentItemData[]) {
        const estHeader = this.estimateMainContextService.getSelectedEstHeaderItem(); //$injector.get('estimateMainService').getSelectedEstHeaderItem();
        const param = {
            EstimatePriceAdjustmentToSave: boqItems,
            EstHeaderId: estHeader?.Id,
        };
        return this.http.post(this.configService.webApiBaseUrl + 'estimate/main/priceadjustment/updateAdjustmentFixedPrice', param); //.subscribe( (res) {
        //return result.data;
        //});//.then(function () {
        // TODO: depended on 'estimateMainService'
        //let estimateMainService = $injector.get('estimateMainService');
        //estimateMainService.refresh();
        //});
    }

    private getAreaBoqItems(): IEstPriceAdjustmentItemData[] {
        let startIndex = 0,
          endIndex = -1;
        const boqList = this.dataService.getAllList();
        if (this.modifyOption.FromRefNo && this.modifyOption.ToRefNo) {
            startIndex = findIndex(boqList, { Id: this.modifyOption.FromRefNo });
            endIndex = findIndex(boqList, { Id: this.modifyOption.ToRefNo });
        } else if (this.modifyOption.FromRefNo) {
            startIndex = findIndex(boqList, { Id: this.modifyOption.FromRefNo });
            endIndex = boqList.length - 1;
        } else if (this.modifyOption.ToRefNo) {
            endIndex = findIndex(boqList, { Id: this.modifyOption.ToRefNo });
        }
        const boqItems = slice(boqList, startIndex, endIndex + 1);
        return filter(boqItems, (e: IEstPriceAdjustmentItemData) => {
            // TODO: depended on 'boqMainCommonService'
            return e.IsAssignedLineItem; //boqMainCommonService.isItem(e) && e.IsAssignedLineItem;
        }) as IEstPriceAdjustmentItemData[];
    }
}
