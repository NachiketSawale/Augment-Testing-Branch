/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { IRuleOperatorInfo } from '../model/representation/rule-operator-info.interface';
import { IRuleDataTypeInfo } from '../model/representation/rule-data-type-info.interface';
import { IEnvExprInfo } from '../model/representation/env-expr-info.interface';
import { ExprOperator } from '../model/data/expr-operator.class';
import { RuleOperand } from '../model/data/rule-operand.class';
import { cloneDeep } from 'lodash';
import { map } from 'rxjs/operators';
import { IEntityField } from '../model/representation/entity-field.interface';
import { PlatformConfigurationService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class RuleEditorManagerService {

	private expressionOperators: Map<string, ExprOperator[]> = new Map();
	private dataTypesByUiType: Map<string, IRuleDataTypeInfo> = new Map();
	private groupOperators: ExprOperator[] = [];
	private environmentExpressionsInfo: IEnvExprInfo[] = [];
	private allDataTypes: IRuleDataTypeInfo[] = [];
	private dataLoaded: boolean = false;

	private allOperatorPath = 'basics/common/bulkexpr/schema/allOperators';
	private allDataTypesPath = 'basics/common/bulkexpr/schema/alldatatypes';
	private allEnvExpressionsPath = 'basics/common/bulkexpr/schema/allenvexprs';

	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);

	private createOperandsForOperator(operatorInfo: IRuleOperatorInfo, uiType: string) {
		const operands: RuleOperand[] = [];
		if(operatorInfo.Parameters) {
			operatorInfo.Parameters.forEach(parameter => {
				operands.push(new RuleOperand(uiType, parameter));
			});
		}
		return operands;
	}

	public loadData() {
		if(this.dataLoaded) {
			return new Observable<void>();
		}
		const allOperators$ = this.http.get<IRuleOperatorInfo[]>(this.configService.webApiBaseUrl + this.allOperatorPath);
		const allDataTypes$ = this.http.get<IRuleDataTypeInfo[]>(this.configService.webApiBaseUrl + this.allDataTypesPath);
		const allEnvExpr$ = this.http.get<IEnvExprInfo[]>(this.configService.webApiBaseUrl + this.allEnvExpressionsPath);

		return forkJoin([allOperators$, allDataTypes$, allEnvExpr$]).pipe(
			map(([allOperators, allDataTypes, allEnvExpr]) => {
				const typedOperators = allOperators as IRuleOperatorInfo[];
				const typedDataTypes = allDataTypes as IRuleDataTypeInfo[];
				this.environmentExpressionsInfo = allEnvExpr as IEnvExprInfo[];

				console.log('environment expressions', this.environmentExpressionsInfo);
				console.log('typed operators', typedOperators);
				console.log('typed data types', typedDataTypes);

				this.processOperatorsResponse(typedOperators);
				this.processDataTypesResponse(typedDataTypes);

				this.dataLoaded = true;
			})
		);
	}

	private processDataTypesResponse(typedDataTypes: IRuleDataTypeInfo[]) {
		typedDataTypes.forEach(dataType => {
			dataType.UiTypes.forEach(uiType => {
				this.dataTypesByUiType.set(uiType, dataType);
			});
		});
	}

	private processOperatorsResponse(typedOperators: IRuleOperatorInfo[]) {
		typedOperators.forEach(operatorInfo => {
			const operator = new ExprOperator(operatorInfo);
			if (operator.uiTypes) {
				operator.uiTypes.forEach(uiType => {
					if (!this.expressionOperators.get(uiType)) {
						this.expressionOperators.set(uiType, []);
					}
					const operands: RuleOperand[] = this.createOperandsForOperator(operatorInfo, uiType);
					const operatorCopy = cloneDeep(operator);
					operatorCopy.setOperands(operands);
					this.expressionOperators.get(uiType)?.push(operatorCopy);
				});
			} else {
				this.groupOperators.push(operator);
			}
		});
	}

	public getAvailableExpressionOperators(uiType: string) {
		return cloneDeep(this.expressionOperators.get(uiType) ?? []);
	}

	public getGroupOperators() {
		return this.groupOperators;
	}


	public getGroupOperatorById(operatorId: number) {
		return cloneDeep(this.groupOperators.find(operator => operator.internalId === operatorId));
	}

	public getEnvironmentExpressions(uiType: string) {
		return this.environmentExpressionsInfo.filter(exp => exp.UiTypeId === uiType);
	}

	public getDataTypeOfField(entityField: IEntityField) {
		return this.dataTypesByUiType.get(entityField.UiTypeId);
	}

}
