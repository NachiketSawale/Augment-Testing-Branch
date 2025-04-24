/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntity, ValueType } from './estimate-main-common-features.service';

@Injectable({
	providedIn: 'root'
})

/**
 * Service providing common features for Field Changed
 */
export class EstimateMainCommonFeaturesFieldChangedService {
	/**
	 * Handles the change event for a specific field in an entity.
	 * @param {string} field - The field that has changed.
	 * @param {IEntity} entity - The entity containing the field.
	 * @returns {void} This method does not return anything.
	 */

	public fieldChanged(field: string, entity: IEntity): void {
		const readOnlyField: { field: string; readonly: boolean }[] = [];
		readOnlyField.push({ field: 'DefaultValue', readonly: true });

		switch (field) {
			case 'ValueType':
				if (entity.ValueType === ValueType.Decimal2) {
					readOnlyField.push({ field: 'IsLookup', readonly: false });

					if (entity.IsLookup) {
						readOnlyField.push({ field: 'ValueDetail', readonly: false });
					} else {
						readOnlyField.push({ field: 'EstRuleParamValueFk', readonly: true }, { field: 'ParameterValue', readonly: false }, { field: 'ValueDetail', readonly: false });
					}

					entity.ParameterText = '';
					entity.ValueText = '';
					entity.IsLookup = false;
				} else if (entity.ValueType === ValueType.TextFormula) {
					readOnlyField.push(
						{ field: 'IsLookup', readonly: true },
						{ field: 'ParameterValue', readonly: false },
						{ field: 'EstRuleParamValueFk', readonly: true },
						{ field: 'ValueText', readonly: true },
						{ field: 'ValueDetail', readonly: true }
					);
					entity.IsLookup = true;
				} else {
					readOnlyField.push({ field: 'IsLookup', readonly: true }, { field: 'ParameterValue', readonly: false }, { field: 'EstRuleParamValueFk', readonly: true }, { field: 'ValueDetail', readonly: true });
					entity.ParameterText = '';
					entity.ValueText = '';
					entity.IsLookup = false;
				}
				entity.ParameterValue = 0;
				//entity.EstRuleParamValueFk = null;
				entity.DefaultValue = 0;
				break;
			case 'IsLookup':
				if (!entity.IsLookup) {
					entity.ParameterValue = 0;
					//entity.EstRuleParamValueFk = null;
					readOnlyField.push({ field: 'EstRuleParamValueFk', readonly: true }, { field: 'ParameterValue', readonly: false }, { field: 'ValueDetail', readonly: false });
				} else {
					readOnlyField.push({ field: 'EstRuleParamValueFk', readonly: false }, { field: 'ParameterValue', readonly: true }, { field: 'ValueDetail', readonly: true });
				}
				//this.platformRuntimeDataService.readonly(entity, readOnlyField);
				break;
			case 'DefaultValue':
				// Change true and false to 1 and 0 for Boolean type
				if (typeof entity.DefaultValue === 'boolean') {
					entity.DefaultValue = entity.DefaultValue ? 1 : 0;
				}
				break;
			case 'ParameterValue':
				// Change true and false to 1 and 0 for Boolean type
				if (typeof entity.ParameterValue === 'boolean') {
					entity.ParameterValue = entity.ParameterValue ? 1 : 0;
				}
				break;
			case 'Code':
				entity.Code = entity.Code ? entity.Code.toUpperCase() : entity.Code;
				break;
			default:
				break;
		}

		//this.platformRuntimeDataService.readonly(entity, readOnlyField);
	}
}
