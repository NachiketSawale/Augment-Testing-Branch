/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityProcessor, IReadOnlyField} from '@libs/platform/data-access';
import {ICostGroupEntity} from '../../model/entities/cost-group-entity.interface';
import {BasicsCostGroupDataService} from '../basics-cost-group-data.service';

/**
 * Basics CostGroup entity readonly processor
 */
export class BasicsCostGroupReadonlyProcessor<T extends ICostGroupEntity> implements IEntityProcessor<T> {

    /**
     *The constructor
     */
    public constructor(protected dataService: BasicsCostGroupDataService) {
    }

    /**
     * Process CostGroup readonly logic
     * @param item
     */
    public process(item: T) {
        const readOnly = !!(item.LeadQuantityCalc || item.LeadQuantityCalc);
        const readonlyFields: IReadOnlyField<ICostGroupEntity>[] = [
            {field: 'Quantity', readOnly: readOnly}
        ];

        this.dataService.setEntityReadOnlyFields(item, readonlyFields);
    }

    /**
     * Revert process item
     * @param item
     */
    public revertProcess(item: T) {
    }
}
