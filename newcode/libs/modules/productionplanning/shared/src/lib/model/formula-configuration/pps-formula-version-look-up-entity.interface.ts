import {IEntityBase} from '@libs/platform/common';

export interface IPpsFormulaVersionLookupEntity extends IEntityBase {
    Id: number;
    PpsFormulaFk: number;
    BasClobsFk?: number | null;
    FormulaVersion: number;
    Status: number;
    IsLive: boolean;
    CommentText: string;
}