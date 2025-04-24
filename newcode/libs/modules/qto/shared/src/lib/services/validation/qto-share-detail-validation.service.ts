/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import * as _ from 'lodash';
import { evaluate } from 'mathjs';
import { firstValueFrom } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { BaseValidationService, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { QtoShareAddressMap } from '../../model/interfaces/qto-share-address-map.interface';
import { QtoShareDetailResult } from '../../model/interfaces/qto-share-detail-result.interface';
import { CodeMap, QtoShareDetailReferenceData } from '../../model/interfaces/qto-share-detail-reference-data.interface';
import {IQtoShareDetailEntity} from '../../model/entities/qto-share-detail-entity.interface';
import {QtoShareDetailGridComplete} from '../../model/qto-share-detail-complete.class';
import {QtoShareDetailDataService} from '../../services/qto-share-detail-data.service';
import {QtoShareLineType} from '../../model/enums/qto-share-line-type.enum';
import {IQtoShareFormulaEntity} from '../../model/entities/qto-share-formula-entity.interface';
import {QtoShareFormulaType} from '../../model/enums/qto-share-formula-type.enum';
import {QtoShareBoqType} from '../../model/enums/qto-share-boq-type.enum';

/**
 * The share validation service for qto detail
 */
export class QtoShareDetailValidationService<T extends IQtoShareDetailEntity, U extends QtoShareDetailGridComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends BaseValidationService<T> {
	protected readonly http = inject(HttpClient);
	protected readonly configurationService = inject(PlatformConfigurationService);
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected readonly translateService = inject(PlatformTranslateService);

	private readonly checkValueProperties: string[] = ['Value1Detail', 'Value2Detail', 'Value3Detail', 'Value4Detail', 'Value5Detail'];
	private readonly checkOperators: string[] = ['Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'];
	private readonly checkValues: string[] = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5'];

	/**
	 * The constructor
	 * @param dataService
	 */
	public constructor(protected dataService: QtoShareDetailDataService<T, U, PT, PU>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			BoqSplitQuantityFk: this.validateBoqSplitQuantityFk,
			QtoLineTypeFk: this.validateQtoLineTypeFk,
			QtoFormulaFk: this.validateQtoFormulaFk,
			Operator1: this.asyncCommonValidateOperators,
			Operator2: this.asyncCommonValidateOperators,
			Operator3: this.asyncCommonValidateOperators,
			Operator4: this.asyncCommonValidateOperators,
			Operator5: this.asyncCommonValidateOperators,
			Value1: this.asyncCommonValidateValues,
			Value2: this.asyncCommonValidateValues,
			Value3: this.asyncCommonValidateValues,
			Value4: this.asyncCommonValidateValues,
			Value5: this.asyncCommonValidateValues,
			Value1Detail: this.asyncCommonValidateValues,
			Value2Detail: this.asyncCommonValidateValues,
			Value3Detail: this.asyncCommonValidateValues,
			Value4Detail: this.asyncCommonValidateValues,
			Value5Detail: this.asyncCommonValidateValues,
			LineText: this.asyncCommonValidateValues,
			PageNumber: this.asyncValidatePageNumber,
			LineReference: this.asyncValidateLineReference,
			LineIndex: this.asyncValidateLineIndex,
			IsBQ: this.syncSplitMultiLineQtoDetailProperty,
			IsIQ: this.syncSplitMultiLineQtoDetailProperty,
			WipHeaderFk: this.syncSplitMultiLineQtoDetailProperty,
			BilHeaderFk: this.syncSplitMultiLineQtoDetailProperty,
			PesHeaderFk: this.syncMultiLineQtoDetailProperty,
			IsWQ: this.syncMultiLineQtoDetailProperty,
			IsAQ: this.syncMultiLineQtoDetailProperty,
			IsReadOnly: this.syncMultiLineQtoDetailProperty,
			PrjLocationFk: this.syncMultiLineQtoDetailProperty,
			AssetMasterFk: this.syncMultiLineQtoDetailProperty,
			PrcStructureFk: this.syncMultiLineQtoDetailProperty,
			MdcControllingUnitFk: this.syncMultiLineQtoDetailProperty,
			IsBlocked: this.syncMultiLineQtoDetailProperty,
			OrdHeaderFk: this.syncMultiLineQtoDetailProperty,
			BillToFk: this.syncMultiLineQtoDetailProperty,
			SortCode01Fk: this.syncMultiLineQtoDetailProperty,
			SortCode02Fk: this.syncMultiLineQtoDetailProperty,
			SortCode03Fk: this.syncMultiLineQtoDetailProperty,
			SortCode04Fk: this.syncMultiLineQtoDetailProperty,
			SortCode05Fk: this.syncMultiLineQtoDetailProperty,
			SortCode06Fk: this.syncMultiLineQtoDetailProperty,
			SortCode07Fk: this.syncMultiLineQtoDetailProperty,
			SortCode08Fk: this.syncMultiLineQtoDetailProperty,
			SortCode09Fk: this.syncMultiLineQtoDetailProperty,
			SortCode10Fk: this.syncMultiLineQtoDetailProperty,
			SpecialUse: this.syncMultiLineQtoDetailProperty,
			V: this.syncMultiLineQtoDetailProperty,
			UserDefined1: this.syncMultiLineQtoDetailProperty,
			UserDefined2: this.syncMultiLineQtoDetailProperty,
			UserDefined3: this.syncMultiLineQtoDetailProperty,
			UserDefined4: this.syncMultiLineQtoDetailProperty,
			UserDefined5: this.syncMultiLineQtoDetailProperty,
		};
	}

	protected getEntityRuntimeData(): QtoShareDetailDataService<T, U, PT, PU> {
		return this.dataService;
	}

	//TODO: missing => validateQtoLineTypeCode and asyncValidateQtoLineTypeCode

	//TODO: missing => validateBoqItemCode and asyncValidateBoqItemCode

	/**
	 * validate BoqSplitQuantityFk
	 * @param info
	 * @private
	 */
	public async validateBoqSplitQuantityFk(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity as T;
		// TODO: Temporarily commenting out to resolve eslint the error because it never used.
		// const model = info.field;
		const value = (_.isNil(info.value) ? 0 : info.value) as number;

		const itemList = this.dataService.getList() as IQtoShareDetailEntity[];
		const items = _.filter(itemList, function (item) {
			return item.Version && item.Version > 0 && item.BoqItemFk === entity.BoqItemFk && item.BoqSplitQuantityFk && item.Id !== entity.Id;
		});

		if (items.length > 0 && this.validationUtils.isEmptyProp(value)) {
			return this.validationUtils.createErrorObject({
				key: 'qto.main.selectSplitQuantityError',
			});
		}

		// set split no. as readonly
		this.dataService.readonlyProcessor.process(entity);

		entity.BoqSplitQuantityFk = value;

		const url = this.configurationService.webApiBaseUrl + 'qto/main/detail/checkQtoDetailHasSplitQtyFkOfBoqItem?boqHeaderFk=' + entity.BoqHeaderFk + '&boqItemFk=' + entity.BoqItemFk;

		const response = (await firstValueFrom(this.http.get(url))) as boolean;

		if (response && !entity.BoqSplitQuantityFk && this.validationUtils.isEmptyProp(value)){
			return this.validationUtils.createErrorObject({
				key: 'qto.main.selectSplitQuantityError',
			});
		}

		// Sync PrjLocation, ControllingUnit, PrcStructure, CostGroup in this qto detail group.
		const referencedLines = _.filter(this.dataService.getTheSameGroupQto(entity), function (qtoDetail) {
			return qtoDetail.Id !== entity.Id;
		});

		if (referencedLines && referencedLines.length) {
			_.forEach(referencedLines, (qtoDetail) => {
				qtoDetail.BoqSplitQuantityFk = value;
				qtoDetail.IsBoqSplitChange = entity.IsBoqSplitChange;
				this.dataService.syncQtoDetailGroupProperty(qtoDetail, entity, false);
			});

			this.dataService.setModified(referencedLines);
		}

		return this.validationUtils.createSuccessObject();
	}

	/**
	 * remove the validation/error
	 * @param entity
	 * @param relField
	 * @private
	 */
	private handleValueAndOperate(entity: T, relField: string) {
		this.getEntityRuntimeData().removeInvalid(entity, {
			field: relField,
			result: new ValidationResult(),
		});
	}

	private validateQtoLineTypeFk(info: ValidationInfo<T>): ValidationResult {
		let result = this.validationUtils.createSuccessObject();

		const entity = info.entity;
		const value = info.value as number;

		result = this.validationUtils.isMandatory(info);
		if (!result.valid) {
			return result;
		}

		this.dataService.isFirstStep = value === QtoShareLineType.LRefrence;

		const isKeepResult = value === QtoShareLineType.CommentLine || value === QtoShareLineType.RRefrence || value === QtoShareLineType.LRefrence || value === QtoShareLineType.IRefrence;

		const qtoType = _.find(this.dataService.qtoLineTypes, function (qtoLineType) {
			return qtoLineType.Id === value;
		});

		if (!qtoType) {
			return result;
		}

		if (entity.QtoLineTypeFk === 1) {
			entity.bakResult = entity.Result;
			entity.Result = 0;
		} else if (entity.bakResult && entity.QtoLineTypeFk === 2 && qtoType.Id === 1) {
			entity.Result = entity.bakResult;
		}

		entity.QtoLineTypeCode = qtoType.CodeInfo?.Description;
		entity.QtoLineTypeFk = qtoType.Id;

		if (entity.V) {
			entity.V = _.toUpper(entity.V);
		}
		entity.IsCalculate = true;

		if (value !== QtoShareLineType.ItemTotal && value !== QtoShareLineType.Subtotal && value !== QtoShareLineType.Standard && value !== QtoShareLineType.Hilfswert) {
			entity.QtoFormulaFk = null;
			entity.QtoFormula = null;
			entity.ignoreScriptValidation = true;
			this.removeErrorForValue1ToValue5AndOp1ToOp5(entity);
			this.handleValueAndOperate(entity, 'Result');
			this.clearCalculateFields(entity, isKeepResult);
			this.clearOperatorFields(entity);
			entity.Factor = 1;
		} else if (!entity.QtoFormulaFk) {
			// set as default
			// TODO: Temporarily commenting out to resolve eslint the error because it never used.
			// const qtoHeader = this.dataService.parentService?.getSelectedEntity();
			//TODO: not sure how to deal with this case -lnt
			// let qtoFormulas = lookupDescriptorService.getData('QtoFormula');
			// let qtoFormula = _.find(qtoFormulas, {
			// 	'BasRubricCategoryFk': qtoHeader.BasRubricCategoryFk,
			// 	'IsDefault': true
			// });
			// if (qtoFormula) {
			// 	entity.QtoFormulaFk = qtoFormula.Id;
			// 	entity.QtoFormula = qtoFormula;
			// }
		}

		const isCommentLine = value === QtoShareLineType.CommentLine;
		if (isCommentLine) {
			this.dataService.readonlyProcessor.process(entity);
		}

		//TODO: missing => dataService.cellStyleChanged.fire(entity) -lnt
		//dataService.cellStyleChanged.fire(dataService.getSelected());

		return result;
	}

	/**
	 * validate QtoFormulaFk
	 * @param info
	 * @private
	 */
	private validateQtoFormulaFk(info: ValidationInfo<T>): ValidationResult {
		const entity = info.entity as T;
		const filed = info.field;
		const value = info.value;

		// filed is LineText and qto line Type is CommentLine
		if (filed === 'LineText' && entity.QtoLineTypeFk === QtoShareLineType.CommentLine) {
			const newValue = (_.isNil(value) ? '' : value) as string;
			_.set(entity, filed, newValue);
			if (newValue && newValue.length > 56) {
				return this.validationUtils.createErrorObject({
					key: 'qto.main.CommentLine',
				});
			}
		}

		if (filed !== 'QtoFormulaFk') {
			return this.validationUtils.createSuccessObject();
		}

		let referencedLines = this.dataService.getTheSameGroupQto(entity);
		if (!referencedLines || referencedLines.length <= 0) {
			referencedLines = [entity];
		}

		const newValue = (_.isNil(info.value) ? 0 : info.value) as number;
		const newQtoFormula: IQtoShareFormulaEntity | null = null;
		if (newValue !== null) {
			//TODO: missing => lookupDescriptorService.getData('QtoFormula')
			//var targetData = lookupDescriptorService.getData('QtoFormula');
			//newQtoFormula = targetData[newValue];
		}

		_.forEach(referencedLines, (line) => {
			this.handleValueAndOperate(line, filed);
			line.ignoreScriptValidation = true;
			line.OldQtoFormula = Object.assign({}, line.QtoFormula);

			if (newValue === null) {
				line.QtoFormula = null;
			} else {
				line.QtoFormula = Object.assign({}, newQtoFormula);
				line.Result = 0;
				this.dataService.filterByFormulaUom(line, newValue);
			}
			line.QtoFormulaFk = newValue;

			// change qto formula keep or clear the value & operator
			this.dealQtoLineValueNOperatorByQtoFormula(line);

			//TODO: missing => dataService.cellStyleChanged.fire(line);
			//dataService.cellStyleChanged.fire(line);
			//TODO: missing => updateReadOnlyDetail;
			//dataService.updateReadOnlyDetail(line, lookupDescriptorService.getData('QtoFormulaAllUom'));
		});

		//TODO: missing => resizeGrid.fire;
		//dataService.resizeGrid.fire(referencedLines[referencedLines.length - 1]);

		this.dataService.updateQtoLineReferenceReadOnly(referencedLines);
		this.getFormulaImage(referencedLines, newValue);
		this.dataService.setModified(referencedLines);

		return this.validationUtils.createSuccessObject();
	}

	private dealQtoLineValueNOperatorByQtoFormula(entity: T) {
		const operatorArray = ['Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'];

		const valueActiveArray = ['Value1IsActive', 'Value2IsActive', 'Value3IsActive', 'Value4IsActive', 'Value5IsActive'];

		const newQtoFormula = entity.QtoFormula;
		const oldQtoFormula = entity.OldQtoFormula;

		this.clearCalculateFields(entity);
		this.clearOperatorFields(entity);

		if (newQtoFormula && oldQtoFormula) {
			switch (oldQtoFormula.QtoFormulaTypeFk) {
				case QtoShareFormulaType.Predefine:
					for (let j = 1; j <= operatorArray.length; j++) {
						const operatorValue = _.get(newQtoFormula, 'Operator' + j);
						if (!operatorValue || operatorValue.indexOf(_.get(entity, 'Operator' + j)) < 0) {
							_.set(entity, 'Operator' + j, null);
							_.set(entity, 'Value' + j, null);
							_.set(entity, 'Value' + j + 'Detail', null);
						}
					}
					break;
				case QtoShareFormulaType.Script:
					for (let j = 1; j <= valueActiveArray.length; j++) {
						const isActive = _.get(newQtoFormula, 'Value' + j + 'IsActive');
						if (!isActive || isActive !== _.get(oldQtoFormula, 'Value' + j + 'IsActive')) {
							_.set(entity, 'Value' + j, null);
							_.set(entity, 'Value' + j + 'Detail', null);
						}
					}
					break;
			}
		}
	}

	/**
	 * clear CalculateFields
	 * @param entity
	 * @param isKeepResult
	 */
	private clearCalculateFields(entity: T, isKeepResult: boolean = false) {
		entity.Value1 = null;
		entity.Value2 = null;
		entity.Value3 = null;
		entity.Value4 = null;
		entity.Value5 = null;
		entity.Value1Detail = null;
		entity.Value2Detail = null;
		entity.Value3Detail = null;
		entity.Value4Detail = null;
		entity.Value5Detail = null;
		entity.FormulaResult = null;
		entity.PrjLocationReferenceFk = null;
		entity.QtoDetailReferenceFk = null;
		entity.BoqItemReferenceFk = null;
		entity.LineText = null;

		// if commentLine to keep the result
		entity.Result = isKeepResult ? entity.Result : 0;
	}

	private clearOperatorFields(entity: T) {
		entity.Operator1 = null;
		entity.Operator2 = null;
		entity.Operator3 = null;
		entity.Operator4 = null;
		entity.Operator5 = null;
	}

	private getFormulaImage(entity: T[] | T, formulaFk: number) {
		if (!entity) {
			return;
		}

		const entities = !_.isArray(entity) ? [entity] : entity;

		function setValueIntoEntity(items: T[], field: string, value: number | null) {
			_.forEach(items, function (item) {
				_.set(item, field, value);
			});
		}

		if (formulaFk === null || formulaFk === undefined) {
			setValueIntoEntity(entities, 'Blob', null);
		} else {
			//TODO: missing => lookupDescriptorService.getData('QtoFormula')
			/*const qtoFormula = find(lookupDescriptorService.getData('QtoFormula'), {Id: formulaFk});
            if (qtoFormula !== null && qtoFormula !== undefined) {
                var basBlobsFk = qtoFormula.BasBlobsFk;
                setValueIntoEntity(entities, 'BasBlobsFk', basBlobsFk);
                if (basBlobsFk !== null) {
                    var imageCache = find(service.qtoFormulaImageCache, {Id: basBlobsFk});
                    if (imageCache === null || imageCache === undefined) {
                        service.getBlobById(basBlobsFk).then(function (data) {
                            var blobEntity = {
                                Id: basBlobsFk,
                                Content: data.Content
                            };
                            $timeout(function () {
                                service.qtoFormulaImageCache.push(blobEntity);
                                setValueIntoEntity(entities, 'Blob', data.Content);
                            }, 300);
                        });
                    } else {
                        setValueIntoEntity(entities, 'Blob', imageCache.Content);
                    }
                } else {
                    setValueIntoEntity(entities, 'Blob', null);
                }
            }*/
		}
	}

	/**
	 * Validate Operators: 'Operator1', 'Operator2', 'Operator3', 'Operator4' and 'Operator5'
	 * @param info
	 * @private
	 */
	public async asyncCommonValidateOperators(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity as T;
		const field = info.field;
		const value = (_.isNil(info.value) ? '' : info.value) as string;

		if (entity.QtoFormulaFk === null) {
			return this.validationUtils.createErrorObject({
				key: 'qto.main.SelectQtoFormula',
			});
		} else {
			if (!this.validationUtils.isEmptyProp(value)) {
				let result = this.validateOperator(info, entity, field, value, field, value);
				_.forEach(this.checkOperators, (item) => {
					if (result.valid && item !== field) {
						result = this.validateOperator(info, entity, item, _.get(entity, item), field, value);
					}
				});

				if (!result.valid) {
					return result;
				}

				// if no validation: do validation for value1 to value5
				result = this.validateValue1ToValue5(info, entity, field, value);

				return result;
			}

			const url = this.configurationService.webApiBaseUrl + 'qto/formula/uom/getFormulaUom?qtoFormulaFk=' + entity.QtoFormulaFk + '&uomFk=' + entity.BasUomFk;
			const response = await firstValueFrom(this.http.get(url));
			if (response) {
				const qtoFormulaUom = _.get(response, 'data') as unknown as IQtoShareFormulaEntity;
				if (!qtoFormulaUom) {
					//TODO: missing => lookupDescriptorService.getData('QtoFormula');
					/* var allQtoFormula;
                    var qtoFormulaFk = entity.QtoFormulaFk;

                    allQtoFormula = lookupDescriptorService.getData('QtoFormula');
                    qtoFormulaUom = _.find(allQtoFormula, {Id: qtoFormulaFk});*/
				}

				const isEmpty: boolean = !value || value === '';
				let valid: boolean = false;
				let operator: string | null | undefined = '';
				switch (field) {
					case 'Operator1':
						valid = qtoFormulaUom.Operator1 ? isEmpty || qtoFormulaUom.Operator1.indexOf(value) >= 0 : false;
						operator = qtoFormulaUom.Operator1;
						break;
					case 'Operator2':
						valid = qtoFormulaUom.Operator2 ? isEmpty || qtoFormulaUom.Operator2.indexOf(value) >= 0 : false;
						operator = qtoFormulaUom.Operator2;
						break;
					case 'Operator3':
						valid = qtoFormulaUom.Operator3 ? isEmpty || qtoFormulaUom.Operator3.indexOf(value) >= 0 : false;
						operator = qtoFormulaUom.Operator3;
						break;
					case 'Operator4':
						valid = qtoFormulaUom.Operator4 ? isEmpty || qtoFormulaUom.Operator4.indexOf(value) >= 0 : false;
						operator = qtoFormulaUom.Operator4;
						break;
					case 'Operator5':
						valid = qtoFormulaUom.Operator5 ? isEmpty || qtoFormulaUom.Operator5.indexOf(value) >= 0 : false;
						operator = qtoFormulaUom.Operator5;
						break;
				}

				if (!valid) {
					const operatorErrorTr = operator ? this.translateService.instant('qto.main.' + operator).text : null;
					return this.validationUtils.createErrorObject({
						key: 'qto.main.operatorError',
						params: {
							object: operatorErrorTr || 'empty',
						},
					});
				} else {
					let result = this.validateOperator(info, entity, field, value, field, value);
					_.each(this.checkOperators, (item) => {
						if (result.valid && item !== field) {
							result = this.validateOperator(info, entity, item, _.get(entity, item), field, value);
						}
					});

					if (result.valid) {
						this.validateValue1ToValue5(info, entity, field, value);
					} else {
						return result;
					}
				}
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	/**
	 * do validation for operators: 'Operator1', 'Operator2', 'Operator3', 'Operator4' and 'Operator5'
	 * @param info
	 * @param entity
	 * @param model
	 * @param value
	 * @param focusOpreatorModel
	 * @param focusOperatorModelValue
	 * @private
	 */
	private validateOperator(info: ValidationInfo<T>, entity: T, model: string, value: string, focusOpreatorModel: string, focusOperatorModelValue: string): ValidationResult {
		delete entity.ignoreScriptValidation;
		const valueIndex: number = parseInt(model.replace('Operator', '')),
			isActive: boolean = entity.QtoFormula ? _.get(entity.QtoFormula, 'Value' + valueIndex + 'IsActive') : false,
			maxActiveIdx: number = this.dataService.maxActiveValueFieldIndex(entity);
		let isRequired: boolean = false;

			if (isActive && entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === QtoShareFormulaType.Predefine) {
			// if operator before this operator column has been set to '=', then this value no need to enter
			const anyEqualSymbolBefore: boolean = this.isAnyEqualSymbolBefore(valueIndex, entity, focusOpreatorModel, focusOperatorModelValue);

			// if operator(n) is not empty, then operator(n-1) can't be empty.
			if (!anyEqualSymbolBefore && !isRequired) {
				isRequired = this.isOperatorEmpty(valueIndex, entity, focusOpreatorModel, focusOperatorModelValue, maxActiveIdx);
			}

			// if value(n) is not empty, then operator(n) can't be empty.
			if (!anyEqualSymbolBefore && !isRequired) {
				const valueDetail = _.get(entity, this.checkValueProperties[valueIndex - 1]);
				if (valueDetail && valueDetail !== '') {
					isRequired = true;
				}
			}

			if (isRequired) {
				// TODO: Temporarily commenting out to resolve eslint the error because it never used.
				// const modelTr = model ? this.translateService.instant('qto.main.' + model) : null;
				const result = model ? this.validationUtils.isMandatory(info, this.translateService.instant('qto.main.' + model)) : this.validationUtils.isMandatory(info);
				if (!result.valid) {
					return result;
				}
			} else {
				// removeFieldError => removeFieldError(entity, model);
				this.handleValueAndOperate(entity, model);
			}

			// check whether the last active operator is '=' or some operator before it is '='
			if (value === '=') {
				return this.validationUtils.createSuccessObject();
			}

			if (valueIndex === maxActiveIdx && !anyEqualSymbolBefore && focusOpreatorModel === model) {
				const anyValOrOperatorHasValue: boolean = this.isAnyValOrOperatorHasValue(entity, valueIndex);

				if (anyValOrOperatorHasValue) {
					return this.validationUtils.createErrorObject({
						key: 'qto.main.lastOperatorShouldBeEqualSymbolError',
						params: {
							object: model,
						},
					});
				}
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	private isAnyEqualSymbolBefore(valueIndex: number, entity: T, focusOpreatorModel: string, focusOperatorModelValue: string): boolean {
		let anyEqualSymbolBefore: boolean = false;
		if (valueIndex > 1) {
			for (let i = 1; i < valueIndex; i++) {
				let checkOperVal = _.get(entity, this.checkOperators[i - 1]);
				if (focusOpreatorModel && this.checkOperators[i - 1] === focusOpreatorModel) {
					checkOperVal = focusOperatorModelValue;
				}
				if (checkOperVal === '=') {
					anyEqualSymbolBefore = true;
				}
			}
		}

		return anyEqualSymbolBefore;
	}

	private isOperatorEmpty(valueIndex: number, entity: T, focusOpreatorModel: string, focusOperatorModelValue: string, maxActiveIdx: number): boolean {
		let isRequired: boolean = false;
		for (let k = valueIndex; k < maxActiveIdx; k++) {
			let checkOper = _.get(entity, this.checkOperators[k]);
			if (focusOpreatorModel && this.checkOperators[k] === focusOpreatorModel) {
				checkOper = focusOperatorModelValue;
			}
			isRequired = checkOper && checkOper !== '';

			if (isRequired) {
				break;
			}
		}

		return isRequired;
	}

	private isAnyValOrOperatorHasValue(entity: T, valueIndex: number): boolean {
		let anyValOrOperatorHasValue = false;
		for (let j = 1; j <= valueIndex; j++) {
			let val = _.get(entity, this.checkValueProperties[j - 1]);
			if (val !== null && val !== '') {
				anyValOrOperatorHasValue = true;
				break;
			}

			val = _.get(entity, this.checkOperators[j - 1]);
			if (val !== null && val !== '' && j < valueIndex) {
				anyValOrOperatorHasValue = true;
				break;
			}
		}

		return anyValOrOperatorHasValue;
	}

	/**
	 * when change operator, will validate value1 to value5
	 * @param info
	 * @param entity
	 * @param focusOpreatorModel
	 * @param focusOperatorModelValue
	 * @private
	 */
	private validateValue1ToValue5(info: ValidationInfo<T>, entity: T, focusOpreatorModel: string, focusOperatorModelValue: string): ValidationResult {
		// TODO: Temporarily commenting out to resolve eslint the error because it never used.
		// let field: string = '';

		let result: ValidationResult = new ValidationResult();

		_.forEach(this.checkValueProperties, (checkProperty) => {
			if (result.valid) {
				 // field = checkProperty;
				result = this.validateValue(info, entity, checkProperty, _.get(entity, checkProperty), '', '', focusOpreatorModel, focusOperatorModelValue);
			}
		});

		if (!result.valid) {
			return result;
		}

		return this.validationUtils.createSuccessObject();
	}

	/**
	 * validate Value, when change the operator
	 * @param info
	 * @param entity
	 * @param model
	 * @param value
	 * @param focusValueModel
	 * @param focusValueModelValue
	 * @param focusOpreatorModel
	 * @param focusOperatorModelValue
	 * @private
	 */
	private validateValue(info: ValidationInfo<T>, entity: T, model: string, value: string, focusValueModel: string, focusValueModelValue: string, focusOpreatorModel: string, focusOperatorModelValue: string): ValidationResult {
		const valueIndex: number = parseInt(model.replace('Value', '').replace('Detail', '')),
			isActive: boolean = entity.QtoFormula ? _.get(entity.QtoFormula, 'Value' + valueIndex + 'IsActive') : false,
			maxActiveIdx: number = this.dataService.maxActiveValueFieldIndex(entity);
		let isRequired: boolean = false,
			result: ValidationResult = new ValidationResult();

		if (isActive) {
			if (entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === QtoShareFormulaType.Predefine) {
				// if operator before this value column has been set to '=', then this value no need to enter;
				const anyEqualSymbolBefore = this.isAnyEqualSymbolBefore(valueIndex, entity, focusOpreatorModel, focusOperatorModelValue);

				if (!anyEqualSymbolBefore) {
					// if value(n) is not empty, then value1 ~ value(n-1) can't be empty.
					isRequired = this.isValueEmpty(entity, valueIndex, maxActiveIdx, focusValueModel, focusValueModelValue);
				}

				// if operator(n) is not empty, then value1 ~ value(n) can't be empty.
				if (!anyEqualSymbolBefore && !isRequired) {
					isRequired = this.isValueEmptyHasOperator(entity, valueIndex, maxActiveIdx, focusOpreatorModel, focusOperatorModelValue);
				}

				if (!anyEqualSymbolBefore) {
					if (value && value !== '' && !focusOpreatorModel) {
						// TODO: Temporarily commenting out to resolve eslint the error because it never used.
						// const op = this.checkOperators[valueIndex - 1];

						// TODO: Temporarily commenting out to resolve eslint the error because it never used.
						// const modelTr = op ? this.translateService.instant('qto.main.' + op) : null;
						result = model ? this.validationUtils.isMandatory(info, this.translateService.instant('qto.main.' + model)) : this.validationUtils.isMandatory(info);
						if (!result.valid) {
							return result;
						}
					} else {
						// removeFieldError =>  removeFieldError(entity, checkOperators[valueIndex - 1]);
						this.handleValueAndOperate(entity, this.checkOperators[valueIndex - 1]);
					}
				}

				if (result.valid) {
					if (isRequired && this.validationUtils.isEmptyProp(value)) {
						const modelProp = model.replace('Detail', '');
						result = modelProp ? this.validationUtils.isMandatory(info, this.translateService.instant('qto.main.' + modelProp)) : this.validationUtils.isMandatory(info);
						if (!result.valid) {
							return result;
						}
					} else {
						//TODO: missing => entity.__rt$data
						/*if (entity.__rt$data && entity.__rt$data.errors) {
                            var error = entity.__rt$data.errors[model];
                            if (error){
                                result.valid = false;
                                result.error = error.error;
                            }

                            if (error && error.errorType === 'nullValue') {
                                removeFieldError(entity, model);
                                // as already remove the error, here should set valid as true.
                                result.valid = true;
                            }
                        }*/
					}
				}

				if (result.valid) {
					if (!this.validationUtils.isEmptyProp(value)) {
						//TODO: missing => $injector.get('basicsCommonStringFormatService').validateInvalidChar(value)
						/* result = $injector.get('basicsCommonStringFormatService').validateInvalidChar(value);
                        if (!result.valid) {
                            platformRuntimeDataService.applyValidationResult(result, entity, model);
                        } else {
                            result = $injector.get('basicsCommonStringFormatService').includeChineseChar(value);
                            if (!result.valid) {
                                platformRuntimeDataService.applyValidationResult(result, entity, model);
                            }
                        }*/
					}
				}
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	private isValueEmpty(entity: T, valueIndex: number, maxActiveIdx: number, focusValueModel: string, focusValueModelValue: string): boolean {
		let isRequired: boolean = false;

		for (let j = valueIndex; j < maxActiveIdx; j++) {
			let checkValue = _.get(entity, this.checkValueProperties[j]);
			if (focusValueModel && this.checkValueProperties[j] === focusValueModel) {
				checkValue = focusValueModelValue;
			}
			isRequired = !!checkValue && checkValue !== '' && checkValue !== '0';

			if (isRequired) {
				break;
			}
		}

		return isRequired;
	}

	private isValueEmptyHasOperator(entity: T, valueIndex: number, maxActiveIdx: number, focusOpreatorModel: string, focusOperatorModelValue: string): boolean {
		let isRequired: boolean = false;

		for (let k = valueIndex - 1; k < maxActiveIdx; k++) {
			let checkOper = _.get(entity, this.checkOperators[k]);
			if (focusOpreatorModel && this.checkOperators[k] === focusOpreatorModel) {
				checkOper = focusOperatorModelValue;
			}
			isRequired = checkOper && checkOper !== '';

			if (isRequired) {
				break;
			}
		}

		// if operator(n) is not empty and also is not'=', the value1 ~ value(n+1) can't be empty
		if (!isRequired) {
			let previousOper = _.get(entity, this.checkOperators[valueIndex - 2]);
			if (focusOpreatorModel && this.checkOperators[valueIndex - 2] === focusOpreatorModel) {
				previousOper = focusOperatorModelValue;
			}

			if (previousOper && previousOper !== '' && previousOper !== '=') {
				isRequired = true;
			}
		}

		return isRequired;
	}

	/**
	 * common function: validate value1-value5
	 * @param info
	 * @private
	 */
	private async asyncCommonValidateValues(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity as T;
		const field = info.field;
		const newValue = (_.isNil(info.value) ? 0 : info.value) as number;

		//TODO: missing => validate for group
		/*else if (result) {
            if (entity.__rt$data && entity.__rt$data.errors && result.valid){
                entity.__rt$data.errors[field] = null;
                platformDataValidationService.finishValidation(result, entity, newValue, field, service, dataService);
                dataService.gridRefresh();
            }
            entity.HasError = !result.valid;
            defer.resolve(result);
            return defer.promise;
        }*/
		if (newValue !== entity.BoqItemFk && newValue && entity.QtoLineTypeFk === 6 && field === 'BoqItemReferenceFk') {
			//TODO: missing => boq info, let boqService = dataService.getBoqService();
		} else if (entity.QtoLineTypeFk === QtoShareLineType.IRefrence) {
			if (newValue === 0) {
				return this.validationUtils.createErrorObject({
					key: 'qto.main.selectBoqItemError',
				});
			}
		} else {
			const orignalReferencedQtoDetails: T[] = this.dataService.getReferencedDetails(entity);

			const newValueEndsWithEqualSymbol: boolean = !!(newValue && newValue.toString().endsWith('='));
			const entityEndsWithEqualSymbol: boolean = this.dataService.isEndWithEqualSymbol(entity);
			if (newValueEndsWithEqualSymbol || entityEndsWithEqualSymbol) {
				const isRemoveEqualSymbol = entityEndsWithEqualSymbol && !newValueEndsWithEqualSymbol;
				_.set(entity, field, newValue);

				if (isRemoveEqualSymbol) {
					this.dataService.updateQtoDetailGroupInfo();
				} else {
					this.dataService.updateQtoDetailGroupInfo(orignalReferencedQtoDetails);
				}
			}

			if (entity && entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === QtoShareFormulaType.FreeInput) {
				let result = this.checkQtoDetailMaxLinenumber(entity);
				if (!result.valid) {
					return result;
				} else {
					_.forEach(orignalReferencedQtoDetails, (qtoDetail) => {
						//TODO: missing => __rt$data
						/*if(qtoDetail.Id === entity.Id || (!qtoDetail.__rt$data || !qtoDetail.__rt$data.errors || !qtoDetail.__rt$data.errors[field])){
                            return;
                        }*/
						result = this.checkQtoDetailMaxLinenumber(qtoDetail);
						if (result.valid) {
							this.dataService.setModified(this.dataService.getReferencedDetails(qtoDetail));
							this.handleValueAndOperate(qtoDetail, field);
							//qtoDetail.__rt$data.errors[field] = null;
						}
					});
				}
			}

			return await this.asyncValidateValue(entity, newValue, field, field.replace('Detail', ''));
		}

		return this.validationUtils.createSuccessObject();
	}

	private async asyncValidateValue(entity: T, value: number | string, field: string, name: string): Promise<ValidationResult> {
		const codesHasChecked: string[] = [];
		let detailVal: string = '';

		// TODO: Temporarily commenting out to resolve eslint the error because it never used.
		// const endWithOperator: boolean = false;
		const originalValue = value;
		let isMultiline: boolean = false;
		const referenceList: T[] = [];

		if (entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === QtoShareFormulaType.FreeInput && entity.QtoFormula.IsMultiline) {
			isMultiline = true;
			value = this.freeInputLineTextBeforeValidationV10(value, field, entity, referenceList);
		}

		if (value && typeof value === 'string') {
			detailVal = value.replace(/=$/g, ''); // only replace the last '='
		}

		let exp = '&exp=';
		if (typeof value === 'string' && new RegExp('[^a-zA-Z\\d.]', 'g').test(value) && (this.checkValueProperties.indexOf(field) >= 0 || field === 'LineText')) {
			exp += encodeURIComponent(value);
		}

		const url = this.configurationService.webApiBaseUrl + 'qto/main/detail/checkformulaandgetdetailrefs?qtoHeaderId=' + entity.QtoHeaderFk + exp;

		const response = await firstValueFrom(this.http.get(url));
		if (response) {
			const data = response as QtoShareDetailReferenceData;
			const qtoDetailCodeMap: CodeMap[] = data.CodeMap,
				referenceDic = data.ReferenceDic,
				errorInfos = data.formulaError;
			// TODO: Temporarily commenting out to resolve eslint the error because it never used.
			// let isEndWithOperator = typeof originalValue === 'string' && new RegExp('[-+*/%^]$', 'g').test(originalValue),
			let	result = this.validationUtils.createSuccessObject();

			// the formular has error
			if (exp || errorInfos) {
				// TODO: Temporarily commenting out to resolve eslint the error because it never used.
				// isEndWithOperator = this.formulaHasError(result, errorInfos, endWithOperator, detailVal, value as string);
			}

			const reg = new RegExp('(\\d{0,4}[a-zA-Z]\\d)|(\\d+[a-zA-Z])|(\\d*[a-zA-Z]+\\d*)', 'g');
			const jsMathFunctions = [
				'abs',
				'acos',
				'acosh',
				'asin',
				'asinh',
				'atan',
				'atanh',
				'atan2',
				'ceil',
				'cbrt',
				'expm1',
				'clz32',
				'cos',
				'cosh',
				'exp',
				'floor',
				'fround',
				'hypot',
				'imul',
				'log',
				'log1p',
				'log2',
				'log10',
				'max',
				'min',
				'pow',
				'random',
				'round',
				'sign',
				'sin',
				'sinh',
				'sqrt',
				'tan',
				'tanh',
				'trunc',
			];
			const jsConstant = ['E', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'PI', 'SQRT1_2', 'SQRT2'];

			const code = this.dataService.getCode(entity);

			const qtoDetailCodeList = _.map(qtoDetailCodeMap, 'code');

			if (result.valid) {
				if (value && typeof value === 'string' && value.length >= 2) {
					// remove js Math function, then match parameters.
					let filterValue = value;
					_.forEach(jsMathFunctions, function (fun) {
						const reg = new RegExp(fun + '\\s*\\(', 'gi');
						filterValue = filterValue.replace(reg, '(');
					});

					const qtoReferenceCodes = filterValue.match(reg);
					const transformQtoReferences: string[] = [];
					const codeFormulas: Array<{ code: string; matchCode: string }> = [];
					if (qtoReferenceCodes && qtoReferenceCodes.length > 0) {
						_.forEach(qtoReferenceCodes, (item) => {
							item = item.toString().toUpperCase();
							if (jsConstant.indexOf(item) < 0) {
								const strReference = this.padLeft(item, 6);
								transformQtoReferences.push(strReference);

								// set the match code array
								const codeFormula = { code: '', matchCode: '' };
								codeFormula.code = strReference;
								codeFormula.matchCode = item.toString();
								codeFormulas.push(codeFormula);
							}
						});

						const hasUnValidCode = _.some(transformQtoReferences, function (referenceCode) {
							return qtoDetailCodeList.indexOf(referenceCode) === -1;
						});

						if (hasUnValidCode) {
							return this.validationUtils.createErrorObject({ key: 'qto.main.hasUnValidCodeErrorMessage' });
						}

						if (result.valid && this.checkSelfReference(transformQtoReferences, code, codesHasChecked, qtoDetailCodeMap)) {
							return this.validationUtils.createErrorObject({ key: 'qto.main.selfReferenceErrorMessage' });
						}

						if (result.valid) {
							const cycleReferences = this.checkCycleReference(referenceDic, transformQtoReferences, code);
							if (cycleReferences.length > 0) {
								let errorText = '';
								_.forEach(cycleReferences, function (item) {
									errorText = (errorText !== '' ? errorText + '-' : '') + item + '-' + code;
								});
								return this.validationUtils.createErrorObject({
									key: 'qto.main.cycleReferenceErrorMessage',
									params: { object: errorText },
								});
							}
						}

						if (result.valid) {
							_.forEach(transformQtoReferences, function (item) {
								const codeformula = _.find(codeFormulas, { code: item });
								const isMatch = codeformula && codeformula.matchCode && codeformula.matchCode.length < 6;
								const referenceItem = _.find(qtoDetailCodeMap, { code: item });
								if (referenceItem) {
									item = isMatch ? item.replace(/\b(0+)/gi, '') : item;
									referenceItem.code = isMatch ? referenceItem.code.replace(/\b(0+)/gi, '') : referenceItem.code;
									const reg = new RegExp(item, 'gi');
									detailVal = detailVal.replace(reg, referenceItem.result.toString());
								}
							});
						}
					}
				} else if (field === 'QtoDetailReferenceFk') {
					if (result.valid) {
						const qtoDetail = _.find(qtoDetailCodeMap, { id: value }) as CodeMap;
						if (qtoDetail) {
							let errorText2 = '';
							if (qtoDetail.qtoDetailReferenceFk === entity.Id) {
								errorText2 = (errorText2 !== '' ? errorText2 + '-' : '') + entity.QtoDetailReference + '-' + qtoDetail.code;
								result.error = this.translateService.instant('qto.main.cycleReferenceErrorMessage', { object: errorText2 }).text;
								result.valid = false;
							} else if (qtoDetail.code) {
								const qtoReferenceCodes2 = qtoDetail.code.match(reg) as string[];
								const cycleReferences2 = this.checkCycleReference(referenceDic, qtoReferenceCodes2, code);
								if (cycleReferences2.length > 0) {
									_.forEach(cycleReferences2, function (item) {
										errorText2 = (errorText2 !== '' ? errorText2 + '-' : '') + item + '-' + code;
									});
									result.error = this.translateService.instant('qto.main.cycleReferenceErrorMessage', { object: errorText2 }).text;
									result.valid = false;
								}
							}
						}
					}
				}
			}

			if (result.valid) {
				if (name) {
					try {
						detailVal = detailVal.replace(/,/g, '.');
						const evalResult = detailVal !== null && detailVal !== '' ? evaluate(detailVal.replace(/\*\*/g, '^').toLocaleLowerCase()) : '';
						if (_.isNumber(evalResult) && field !== 'LineText') {
							_.set(entity, name, evalResult);
						}
					} catch (ex) {
						if (!entity.QtoFormula || entity.QtoFormula.QtoFormulaTypeFk !== 2 || !entity.QtoFormula.IsMultiline) {
							_.set(entity, name, 0);
						}
					}
				}

				if (result.valid) {
					result = this.scriptValidate(entity, field, value === null || value === '' ? _.get(entity, name) : value);
				}
			}

			if (result.valid && entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === 2 && entity.QtoFormula.BasRubricCategoryFk === 84) {
				this.validateRebCharacterLength(originalValue as string, result);
			}

			if (isMultiline || (entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === 2 && entity.QtoFormula.BasRubricCategoryFk === 84)) {
				entity.HasError = !result.valid;
				// for isMultiLine qtolines, do validation for other reference lines
				if (referenceList && referenceList.length > 0) {
					//TODO: missing => multiline validation
					/*_.each(referenceList, (line) => {
                        this.asyncValidateValue1(line, line[field], field, undefined, result);
                    });

                    if(entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === 2 && entity.QtoFormula.BasRubricCategoryFk === 84 && field === 'LineText'){
                        let characterLengthResult = angular.copy(result);
                        characterLengthResult.valid = true;
                        _.each(referenceList, function (line) {
                            validateRebCharacterLength(line.LineText, characterLengthResult);

                            if (!characterLengthResult.valid){
                                platformRuntimeDataService.applyValidationResult(characterLengthResult, line, field);
                                platformDataValidationService.finishValidation(characterLengthResult, line, line[field], field, service, dataService);
                            }
                        });
                       // dataService.gridRefresh();
                    }*/
				}
			}

			return result;
		}

		return this.validationUtils.createSuccessObject();
	}

	private validateRebCharacterLength(value: string, validateResult: ValidationResult) {
		if (_.isString(value) && value.length > 38) {
			validateResult.error = this.translateService.instant('qto.main.detail.validationText.maxCharacterLenthReb23003').text;
			validateResult.valid = false;
		}
	}

	private formulaHasError(result: ValidationResult, errorInfos: string[], endWithOperator: boolean, detailVal: string, value: string) {
		let errStr: string = '',
			i: number = 1,
			isEndWithOperator: boolean = false;
		_.forEach(errorInfos, function (item) {
			if (endWithOperator && _.startsWith(item, 'End with a operator:')) {
				detailVal = detailVal.trimEnd().slice(0, detailVal.length - 1);
				isEndWithOperator = true;
				return;
			}

			errStr += ' &#10;';
			errStr += i + ', ' + item;
			i++;
		});

		if (endWithOperator && !isEndWithOperator && value) {
			errStr += ' &#10;';
			errStr += i + ', ' + 'Multiline freeinput formula need end with operator:' + value;
		} else if (new RegExp('\\.[^0-9]', 'g').test(value)) {
			errStr += ' &#10;';
			errStr += i + ', ' + this.translateService.instant('cloud.common.ERROR_TYPE_NUMBER').text;
		} else if (new RegExp('([-+]\\s*){2,}', 'g').test(value)) {
			errStr += ' &#10;';
			errStr += i + ', Wrong operator between two variate or value';
		}

		result.valid = errStr === '';
		if (!result.valid) {
			result.error = errStr;
		}

		return isEndWithOperator;
	}

	private checkSelfReference(codeToCheck: string[], selfCode: string, codesHasChecked: string[], qtoDetailCodeMap: CodeMap[]) {
		let hasSelfReference = false;

		if (codeToCheck.indexOf(selfCode) > -1) {
			return true;
		}

		_.forEach(codeToCheck, (item) => {
			if (codesHasChecked.indexOf(item) < 0) {
				const nextToCheck = _.find(qtoDetailCodeMap, { code: item });
				codesHasChecked = codesHasChecked.concat(item);
				if (nextToCheck && nextToCheck.referenceCodes && this.checkSelfReference(nextToCheck.referenceCodes, selfCode, codesHasChecked, qtoDetailCodeMap)) {
					hasSelfReference = true;
				}
			}
		});

		return hasSelfReference;
	}

	private checkCycleReference(referenceDic: Record<string, string[]>, codeToCheck: string[], selfCode: string) {
		const cycleReferences: string[] = [];
		_.forEach(codeToCheck, (item) => {
			const itemTemp = this.padLeft(item.toString(), 6);
			if (Object.hasOwnProperty.call(referenceDic, itemTemp)) {
				if (referenceDic[itemTemp].indexOf(selfCode) !== -1) {
					cycleReferences.push(itemTemp);
				}
			}
		});

		return cycleReferences;
	}

	private freeInputLineTextBeforeValidationV10(value: number | string, field: string, entity: T, referenceList: T[]): string {
		// TODO: Temporarily commenting out to resolve eslint the error because it never used.
		// const jsMathOperatorAndFunctions = [
		// 	'**',
		// 	'abs',
		// 	'acos',
		// 	'acosh',
		// 	'asin',
		// 	'asinh',
		// 	'atan',
		// 	'atanh',
		// 	'atan2',
		// 	'ceil',
		// 	'cbrt',
		// 	'expm1',
		// 	'clz32',
		// 	'cos',
		// 	'cosh',
		// 	'exp',
		// 	'floor',
		// 	'fround',
		// 	'hypot',
		// 	'imul',
		// 	'log',
		// 	'log1p',
		// 	'log2',
		// 	'log10',
		// 	'max',
		// 	'min',
		// 	'pow',
		// 	'random',
		// 	'round',
		// 	'sign',
		// 	'sin',
		// 	'sinh',
		// 	'sqrt',
		// 	'tan',
		// 	'tanh',
		// 	'trunc',
		// ];

		value = value || '';

		let formulaStr = value as string;

		const detail: T = { ...entity };
		_.set(detail, field, value);
		const referencedLines = this.dataService.getReferencedDetails(detail);
		_.each(referencedLines, function (line) {
			if (line.Id !== entity.Id) {
				referenceList.push(line);
			}
		});

		_.forEach(referencedLines, function (item) {
			const currentFormula = item.Id === entity.Id ? value : item.LineText || '';
			formulaStr += ' ' + currentFormula;
		});

		return formulaStr;
	}

	private checkQtoDetailMaxLinenumber(qtoDetail: T) {
		const result: ValidationResult = this.validationUtils.createSuccessObject();

		if (!qtoDetail || !qtoDetail.QtoFormula || !_.isNumber(qtoDetail.QtoFormula.MaxLinenumber)) {
			return result;
		}

		const referencedLines = this.dataService.getReferencedDetails(qtoDetail, []);
		if (referencedLines.length > qtoDetail.QtoFormula.MaxLinenumber) {
			return this.validationUtils.createErrorObject({
				key: 'qto.main.detail.outOfMaxLineNumber',
				params: {
					value0: qtoDetail.QtoFormula.Code,
					value1: qtoDetail.QtoFormula.MaxLinenumber,
				},
			});
		}

		return result;
	}

	//TODO: missing => scriptValidateForUserForm, missing userFormData
	private scriptValidate(entity: T, model: string, value: string, validationIsFromBeforeEdit: boolean = false) {
		const valueIndex = parseInt(model.replace('Value', '').replace('Detail', ''));
		const result = this.validationUtils.createSuccessObject();

		if (entity.QtoFormula && entity.QtoFormula.QtoFormulaScriptEntities && entity.QtoFormula.QtoFormulaScriptEntities.length > 0) {
			this.dataService.updateQtoDetailGroupInfo();

			const parameterList = this.getValuesParameter(entity, model, value);
			const referencedDetails = this.getItemForValidation(this.dataService.getReferencedDetails(entity));
			parameterList.push({
				VariableName: 'ReferencedItems',
				InputValue: referencedDetails,
			});

			const scriptData = {
				ParameterList: parameterList,
				ValidateScriptData: entity.QtoFormula.QtoFormulaScriptEntities[0].ValidateScriptData || '',
			};

			_.forEach(scriptData.ParameterList, function (item) {
				if (item.VariableName === 'val' + valueIndex) {
					item.InputValue = value === null || value === '' ? '' : parseFloat(value.replace(/,/g, '.'));
				}
			});

			//TODO: missing => scriptEvalService.synValidate(scriptData);
			/*const response = scriptEvalService.synValidate(scriptData);
            if (response && response.length > 0) {
                var errorInfo = _.filter(response, function (info) {
                    // eslint-disable-next-line no-prototype-builtins
                    return info.hasOwnProperty('HasError') && info.HasError === true && info.Name.toLowerCase() === 'val' + valueIndex;
                });

                if (errorInfo.length === 0) {
                    errorInfo = _.filter(response, function (info) {
                        // eslint-disable-next-line no-prototype-builtins
                        return info.hasOwnProperty('HasError') && info.HasError === true && info.Name.toLowerCase() === model.toLowerCase();
                    });
                }

                if (errorInfo.length > 0) {
                    var errorStr = '';
                    for (var i = 0; i < errorInfo.length; i++) {
                        if (i > 0) {
                            errorStr += '&#10';
                        }
                        errorStr += errorInfo[i].Error;
                    }
                    if (value !== null || validationIsFromBeforeEdit) {
                        result.valid = false;
                        result.error = errorStr;
                        result.errorType = 'scriptError';
                    }
                }
            }*/

			//TODO: missing response type
			//this.setValueFieldIsDisableAfterScriptValidation(entity, response);
		}

		return result;
	}

	//TODO: missing => setValueFieldIsDisableAfterScriptValidation, missing response data type

	private validateLineAddressInGroup(entity: T, value: number | string, model: string) {
		// validate qto line address is used in another qto detail group or not.
		const entityCopy: T = Object.assign({}, entity);
		_.set(entityCopy, model, value);
		entityCopy.QtoDetailReference = this.dataService.getCode(entityCopy);

		//TODO: missing => type
		/*let isUsed = this.dataService.isUsedInOtherGroup([entityCopy]);

        if (!isUsed.isValid && isUsed.inValidLine){
            let info = 'qto.main.lineReferenceIsUsedInAnotherGroup',
                infoParam =  {
                    linereference: isUsed.inValidLine
                },
                message = $injector.get('$translate').instant(info, infoParam);

            $injector.get('platformModalService').showMsgBox(message, 'qto.main.changeLineReferenceFailed', 'info');
            return platformDataValidationService.createErrorObject(info,infoParam);
        }*/

		return this.validationUtils.createSuccessObject();
	}

	/**
	 * validate for qto address: sheet, line and index.
	 * if lineIndex is null | '', set lineIndex = 0
	 * if pageNumber is null | '', set pageNumber = 1
	 * @param entity
	 * @param pageNumber
	 * @param lineReference
	 * @param lineIndex
	 * @param value
	 * @param model
	 * @private
	 */
	private async qtoAddressValidate(entity: T, pageNumber: number, lineReference: string, lineIndex: number, value: number | string, model: string): Promise<ValidationResult> {
		let result: ValidationResult = this.validationUtils.createSuccessObject();

		entity.LineReference = lineReference;
		entity.PageNumber = pageNumber;
		entity.LineIndex = lineIndex;
		entity.IsModifyLineReference = true;
		const postParam = {
			Id: [entity.Id],
			QtoHeaderId: entity.QtoHeaderFk,
			PageNumber: [pageNumber],
			LineReference: [lineReference],
			LineIndex: [lineIndex],
			IsCheckedSheet: true,
		};

		const url = this.configurationService.webApiBaseUrl + 'qto/main/detail/ismapqtoaddress';
		const response = await firstValueFrom(this.http.post(url, postParam));
		if (response) {
			const data = _.get(response, 'data') as unknown as QtoShareAddressMap;

			// validate address Overflow
			this.addressOverflow(result, data, model);

			// validate for sheet
			const isSheetReadonly = data.IsSheetReadonly;
			if (result.valid) {
				if (isSheetReadonly) {
					result.apply = true;
					result.valid = false;
					result.error = this.translateService.instant('qto.main.sheetReadonly').text;
				}
			}

			if (result.valid) {
				if (!data.IsLiveOrReadable) {
					result.apply = true;
					result.valid = false;
					result.error = this.translateService.instant('qto.main.sheetNoIsLiveOrReadable').text;
				}
			}

			// validate for unique
			this.addressUnque(result, data, lineReference, pageNumber, lineIndex, entity.Id);

			if (result.valid) {
				result = this.checkDependentQtoDetailItem(entity);
			}

			// sort qto details and set code
			if (result.valid) {
				this.setQtoDetailCode(entity, pageNumber, lineReference, lineIndex);
			}

			// create the sheet no
			//TODO: missing => sheet logic
			if (result.valid && model === 'PageNumber') {
				// dataService.setPageNumberCreated(value); // create sheet in validation
				// return $injector.get('qtoMainStructureDataService').createQtoStructure(value, entity.QtoHeaderFk, boqType, entity.QtoTypeFk).then(function (sheetItem) {
				//     entity.QtoSheetFk = sheetItem ? sheetItem.Id : null;
				//     dataService.setSelected(entity);
				//     var cell = dataService.getPageNumberCell();
				//     cell = cell ? cell : 0;
				//     var options = {
				//         item: entity,
				//         cell: cell + 1,
				//         forceEdit: true
				//     };
				//     dataService.setCellFocus(options);
				// });
			}
		}

		return result;
	}

	private addressOverflow(result: ValidationResult, data: QtoShareAddressMap, model: string) {
		const errorMessage = this.translateService.instant('qto.main.detail.addressOverflow').text;

		if (data.ErrorSheet && model === 'PageNumber') {
			result.apply = true;
			result.valid = false;
			result.error = errorMessage;
		}

		if (data.ErrorIndex && model === 'LineIndex') {
			result.apply = true;
			result.valid = false;
			result.error = errorMessage;
		}

		if (data.ErrorLine && model === 'LineReference') {
			result.apply = true;
			result.valid = false;
			result.error = errorMessage;
		}
	}

	private addressUnque(result: ValidationResult, data: QtoShareAddressMap, lineReference: string, pageNumber: number, lineIndex: number, id: number) {
		if (result.valid) {
			let isUnique = data.IsUnique;
			if (isUnique) {
				const qtoDetailList = this.dataService.getList();
				_.forEach(qtoDetailList, function (qto) {
					if (qto.LineReference === lineReference && qto.PageNumber === pageNumber && qto.LineIndex === lineIndex && qto.Id !== id) {
						isUnique = false;
					}
				});
			}

			result = { apply: true, valid: isUnique };
			if (!result.valid) {
				const pageNumberErrorTr = this.translateService.instant('qto.main.PageNumber').text;
				const lineReferenceErrorTr = this.translateService.instant('qto.main.LineReference').text;
				const lineIndexErrorTr = this.translateService.instant('qto.main.LineIndex').text;
				result.error = this.translateService.instant('qto.main.threeFiledUniqueValueErrorMessage', {
					field1: pageNumberErrorTr,
					field2: lineReferenceErrorTr,
					field3: lineIndexErrorTr,
				}).text;
			}
		}
	}

	private checkDependentQtoDetailItem(entity: T): ValidationResult {
		const code = this.dataService.getCode(entity);
		const regex = new RegExp(code);
		const qtoDetailList = this.dataService.getList();
		const hasDependent = _.some(qtoDetailList, (qtoDetailItem) => {
			let isValid = false;
			_.forEach(this.checkValueProperties, function (checkProperty) {
				const valueDetail = _.get(qtoDetailItem, checkProperty);
				if (valueDetail && valueDetail.length >= 6) {
					if (regex.test(valueDetail)) {
						isValid = true;
					}
				}
			});
			return isValid;
		});

		if (hasDependent) {
			const errorParam = {
				code: code,
				field1: 'PageNumber',
				field2: 'LineReference',
				field3: 'LineIndex',
			};

			return this.validationUtils.createErrorObject({
				key: 'qto.main.threeFiledReferenceErrorMessage',
				params: errorParam,
			});
		}

		return this.validationUtils.createSuccessObject();
	}

	private setQtoDetailCode(entity: T, pageNumber: number, lineReference: string, lineIndex: number) {
		entity.PageNumber = pageNumber;
		entity.LineIndex = lineIndex;

		const sortProperty = ['PageNumber', 'LineReference', 'LineIndex'];
		this.dataService.getList().sort(this.dataService.sortDetail(sortProperty));

		// page number+line reference+line index, if lineReference.length > 1, it is Onorm qto
		if (lineReference.length > 1) {
			entity.QtoDetailReference = this.padLeft(pageNumber.toString(), 4) + lineReference.toString() + this.padLeft(lineIndex.toString(), 3);
		} else {
			entity.QtoDetailReference = this.padLeft(pageNumber.toString(), 4) + lineReference + lineIndex;
		}

		entity.Code = entity.QtoDetailReference; // TODO: when bulk edit,show the code
		// dataService.gridRefresh();
	}

	private padLeft(num: string, n: number) {
		let len = num.toString().length;
		while (len < n) {
			num = '0' + num;
			len++;
		}
		return num;
	}

	/**
	 * asyncValidate PageNumber
	 * @param info
	 * @private
	 */
	private async asyncValidatePageNumber(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity as T;
		const model = info.field;
		const value = (_.isNil(info.value) ? 0 : info.value) as number;

		let result = this.validateIsMandatory(info);
		if (!result.valid) {
			return result;
		}

		if (value === 0) {
			return this.validationUtils.createErrorObject({
				key: 'qto.main.' + model,
			});
		}

		//TODO: missing => sheet logic
		// validate for sheet readonly
		if (result.valid) {
			// let qtoSheets = $injector.get('qtoMainStructureDataService').getList();
			// let qtoSheet = _.find(qtoSheets, {'PageNumber': value, 'IsReadonly': true});
			// if (qtoSheet) {
			//     result.apply = true;
			//     result.valid = false;
			//     result.error = this.translateService.instant('qto.main.sheetReadonly');
			// }
		}

		// validate the group for multi lines
		if (result.valid) {
			result = this.validateLineAddressInGroup(entity, value, model);
		}

		if (result.valid) {
			const referencedLines = this.dataService.getReferencedDetails(entity);
			if (entity.QtoFormula && entity.QtoFormula.IsMultiline && referencedLines.length > 1) {
				_.forEach(referencedLines, function (item) {
					item.PageNumber = value;
				});
				this.dataService.setModified(referencedLines);
			}

			const lineReference = (_.isNil(entity.LineReference) ? '' : entity.LineReference) as string;
			result = await this.qtoAddressValidate(entity, value, lineReference, entity.LineIndex, value, model);
		}

		return result;
	}

	/**
	 * asyncValidate LineReference
	 * @param info
	 * @private
	 */
	private async asyncValidateLineReference(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity as T;
		const model = info.field;
		let value = (_.isNil(info.value) ? '' : info.value) as string;

		let result = this.validateIsMandatory(info);
		if (!result.valid) {
			return result;
		}

		if (result.valid) {
			value = value.toUpperCase();
			_.set(entity, model, value);
			result = this.validateLineAddressInGroup(entity, value, model);
		}

		if (result.valid) {
			result = await this.qtoAddressValidate(entity, entity.PageNumber, value, entity.LineIndex, value, model);
		}

		return result;
	}

	/**
	 * asyncValidate LineIndex
	 * @param info
	 * @private
	 */
	private async asyncValidateLineIndex(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity as T;
		const model = info.field;
		const value = (_.isNil(info.value) ? 0 : info.value) as number;

		let result = this.validateIsMandatory(info);
		if (!result.valid) {
			return result;
		}

		if (result.valid) {
			result = this.validateLineAddressInGroup(entity, value, model);
		}

		if (result.valid) {
			const lineReference = (_.isNil(entity.LineReference) ? '' : entity.LineReference) as string;
			result = await this.qtoAddressValidate(entity, entity.PageNumber, lineReference, value, value, model);
		}

		return result;
	}

	//TODO: missing => why here create?
	// service.entityCreated = function (e, entity){
	//     onEntityCreated(e, entity);
	// };

	private getIsMapCulture(checkVal: string) {
		//TODO: missing => culture validation
		/*let isMapCulture = $injector.get('estimateMainCommonCalculationService').getIsMapCulture(checkVal);

        let result = {apply: true, valid: true};
        if (!isMapCulture) {
            result = {
                apply: true,
                valid: false,
                error: $translate.instant('cloud.common.computationFormula')
            };
        }*/

		return this.validationUtils.createSuccessObject();
	}

	//TODO: missing => service.checkValueForUserForm

	//TODO: missing => service.checkValueDetail

	private removeErrorForValue1ToValue5AndOp1ToOp5(entity: T) {
		_.forEach(this.checkValueProperties, (checkProperty) => {
			this.handleValueAndOperate(entity, checkProperty);
		});

		_.forEach(this.checkOperators, (checkProperty) => {
			this.handleValueAndOperate(entity, checkProperty);
		});
	}

	private getValuesParameter(entity: T, model: string | undefined = undefined, value: string | undefined = undefined) {
		const parameters = [];
		for (let valueIndex = 1; valueIndex <= this.checkValueProperties.length; valueIndex++) {
			// var valueDetail = entity[checkValueProperties[valueIndex-1]];
			let valueValue = _.get(entity, this.checkValues[valueIndex - 1]);
			valueValue = valueValue === null || valueValue === '' ? '' : valueValue - 0;
			parameters.push({ VariableName: 'val' + valueIndex, InputValue: valueValue });

			let valDetail = _.get(entity, this.checkValueProperties[valueIndex - 1]);
			if (model && value && model.indexOf(String(valueIndex)) >= 0) {
				valDetail = value;
			}
			valDetail = valDetail === null || valDetail === '' ? '' : valDetail;
			valDetail = valDetail.replace(/,/g, '.');
			parameters.push({ VariableName: 'val' + valueIndex + 'Detail', InputValue: valDetail });

			let operator = _.get(entity, this.checkOperators[valueIndex - 1]);
			operator = operator === null || operator === '' ? '' : operator;
			parameters.push({ VariableName: 'operator' + valueIndex, InputValue: operator });
		}
		parameters.push({ VariableName: 'reference', InputValue: entity.QtoDetailReference });
		parameters.push({ VariableName: 'factor', InputValue: entity.Factor });
		parameters.push({ VariableName: 'result', InputValue: entity.Result });
		parameters.push({ VariableName: 'subtotal', InputValue: entity.SubTotal });
		parameters.push({ VariableName: 'linetext', InputValue: entity.LineText });
		parameters.push({ VariableName: 'remarktext', InputValue: entity.RemarkText });
		parameters.push({ VariableName: 'remark1text', InputValue: entity.Remark1Text });
		//TODO: missing => scriptTransService
		//parameters.push({'VariableName': 'translator', 'InputValue': scriptTransService.getTranslator()});
		parameters.push({ VariableName: 'RHO', InputValue: this.getRho() });
		parameters.push({ VariableName: 'PI', InputValue: this.getPiValue() });

		return parameters;
	}

	private getRho() {
		let gonimeter = 3;
		const currentHeader = this.dataService.currentQtoHeader;
		const PI = this.getPiValue();
		if (currentHeader && currentHeader.BasGoniometerTypeFk) {
			gonimeter = currentHeader.BasGoniometerTypeFk;
		}

		switch (gonimeter) {
			// Degree
			case 1:
				return PI / 180.0;
			// Gradian
			case 2:
				return PI / 200.0;
			// Radian
			case 3:
				return 1;
		}

		return 1;
	}

	private getPiValue() {
		let category = 1;
		const currentHeader = this.dataService.currentQtoHeader;

		if (currentHeader) {
			category = currentHeader.BasRubricCategoryFk;
		}

		switch (category) {
			// Onorm
			case 525:
				return 3.141592654;
			default:
				return 3.14159265359;
		}
	}

	private getItemForValidation(qtoDetails: T[]): QtoShareDetailResult[] {
		const result: QtoShareDetailResult[] = [];

		if (qtoDetails && qtoDetails.length > 0) {
			qtoDetails.forEach((detail) => {
				const item: QtoShareDetailResult = {
					reference: _.isString(detail.QtoDetailReference) ? detail.QtoDetailReference : this.dataService.getCode(detail),
					result: detail.Result,
				};

				for (let valueIndex = 1; valueIndex <= this.checkValueProperties.length; valueIndex++) {
					const valueValue = _.get(detail, this.checkValues[valueIndex - 1]);
					_.set(item, 'val' + valueIndex, valueValue === null || valueValue === '' ? '' : valueValue - 0);

					const valDetail = _.get(detail, this.checkValueProperties[valueIndex - 1]);
					_.set(item, 'val' + valueIndex + 'Detail', valDetail === null || valDetail === '' ? '' : valDetail);

					const operator = _.get(detail, this.checkOperators[valueIndex - 1]);
					_.set(item, 'operator' + valueIndex, operator === null || operator === '' ? '' : operator);
				}

				result.push(item);
			});
		}

		return result;
	}

	//TODO: missing => service.setOperatorByEnterKeyOrTebKey

	/**
	 * validate Result
	 * @param entity
	 * @param skipUpdateQtoDetailGrouping
	 * @private
	 */
	private validateResult(entity: T, skipUpdateQtoDetailGrouping: boolean) {
		if (!entity) {
			return;
		}

		if (entity.QtoLineTypeFk === QtoShareLineType.Standard || entity.QtoLineTypeFk === QtoShareLineType.Hilfswert || entity.QtoLineTypeFk === QtoShareLineType.Subtotal || entity.QtoLineTypeFk === QtoShareLineType.ItemTotal) {
			if (entity.QtoFormula === null || (entity.QtoFormula && (entity.QtoFormula.QtoFormulaScriptEntities === null || entity.QtoFormula.QtoFormulaScriptEntities === undefined || entity.QtoFormula.QtoFormulaScriptEntities.length === 0))) {
				return;
			}

			if (!skipUpdateQtoDetailGrouping) {
				this.dataService.updateQtoDetailGroupInfo();
			}

			const parameterList = this.getValuesParameter(entity);
			const referencedDetails = this.getItemForValidation(this.dataService.getReferencedDetails(entity));
			parameterList.push({
				VariableName: 'ReferencedItems',
				InputValue: referencedDetails,
			});

			const validateScriptData = entity.QtoFormula && entity.QtoFormula.QtoFormulaScriptEntities && entity.QtoFormula.QtoFormulaScriptEntities.length > 0 ? entity.QtoFormula.QtoFormulaScriptEntities[0].ValidateScriptData : '';
			const scriptData = {
				ParameterList: parameterList,
				ValidateScriptData: validateScriptData,
			};

			_.forEach(scriptData.ParameterList, (item) => {
				if (item.VariableName === 'result') {
					item.InputValue = entity.Result;
				}
				if (item.VariableName === 'subtotal') {
					item.InputValue = entity.SubTotal;
				}
				for (let i = 1; i <= this.checkValueProperties.length; i++) {
					if (item.VariableName.indexOf('val' + i) > 0 || item.VariableName.indexOf('operator' + i) > 0) {
						const value = _.get(entity, this.checkValueProperties[i]);
						if (value === null || value === '') {
							item.InputValue = '';
						}
					}
				}
			});

			//TODO: missing => scriptEvalService.synValidate(scriptData);
			// const response = scriptEvalService.synValidate(scriptData);
			// if (!response || response.length === 0) {
			//     return;
			// }

			//TODO: missing => response
			// for result
			//this.applyScriptValidationErrorToField(entity, 'Result', response, 'result');

			// for subtotal
			if (entity.QtoLineTypeFk === QtoShareLineType.Subtotal || entity.QtoLineTypeFk === QtoShareLineType.ItemTotal) {
				//applyScriptValidationErrorToField(entity, 'SubTotal', response, 'subtotal');
			}

			// for factor
			//applyScriptValidationErrorToField(entity, 'Factor', response, 'factor');

			// for value1 - value5
			if (!entity.ignoreScriptValidation) {
				for (let k = 0; k < this.checkValueProperties.length; k++) {
					//applyScriptValidationErrorToField(entity, checkValueProperties[k], response, 'val' + (k + 1));
				}
			}

			//TODO: missing => response
			//setValueFieldIsDisableAfterScriptValidation(entity, response);
		}
	}

	private syncMultiLineQtoDetailProperty(info: ValidationInfo<T>): ValidationResult {
		const entity = info.entity as T;
		const field = info.field;
		const newValue = info.value;

		const result = this.validationUtils.createSuccessObject();
		if (!entity) {
			return result;
		}

		const referencedLines = this.dataService.getTheSameGroupQto(entity);
		if (referencedLines && referencedLines.length) {
			_.forEach(referencedLines, function (item) {
				_.set(item, field, info.value);
				if (field === 'BilHeaderFk') {
					item.PerformedFromBil = entity.PerformedFromBil;
					item.PerformedToBil = entity.PerformedToBil;
					item.ProgressInvoiceNo = entity.ProgressInvoiceNo;

					if (!_.isNull(newValue) && !_.isUndefined(newValue)) {
						item.OrdHeaderFk = entity.OrdHeaderFk;
						item.BillToFk = entity.BillToFk;
					}
				} else if (field === 'WipHeaderFk') {
					item.PerformedFromWip = entity.PerformedFromWip;
					item.PerformedToWip = entity.PerformedToWip;

					if (!_.isNull(newValue) && !_.isUndefined(newValue)) {
						item.OrdHeaderFk = entity.OrdHeaderFk;
						item.BillToFk = entity.BillToFk;
					}
				} else if (field === 'BillToFk') {
					item.OrdHeaderFk = entity.OrdHeaderFk;
				} else if (field === 'OrdHeaderFk') {
					item.BillToFk = entity.BillToFk;
				} else if (field === 'IsReadonly') {
					item.IsReadonly = newValue as boolean;
				}
			});
			this.dataService.setModified(referencedLines);
		}

		this.dataService.updateQtoDetailGroupInfo();

		const newReferencedLines = this.dataService.getTheSameGroupQto(entity);
		if (referencedLines.length !== newReferencedLines.length) {
			//TODO: missing => service.validateNewGroup(newReferencedLines);
			//service.validateNewGroup(newReferencedLines);
		}

		return result;
	}

	private syncSplitMultiLineQtoDetailProperty(info: ValidationInfo<T>): ValidationResult {
		const result = this.validationUtils.createSuccessObject();

		const entity = info.entity as T;
		// TODO: Temporarily commenting out to resolve eslint the error because it never used.
		// const field = info.field;
		// let newValue = info.value;

		this.syncMultiLineQtoDetailProperty(info);

		if (this.dataService.boqType === QtoShareBoqType.QtoBoq && (entity.IsSplitted || (entity.QtoDetailSplitFromFk && entity.QtoDetailSplitFromFk > 0))) {
			const qtoList = this.dataService.getList();
			let releatedEntity: T | undefined;

			if (entity.IsSplitted && !entity.QtoDetailSplitFromFk) {
				releatedEntity = _.find(qtoList, { QtoDetailSplitFromFk: entity.Id }) as T;
			} else if (!entity.IsSplitted && entity.QtoDetailSplitFromFk) {
				releatedEntity = _.find(qtoList, { Id: entity.QtoDetailSplitFromFk }) as T;
			}

			const isIQBQInfoEmpty = !entity.IsIQ && !entity.IsBQ && !entity.WipHeaderFk && !entity.BilHeaderFk && releatedEntity && !releatedEntity.IsIQ && !releatedEntity.IsBQ && !releatedEntity.WipHeaderFk && !releatedEntity.BilHeaderFk;
			const isIQBQInfoReadonly = entity.SplitItemIQReadOnly || entity.SplitItemBQReadOnly || (releatedEntity && (releatedEntity.SplitItemIQReadOnly || releatedEntity.SplitItemBQReadOnly));

			const entityGroup = this.dataService.getTheSameGroupQto(entity);
			const releatedEntityGroup = this.dataService.getTheSameGroupQto(releatedEntity as T);

			if (isIQBQInfoEmpty) {
				const readonly = false;
				const allList = entityGroup.concat(releatedEntityGroup);

				_.forEach(allList, (item) => {
					item.SplitItemIQReadOnly = readonly;
					item.SplitItemBQReadOnly = readonly;

					this.dataService.updateReadOnly(item, ['IsBQ', 'BilHeaderFk', 'IsIQ', 'WipHeaderFk'], readonly);
				});

				// dataService.gridRefresh();
			} else if (!isIQBQInfoReadonly) {
				const IQReadonly = entity.IsBQ || !!entity.BilHeaderFk;

				const updateReadOnlyStatus = (item: T, readonly: boolean) => {
					item.SplitItemIQReadOnly = readonly;
					item.SplitItemBQReadOnly = !readonly;

					this.dataService.updateReadOnly(item, ['IsBQ', 'BilHeaderFk'], !readonly);
					this.dataService.updateReadOnly(item, ['IsIQ', 'WipHeaderFk'], readonly);
				};

				_.forEach(entityGroup, function (item) {
					updateReadOnlyStatus(item, IQReadonly);
				});

				_.forEach(releatedEntityGroup, function (item) {
					updateReadOnlyStatus(item, !IQReadonly);
				});

				//dataService.gridRefresh();
			}
		}

		return result;
	}

	//TODO: missing => service.validateNewGroup
}
