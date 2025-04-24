/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (ng) {
	'use strict';

	ng.module('controlling.projectcontrols').factory('controllingProjectcontrolsDashboardCommonService', [
		'_',
		'platformContextService',
		'platformLanguageService',
		function (_, platformContextService, platformLanguageService) {
			let _culture = platformContextService.culture();
			let _cultureInfo = platformLanguageService.getLanguageInfo(_culture);
			let _groupingStructureFieldMapping = {
				REL_CO: 'MdcControllingunitFk',
				REL_ACTIVITY: 'PsdActivityFk',
				REL_COSTCODE: 'MdcCostCodeFk',
				REL_COSTCODE_CO: 'MdcContrCostCodeFk',
				REL_BOQ: 'BoqItemFk',
				REL_PACKAGE: 'PrcPackageFk'
			};

			function checkValueByCulture(value){
				if(!_.isNumber(value) && (!_.isString(value) || value === '')){
					return {
						value: 0,
						valueDetail: '0'
					};
				}

				let result = {
					value: value,
					valueDetail: value
				};

				if (_cultureInfo && _cultureInfo.numeric) {
					let numberDecimal = _cultureInfo.numeric.decimal;

					if (_.isNumber(value)){
						value = _.toString(value);
					}

					if (_.isString(value)) {
						if (value.indexOf(numberDecimal) !== -1) {
							result.value = value.replace(numberDecimal, '.');
						}

						let inverseNumberDecimal = numberDecimal === ',' ? '.' : ',';
						if (value.indexOf(numberDecimal) === -1 && value.indexOf(inverseNumberDecimal) !== -1) {
							result.valueDetail = value.replace('.', ',');
						}
					}
				}

				return result;
			}

			function getGroupingStructureField(GroupColumnId){
				return _groupingStructureFieldMapping[GroupColumnId];
			}

			function getGroupingStructureFieldMapping() {
				return _groupingStructureFieldMapping;
			}

			return {
				checkValueByCulture: checkValueByCulture,
				getGroupingStructureFieldMapping: getGroupingStructureFieldMapping,
				getGroupingStructureField: getGroupingStructureField
			};
		}
	]);

})(angular);
