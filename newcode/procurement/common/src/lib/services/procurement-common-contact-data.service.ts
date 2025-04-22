/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IReadonlyParentService } from '@libs/procurement/shared';
import { IPrcContactEntity } from '../model/entities/prc-contact-entity.interface';
import { IPrcHeaderDataService, IPrcModuleValidatorService } from '../model/interfaces';
import { ProcurementCommonDataServiceFlatLeaf } from './procurement-common-data-service-flat-leaf.service';
import { PrcCreateContext } from '../model/interfaces/prc-common-context.interface';


/**
 * The basic data service for procurement Contact entity
 */
export abstract class ProcurementCommonContactDataService<T extends IPrcContactEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
    extends ProcurementCommonDataServiceFlatLeaf<T, PT, PU> {
    protected constructor(
        public override parentService: IPrcHeaderDataService<PT, PU> & IPrcModuleValidatorService<PT, PU> & IReadonlyParentService<PT, PU>,
        protected config: { apiUrl?: string, itemName?: string }) {
        const dataConfig: { apiUrl: string, itemName: string, endPoint?: string } = {
            apiUrl: config.apiUrl || 'procurement/common/prccontact',
            itemName: config.itemName || 'PrcContact'
        };
        super(parentService, dataConfig);
    }

    public abstract getSelectedParentEntity(): {
        BusinessPartnerFk: number | undefined,
        BusinessPartner2Fk: number | undefined
    };

    protected override provideCreatePayload(): PrcCreateContext {
        const headerContext = this.parentService.getHeaderContext();
        return {
            MainItemId: headerContext.prcHeaderFk,
            PrcConfigFk: headerContext.prcConfigFk
        };
    }


}