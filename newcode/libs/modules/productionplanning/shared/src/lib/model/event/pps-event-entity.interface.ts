/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPPSEventEntityGenerated } from './pps-event-entity-generated.interface';

export interface IPPSEventEntity extends IPPSEventEntityGenerated {
    ProjectFk?: number;
    IsHidden: boolean;
    EventCode: string;
    MultishiftType: string;
    DisplayTxt: string;
    HasWriteRight: boolean;
    IsSizeLocked: boolean;
    IsLockedStartVirtual: boolean;
    IsLockedFinishVirtual: boolean;
    SequenceOrder: number;
    // ModificationInfo
}
