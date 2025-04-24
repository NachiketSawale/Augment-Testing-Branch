/*
 * Copyright(c) RIB Software GmbH
 */
import {IDescriptionInfo} from '@libs/platform/common';

export interface ControllingGeneralContractorCostHeaderMap {
    Id: number;
    OrdHeaderFk:number;
    Comment: string;
    DescriptionInfo?: IDescriptionInfo | null;
    Code: string;
    OrdStatusFk?: number | null;
    BusinesspartnerFk?: number | null;
    CustomerFk?: number | null;
    PrjChangeFk?: number | null;
}

export interface CostControlWizardResultMap {
    noDefaultJob:boolean;
    result:boolean;
    timeStr:string;
}



export interface CreatePackagesWizardMap {
    GenerateType: string;
    PrjProjectFk?: number|null;
    StructureFk?: number|null;
    ConfigurationFk?: number|null;
    PrcPackageFk?: number|null;
    Code:string;
    Description: IDescriptionInfo | null;
    Budget:number;
    MdcControllingUnitFk?: number|null;
    Remark:string;
    Remark2:string;
    Remark3:string;
}