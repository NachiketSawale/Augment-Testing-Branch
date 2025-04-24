/**
 * Created by dwaldrop on 06/11/2018
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionsystemMainCommonCalculationService
	 * @function
	 * @description
	 * constructionsystemMainCommonCalculationService is the data service for estimate resource related common functionality.
	 */
	angular.module(moduleName).factory('constructionsystemMainCommonCalculationService',
		['$injector', '$translate', 'estimateMainCommonService',
			'constructionsystemMainLineItemService', 'cloudCommonGridService', 'PlatformMessenger',
			function ($injector, $translate, estimateMainCommonService,
				constructionsystemMainLineItemService, cloudCommonGridService, PlatformMessenger) {
				var service = {},
					resList = [],
					parentLineItem = {},
					lineItemList = [],
					selectedResourceItem = {},
					// eslint-disable-next-line no-unused-vars
					projectInfo = {};

				service.resourceItemModified = new PlatformMessenger();
				service.refreshData = new PlatformMessenger();
				service.getList = new PlatformMessenger();

				service.setInfo = function setInfo(info){
					resList = info.resList;
					parentLineItem = info.parentLineItem;
					lineItemList = info.lineItemList;
					projectInfo = info.projectInfo;
					selectedResourceItem = info.selectedResourceItem;
				};

				function markChildrenAsModified(parent) {
					var children = [];
					children = cloudCommonGridService.getAllChildren(parent, 'EstResources');
					if (children && children.length > 0) {
						angular.forEach(children, function (res) {
							service.resourceItemModified.fire(res);
						});
					}
				}

				// todo: pending test if isPrjUpdate is required or remove it
				service.markResourceAsModified = function markResourceAsModified(isPrjUpdate, res) {
					if (res.EstResourceFk > 0) {
					// get parent item and mark as modified
						var rootParent = cloudCommonGridService.getRootParentItem(res, resList, 'EstResourceFk');
						if (rootParent) {
							service.resourceItemModified.fire(res);
							markChildrenAsModified(rootParent);
						}
					}else{
						service.resourceItemModified.fire(res);
						if(res.HasChildren && res.EstResources && res.EstResources.length > 0){
						// get all children and mark as modified
							markChildrenAsModified(res);
						}
					}
				};

				// calculation for Resources
				service.calculateResources = function calculateResources(arg){
					estimateMainCommonService.estimateResources(arg, resList, parentLineItem, lineItemList, null);
					constructionsystemMainLineItemService.markItemAsModified(parentLineItem);
					service.markResourceAsModified(false, selectedResourceItem);
					service.refreshData.fire(parentLineItem);
				};

				// calculation for Line Items
				service.calculateLineItems = function calculateLineItems(lineItem){
					resList = service.getList.fire();
					// estimateMainCommonService.estimateLineItems(null, lineItem, lineItemList, resList);
					constructionsystemMainLineItemService.markItemAsModified(lineItem);
					if (lineItem.Id && lineItem.EstLineItemFk === null && resList && resList.length > 0) {
						angular.forEach(resList, function (res) {
							service.markResourceAsModified(false, res);
						});
					}else{
						lineItem.EstResources = [];
					}
					var calcData = {
						EntitiesCount : 1,
						MainItemId : lineItem.Id,
						EstLineItem : lineItem,
						EstResourceToSave: resList
					};
					constructionsystemMainLineItemService.handleOnCalculationUpdate(calcData);
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
					var culture = $injector.get('platformContextService').culture();
					var cultureInfo = $injector.get('platformLanguageService').getLanguageInfo(culture);
					var isMapCulture = true;
					if(cultureInfo && cultureInfo.numeric) {
						var numberDecimal = cultureInfo.numeric.decimal;
						// eslint-disable-next-line no-unused-vars
						var numberThousand = cultureInfo.numeric.thousand;
						var inverseNumberDecimal = numberDecimal === ',' ? '.' : ',';
						if (typeof value === 'string' && value.indexOf(numberDecimal) !== -1 && value.indexOf(inverseNumberDecimal) !== -1) {
							isMapCulture = false;
						} else if (typeof value === 'string' && value.indexOf(numberDecimal) === -1 && value.indexOf(inverseNumberDecimal) !== -1) {
							isMapCulture = false;
						}
					}

					return isMapCulture;
				};

				service.calcuateValueByCulture = function getValueByCulture(value) {
					var result =value;
					var culture = $injector.get('platformContextService').culture();
					var cultureInfo = $injector.get('platformLanguageService').getLanguageInfo(culture);
					if(cultureInfo && cultureInfo.numeric) {
						var numberDecimal = cultureInfo.numeric.decimal;
						var inverseNumberDecimal = numberDecimal === ',' ? '.' : ',';
						if (typeof value === 'string' && value.indexOf(numberDecimal) === -1 && value.indexOf(inverseNumberDecimal) !== -1)
						{
							result = value.replace('.',',');
						}
					}
					return result;
				};

				service.mapCultureValidation = function mapCultureValidation(entity, value, field, validationService, dataService){
					var isMapCulture = service.getIsMapCulture(value);
					var result = {apply: true, valid: true};
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
