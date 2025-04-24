import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IProjectEntity} from '@libs/project/interfaces';

export interface IScheduleEntityGenerated extends IEntityBase{

    Project:IProjectEntity;
    IsRoot:boolean;
    IsBold: boolean;
    IsMarked: boolean;
    PermissionObjectInfo: object;
    IsReadOnly: boolean;
    RubricCategoryFk: number;
    Id: number;
    Code: string;
    DescriptionInfo: IDescriptionInfo;
    ScheduleMasterFk: number | null;
    Remark: number | null;
    CommentText: number | null;
    ProjectFk: number;
    CompanyFk: number;
    ScheduleTypeFk: number;
    ScheduleStatusFk: number;
    TargetStart: Date | null;
    TargetEnd: Date | null;
    PerformanceSheetFk: number | null;
    ProgressReportingMethod: number | null;
    CalendarFk: number;
    IsLocationMandatory: boolean;
    CodeFormatFk: number;
    IsLive: boolean;
    IsFinishedWith100Percent: boolean;
    UseCalendarForLagtime: boolean;
    InitWithTargetStart: boolean;
    ScheduleChartIntervalFk: number;
    ChartIntervalStartDate: Date;
    ChartIntervalEndDate: Date;
    UserDefinedText01: string;
    UserDefinedText02: string;
    UserDefinedText03: string;
    UserDefinedText04: string;
    UserDefinedText05: string;
    UserDefinedText06: string;
    UserDefinedText07: string;
    UserDefinedText08: string;
    UserDefinedText09: string;
    UserDefinedText10: string;
    ScheduleVersion:number;
    InsertedAt:Date ;
    InsertedBy: number;
    UpdatedAt: Date;
    UpdatedBy: number;
    Version: number;
    IsActive: boolean;
    BlobsFk: number | null;
    ScheduleEntities_PsdSchedulemasterFk:number | null;
    ScheduleEntity_PsdSchedulemasterFk: number | null
}