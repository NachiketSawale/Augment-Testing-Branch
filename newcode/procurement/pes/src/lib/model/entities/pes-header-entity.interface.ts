/*
 * Copyright(c) RIB Software GmbH
 */

import { IPesHeaderEntityGenerated } from './pes-header-entity-generated.interface';

export interface IPesHeaderEntity extends IPesHeaderEntityGenerated {
    /**
     * CallOffMainContractDes
     */
    CallOffMainContractDes?: string;

    /**
     * CallOffMainContract;
     */
    CallOffMainContract?: string;

    /**
     * CallOffMainContractFk
     */
    CallOffMainContractFk?: number;

    /**
     * TotalGross;
     */
    TotalGross?: number;

    /**
     * TotalGrossOc
     */
    TotalGrossOc?: number;
}
