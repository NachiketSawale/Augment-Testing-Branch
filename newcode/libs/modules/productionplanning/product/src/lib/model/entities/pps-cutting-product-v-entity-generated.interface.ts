/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsCuttingProductVEntityGenerated extends IEntityBase {

    Id: number;
    KeepRemainingLength: boolean;
    KeepRemainingWidth: boolean;
    ProductFk: number;
    ProductCode: string;
    ProductDescription: string | null;
    ProductProductionDate: string | null;
    ProductLength: number;
    ProductWidth: number;
    ProductHeight: number;
    ProductLengthUomFk: number;
    ProductWidthUomFk: number;
    ProductHeightUomFk: number;
    ProductLengthUom: string;
    ProductWidthUom: string;
    ProductHeightUom:string;
    ScrpProductFk: number;
    ScrpProductCode: string;
    ScrpProductDescription: string | null;
    ScrpProductLength: number;
    ScrpProductWidth: number;
    ScrpProductHeight: number;
    ScrpProductLengthUom: string;
    ScrpProductWidthUom: string;
    ScrpProductHeightUom: string;
    ScrpProductLengthUomFk: number;
    ScrpProductwidthUomFk: number;
    ScrpProductHeightUomFk: number;
}