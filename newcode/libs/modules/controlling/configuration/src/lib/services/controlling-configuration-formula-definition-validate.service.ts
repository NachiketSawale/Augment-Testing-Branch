/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions, ValidationInfo,
    ValidationResult
} from '@libs/platform/data-access';
import { IMdcContrColumnPropDefEntity } from '../model/entities/mdc-contr-column-prop-def-entity.interface';
import { inject, Inject, Injectable } from '@angular/core';
import {
    ControllingConfigurationFormulaDefinitionDataService
} from './controlling-configuration-formula-definition-data.service';
import { FieldValidationInfo } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { filter, forEach, find, get, isString, sortBy } from 'lodash';
import { ContrConfigFormulaTypeHelper } from './controlling-config-formula-type-helper.service';
import { HttpClient } from '@angular/common/http';
import {
    FormulaPropDefResult,
    IMdcContrFormulaPropDefEntity
} from '../model/entities/mdc-contr-formula-prop-def-entity.interface';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

@Injectable({
    providedIn: 'root'
})
export class ControllingConfigurationFormulaDefinitionValidateService extends BaseValidationService<IMdcContrFormulaPropDefEntity>{

    private readonly dataService = Inject(ControllingConfigurationFormulaDefinitionDataService<IMdcContrFormulaPropDefEntity>);
    private readonly translateService = inject(PlatformTranslateService);
    private paramRegEx = new RegExp('([a-zA-Z_]+[a-zA-Z0-9_]*)', 'g');
    private contrConfigFormulaTypeHelper = inject(ContrConfigFormulaTypeHelper);
    private readonly http = inject(HttpClient);
    private readonly configurationService = inject(PlatformConfigurationService);
    private requestUrl: string = this.configurationService.webApiBaseUrl;
	private validationService = inject(BasicsSharedDataValidationService);

    protected generateValidationFunctions(): IValidationFunctions<IMdcContrFormulaPropDefEntity> {
        return {
            Code: this.validateCode,
            BasContrColumnTypeFk: this.validateBasContrColumnTypeFk,
            DescriptionInfo:this.validateDescriptionInfo,
            Formula:this.validateFormula,
            IsDefault: this.validateIsDefault,
            IsVisible: this.validateIsVisible
        };
    }



     public validateCode(info: ValidationInfo<IMdcContrFormulaPropDefEntity>): ValidationResult  {
        const result = super.validateIsMandatory(info);
        if (!result.valid) {
            return result;
        }
        const newCode = info.value as string;

        const codeRegex = new RegExp('(^[a-zA-Z_]+[a-zA-Z0-9_]*)$', 'g');
        if(!codeRegex.test(newCode)){
            result.valid = false;
            result.error = this.translateService.instant('controlling.configuration.codeFormat').text;
            return result;
        }

        const itemColumn = find(this.columnDefs, function (item) {
            return get(item, 'CodeUpper') === newCode.toUpperCase();
        });

        const itemFormula = find(this.dataService.getList() as IMdcContrFormulaPropDefEntity[], function (item) {
            return get(item, 'Code') === newCode && item.Id !== info.entity.Id;
        });

        if(itemColumn || itemFormula){
            result.valid = false;
            result.error = this.translateService.instant('controlling.configuration.codeRepeated').text;
        }

        if(result.valid){
            this.replaceFormulaCode(info.entity, newCode);
        }

        return result;
    }

    private replaceFormulaCode(entity :IMdcContrFormulaPropDefEntity, newCode: string){
        const existList = filter(this.dataService.getList(), function (item){
            return item.Id !== entity.Id;
        }) as IMdcContrFormulaPropDefEntity[];
        forEach(existList, (item) =>{
            if(item.IsBaseConfigData || !item.Formula || item.Formula === ''){
                return;
            }

            const params = item.Formula.match(this.paramRegEx);
            if(!params || (entity.Code && params.indexOf(entity.Code)<0 && params.indexOf(entity.Code.toLowerCase())<0 )) {
                return;
            }

            const regex = new RegExp('\\b' + entity.Code + '\\b', 'gi');
            item.Formula = item.Formula.replace(regex,  newCode);

            this.dataService.markItemAsModified(item);
        });
    }

    public validateBasContrColumnTypeFk(info: FieldValidationInfo<IMdcContrFormulaPropDefEntity>): ValidationResult  {
        const res = new ValidationResult();
        let result = true;
        const newVal = info.value as number;
        const entity = info.entity;
        if(!this.contrConfigFormulaTypeHelper.canBeNew(newVal)){
            result = false;
        }

        if(!result){
            res.valid = false;
            res.error = this.translateService.instant('controlling.configuration.canotUseType').text;
        }


        if(result){
            if(entity.BasContrColumnTypeFk && this.contrConfigFormulaTypeHelper.isCac_m(entity.BasContrColumnTypeFk) && entity.IsDefault){
                result = false;
                res.valid = false;
                res.error = this.translateService.instant('controlling.configuration.noDefault4CurrFormula').text;
                res.apply = false;
            }
        }

        if(result && entity.Formula){
            const isFactorType = this.contrConfigFormulaTypeHelper.isFactorType(newVal);
            const isNumber = info.entity.Formula && new RegExp('^(-)?\\d+(\\.\\d+)?$').test(info.entity.Formula);
            if(!isFactorType && isNumber){
					this.validationService.applyValidationResult(this.dataService, { entity: entity, field: 'Formula', result: new ValidationResult(this.translateService.instant('controlling.configuration.formulaError1').text) });
            }else if(isFactorType){
	            this.validationService.applyValidationResult(this.dataService, { entity: entity, field: 'Formula', result: new ValidationResult() });
            }

            const existLists = filter(this.dataService.getList() as IMdcContrFormulaPropDefEntity[], function (item){
                return item.Id !== entity.Id;
            });

            const item =  find(existLists, function (item) {
                return get(item, 'Formula') === entity.Formula && item.BasContrColumnTypeFk === newVal;
            });

            // check repeated
            if(item){
                res.valid = false;
                res.error = this.translateService.instant('controlling.configuration.formulaRepeated').text;
                return res;
            }
        }

        if(result) {
            if(this.contrConfigFormulaTypeHelper.isFactorType(newVal) && entity.Formula){
                if(!(new RegExp('^(-)?\\d+(\\.\\d+)?$')).test(entity.Formula)){
                    entity.Formula = '0';
                }
            }

            entity.BasContrColumnTypeFk = newVal;
            this.generateFormulaDetail(entity, entity.Formula || '');
            this.generateFormulaDividend(entity);

            this.dataService.setEntityFieldReadonly(entity);
            entity.IsVisible = !this.contrConfigFormulaTypeHelper.isCac_m(newVal);
            entity.IsDefault = !this.contrConfigFormulaTypeHelper.isCac_m(newVal) ? false : entity.IsDefault;
            entity.IsEditable = !this.contrConfigFormulaTypeHelper.isCustFactor(newVal) ? false : entity.IsEditable;
        }

        return res;
    }

    public validateDescriptionInfo(info: ValidationInfo<IMdcContrFormulaPropDefEntity>): ValidationResult  {
        const result = super.validateIsMandatory(info);
        if (!result.valid) {
            return result;
        }

        const newVal = info.value as string;
        const entity = info.entity;

        const item =  find(this.dataService.getList() as IMdcContrFormulaPropDefEntity[], function (item) {
            return get(item, 'DescriptionInfo.Translated') === newVal && item.Id !== entity.Id;
        });

        if(item){
            result.valid = false;
            result.error = this.translateService.instant('controlling.configuration.descriptionRepeated').text;
        }

        return result;
    }

    public validateFormula(info: ValidationInfo<IMdcContrFormulaPropDefEntity>): Promise<ValidationResult>  {
        return new Promise((resolve) => {
            const result = super.validateIsMandatory(info);
            if (!result.valid) {
                resolve(result);
                return;
            }
            const newVal = info.value as string;
            const entity = info.entity;
            const existList = filter(this.dataService.getList() as IMdcContrFormulaPropDefEntity[], function (item){
                return item.Id !== entity.Id;
            });

            const item =  find(existList, function (item) {
                if(item.BasContrColumnTypeFk !== entity.BasContrColumnTypeFk){
                    return false;
                }

                const itemFormula = get(item, 'Formula');
                if(!itemFormula || itemFormula === ''){
                    return false;
                }

                return itemFormula.replace(/\s+/g,'').toLowerCase() === newVal.replace(/\s+/g,'').toLowerCase();
            });

            // check repeated
            if(item){
                result.valid = false;
                result.error = this.translateService.instant('controlling.configuration.formulaRepeated').text;
                resolve(result);
                return;
            }

            const isFactorType = entity.BasContrColumnTypeFk && this.contrConfigFormulaTypeHelper.isFactorType(entity.BasContrColumnTypeFk);
            const isNumber = new RegExp('^(-)?\\d+(\\.\\d+)?$').test(newVal);
            if(isFactorType && !isNumber){
                result.valid = false;
                result.error = this.translateService.instant('controlling.configuration.formulaError').text;
                resolve(result);
                return;
            }
            if(!isFactorType && isNumber){
                result.valid = false;
                result.error = this.translateService.instant('controlling.configuration.formulaError1').text;
                resolve(result);
                return;
            }

            // check whether the parameter exists;
            const codes = newVal.match(this.paramRegEx);
            const errorCodes: string[] = [];
            if (codes && codes.length > 0) {
                forEach(codes,  (code) => {
                    if(code && code.toUpperCase() === entity.Code){
                        errorCodes.push(code);
                        return;
                    }

                    const itemColumn = find(this.columnDefs, function (item) {
                        return get(item, 'CodeUpper') === code.toUpperCase();
                    });

                    const itemFormula = find(existList, function (item) {
                        return get(item, 'Code') === code.toUpperCase();
                    });

                    if(!itemColumn && !itemFormula){
                        errorCodes.push(code);
                    }

                });
            }

            if(errorCodes.length > 0){
                result.valid = false;
                result.error = this.translateService.instant('controlling.configuration.wrongOrSelfCode').text + errorCodes.join(', ');
                resolve(result);
                return;
            }

            // check cycle reference
            const cycledResult:FormulaPropDefResult = {cycledPath : '', result: false};
            if (codes && codes.length > 0){
                forEach(codes,  (code) => {
                    if(cycledResult.result) {
                        return;
                    }
                    const matched = find(existList, function (item) {
                        return get(item, 'Code') === code.toUpperCase();
                    });
                    if(matched) {
                        this.isCycledReference(matched, cycledResult, existList, entity);
                    }
                });
            }

            if(cycledResult.result) {
                result.valid = false;
                result.error = this.translateService.instant('controlling.configuration.cycleReference').text + entity.Code + cycledResult.cycledPath + '->' + entity.Code;
            }
            if(!result.valid){
                resolve(result);
                return ;
            }

            // sync check
            if ((new RegExp('[^a-zA-Z\\d.]', 'ig')).test(newVal)) {
                const checkFormulaPromise = this.http.get(this.requestUrl + 'estimate/main/calculator/checkformular?exp=' + encodeURIComponent(newVal));
                checkFormulaPromise.subscribe((response) => {
                    if (response && 'valid' in response && !response.valid as boolean) {
                        if ('formulaError' in response && response.formulaError) {
                            let errStr = '', i = 1;
                            const formulaErr = response.formulaError as string[];
                            if (formulaErr.length > 1) {
                                forEach(formulaErr, function (item) {
                                    errStr += '【' + i + ', ' + item + '】';
                                    i++;
                                });
                            } else {
                                errStr = formulaErr[0];
                            }

                            result.valid= false;
                            result.error = errStr;
                            resolve(result);
                        }
                    } else{
                        result.valid= true;
                        resolve(result);
                    }
                });
            }

            this.generateFormulaDetail(entity, newVal);
            this.generateFormulaDividend(entity);

            result.valid= true;
            resolve(result);
        });
    }

    private isCycledReference(matched: IMdcContrFormulaPropDefEntity, checkResult: FormulaPropDefResult, existList: IMdcContrFormulaPropDefEntity[], entity: IMdcContrFormulaPropDefEntity){
        if(!matched || checkResult.result){
            return false;
        }

        if(this.contrConfigFormulaTypeHelper.isCAC(matched.BasContrColumnTypeFk || 0)){
            const matchedSubs = filter(existList, (sub) => {
                return this.contrConfigFormulaTypeHelper.isCac_m(sub.BasContrColumnTypeFk || 0);
            });
            forEach(matchedSubs, (sub: IMdcContrFormulaPropDefEntity) =>{
                this.isCycledReference(sub, checkResult, existList, entity);
            });
            return false;
        }else{
            if(!matched.Formula){
                return false;
            }
            const cycledCodes = matched.Formula.match(this.paramRegEx);
            if(!cycledCodes || cycledCodes.length <= 0) {
                return false;
            }
            if(find(cycledCodes, function (cycledCode){
                return cycledCode.toUpperCase() === entity.Code;
            })) {
                checkResult.cycledPath += '->' + matched.Code;
                checkResult.result = true;
                return false;
            }

            let anyCycle : boolean = false;
            forEach(cycledCodes,  (cycledCode) => {
                const matchedCycled = find(existList, function (item) {
                    return get(item, 'Code') === cycledCode.toUpperCase() && item.Id !== matched.Id;
                });
                const res: boolean = !!matchedCycled && this.isCycledReference(matchedCycled, checkResult, existList, entity);
                anyCycle = anyCycle || res;
            });
            if(anyCycle){
                checkResult.cycledPath = '->' + matched.Code + checkResult.cycledPath;
            }
            return anyCycle;
        }
    }

    private generateFormulaDetail(entity :IMdcContrFormulaPropDefEntity, newVal?: string){
        newVal = newVal || '';
        entity.Formula = newVal;

        const codes = newVal.match(this.paramRegEx);
        const allList = this.dataService.getList() as IMdcContrFormulaPropDefEntity[];
        const existList = filter(allList, function (item){
            return item.Id !== entity.Id;
        }) as IMdcContrFormulaPropDefEntity[];

        // generate formula detail
        let formula = newVal;
        if (codes && codes.length > 0){
            codes.sort((a, b) => {
                return b.length - a.length;
            });

            forEach(codes,  (code) =>{
                const matched = find(existList, function (item) {
                    return get(item, 'Code') === code.toUpperCase();
                });

                if(matched){
                    // cac type use it owner code
                    if(matched.BasContrColumnTypeFk && !this.contrConfigFormulaTypeHelper.canReplaceInDetail(matched.BasContrColumnTypeFk)){
                        return;
                    }
                    const fDetail = matched.FormulaDetail && matched.FormulaDetail !== '' ? matched.FormulaDetail : matched.Formula;
                    const regex = new RegExp('\\b' + code + '\\b', 'g');
                    formula = formula.replace(regex, '('+ fDetail +')');
                }

            });
        }
        entity.FormulaDetail = formula;

        // generate relative formula detail
        const generateItemIds: number[] = [];
        const _this = this;
        forEach(existList, (item) => {
            if(item.IsBaseConfigData){
                return;
            }
            generateSubFormulaDetail(item, this);
        });

        function generateSubFormulaDetail(item: IMdcContrFormulaPropDefEntity, _this: ControllingConfigurationFormulaDefinitionValidateService){
            if(!item || generateItemIds.indexOf(item.Id) >= 0){
                return;
            }
            generateItemIds.push(item.Id);

            if(!item.Formula || item.Formula === ''){
                return;
            }

            const params = item.Formula.match(_this.paramRegEx);
            if(!params || params.length === 0){
                return;
            }

            forEach(params, function (param){
                if(param.toLowerCase() !== entity.Code.toLowerCase()){
                    const findExist = find(existList, function (exist){
                        return get(exist, 'Code') === param.toUpperCase() && exist.Id !== item.Id;
                    });
                    if(findExist) {
                        generateSubFormulaDetail(findExist, _this);
                    }
                }
            });

            params.sort(function(a: string, b: string) {
                return b.length - a.length;
            });
            item.FormulaDetail = item.Formula;
            forEach(params, function (param){
                const matched = find(allList, function (item) {
                    return get(item, 'Code') === param.toUpperCase();
                });

                if(matched){
                    // cac type use it owner code
                    if(!_this.contrConfigFormulaTypeHelper.canReplaceInDetail(matched.BasContrColumnTypeFk || 0)){
                        return;
                    }
                    const fDetail = matched.FormulaDetail && matched.FormulaDetail !== '' ? matched.FormulaDetail : matched.Formula;
                    const regex = new RegExp('\\b' + param + '\\b', 'g');
                    item.FormulaDetail = item.FormulaDetail ? item.FormulaDetail.replace(regex, '('+ fDetail +')') : item.FormulaDetail;
                }
            });
            _this.dataService.markItemAsModified(item);
        }
    }

    private getPrio(op: string) : number {
        if (op === '*' || op === '/') {
            return 2;
        }
        if (op === '+' || op === '-') {
            return 1;
        }
        if (op === '(') {
            return 0;
        }
        return 0;
    }

    private isOperator(char: string){
        return ['+','-','*','/','(',')'].indexOf(char) >= 0;
    }

    private getPostFix(formulaDetail: string){
        let postfix = '';
        const postFixStack: string[] =  [];
        const stack: string[] = [];

        forEach(formulaDetail, (char) =>{
            if(!this.isOperator(char)){
                postfix += char;
            }else {
                if(postfix !== ''){
                    postFixStack.push(postfix);
                    postfix = '';
                }

                if (stack.length === 0) {
                    stack.push(char);
                }else if (char === '(') {
                    stack.push(char);
                }else if (char === ')') {
                    let topChar = stack[stack.length - 1];
                    while (topChar !== '('){
                        postFixStack.push(topChar);
                        stack.pop();
                        topChar = stack[stack.length - 1];
                    }
                    stack.pop();
                }else {
                    let topChar = stack[stack.length - 1];
                    while (this.getPrio(char) <= this.getPrio(topChar)){
                        postFixStack.push(topChar);
                        stack.pop();
                        if (stack.length === 0){
                            break;
                        }
                        topChar = stack[stack.length - 1];
                    }
                    stack.push(char);
                }
            }
        });

        if(postfix !== ''){
            postFixStack.push(postfix);
        }

        while (stack.length !== 0) {
            const pop = stack.pop();
            if(pop) {
                postFixStack.push(pop);
            }
        }

        return postFixStack;
    }

    private generateFormulaDividend(entity: IMdcContrFormulaPropDefEntity){
        let formulaDividend = '';
        const resultStack: string[] = [];
        let str: string = '', right: string = '', left: string = '', item: string = '';

        if (isString(entity.FormulaDetail) && entity.FormulaDetail.indexOf('/') > 0){
            const formulaDetail = entity.FormulaDetail;
            formulaDividend = '';
            const result = this.getPostFix(formulaDetail);

            while(result.length > 0){
                item = result.shift() || '';

                if(item === ' '){
                    continue;
                }

                if(this.isOperator(item)){
                    right = resultStack.pop() || '';
                    left = resultStack.pop() || '';

                    if(item === '/'){
                        formulaDividend = formulaDividend + ' AND ' + right + ' != 0 ';
                    }

                    str = '(' + left + item + right + ')';
                    resultStack.push(str);
                }else{
                    resultStack.push(item);
                }
            }
        }

        entity.FormulaDividendDetail = formulaDividend;
    }

    public validateNewEntity(item: IMdcContrFormulaPropDefEntity){
        let info = new ValidationInfo<IMdcContrFormulaPropDefEntity>(item, item.Code || '', 'Code');
        let result = this.validateCode(info);
        this.applyValidationResult(result, item, 'Code');
        info = new ValidationInfo<IMdcContrFormulaPropDefEntity>(item, item.DescriptionInfo || undefined, 'DescriptionInfo');
        result = this.validateDescriptionInfo(info);
        this.applyValidationResult(result, item, 'DescriptionInfo');
        info = new ValidationInfo<IMdcContrFormulaPropDefEntity>(item, item.Formula || '', 'Formula');
        const promise = this.validateFormula(info);
        promise.then( () => {
            this.applyValidationResult(result, item, 'Formula');
        });
    }

    private applyValidationResult(result: ValidationResult, entity: IMdcContrFormulaPropDefEntity, field: string) {
        if (result.valid) {
            this.dataService.removeInvalid(entity, {result: result, field: field});
        } else {
            this.dataService.addInvalid(entity, {result: result, field: field});
        }
    }

    public validateIsDefault(info: FieldValidationInfo<IMdcContrFormulaPropDefEntity>): ValidationResult{
        const newValue = info.value as boolean;
        const entity = info.entity;
        const result = new ValidationResult();

        if(!newValue || !this.contrConfigFormulaTypeHelper.isWcfOrBcf(entity.BasContrColumnTypeFk || 0)){
            return result;
        }

        const existList = filter(this.dataService.getList(), function (item){
            return item.Id !== entity.Id;
        }) as IMdcContrFormulaPropDefEntity[];
        let hasReferItem = false;
        forEach(existList,  (item) => {
            if(item.IsBaseConfigData || !item.Formula || item.Formula === ''){
                return;
            }

            const params = item.Formula.match(this.paramRegEx);
            if(params && (params.indexOf(entity.Code) >= 0 || params.indexOf(entity.Code.toLowerCase()) >= 0)) {
                hasReferItem = true;
            }
        });

        if(!hasReferItem) {
            result.valid = false;
            result.error = this.translateService.instant('controlling.configuration.noRelativeFormula').text;
            return result;
        }

        if(!newValue &&
            (this.contrConfigFormulaTypeHelper.isCac_m(entity.BasContrColumnTypeFk ||0) || this.contrConfigFormulaTypeHelper.isSac(entity.BasContrColumnTypeFk ||0))){
            entity.IsDefault= true;
            result.valid = false;
            result.apply = false;
            result.error = this.translateService.instant('controlling.configuration.noDefault4CurrFormula').text;
            return result;
        }

        forEach(this.dataService.getList() as IMdcContrFormulaPropDefEntity[],  (item) =>{
            if(entity.Id === item.Id || entity.BasContrColumnTypeFk !== item.BasContrColumnTypeFk){
                return;
            }

            const originalVal = item.IsDefault;
            item.IsDefault = false;
            if(originalVal !== item.IsDefault){
                this.dataService.markItemAsModified(item);
            }
        });

        return result;
    }

    public validateIsVisible(info: FieldValidationInfo<IMdcContrFormulaPropDefEntity>): ValidationResult{
        const entity = info.entity;
        const result = new ValidationResult();

        if(this.contrConfigFormulaTypeHelper.isCustomType(entity.BasContrColumnTypeFk || 0)){
            return result;
        }

        forEach(this.dataService.getList() as IMdcContrFormulaPropDefEntity[],  (item) => {
            if(entity.Id === item.Id || entity.BasContrColumnTypeFk !== item.BasContrColumnTypeFk){
                return;
            }

            const originalVal = item.IsVisible;
            item.IsVisible = false;
            if(originalVal !== item.IsVisible){
                this.dataService.markItemAsModified(item);
            }
        });

        return result;
    }

    private columnDefs: IMdcContrColumnPropDefEntity[] = [];

    public loadColumnDef(){
        this.http.post(this.requestUrl +  'Controlling/Configuration/ContrColumnPropDefController/getColumnDefinitionList', {filter: ''}).subscribe( (response) => {
            if(response && 'dtos' in response){
                this.columnDefs = response.dtos as IMdcContrColumnPropDefEntity[];
                forEach(this.columnDefs, function (col){
                    col.CodeUpper = col.Code ? col.Code.toUpperCase() : '';
                    // col.sorting = 100 - col.Code.Length;
                });

                this.columnDefs = sortBy(this.columnDefs, 'sorting');
            }
        });
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMdcContrFormulaPropDefEntity> {
        return this.dataService;
    }

}

