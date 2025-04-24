/*
 * Copyright(c) RIB Software GmbH
 */

export interface ITrsRouteObjectGenerated {
    /**
     * ActualFinish
     */
    ActualFinish?: Date | string | null;

    /**
     * ActualStart
     */
    ActualStart?: Date | string | null;

    /**
     * BasUomFk
     */
    BasUomFk: number;

    /**
     * CalCalendarFk
     */
    CalCalendarFk: number;

    /**
     * Code
     */
    Code?: string | null;

    /**
     * DateshiftMode
     */
    DateshiftMode: number;

    /**
     * EarliestFinish
     */
    EarliestFinish?: Date | string | null;

    /**
     * EarliestStart
     */
    EarliestStart?: Date | string | null;

    /**
     * EventTypeFk
     */
    EventTypeFk: number;

    /**
     * Id
     */
    Id: number;

    /**
     * IsLive
     */
    IsLive: boolean;

    /**
     * IsLocked
     */
    IsLocked: boolean;

    /**
     * JobDefFk
     */
    JobDefFk?: number | null;

    /**
     * LatestFinish
     */
    LatestFinish?: Date | string | null;

    /**
     * LatestStart
     */
    LatestStart?: Date | string | null;

    /**
     * LgmJobFk
     */
    LgmJobFk?: number | null;

    /**
     * MdcControllingunitFk
     */
    MdcControllingunitFk?: number | null;

    /**
     * PlannedDelivery
     */
    PlannedDelivery?: Date | string | null;

    /**
     * PlannedFinish
     */
    PlannedFinish?: Date | string | null;

    /**
     * PlannedStart
     */
    PlannedStart?: Date | string | null;

    /**
     * PrjLocationFk
     */
    PrjLocationFk?: number | null;

    /**
     * ProjectDefFk
     */
    ProjectDefFk?: number | null;

    /**
     * ProjectFk
     */
    ProjectFk: number;

    /**
     * PsdActivityFk
     */
    PsdActivityFk?: number | null;

    /**
     * Quantity
     */
    Quantity?: number | null;

    /**
     * Userdefined1
     */
    Userdefined1?: string | null;
}
