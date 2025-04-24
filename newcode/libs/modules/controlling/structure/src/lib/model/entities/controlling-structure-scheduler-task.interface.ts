/*
 * Copyright(c) RIB Software GmbH
 */

import {IControllingStructureSchedulerJob} from '@libs/controlling/interfaces';

export interface ControllingStructureSchedulerTask extends IControllingStructureSchedulerJob{
    
    JobEntity?: IControllingStructureSchedulerJob;

    CompanyFk?: number;

    ProjectIds?: number[];

    isUpdateLineItemQuantityDisabled: boolean,

    isUpdateRevenueDisabled: boolean;

    isCreateDisabled: boolean;

    isActive?: boolean;

    okButtonFlag?: boolean;

    versionType: boolean;
}