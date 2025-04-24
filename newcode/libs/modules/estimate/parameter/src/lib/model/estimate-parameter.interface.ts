/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, ITranslated } from '@libs/platform/common';
import {IPrjEstRuleParamEntity} from '@libs/estimate/interfaces';
import {IBasicsCustomizeEstParameterEntity} from '@libs/basics/interfaces';

export interface IEstimateParameter {
    DefaultValue?: number,
    MainId?:number,
    IsRoot? : boolean | string |undefined,
    IsEstHeaderRoot ?: string,
    EstHeaderFk	?:  number,	
    Code:string,			
    Id:number,					
    LineItemType ?: number | null,					
    EstAssemblyCatFk ?: number,
    PrjProjectFk?: number,
    PrjEstRuleFk?: number,
    CostGroupCatalogFk?: number,
    EstLeadingStructureId?: number,
    BoqItemFk?: number,
    BoqHeaderFk?: number,
    PsdActivityFk?: number,
    IsPrjAssembly?: boolean,
    ProjectFk?: number,
    IsPrjPlantAssembly?: boolean,
    PrjLocationFk?: number,
    MdcControllingUnitFk?: number,
    PrcStructureFk?: number,
    BasCostGroupFk?: number,
    CostGroupCatFk?: number,
    CostGrpType?: number,
    CostGroupFk?: number,
    AssignedStructureId?:number,
    __rt$data?: IEstimateParameter,
    Param?: string[],
    ParamAssignment?: IEstimateParameter[],
    ParametergroupFk?: number,
    ParameterValue?: number | string,
    EstParameterGroupFk?: number,
    ItemName?: string,
    Action?: string,
    LicCostGrp1Fk?: number,
    LicCostGrp2Fk?: number,
    LicCostGrp3Fk?: number,
    LicCostGrp4Fk?: number,
    LicCostGrp5Fk?: number,
    PrjCostGrp1Fk?: number,
    PrjCostGrp2Fk?: number,
    PrjCostGrp3Fk?: number,
    PrjCostGrp4Fk?: number,
    PrjCostGrp5Fk?: number,   
    EstLineItemFk?: number,
    errors?: IEstimateParameter,
    Version?:number,
    MainItemId?:number,
    EntitiesCount?:number,
    ValueType?:number,
    ProjectEstRuleFk?:number,
    Desc?:string,
    DescriptionInfo?:IDescriptionInfo|null,
    ValueDetail?:string|number|null,
    ValueText?:string,
    UomFk?:number|string,
    ParameterText?:string,
    NeedValidation?:boolean
}

export interface IEstimateParameterUpdateData {
    [key: string]: IEstimateParameter[],
    EstLineItemsParamToSave: IEstimateParameter[],
    EstLineItemsParamToDelete: IEstimateParameter[]
}
export interface IEstimateParameterColumn{
    Field?:string,
    ValueText?:string|null,
    DefaultValue?:boolean|number|null,
    EditorOptions?: {
        lookupDirective?:string,
        lookupType?:string,
        dataServiceName?:string,
        valueMember?:string,
        displayMember?:string,
        isTextEditable?:boolean,
        showClearButton?:boolean,
        decimalPlaces?:number
    } | null,
    FormatterOptions?: {
        decimalPlaces?:number,
        multiSelect?:boolean,
        lookupDirective?:string,
        lookupType?:string,
        dataServiceName?:string,
        valueMember?:string,
        displayMember?:string,
        isTextEditable?:boolean,
        field?:string
    } | null,
    MaxLength?:number,
    Regex?:string | null,
    Readonly:boolean
}
export interface IEstParamLookupCreationData {
    ItemName: string,
    ItemServiceName : string
}

export interface IEstParamScope{
    $parent?:{
        $parent:{
            groups:IEstParamGroup[],
            config:{
                formatterOptions:IEstParamLookupCreationData,
            }
        }
    }
    ParamsTab?:IEstParamTab[],
    ShowParamGrid?:boolean,
    SaveResult?:boolean,
    ShowIframe?:boolean | IRuleAssignment,
    tabClick?: (item:IEstParamTab,openMethod:()=>void) => void,
    Tabs?:IEstParamTab[],
    CurrentParamDataService: IEstParamDataService | null,
    onContentResized: () => boolean,
    openMethodOption:(item:IEstParamTab, isOpen:boolean)=>void,
    Entity:IEstimateParameter
}

export interface IEstParamTab{
    Name: ITranslated,
    Index: number,
    ClassName: boolean | string,
    Display?: string,
    DisplayNew?: string
}

export interface IEstParamGroup{
    Gid:string,
    Rows:IEstParamRow[]
}

export interface IEstParamRow{
    Rid:string,
    FormatterOptions:IEstParamLookupCreationData,
}

export interface IEstParamEntity{
    FormFk:number,
    Id:number,
    EstHeaderFk:number,
    RuleAssignment:IRuleAssignment[]
}

export interface IRuleAssignment{
    FormFk:number,
    MainId:number,
    Id:number,
    OriginalMainId:number,
    PrjEstRuleFk:number,
    IsPrjRule:boolean
}

export interface IEstParamIds{
    FormId:number,
    ContextId:number
}

export interface IEstParamArgs{
    FormData:{
        Parameters:IEstimateParameter[],
        ParamCode:string,
        ColumnName:string
    }
}

export interface IEstParamDataService{
    updateParameter: (param:IEstimateParameter,value:string) => IEstimateParameter[],
    createItem:(code:string|null,val:boolean) => Promise<IEstimateParameter>,
    IsPupopUpParameterWin:boolean,
    isPupopUpParameterWin:()=>boolean,
    getSelection:()=> IEstimateParameter[],
    syncParametersFinished:()=>void,
    IsReadonly:boolean,
    isReadOnly:()=>boolean,
    getServiceName:()=>string,
}

export interface IEstParamSelectionArgs{
    Entity:IEstimateParameter,
    PreviousItem:IEstimateParameter,
    SelectedItem:IEstimateParameter
}

export interface IEstCustomParameter{
    SourceId:number,
    IsLookup:boolean,
    IsAssignmentCusParameterValue:boolean,
    Code:string,
    Id:number,
    ValueType:number
}

export interface IEstParamComplexLookupApiEntity {
    PrjEstRuleParamEntities : IPrjEstRuleParamEntity[],
    ProjectParamEntities: IPrjEstRuleParamEntity[],
    BasicCustomizeEstParams : IBasicsCustomizeEstParameterEntity[]
}

export interface IEstParamComplexLookupApiResponse {
    Data : IEstParamComplexLookupApiEntity
}