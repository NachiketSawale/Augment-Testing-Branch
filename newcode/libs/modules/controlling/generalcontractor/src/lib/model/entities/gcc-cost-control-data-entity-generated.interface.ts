import {IEntityBase} from '@libs/platform/common';
import {IGccCostControlDataEntity} from './gcc-cost-control-data-entity.interface';

export interface IGccCostControlDataEntityGenerated extends IEntityBase {
    Id: number;
    Code:string,
    Revenue:number;
    BasicCost:number;
    BasicCostCO:number;
    DirectCosts:number;
    BudgetShift:number;
    Budget:number;
    Additional:number;
    Contract:number;
    Performance:number;
    Invoice:number;
    InvoiceStatus:number;
    ActualsWithoutContract:number;
    ActualCosts:number;
    Forecast:number;
    Result:number;

    BudgetPackage:number;
    GccCostControlComment:string;
    InvoiceStatusPercent:number;
    DescriptionInfo:string;
    UserDefined1:string;
    UserDefined2:string;
    UserDefined3:string;

    image:string;
    ElementType:number;
    IsParent:number;
    cssClass:string;

    CostControlVChildren?:IGccCostControlDataEntity[]| null;
    MdcControllingUnitFk?:number |null;
    HasChildren:boolean;
    PrjProjectFk:number;
}