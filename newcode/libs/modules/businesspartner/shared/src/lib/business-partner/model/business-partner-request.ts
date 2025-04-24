/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Business Partner search request model
 */
export class BusinessPartnerRequest {
    public isLocation?: boolean;

    public isCharacteristic?: boolean;
    public isEvaluation?: boolean;
    public isDistance?: boolean;
    public isRegional?: boolean;
    public isPrcStructure?: boolean;
    public isBusinesspartnerstatus?: boolean;
    public isBusinesspartnerstatus2?: boolean;
    public distanceId?: number | null;
    public regionalCountryId?: number | null;
    public regionalAddressElement?: string | null;
    public evaluationId?: number | null;
    public evaluationPoint?: string | null;
    public basCharacteristicId?: number | null;
    public characteristicOperation?: string | null;
    public characteristicValue2Compare?: string | number | null;
    public structureFk?: number | null;
    public businesspartnerstatusFks?: number[];
    public businesspartnerstatus2Fks?: number[];
    public filterValue?: string;
    public pageNumber?: number;
    public pageSize?: number;
    public distanceParameters?: LocationDistanceParameters;
    public bidderColumn?: number[];
    public bidderMode?: number | null;
    public bidderName?: string | null;
    public isCommonBidder: boolean | undefined;
    public certificateInfo?: CertificateInfo;
    public isContractGrandTotal?: boolean;
    public isFilterByStructure?: boolean;
    public grandTotalOperation?: string | null;
    public grandTotalValue?: number | null;
    public isContractedDateOrdered?: boolean;
    public startDate?: Date | null;
    public endDate?: Date | null;
    public headerId?: number | null;
    public isBidderName: boolean | undefined;
    public isApprovedBP?: boolean;

}


/**
 * LocationDistanceParameters
 */
export class LocationDistanceParameters {
    public moduleName?: string | null;
    public isSubModule?: boolean;
    public s_headerFk?: number | null;
    public t_headerFk?: number | null;
    public addressFk?: number | null;
    public projectFk?: number | null;
    public companyFk?: number | null;
    public businessPartnerFk?: number | null;


    public constructor() {
        this.moduleName = null;
        this.isSubModule = false;
        this.s_headerFk = null;
        this.t_headerFk = null;
        this.addressFk = null;
        this.projectFk = null;
        this.companyFk = null;
        this.businessPartnerFk = null;
    }
}

/**
 * CertificateInfo
 */
export class CertificateInfo {
    public isActive?: boolean;
    public typeId?: number;

    public constructor() {
        this.isActive = false;
    }

}