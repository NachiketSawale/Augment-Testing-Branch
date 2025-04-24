/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinessPartnerEntityGenerated } from './business-partner-entity-generated.interface';

export interface IBusinessPartnerEntity extends IBusinessPartnerEntityGenerated {
    /**
     * ClerkDescriptionFk
     */
    ClerkDescriptionFk?: number | null;

    /**
     * CompanyNameFk
     */
    CompanyNameFk?: number | null;

    /**
     * CustomerBranchDescFk
     */
    CustomerBranchDescFk?: number | null;

    /**
     * PrcIncotermDescFk
     */
    PrcIncotermDescFk?: number | null;
}
