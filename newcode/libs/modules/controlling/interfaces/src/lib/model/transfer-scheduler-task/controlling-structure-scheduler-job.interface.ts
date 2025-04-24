/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase} from '@libs/platform/common';

export interface IControllingStructureSchedulerJob extends IEntityBase{

    AdditionalParam?: ArrayBuffer | null;

    AllowChangeContext?: boolean | null;

    Description?: string | null;

    Enable?: boolean | null;

    EndDate?: string | null;

    EndTime?: string | null;

    ErrorCode?: number | null;

    ErrorMessage?: string | null;

    ExecutionEndTime?: string | null;

    ExecutionMachine?: string | null;

    ExecutionStartTime?: string | null;

    HasChildren?: boolean | null;

    Id?: number;

    IsAutoDrop?: boolean | null;

    IsRepetitive?: boolean | null;

    ItemType?: number | null;

    JobState?: number | null;

    KeepCount?: number | null;

    KeepDuration?: number | null;

    LoggingLevel?: number | null;

    LoggingMessage?: string | null;

    LoggingMessagePresent?: boolean | null;

    MachineName?: string | null;

    Name?: string | null;

    NotificationInfo?: string | null;

    ParameterList?: string | null;

    ParentId?: number | null;

    Priority?: number | null;

    ProgressInfo?: string | null;

    ProgressValue?: number | null;

    RepeatCount?: number | null;

    RepeatUnit?: number | null;

    RunInUserContext?: boolean | null;

    StartDate?: string | null;

    StartTime?: string | null;

    TaskType?: string | null;

    UserFk?: number | null;

    UserSecurityData?: string | null;

    TargetGroup?: string | null;

    companyFk?: number;

    projectIds?: number[];

    updatePlannedQty?: boolean;

    updateInstalledQty?: boolean;

    updateBillingQty?: boolean;

    updateForecastingPlannedQty?: boolean;

    updateRevenue?: boolean;

    insQtyUpdateFrom?: number;

    revenueUpdateFrom?: number;

    costGroupCats?: string[];

}