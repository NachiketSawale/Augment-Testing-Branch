/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainCommonCalculationService
	 * @function
	 * @description
	 * estimateMainCommonCalculationService is the data service for estimate resource related common functionality.
	 */
	angular.module(moduleName).factory('estimateMainCommonCalculationService', ['$injector', '$translate', 'estimateMainCommonService', 'estimateMainService', 'cloudCommonGridService', 'PlatformMessenger','estimateRuleParameterConstant',
		function ($injector, $translate, estimateMainCommonService, estimateMainService, cloudCommonGridService, PlatformMessenger,estimateRuleParameterConstant) {
			let service = {},
				resList = [];

			service.resourceItemModified = new PlatformMessenger();
			service.refreshData = new PlatformMessenger();
			service.getList = new PlatformMessenger();

			service.setInfo = function setInfo(info){
				resList = info.resList;
			};

			function markChildrenAsModified(parent) {
				let children = [];
				children = cloudCommonGridService.getAllChildren(parent, 'EstResources');
				if (children && children.length > 0) {
					angular.forEach(children, function (res) {
						service.resourceItemModified.fire(res);
					});
				}
			}

			// todo: pending test if isPrjUpdate is required or remove it
			service.markResourceAsModified = function markResourceAsModified(isPrjUpdate, res, resources) {
				let resourceList = resources || resList;
				if (res.EstResourceFk > 0) {
					// get parent item and mark as modified
					let rootParent = cloudCommonGridService.getRootParentItem(res, resourceList, 'EstResourceFk');
					if (rootParent) {
						service.resourceItemModified.fire(rootParent);
						markChildrenAsModified(rootParent);
					}else{
						service.resourceItemModified.fire(res);
					}
				}else{
					service.resourceItemModified.fire(res);
					if(res.HasChildren && res.EstResources && res.EstResources.length > 0){
						// get all children and mark as modified
						markChildrenAsModified(res);
					}
				}
			};

			service.markResAsModified = function markResAsModified(resources) {
				if(_.isArray(resources) && resources.length > 0){
					_.forEach(resources, function(res){
						service.resourceItemModified.fire(res);
					});
				}
			};

			// calculation for Resources and line items
			service.calcResNLineItem = function calcResNLineItem(resources, lineItem, isRef){
				// recalculate the lineitem
				estimateMainCommonService.calculateLineItemAndResources(lineItem, resources);

				angular.forEach(resources, function(res){
					if(!isRef){
						service.markResourceAsModified(false, res);
					}
				});
			};

			service.getIsMapCulture = function getIsMapCulture(value){
				let culture = $injector.get('platformContextService').culture();
				let cultureInfo = $injector.get('platformLanguageService').getLanguageInfo(culture);
				let isMapCulture = true;
				if(cultureInfo && cultureInfo.numeric) {
					let numberDecimal = cultureInfo.numeric.decimal;
					let inverseNumberDecimal = numberDecimal === ',' ? '.' : ',';
					if (typeof value === 'string' && value.indexOf(numberDecimal) !== -1 && value.indexOf(inverseNumberDecimal) !== -1) {
						isMapCulture = false;
					} else if (typeof value === 'string' && value.indexOf(numberDecimal) === -1 && value.indexOf(inverseNumberDecimal) !== -1) {
						isMapCulture = false;
					}
				}

				return isMapCulture;
			};

			service.calcuateValueByCulture = function getValueByCulture(value) {
				let result =value;
				let culture = $injector.get('platformContextService').culture();
				let cultureInfo = $injector.get('platformLanguageService').getLanguageInfo(culture);
				if(cultureInfo && cultureInfo.numeric) {
					let numberDecimal = cultureInfo.numeric.decimal;
					let inverseNumberDecimal = numberDecimal === ',' ? '.' : ',';
					if (typeof value === 'string' && value.indexOf(numberDecimal) === -1 && value.indexOf(inverseNumberDecimal) !== -1) {
						result = value.replace(inverseNumberDecimal, numberDecimal);
					}
				}
				return result;
			};

			service.resetParameterDetailValueByCulture = function resetParameterDetailValueByCulture(params, fieldName) {
				fieldName = fieldName || 'ValueDetail';
				if (params && params.length > 0) {
					params.map((p) => {
						if (Object.prototype.hasOwnProperty.call(p, fieldName)) {
							p[fieldName] = service.calcuateValueByCulture(p[fieldName]);
						}
					});
				}
			}

			service.mapCultureValidation = function mapCultureValidation(entity, value, field, validationService, dataService, filterComment){

				let checkVal = value;
				if (typeof checkVal === 'number') {
					checkVal = checkVal.toString();
				}

				if(typeof checkVal === 'string' && filterComment){
					checkVal = checkVal.replace(/'.*?'/gi, '').replace(/{.*?}/gi, '');
				}

				let isMapCulture = service.getIsMapCulture(checkVal);
				if(entity.ValueType === estimateRuleParameterConstant.Text){
					isMapCulture = true;
				}
				let result = {apply: true, valid: true};
				if (!isMapCulture) {
					result = {
						apply: true,
						valid: false,
						error: $translate.instant('cloud.common.computationFormula')
					};
				}

				return $injector.get('platformDataValidationService').finishValidation(result, entity, value, field, validationService, dataService);
			};

			return service;
		}]);
})(angular);
