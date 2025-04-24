/*
 * Copyright(c) RIB Software GmbH
 */

export interface IEstimateCommonDynamicData {
    ParentScope: object; 
    IsInitialized: boolean;
    Uuid: string | null; 
    GroupName: string;
    AllColumns: unknown[]; 
    DynamicColDictionaryForList: Record<string, string | number | boolean>; 
    DynamicColDictionaryForDetail: Record<string, string | number | boolean>; 
    IsDynamicColumnConfigChanged: boolean;
}