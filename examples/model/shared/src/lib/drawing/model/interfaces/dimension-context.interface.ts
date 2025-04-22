/*
 * Copyright(c) RIB Software GmbH
 */

import {IIdentificationData} from '@libs/platform/common';

/**
 * Dimension context
 */
export interface IDimensionContext {
    UsageContract?: string;
    TemplateContract?: string;
    IsHeaderModelObject?: boolean;
    HeaderId?: IIdentificationData | null;
    HeaderIds?: IIdentificationData[] | null;
    ValidHeaderIds?: IIdentificationData[] | null;
    ModelId: number;
    FilterByHeader: boolean;
    BaseUnitId?: number | null;
    Layout?: string;
    IsFromWde: boolean;
    DeleteFlow?: IDimensionDeleteFlow;
}

/**
 * Deleting dimension flow
 */
export interface IDimensionDeleteFlow {
    Success?: boolean;
    IsObjectReferencedByLineItem?: boolean;
    IsAutoDeleteLineItemObject?: boolean;
}