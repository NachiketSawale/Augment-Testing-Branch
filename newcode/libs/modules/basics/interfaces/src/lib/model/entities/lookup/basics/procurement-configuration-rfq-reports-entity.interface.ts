/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

/**
 * Rfq Reports
 */
export interface IBasicsConfigRfqReportsEntity {
    Name?: IDescriptionInfo;
    Description?: IDescriptionInfo;
    FileName?: string;
    FilePath?: string;
}