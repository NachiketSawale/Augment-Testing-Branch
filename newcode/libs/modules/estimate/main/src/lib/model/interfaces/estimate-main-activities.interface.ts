/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstRuleAndParam } from '@libs/estimate/shared';
import { IScheduleExtendedEntity } from '@libs/scheduling/interfaces';


export interface IEstActivities extends IEstRuleAndParam,IScheduleExtendedEntity{
    Code?: string | null;
    Description?:string | null;
    HasChildren?:boolean | null;
    EstHeaderFk?:number | null;
    IsRoot?:boolean | null;
}