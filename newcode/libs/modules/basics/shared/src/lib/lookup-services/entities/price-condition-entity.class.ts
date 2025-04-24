/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo, IEntityBase} from '@libs/platform/common';

/**
 * Price Condition entity
 */
export class PriceConditionEntity implements IEntityBase {

    /**
     *
     * @param Id
     * @param Sorting
     * @param IsDefault
     */
    public constructor(
        public Id: number,
        public Sorting: number,
        public IsDefault: boolean
    ) {

    }

    /**
     * description info
     */
    public DescriptionInfo!: IDescriptionInfo;

    /**
     * Remark info
     */
    public RemarkInfo!: IDescriptionInfo;

    /**
     * FormulaText
     */
    public FormulaText !: string;

    /**
     * Creation date of the entity
     */
    public readonly InsertedAt?: Date;

    /**
     * User id of the creator
     */
    public readonly InsertedBy?: number;

    /**
     * Date stating the last update of the entity
     */
    public readonly UpdatedAt?: Date;

    /**
     *  User id of the last entity update
     */
    public readonly UpdatedBy?: number;

    /**
     * Current version of the entity
     */
    public readonly Version?: number;

}