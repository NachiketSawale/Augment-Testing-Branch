/*
 * $Id: platform-grid-filter-service.js $
 * Copyright (c) RIB Software GmbH
 */
(function ($) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platformGrid:platformGridFilterService
	 * @function
	 * @requires
	 * @description
	 * platformGridFilterService provides filter service for Grid
	 */
	angular.module('platform').factory('platformGridFilterService', platformGridFilterService);

	platformGridFilterService.$inject = ['$http', 'platformDomainService', 'platformContextService', 'platformLanguageService', '$translate', 'moment', 'accounting', '$sanitize'];

	function platformGridFilterService($http, platformDomainService, platformContextService, platformLanguageService, $translate, moment, accounting, $sanitize) { // jshint ignore:line

		let service = {};
		let culture = platformContextService.culture();
		let cultureInfo = platformLanguageService.getLanguageInfo(culture);

		const numericDomainTypes = ['quantity', 'numeric', 'factor', 'exchangerate', 'percent', 'integer', 'decimal', 'money'];
		let operators = {};

		platformContextService.contextChanged.register(function (type) {
			if (type === 'culture') {
				culture = platformContextService.culture();
				cultureInfo = platformLanguageService.getLanguageInfo(culture);
			}
		});

		service.initFilterService = function initFilterService($scope) {
			$http.get(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/allOperators').then(function processOperatorData(response) {
				operators = response.data.reduce(function (result, item) {
					result[item.StringId.replace(/\!/, 'not')] = item;
					return result;
				}, {});
			});
			if (!$scope.options) {
				var boolOptions = {
					displayMember: 'description',
					valueMember: 'Id',
					items: [
						{Id: '', description: $translate.instant('cloud.common.Filter_RuleOperator_And_TXT')},
						{Id: 'true', description: $translate.instant('cloud.common.FilterUi_checked')},
						{Id: 'false', description: $translate.instant('cloud.common.FilterUi_unchecked')}
					],
					popupOptions: {
						hasDefaultWidth: false
					}
				};
				$scope.options = boolOptions;
			}
		};

		service.formatFilter = formatFilter;

		function formatFilter(domain, dataModel) {
			var domainInfo = platformDomainService.loadDomain(domain);
			if (domainInfo && domainInfo.datatype) {
				switch (domainInfo.datatype) {
					case 'bool':
						return $('<div data-domain-control data-options="options" data-change="onFilterChanged()" data-model="' + dataModel + '" data-domain="select" data-grid="true"></div>');
					default:
						return $('<div data-domain-control data-model="' + dataModel + '" data-domain="text" data-grid="true"></div>');
				}
			} else {
				return $('<div data-domain-control data-model="' + dataModel + '" data-domain="text" data-grid="true"></div>');
			}
		}

		// //Takes string and converts it to an object of arrays containing distinct AND + OR values separately.
		service.parseQuery = function parseQuery(str, field) {
			// '<' value1 'and' '>' value2 (example input)

			// filters: [{field: 'field', operator: '<', value: 'value1', logic:''},
			//   {field: 'field', operator: '>', value: 'value2', logic: 'and'}] (example output)

			var checkForOp = true;
			var filters = []; // Used to store all of the parsed filters.
			var fIndex = 0; // Used to track filter index.
			var ss = str.split(/(')/g);

			filters.push({
				field: field,
				operator: '',
				value: '',
				logic: ''
			});

			for (var i = 0; i < ss.length; i++) {
				ss[i] = ss[i].trim();

				if (ss[i].trim() === '') {
					continue;
				}

				if (checkForOp) {
					var op = '=';
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
						var logic = ss[i + 1].toLowerCase();
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

		};

		service.filter = function filter(val, filters, domainType) {
			var result;
			if (domainType === 'boolean') {
				if (val === JSON.parse(filters)) {
					result = true;
				} else {
					result = false;
				}
			} else if (filters) {
				for (var i = 0; i < filters.length; i++) {
					if (i === 0) {
						result = testCondition(val, filters[i].value, filters[i].operator, domainType, filters[i].field);
					} else {
						var nextResult = testCondition(val, filters[i].value, filters[i].operator, domainType, filters[i].field);
						if (filters[i].logic !== '') {
							result = testCondition(result, nextResult, filters[i].logic, filters[i].field);
						}
					}
				}
			}

			return result;
		};

		service.formatFilterInput = function formatFilterInput(text) {
			//Fix for defect 132845 - Grid Search Field XSS Attack- let the browser remove html tags
			let tmp = document.createElement('DIV');
			tmp.innerHTML = $sanitize(text);
			text = tmp.textContent || tmp.innerText || '';

			if (/'and'/i.test(text)) {
				text = text.replaceAll(new RegExp(/'and'/, 'ig'), '<span style="color:red;">AND</span>');
			}
			if (/'or'/i.test(text)) {
				text = text.replaceAll(new RegExp(/'or'/, 'ig'), '<span style="color:red;">OR</span>');
			}
			if (/'>'/i.test(text)) {
				text = text.replaceAll(new RegExp(/'>'/, 'ig'), '<span style="color:red;">></span>');
			}
			if (/'>='/i.test(text)) {
				text = text.replaceAll(new RegExp(/'>='/, 'ig'), '<span style="color:red;">>=</span>');
			}
			if (/'<'/i.test(text)) {
				text = text.replaceAll(new RegExp(/'<'/, 'ig'), '<span style="color:red;"><</span>');
			}
			if (/'<='/i.test(text)) {
				text = text.replaceAll(new RegExp(/'<='/, 'ig'), '<span style="color:red;"><=</span>');
			}
			if (/'empty'/i.test(text)) {
				text = text.replaceAll(new RegExp(/'empty'/, 'ig'), '<span style="color:red;">EMPTY</span>');
			}
			if (/'non-empty'/i.test(text)) {
				text = text.replaceAll(new RegExp(/'non-empty'/, 'ig'), '<span style="color:red;">NON-EMPTY</span>');
			}
			if (/'not'/i.test(text)) {
				text = text.replaceAll(new RegExp(/'not'/, 'ig'), '<span style="color:red;">NOT</span>');
			}
			return $sanitize(text);
		};

		function matchRuleShort(str, rule) {
			const escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1').replace(/(\r\n|\n|\r)/gm, '');

			return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$', 'i').test(str);
		}

		function isEqual(domainType, value1, value2) {
			if (domainType === 'boolean') {
				return value1 === JSON.parse(value2);
			} else if ((domainType === 'history' || domainType === 'dateutc' || domainType === 'datetimeutc' || domainType === 'date' || domainType === 'datetime') && moment.isMoment(value1)) {
				return value2.isSame(value1, 'day');
			} else if (value1 && _.isString(value2)) {
				return matchRuleShort(value1.toString(), value2);
			} else {
				return value1 === value2;
			}
		}

		function testCondition(value1, value2, op, domainType, field) {

			if (value1 && value1.trim) {
				value1 = value1.trim();
			}

			if (value2 && value2.trim) {
				value2 = value2.trim();
			}

			if (_.includes(numericDomainTypes, domainType)) {
				var value1Numeric = accounting.unformat(value1, cultureInfo.numeric.decimal);
				var value2Numeric = accounting.unformat(value2, cultureInfo.numeric.decimal);

				if (!isNaN(value2Numeric) && !isNaN(value1Numeric)) {
					value1 = Number(value1Numeric);
					value2 = Number(value2Numeric);
				}
			}

			if (op) {
				op = op.toLowerCase();
			}

			if (domainType === 'history' && (!field.includes('insertedBy') && !field.includes('updatedBy'))) {
				var format = moment.localeData().longDateFormat('L') + '|' + moment.localeData().longDateFormat('LTS');
				value1 = moment(value1, format);
				value2 = moment(value2, format);
			}

			if (moment.isMoment(value1)) {
				if (domainType === 'datetimeutc' || domainType === 'datetime') {
					value2 = moment.utc(value2, moment.localeData().longDateFormat('L') + ' ' + moment.localeData().longDateFormat('LT'));
					// value1 = moment(value1.format(moment.localeData().longDateFormat('L') + ' ' + moment.localeData().longDateFormat('LT')));
				} else if (domainType === 'dateutc' || domainType === 'date') {
					value2 = moment.utc(value2, moment.localeData().longDateFormat('L'));
					// value1 = moment(value1.format(moment.localeData().longDateFormat('L')));
				}
			}

			switch (op) {
				case operators.isempty.Symbol:
					if (value1) {
						return false;
					} else {
						return true;
					}
				case operators.isnotempty.Symbol:
					if (!value1) {
						return false;
					} else {
						return true;
					}
				case operators.eq.Symbol:
					return isEqual(domainType, value1, value2);
				case operators.gt.Symbol:
					if ((domainType === 'history' || domainType === 'dateutc' || domainType === 'datetimeutc' || domainType === 'date' || domainType === 'datetime') && moment.isMoment(value1)) {
						return value1.isAfter(value2);
					} else {
						return value1 > value2;
					}
				case operators.lt.Symbol:
					if ((domainType === 'history' || domainType === 'dateutc' || domainType === 'datetimeutc' || domainType === 'date' || domainType === 'datetime') && moment.isMoment(value1)) {
						return value1.isBefore(value2);
					} else {
						return value1 < value2;
					}
				case operators.gte.Symbol:
					if ((domainType === 'history' || domainType === 'dateutc' || domainType === 'datetimeutc' || domainType === 'date' || domainType === 'datetime') && moment.isMoment(value1)) {
						return value1.isSameOrAfter(value2);
					} else {
						return value1 >= value2;
					}
				case operators.lte.Symbol:
					if ((domainType === 'history' || domainType === 'dateutc' || domainType === 'datetimeutc' || domainType === 'date' || domainType === 'datetime') && moment.isMoment(value1)) {
						return value1.isSameOrBefore(value2);
					} else {
						return value1 <= value2;
					}
				case operators.and.Symbol:
					return value1 && value2;
				case operators.or.Symbol:
					return value1 || value2;
				case operators.noteq.Symbol:
					return !isEqual(domainType, value1, value2);
				default:
					return true;
			}
		}

		service.testCondition = testCondition;

		return service;
	}
})(jQuery);
