import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IEstResourcesSummaryEntity } from '@libs/estimate/interfaces';
import { IPrjEstRuleEntity } from '@libs/boq/main';
import { ICharacteristicDataEntity, ICharacteristicGroupEntity } from '@libs/basics/interfaces';

/**
 * Interface for Controlling unit type Responce
 */
export interface IEstContrUnitResponceData {
    Data: number;
}

/**
 * Interface for line item type Responce
 */
export interface IEstResponceLineItems{
    Data : IEstLineItemEntity[];
}

/**
 * Interface for Total calculation
 */
export interface IEstTotalCost{
    TotalCost: number;
    TotalCostRisk: number;
    TotalHours: number;
    MajorCostCode: IEstResourcesSummaryEntity[];
    MajorCostTotal: number;
    IsValid: boolean;
}

/**
 * Interface for overwrite options
 */
export interface IOverwrite {
	CanRuleOverwrite: boolean;
	OverwriteFlag: boolean;
	HasSameUom: boolean;
}

/**
 * Interface for line item selected rows and items
 */
export interface IEstSelectedRows{
    SelectedRows:number[];
    SelectedItems:IEstLineItemEntity[];
}

/**
 * Interface for Dynamic column options
 */
export interface IEstDynamicColReadData{
    DynamicColumns:IEstDynamicColumn;
    ExtendColumns:string[];
    Dtos:IEstLineItemEntity[];
}

/**
 * Interface for single dynamic column
 */
export interface IEstDynamicColumn{
    ColumnConfigDetails:string[];
    Characteristics:string[];
    DefaultCharacteristics:ICharacteristicGroupEntity[];
    CharacteristicsGroupIds:number[];
    ExtendColumns:string[];
    LiUDPs:string[];
}

/**
 * Interface for LsumpUom option
 */
export interface IEstlsumUom {
    Id:number;
}

/**
 * Interface for Assembly type logics 
 */
export interface IEstAssemblyTypeLogics{
    [key: string]: number;
}

/**
 * Interface for Boq item
 */
export interface IEstBoqItem{
    Item1:number;
    Item2:number;
    Item3:boolean;
}

/**
 * Interface for configuration details option
 */
export interface IConfDetailItem {
    [key: string]: number;
}
/**
 * Interface for Single characteristic
 */

export interface IEstCharacteristics{
    IsCharacteristicExpired:boolean;
    IsCharacteristic:boolean;
}

/**
 * Interface for updating project data
 */
export interface IEstPrjUpdateData{
    PrjEstLineItemToSave:IEstLineItemToSave[],
    PrjEstRuleToSave:IEstRuleToSave[]
}

/**
 * Interface for line item save
 */
export interface IEstLineItemToSave{
    PrjEstLineItem:IEstLineItemEntity;
    PrjEstResourceToSave:IEstResourceToSave[];
}

/**
 * Interface for resource save
 */
export interface IEstResourceToSave{
    PrjEstResource:IEstResourceEntity
}

/**
 * Interface for Rule save
 */
export interface IEstRuleToSave{
    PrjEstRuleParamToSave:IPrjEstRuleEntity[]
}

/**
 * Interface for Merge cell option
 */
export interface IEstMergeCell {
    Colid: string;
    Colspan: number;
}

/**
 * Interface for Base column in merge cell option
 */
export interface IEstBaseColumn{ 
    BaseField: string 
}

/**
 * Interface for Characteristic option
 */
export interface IEstCharacteristic{
    CharacteristicEntity: {
        Code:string;
    }
}

/**
 * Interface for Characteristic data entity
 */
export interface IEstCharacteristicDataEntity extends ICharacteristicDataEntity{
    IsCharacteristic:boolean;
    IsCharacteristicExpired:boolean;
}

/**
 * Interface for Domain formatter
 */
export interface IEstDomainFormatter{
    formatter?: string | null,
    editorOptions?: null | {
        directive: string,
    },
    formatterOptions?: null | {
        lookupType: string,
        displayMember: string,
    }
}