import {Inject, Injectable} from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {BusinessPartnerEvaluationSchemaSubGroupService} from '../subgroup-data.service';
import {IEvaluationSubgroupEntity} from '@libs/businesspartner/interfaces';
import * as _ from 'lodash';
import {PlatformTranslateService} from '@libs/platform/common';
import { BusinesspartnerEvaluationschemaHeaderService } from '../schema-data.service';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerEvaluationSchemaSubGroupValidationService extends BaseValidationService<IEvaluationSubgroupEntity> {
	private readonly subgroupService = Inject(BusinessPartnerEvaluationSchemaSubGroupService);
	private readonly translate = Inject(PlatformTranslateService);
	private readonly schemaHeaderService = Inject(BusinesspartnerEvaluationschemaHeaderService);

	protected generateValidationFunctions(): IValidationFunctions<IEvaluationSubgroupEntity> {
		return {
			Formula: this.ValidateFormula,
			FormFieldFk: this.ValidateFormFieldFk
		};
	}

	protected ValidateFormula(info: ValidationInfo<IEvaluationSubgroupEntity>): ValidationResult {
		const validationResult: ValidationResult = {apply: true, valid: true};
		if ((info.value as string).trim() !== '') {
			const formulaStr = info.value as string;
			if (!_.startsWith(formulaStr.toUpperCase(), 'SELECT')) {
				const regCheckChar = /[a-zA-Z]+/;
				if (regCheckChar.test(formulaStr)) {
					validationResult.valid = false;
					validationResult.error = this.translate.instant('businesspartner.evaluationschema.formulaValidate',
						{p0: info.entity.GroupOrder, p1: formulaStr});
				} else {
					const regStr = /#(\d+\.?)+\d*/g;
					const strArray = formulaStr.match(regStr);
					let arrString = '';
					const groupOrder = this.strToSplit(info.entity.GroupOrder);
					if (strArray) {
						strArray.forEach(arr => {
							const tempArr = this.strToSplit(arr);
							if (tempArr.first > groupOrder.first || (tempArr.first === groupOrder.first && tempArr.second >= groupOrder.second)) {
								arrString += arr + ',';
							}
						});

						if (arrString) {
							validationResult.valid = false;
							validationResult.error = this.translate.instant('businesspartner.evaluationschema.formulaGroupOrder',
								{p0: arrString, p1: info.entity.GroupOrder, p2: info.value});
						}
					}
				}
			}
		}
		return validationResult;
	}

	protected ValidateFormFieldFk(info: ValidationInfo<IEvaluationSubgroupEntity>):ValidationResult {
		const validationResult: ValidationResult = {apply: true, valid: true};
		if (!this.schemaHeaderService.oldFormFieldId) {
			this.schemaHeaderService.oldFormFieldId = info.entity.FormFieldFk;
		}
		return validationResult;
	}
	protected strToSplit(sourceStr: string | null | undefined) {
		const sourceList = _.split(sourceStr, '.');
		if (sourceList.length > 1) {
			return {
				first: sourceList[0],
				second: parseFloat(sourceList[1])
			};
		}
		return {
			first: sourceList[0],
			second: -1
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEvaluationSubgroupEntity> {
		return this.subgroupService;
	}
}
