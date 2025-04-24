/*
 * Copyright(c) RIB Software GmbH
 */


import { LocationDistanceParameters } from './business-partner-request';

/**
 * Business Partner Subsidiary search request model
 */
export class BusinessPartnerSubsidiaryRequest {
    public distanceId?: number | null;
    public distanceParameters?: LocationDistanceParameters;
    public isCommonBidder: boolean | undefined;
    public isDistance?: boolean;
    public isLocation?: boolean;
    public isPrcStructure?: boolean;
    public isRegional?: boolean;
    public regionalCountryId?: number | null;
    public regionalAddressElement?: string | null;
    public structureFk?: number | null;
}