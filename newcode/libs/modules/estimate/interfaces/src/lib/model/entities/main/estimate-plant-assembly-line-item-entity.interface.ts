/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';

/**
 * Interface for Plant Assembly Line Item Entity
 */
export interface IPlantAssemblyLineItemEntiy extends IEstLineItemEntity {

    /**
     * Plant Group Id
     */
    PlantGroupFk?: string | null;

    /**
     * Plant Id
     */
    PlantFk?: string | null;

}
