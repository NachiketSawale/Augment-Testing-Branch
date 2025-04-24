import { IEstPriceAdjustmentItemData, IEstPriceAdjustmentTotalEntity } from '@libs/estimate/interfaces';
import { EstimatePriceAdjustmentDataService } from '../price-adjustment/estimate-price-adjustment.data.service';
import { runInInjectionContext } from '@angular/core';
import { PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { forEach,get,set } from 'lodash';

export class EstimatePriceAdjustmentTotalMapService {
    private readonly translateService = runInInjectionContext(ServiceLocator.injector,
        () => new PlatformTranslateService);
    private mapList: IEstPriceAdjustmentTotalEntity[] = [];
    private mapOption = {Columns: ['Id', 'AdjType', 'Quantity', 'EstimatedPrice', 'AdjustmentPrice', 'TenderPrice', 'DeltaA', 'DeltaB'], Rows: {}};

    public constructor(private readonly parentService :EstimatePriceAdjustmentDataService,
                public entity:IEstPriceAdjustmentItemData) {
        this.init();
        this.createGridList();
    }
    
    

    private init(){
        this.mapOption = {
            Rows: {
                Urb1:{
                    AdjType: this.translateService.instant('estimate.main.priceAdjust.URBreakdown', {num: 1}).text,
                    EstimatedPrice: 'Urb1Estimated',
                    AdjustmentPrice: 'Urb1Adjustment',
                    TenderPrice: 'Urb1Tender',
                    DeltaA: 'Urb1Delta'
                },
                Urb2: {
                    AdjType: this.translateService.instant('estimate.main.priceAdjust.URBreakdown', {num: 2}).text,
                    EstimatedPrice: 'Urb2Estimated',
                    AdjustmentPrice: 'Urb2Adjustment',
                    TenderPrice: 'Urb2Tender',
                    DeltaA: 'Urb2Delta'
                },
                Urb3: {
                    AdjType: this.translateService.instant('estimate.main.priceAdjust.URBreakdown', {num: 3}).text,
                    EstimatedPrice: 'Urb3Estimated',
                    AdjustmentPrice: 'Urb3Adjustment',
                    TenderPrice: 'Urb3Tender',
                    DeltaA: 'Urb3Delta'
                },
                Urb4: {
                    AdjType: this.translateService.instant('estimate.main.priceAdjust.URBreakdown', {num: 4}).text,
                    EstimatedPrice: 'Urb4Estimated',
                    AdjustmentPrice: 'Urb4Adjustment',
                    TenderPrice: 'Urb4Tender',
                    DeltaA: 'Urb4Delta'
                },
                Urb5: {
                    AdjType: this.translateService.instant('estimate.main.priceAdjust.URBreakdown', {num: 5}).text,
                    EstimatedPrice: 'Urb5Estimated',
                    AdjustmentPrice: 'Urb5Adjustment',
                    TenderPrice: 'Urb5Tender',
                    DeltaA: 'Urb5Delta'
                },
                Urb6: {
                    AdjType: this.translateService.instant('estimate.main.priceAdjust.URBreakdown', {num: 6}).text,
                    EstimatedPrice: 'Urb6Estimated',
                    AdjustmentPrice: 'Urb6Adjustment',
                    TenderPrice: 'Urb6Tender',
                    DeltaA: 'Urb6Delta'
                },
                EpNa: {
                    AdjType: this.translateService.instant('estimate.main.priceAdjust.EpnaEstimagted').text,
                    EstimatedPrice: 'EpnaEstimagted'
                },
                Ur: {
                    AdjType: this.translateService.instant('estimate.main.priceAdjust.URRate').text,
                    EstimatedPrice: 'UrEstimated',
                    AdjustmentPrice: 'UrAdjustment',
                    TenderPrice: 'UrTender',
                    DeltaA: 'UrDelta'
                },
                Wq: {
                    AdjType: this.translateService.instant('estimate.main.priceAdjust.WQ').text,
                    Quantity: 'WqQuantity',
                    EstimatedPrice: 'WqEstimatedPrice',
                    AdjustmentPrice: 'WqAdjustmentPrice',
                    TenderPrice: 'WqTenderPrice',
                    DeltaA: 'WqDeltaPrice'
                },
                Aq: {
                    AdjType: this.translateService.instant('estimate.main.priceAdjust.AQ').text,
                    Quantity: 'AqQuantity',
                    EstimatedPrice: 'AqEstimatedPrice',
                    AdjustmentPrice: 'AqAdjustmentPrice',
                    TenderPrice: 'AqTenderPrice',
                    DeltaA: 'AqDeltaPrice'
                },
                TotalWq: {
                    AdjType: this.translateService.instant('estimate.main.priceAdjust.TotalWQ').text,
                    Quantity: 'WqQuantity',
                    EstimatedPrice: 'WqEstimatedPrice',
                    AdjustmentPrice: 'WqAdjustmentPrice',
                    TenderPrice: 'WqTenderPrice',
                    DeltaA: 'WqDeltaPrice'
                },
                TotalAq: {
                    AdjType: this.translateService.instant('estimate.main.priceAdjust.TotalAQ').text,
                    Quantity: 'AqQuantity',
                    EstimatedPrice: 'AqEstimatedPrice',
                    AdjustmentPrice: 'AqAdjustmentPrice',
                    TenderPrice: 'AqTenderPrice',
                    DeltaA: 'AqDeltaPrice'
                }
            },
            Columns: ['Id', 'AdjType', 'Quantity', 'EstimatedPrice', 'AdjustmentPrice', 'TenderPrice', 'DeltaA', 'DeltaB']
        };
    }

    private createGridList(): IEstPriceAdjustmentTotalEntity[] {
        if (this.entity && this.entity.Id) {
            const list: IEstPriceAdjustmentTotalEntity[] = [];
            //let vRoot = this.vRoot;
            const readOnlyURBFileds = this.parentService.getReadOnlyURBFiledName(this.entity);
            const isExistUrb = readOnlyURBFileds.length !== 6;
            forEach(Object.keys(this.mapOption.Rows), (rId) => {
                if (!readOnlyURBFileds.includes(rId)) {
                    const item: IEstPriceAdjustmentTotalEntity = {} as IEstPriceAdjustmentTotalEntity;
                    set(item, 'Id', rId);
                    set(item, 'AdjType', rId);
                    if (rId === 'Ur') {
                        set(item, 'Status', this.entity?.Status);
                    }
                    forEach(this.mapOption.Columns, (cId) => {
                        if (cId !== 'Id' && cId !== 'AdjType') {
                            const path = rId + '.' + cId;
                            const fieldName = get(this.mapOption.Rows, path);
                            if (fieldName) {
                                if (['TotalWq', 'TotalAq'].includes(rId)) {
                                    //item[c] = vRoot[mapOption.Rows[r][c]];
                                } else {
                                    set(item, cId, get(this.entity, fieldName));
                                }
                            }
                        }
                    });
                    if (rId === 'EpNa') {
                        set(item, 'Quantity', get(this.mapOption.Rows, rId + '.AdjType'));
                        set(item, 'AdjType', '');
                        // entity
                        if (this.entity && this.entity.EpnaEstimagted !== null && get(this.entity, 'Id') > -1 && isExistUrb) {
                            list.push(item);
                        }
                    } else {
                        const deltaB = item.AdjustmentPrice !== null && item.TenderPrice !== null ? (item.TenderPrice - item.AdjustmentPrice) : (item.AdjustmentPrice !== null ? 0 : null);
                        set(item, 'DeltaB', deltaB);
                        if (rId === 'Ur') {
                            if (this.entity?.Id === -1) {
                                set(item, 'DeltaB', null);
                            }
                        }
                        list.push(item);
                    }
                }
            });
            this.mapList = list;
        }
        return this.mapList;
    }

    public getGridData(): IEstPriceAdjustmentTotalEntity[] {
        return this.mapList;
    }

    public getMappingField(item: IEstPriceAdjustmentTotalEntity, field: string) {
        return get(this.mapOption.Rows, item.Id + '.' + field);
    }

    public calculateDeltaB(item: IEstPriceAdjustmentTotalEntity, newValue: number) {
        if (this.entity) {
            const adjustmentName = get(this.mapOption.Rows, item.Id + '.AdjustmentPrice');
            const deltaAName = get(this.mapOption.Rows, item.Id + '.DeltaA');
            const tenderName = get(this.mapOption.Rows, item.Id + '.TenderPrice');
            const AdjustmentPrice = get(this.entity, adjustmentName);
            if (AdjustmentPrice === null) {
                set(this.entity, deltaAName, newValue);
                return {newField: deltaAName, newValue: newValue};
            } else {
                set(this.entity, tenderName, newValue + AdjustmentPrice);
                return {newField: tenderName, newValue: newValue + AdjustmentPrice};
            }
        }
        return {newField: '', newValue: null};
    }
}