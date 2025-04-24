/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, ProviderToken, inject } from '@angular/core';
import { IPrcHeaderDataService, ProcurementCommonTotalDataService, ProcurementCommonTotalLayoutService } from '@libs/procurement/common';
import { IConHeaderEntity, IPrcCommonTotalEntity, IPrcContractTotalsLayoutService, PRC_CONTRACT_TOTAL_LAYOUT_SERVICE_TOKEN } from '@libs/procurement/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ContractComplete } from '../../model/contract-complete.class';
import { IReadonlyRootService } from '@libs/procurement/shared';
import { IEntityList, IEntitySelection, IParentRole } from '@libs/platform/data-access';
import { CompleteIdentification, LazyInjectable } from '@libs/platform/common';

/**
 * Used to build layout for contract totals container.
 */
@LazyInjectable({
    token: PRC_CONTRACT_TOTAL_LAYOUT_SERVICE_TOKEN,
    useAngularInjection: true
})
@Injectable({
    providedIn: 'root'
})
export class ProcurementContractTotalsLayoutService implements IPrcContractTotalsLayoutService {

    private readonly prcCommonTotalLayoutService = inject(ProcurementCommonTotalLayoutService);

    /**
     * Generates the layout for procurement common totals container.
     * @param parentService 
     * @returns Layout configuration for the totals container. Promise<ILayoutConfiguration<IPrcCommonTotalEntity>>
     */
    public async generateLayout<T extends object, U extends CompleteIdentification<T>>(parentService: IParentRole<T, U> & IEntitySelection<T> & IEntityList<T>): Promise<ILayoutConfiguration<IPrcCommonTotalEntity>> {
        const config: {
            dataServiceToken?: ProviderToken<ProcurementCommonTotalDataService<IPrcCommonTotalEntity, IConHeaderEntity, ContractComplete>>,
            parentService?: IPrcHeaderDataService<IConHeaderEntity, ContractComplete> & IReadonlyRootService<IConHeaderEntity, ContractComplete>
        } = {
            parentService: parentService as unknown as IPrcHeaderDataService<IConHeaderEntity, ContractComplete> & IReadonlyRootService<IConHeaderEntity, ContractComplete>
        };
        const layout = await this.prcCommonTotalLayoutService.generateLayout(config);
        return layout;
    }

}