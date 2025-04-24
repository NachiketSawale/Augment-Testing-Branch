/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {FormulaType} from '../model/contolling-configuration-constants';

@Injectable({
    providedIn: 'root'
})
export class ContrConfigFormulaTypeHelper{
    public isCAC(typeId: number){
        return typeId === FormulaType.CAC;
    }

    public isCac_m(typeId: number){
        return typeId === FormulaType.CAC_M;
    }

    public isFactorType(typeId: number){
        return typeId === FormulaType.SAC || typeId === FormulaType.WCF || typeId === FormulaType.BCF || typeId === FormulaType.CUST_FACTOR;
    }

    public isCustFactor(typeId: number){
        return typeId === FormulaType.CUST_FACTOR;
    }

    public isCustomType(typeId: number){
        return typeId === FormulaType.CUST_FORMULA || typeId === FormulaType.CUST_FACTOR;
    }

    public canReplaceInDetail(typeId: number){
        return !this.isCAC(typeId) && !this.isFactorType(typeId);
    }

    public isDefaultEditable(typeId: number){
        return this.isCac_m(typeId) || this.isSac(typeId);
    }

    public isSac(typeId: number){
        return typeId === FormulaType.SAC;
    }

    public isWcfOrBcf(typeId: number){
        return typeId === FormulaType.WCF || typeId === FormulaType.BCF;
    }

    public canBeNew(typeId: number){
        return !this.isCAC(typeId) && typeId !== FormulaType.BCF && typeId !== FormulaType.WCF;
    }
}