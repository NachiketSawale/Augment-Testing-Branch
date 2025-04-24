/*
 * Copyright(c) RIB Software GmbH
 */
import {IDescriptionInfo} from '@libs/platform/common';
/**
 *  Procurement Structure Event Type
 */
export class ProcurementStructureEventTypeEntity {

    /**
     * description info
     */
    public DescriptionInfo!: IDescriptionInfo;
    /**
     * IsDefault
     */
    public IsDefault!: boolean;
    /**
     * IsLive
     */
    public IsLive!: boolean;
    /**
     * IsMainEvent
     */
    public IsMainEvent!: boolean;
    /**
     * HasStartDate
     */
    public HasStartDate!: boolean;
    /**
     * Sorting
     */
    public Sorting!: number;
    /**
     * Psd Event Type
     */
    public PsdEventTypeFk?: number;
    /**
     * Psd Event Type Start
     */
    public PrcSystemEventTypeStartFk?: number;
    /**
     * Psd Event Type End
     */
    public PrcSystemEventTypeEndFk?: number;

    /**
     * constructor
     * @param Id
     */
    public constructor(public Id: number) {

    }
}