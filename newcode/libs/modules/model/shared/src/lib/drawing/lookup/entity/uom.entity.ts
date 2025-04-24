/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo, IIdentificationData} from '@libs/platform/common';

/**
 * Uom entity
 */
export class UomEntity implements IIdentificationData {

    public get id() {
        return this.Id;
    }

    public DescriptionInfo!: IDescriptionInfo;

    public LengthDimension: number = 0;

    public constructor(public Id: number, public Unit: string) {

    }
}