/*
 * Copyright(c) RIB Software GmbH
 */

export type BidderRequisitionInfo = {
    BusinessPartnerId: number;
	ReqList: Requisitions[];
	ReqHeadersList: ReqHeaders[];
	BoqList: Boq[];
	BoqListComplete: BoqListComplete[];
};

export type Requisitions = {
    ReqHeaderId: number;
    ReqVariantId: number | null;
}

export type ReqHeaders = {
    ReqId: number;
    Code: string;
    Description: string;
    PrcHeaderFk?: number;
    customFileName?: string;
    customReportFileName?: string;
}

export type Boq = {
    BoqHeaderId: number;
};

export type BoqListComplete = {
    REFERENCE: string;
    ReqId: number;
    Code: string;
    Description: string;
    PRC_HEADER_FK: number;
    PRJ_PROJECT_FK: number;
    BoqHeaderId: number;
    customFileName?: string;
}