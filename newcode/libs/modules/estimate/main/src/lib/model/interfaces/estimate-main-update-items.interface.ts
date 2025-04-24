/*
 * Copyright(c) RIB Software GmbH
 */

export interface IEstimateUpdateItems  {
    selectUpdateScope: number;
    selectUpdatePolicy: number;
    isReadonly: boolean;
    updPrjCC: boolean;
    updPrjMat: boolean;
    updPrjAssembly: boolean;
    updPrjPlantAssembly: boolean;
    calcRuleParam: boolean;
    updBoq: boolean;
    updFromBoq: boolean;
    updCur: boolean;
    reCalEsc: boolean;
    updRisk: boolean;
    isUpdateAllowance: boolean;
    CopyLineItemRete: boolean;
    updProtectedAssembly: boolean;
    updCompositeAssembly: boolean;
    updDissolvedAssembly: boolean;
}