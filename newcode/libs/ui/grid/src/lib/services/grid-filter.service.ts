/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { FieldType, isDateFieldType, isNumericFieldType } from '@libs/ui/common';
import { unformat } from 'accounting';
import { IGridColumnFilterLogic } from '../models/grid-column-filter.interface';
import * as dayjs from 'dayjs';

/***
 * Service for filter functions in the grid
 */
export class GridFilterService {

	private configurationService = inject(PlatformConfigurationService);
	private currentUILanguage = this.configurationService.savedOrDefaultUiLanguage;
	private currentCulture = this.configurationService.savedOrDefaultUiCulture;

	public constructor() {
		this.configurationService.contextChangeEmitter.subscribe(() => {
			this.currentUILanguage = this.configurationService.savedOrDefaultUiLanguage;
			this.currentCulture = this.configurationService.savedOrDefaultUiCulture;
		});
	}

	//Takes string and converts it to an object of arrays containing distinct AND + OR values separately.
	public parseQuery(str: string, field: string) : IGridColumnFilterLogic[]{
		// '<' value1 'and' '>' value2 (example input)

		// filters: [{field: 'field', operator: '<', value: 'value1', logic:''},
		//   {field: 'field', operator: '>', value: 'value2', logic: 'and'}] (example output)

		let checkForOp = true;
		const filters = []; // Used to store all of the parsed filters.
		let fIndex = 0; // Used to track filter index.
		const ss = str.split(/(')/g);

		filters.push({
			field: field,
			operator: '',
			value: '',
			logic: ''
		});

		for (let i = 0; i < ss.length; i++) {
			ss[i] = ss[i].trim();

			if (ss[i].trim() === '') {
				continue;
			}

			if (checkForOp) {
				let op = '=';
				if (ss[i] === ('\'') && ss[i + 2] === ('\'')) { // this indicates an operator
					op = ss[i + 1].toLowerCase();
					filters[fIndex].operator = op;
					i = i + 2;
				} else {
					filters[fIndex].operator = op;
					filters[fIndex].value = ss[i];
				}
				checkForOp = false;
			} else {
				if (ss[i] === ('\'') && ss[i + 2] === ('\'')) { // this indicates a logic
					fIndex++; // We added an object to the array, so increment the counter.
					const logic = ss[i + 1].toLowerCase();
					filters.push({
						field: field,
						operator: '',
						value: '',
						logic: logic
					});
					i = i + 2;
					checkForOp = true;
				} else {
					filters[fIndex].value = filters[fIndex].value.concat(' ', ss[i]);
				}
			}
		}

		return filters;
	}

	private matchRuleShort(str: string, rule: string) {
		const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1').replace(/(\r\n|\n|\r)/gm, '');

		return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$', 'i').test(str);
	}

	private isEqual(type: FieldType, value1:  object | string | number | boolean, value2:  object | string | number | boolean) {
		if (type === FieldType.Boolean) {
			return value1 === JSON.parse(value2.toString());
		} else if (isDateFieldType(type)) {
			return dayjs(value2.toString()).isSame(dayjs(value1.toString()), 'day');
		} else if (value1 && this.isString(value2)) {
			return this.matchRuleShort(value1.toString(), value2.toString());
		} else {
			return value1 === value2;
		}
	}

	private isString(value:  object | string | number | boolean) {
		return typeof value === 'string';
	}

	private testCondition(value1: object | string | number | boolean, value2: object | string | number | boolean, op: string, type: FieldType, field: string) : boolean {

		if (value1 && this.isString(value1)) {
			value1 = value1.toString().trim();
		}

		if (value2 && this.isString(value2)) {
			value2 = value2.toString().trim();
		}

		if (isNumericFieldType(type)) {
			const value1Numeric = unformat(value1.toString(), '.');
			const value2Numeric = unformat(value2.toString(), '.');

			if (!isNaN(value2Numeric) && !isNaN(value1Numeric)) {
				value1 = Number(value1Numeric);
				value2 = Number(value2Numeric);
			}
		}

		if (op) {
			op = op.toLowerCase();
		}

		switch (op) {
			case 'empty':
				if (value1) {
					return false;
				} else {
					return true;
				}
			case 'non-empty':
				if (!value1) {
					return false;
				} else {
					return true;
				}
			case '=':
				return this.isEqual(type, value1, value2);
			case '>':
				if (isDateFieldType(type)) {
					return dayjs(value2.toString()).isBefore(dayjs(value1.toString()), 'day');
				} else {
					return value1 > value2;
				}
			case '<':
				if (isDateFieldType(type)) {
					return dayjs(value2.toString()).isAfter(dayjs(value1.toString()), 'day');
				} else {
					return value1 < value2;
				}
			case '>=':
				if (isDateFieldType(type)) {
					return dayjs(value2.toString()).isSame(dayjs(value1.toString()), 'day') || dayjs(value2.toString()).isBefore(dayjs(value1.toString()), 'day');
				} else {
					return value1 >= value2;
				}
			case '<=':
				if (isDateFieldType(type)) {
					return dayjs(value2.toString()).isSame(dayjs(value1.toString()), 'day') || dayjs(value2.toString()).isAfter(dayjs(value1.toString()), 'day');
				} else {
					return value1 <= value2;
				}
			case 'and':
				if (value1 && value2) {
					return true;
				}
				return false;
			case 'or':
				if (value1 || value2) {
					return true;
				}
				return false;
			case 'not':
				return !this.isEqual(type, value1, value2);
			default:
				return true;
		}
	}

	public filter(val: string | number, filters: IGridColumnFilterLogic[], domain: FieldType) : boolean {
		let result = false;
		if (filters) {
			for (let i = 0; i < filters.length; i++) {
				if (i === 0) {
					result = this.testCondition(val, filters[i].value, filters[i].operator, domain, filters[i].field);
				} else {
					const nextResult = this.testCondition(val, filters[i].value, filters[i].operator, domain, filters[i].field);
					if (filters[i].logic !== '') {
						result = this.testCondition(result, nextResult, filters[i].logic, domain, filters[i].field);
					}
				}
			}
		}

		return result;
	}

	public filterBoolean(val: string | number, filters: string ) : boolean {
		let result = false;

		if (val === JSON.parse(filters)) {
			result = true;
		} else {
			result = false;
		}

		return result;
	}
}