/*
 * Copyright(c) RIB Software GmbH
 */
import {IDescriptionInfo} from '@libs/platform/common';
/**
 *  Procurement Structure
 */
export class ProcurementStructureTypeEntity {

    /**
     * description info
     */
    public DescriptionInfo!: IDescriptionInfo;
    /**
     * Sorting
     */
    public Sorting!: number;
    /**
     * IsDefault
     */
    public IsDefault!: boolean;
    /**
     * Icon1
     */
    public Icon1!: number;
    /**
     * Icon2
     */
    public Icon2!: number;
    /**
     * IsLive
     */
    public IsLive!: boolean;

    /**
     * constructor
     * @param Id
     */
    public constructor(public Id: number) {

    }
}