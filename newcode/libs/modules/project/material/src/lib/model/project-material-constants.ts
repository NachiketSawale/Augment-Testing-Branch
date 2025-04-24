/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export enum ProjectMainUpdatePriceFromCatalogPriceListSourceOption
{
    'None'= 0,
    'OnlyBase'= 1,
    'OnlyOneVersion'= 2,
    'Mixed'= 3
}

export enum PriceVersions{
    base = -1,
    mixed = 2
}

export enum FieldVarianceFormatterOptions {
    decimalPlaces= 2,
    dataType= 'numeric'
}