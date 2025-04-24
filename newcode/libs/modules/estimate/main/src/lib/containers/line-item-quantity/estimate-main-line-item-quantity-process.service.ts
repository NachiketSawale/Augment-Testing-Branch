/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {IEntityProcessor, IReadOnlyField} from '@libs/platform/data-access';
import {IEstLineItemQuantityEntity} from '@libs/estimate/interfaces';
import {EstimateMainLineItemQuantityDataService} from './estimate-main-line-item-quantity-data.service';
import {BasicsSharedQuantityTypeLookupService} from '@libs/basics/shared';
import * as _ from 'lodash';
import {IBasicsCustomizeQuantityTypeEntity} from '@libs/basics/interfaces';

@Injectable({
    providedIn: 'root'
})

/**
 * estimateMainLineItemQuantityProcessor is the service to set LineItem Quantity readonly.
 */
export class EstimateMainLineItemQuantityProcessService<T extends IEstLineItemQuantityEntity> implements IEntityProcessor<T> {
    private readonly basicsSharedQuantityTypeLookupService = inject(BasicsSharedQuantityTypeLookupService);

    public constructor(private estimateMainLineItemQuantityDataService: EstimateMainLineItemQuantityDataService) {
    }

    private lookupData :IBasicsCustomizeQuantityTypeEntity[] = [];
    private fqQuantityType: number = 6;

    /**
     * Processes the given Estimate Main LineItem Quantity entity.
     * @param item IEstLineItemQuantityEntity.
     */
    public process(item: IEstLineItemQuantityEntity): void {
        if (!item) {
            return;
        }

        if (this.lookupData && this.lookupData.length >= 1) {
            this.setReadOnly(item);
        } else {
            this.basicsSharedQuantityTypeLookupService.getList().subscribe(
                data => {
                    if (data) {
                        this.lookupData = data;
                        this.setReadOnly(item);
                    }
                }
            );
        }
    }

    /**
     * Set readonly the given Estimate Main LineItem Quantity entity.
     * @param item IEstLineItemQuantityEntity.
     */
    private setReadOnly(item: IEstLineItemQuantityEntity) {
        const lookupItem = _.find(this.lookupData, {Id: item.QuantityTypeFk});
        if (lookupItem) {
            const fields = this.getFields(!lookupItem.Iseditable, item);
            if (fields.length > 0) {
                this.estimateMainLineItemQuantityDataService.setEntityReadOnlyFields(item, fields);
            }
        }
    }

    /**
     * Get readonly fields from Estimate Main LineItem Quantity entity.
     * @param flag boolean.
     * @param item IEstLineItemQuantityEntity.
     */
    private getFields(flag: boolean, item: IEstLineItemQuantityEntity) {
        const readonlyFields: IReadOnlyField<IEstLineItemQuantityEntity>[] = [
            {field: 'Quantity', readOnly: item.QuantityTypeFk === this.fqQuantityType ? true : flag},
            {field: 'QuantityTypeFk', readOnly: item.QuantityTypeFk === this.fqQuantityType ? true : flag},
            {field: 'Date', readOnly: item.QuantityTypeFk === this.fqQuantityType ? true : flag},
            {field: 'BoqItemFk', readOnly: true},
            {field: 'PsdActivityFk', readOnly: true}
        ];

        if (item.QuantityTypeFk === this.fqQuantityType) {
            readonlyFields.push({field: 'MdlModelFk', readOnly: true});
            readonlyFields.push({field: 'Comment', readOnly: true});
        }
        return readonlyFields;
    }

    /**
     * Revert process item
     * @param item
     */
    public revertProcess(item: T) {
    }
}
