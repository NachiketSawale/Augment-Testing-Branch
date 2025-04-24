/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IQtoFormulaEntity } from '../model/entities/qto-formula-entity.interface';
import { QtoFormulaGridDataService } from '../services/qto-formula-grid-data.service';
import {ItemType} from '@libs/ui/common';
import * as _ from 'lodash';


@Injectable({
    providedIn: 'root'
})
export class QtoFormulaItemGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IQtoFormulaEntity>, IQtoFormulaEntity> {
   

    public constructor(private dataService: QtoFormulaGridDataService) {
    }

    public onCreate(containerLink: IGridContainerLink<IQtoFormulaEntity>): void {
        const formulaItemChanged = this.dataService.selectionChanged$.subscribe(() => {
            this.dataService.setBlobsToFormulaItem();
        });

        containerLink.registerSubscription(formulaItemChanged);

        containerLink.uiAddOns.toolbar.addItems([
            {
                caption: {text: 'Preview'},
                iconClass: 'tlb-icons ico-preview-form',
                id: 't100',
                type: ItemType.Item,
                fn: () => {
                    this.dataService.previewSelectedFormula();
                },
                disabled: () => {
                    const selectedQtoDetailItem = this.dataService.getSelectedEntity();

                    return _.isEmpty(selectedQtoDetailItem) || _.isEmpty(selectedQtoDetailItem.BasFormFk) || selectedQtoDetailItem.BasFormFk === null;
                },
                sort: 201
            },
        ]);
    }

}