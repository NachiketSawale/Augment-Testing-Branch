import {IEntityBase} from '@libs/platform/common';

export interface IEstimateMainPrcItemAssignmentGenerated extends IEntityBase {
    EstLineItemFk: number;
    EstResourceFk: number;
    PrcItemFk: number;
    BoqHeaderReference: number;
    BoqItemFk: number;
    IsContracted: boolean;
    PrcPackageFk: number;
    PackageStatusFk: number;
    Id:number;
    EstHeaderFk:number;
}