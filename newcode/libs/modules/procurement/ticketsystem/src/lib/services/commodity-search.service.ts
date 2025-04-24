/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {
    BasicsSharedMaterialSearchService,
    MaterialSearchPriceTypeEnum,
    MaterialSearchRequest
} from '@libs/basics/shared';

/**
 * Commodity search service
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementTicketSystemCommoditySearchService extends BasicsSharedMaterialSearchService {

    /**
     * Initialize search request
     * @param request
     */
    public override initSearchRequest(request: MaterialSearchRequest) {
        super.initSearchRequest(request);
	    request.Filter.IsTicketSystem = true;
	    request.Filter.IsFilterCompany = true;
        request.MaterialTypeFilter.IsForProcurement = true;
    }

    protected override processSearchRequest(request: MaterialSearchRequest) {
        super.processSearchRequest(request);
        request.FilterString = 'PrcStructuretypeFk=1 && Isticketsystem=true';
        request.Filter.IsTicketSystem = true;
        request.Filter.IsFilterCompany = true;
        request.DisplayedPriceType = MaterialSearchPriceTypeEnum.CostPrice;
    }

}