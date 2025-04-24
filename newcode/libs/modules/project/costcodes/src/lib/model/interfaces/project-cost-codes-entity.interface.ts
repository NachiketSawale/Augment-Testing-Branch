 /*
 * Copyright(c) RIB Software GmbH
 */
 export interface IEntity {
    OriginalId: number;
    BasCostCode: number;
    JobCode: string;
    JobDescription: string;
    MdcPriceListFk: null;
    IsChecked: boolean;
    ProjectCostCodes:[];
    isJob:boolean;
    LgmJobFk:number;
    JobCostCodePriceVersionFk:null;
    NewRate:number;
    NewDayWorkRate:number
    NewCurrencyFk:number;
    Selected:boolean;
    Weighting:number;
 }