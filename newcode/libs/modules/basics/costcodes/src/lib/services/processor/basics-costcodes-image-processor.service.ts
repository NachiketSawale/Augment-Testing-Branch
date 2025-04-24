/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { BasicsCostCodesDataService } from '../data-service/basics-cost-codes-data.service';
import { ICostCodeEntity } from '../../model/models';
import { Injectable, inject } from '@angular/core';
@Injectable({ providedIn: 'root' })

export class BasicsCostCodesImageProcessor<T extends ICostCodeEntity> implements IEntityProcessor<T> {

    /**
    * Processes a single cost code item to insert an image.
    */
    public process(costCodeItem: T) {
        if (costCodeItem) {
            this.insertImages(costCodeItem);
        }
    }

    public revertProcess(item: T): void {
    }

    /**
    * Processes a list of cost code items recursively to insert images.
    */
    public processData(dataList: ICostCodeEntity[]): ICostCodeEntity[] {
        dataList.forEach((item) => {
            this.insertImages(item);
            if (item.CostCodes && item.CostCodes.length > 0) {
                this.processData(item.CostCodes);
            }
        });
        return dataList;
    }

    /**
    * Returns the image path corresponding to the given cost code type icon.
    */
    public getImagePath(icon?: number): string {
        switch (icon) {
            case 1:
                return 'ico-ccode-estimate';
            case 2:
                return 'ico-ccode-revenue';
            case 3:
                return 'ico-ccode-subcontractor';
            case 4:
                return 'ico-cc-inhouse-work';
            default:
                return '';
        }
    }

    /**
    * Inserts the appropriate image into a cost code item based on its type.
    */
    public insertImages(costCodeItem: ICostCodeEntity): ICostCodeEntity {
        if (!costCodeItem) {
            return costCodeItem;
        }

        //TODO - basicsLookupdataLookupDescriptorService and basicsCostCodesLookupService are not ready yet
        // let types = this.basicsCostCodesLookupService.getCostCodeTypes();
        // if (!types) {
        //   types = this.basicsLookupdataLookupDescriptorService.getData('costcodetype');
        // }

        // if (types) {
        //   const iconItem = types.find((t) => t.Id === costCodeItem.CostCodeTypeFk);
        //   costCodeItem.Image = this.getImagePath(iconItem ? iconItem.Icon : undefined);
        // }

        return costCodeItem;
    }

    /**
    * Inserts images into a list of cost code items based on their types.
    */
    public insertImagesInList(costCodeItems: ICostCodeEntity[]): ICostCodeEntity[] {
        if (!costCodeItems || !Array.isArray(costCodeItems)) {
            return [];
        }

        //TODO - basicsCostCodesLookupService are not ready yet
        // const types = this.basicsCostCodesLookupService.getCostCodeTypes();
        // costCodeItems.forEach((item) => {
        //   const type = types.find((t) => t.Id === item.CostCodeTypeFk);
        //   if (type) {
        //     item.Image = this.getImagePath(type.Icon);
        //   }
        // });

        return costCodeItems;
    }

    /**
    * Marks CurrencyFk in the cost code item as readonly.
    */
    public processLookupItem(item: ICostCodeEntity): ICostCodeEntity {
        const dataService = inject(BasicsCostCodesDataService);
        if (item) {
            const fields: IReadOnlyField<ICostCodeEntity>[] = [
                { field: 'CurrencyFk', readOnly: true }
            ];
            dataService.setEntityReadOnlyFields(item, fields);
        }
        return item;
    }
}
