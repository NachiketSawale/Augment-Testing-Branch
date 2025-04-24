/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import {IEntityProcessor} from '@libs/platform/data-access';
import {IQtoFormulaUomEntity} from '../../model/entities/qto-formula-uom-entity.interface';
import {QtoFormulaUomDataService} from '../qto-formula-uom-data.service';
import {QtoFormulaGridDataService} from '../qto-formula-grid-data.service';

/**
 * Qto formula uom data processor
 */
export class QtoFormulaUomDataProcessor<T extends IQtoFormulaUomEntity> implements IEntityProcessor<T> {

    private parentService = inject(QtoFormulaGridDataService);
    
    /**
     *The constructor
     */
    public constructor(protected dataService: QtoFormulaUomDataService) {
    }

    /**
     * Process formula uom logic
     * @param item
     */
    public process(item: T) {
       this.dataService.setColumnsReadonly(item);
    }

    /**
     * Revert process item
     * @param item
     */
    public revertProcess(item: T) {
    }
}
