/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainLineitem2MdlObjectDetailService
	 * @function
	 * @requires estimateMainService
	 *
	 * @description
	 * # calculation for lineitem model object
	 *
	 */
	angular.module(moduleName).factory('estimateMainLineitem2MdlObjectDetailService', ['$q', '$injector', 'platformRuntimeDataService', 'estimateMainService', 'estimateMainLineItem2MdlObjectService',
		function ($q, $injector, platformRuntimeDataService, estimateMainService, estimateMainLineItem2MdlObjectService) {

			let service = {
				fieldChange: fieldChange,
				valueChangeCallBack:valueChangeCallBack,
				calcQuantity : calcLineItemQuantity
			};

			function updateModelObjectQuantityFromLineItem(modelObjects){

				/* get lineItem selected */
				let lineItemSelected = estimateMainService.getSelected();

				angular.forEach(modelObjects, function(item){
					item.QuantityDetail = item.Quantity = lineItemSelected.Quantity;
					estimateMainLineItem2MdlObjectService.markItemAsModified(item);
				});
			}

			function recalculate(item, field) {
				let serv = $injector.get('estimateMainLineItemDetailService');
				serv.valueChangeCallBack(item, field);
				estimateMainService.markItemAsModified(item);
			}

			function getLineItemFactor(lineItemSelected){
				return lineItemSelected.QuantityFactor1 * lineItemSelected.QuantityFactor2 * lineItemSelected.QuantityFactor3 * lineItemSelected.QuantityFactor4 * lineItemSelected.ProductivityFactor;
			}

			function calculateModelObjectQuantity(field, item, lineItemSelected, isCalcTotalWithWq){
				if(!item){
					return;
				}

				let factors = getLineItemFactor(lineItemSelected);

				if (field === 'QuantityTarget' || field === 'WqQuantityTarget') {
					if (!item.Quantity) {
						item.QuantityDetail = item.Quantity = lineItemSelected.Quantity * factors;
					}

					if(field === 'QuantityTarget') {
						item.QuantityTargetDetail = item.QuantityTarget;
					}

					if(field === 'WqQuantityTarget'){
						item.WqQuantityTargetDetail = item.WqQuantityTarget;
					}
				}

				if(item && field === 'Quantity' ){
					item.QuantityDetail = item.Quantity;
				}

				item.QuantityTotal = (isCalcTotalWithWq ? item.WqQuantityTarget : item.QuantityTarget) * item.Quantity * factors;
			}

			function calculateQuantity(field, item, realFieldName){
				let lineItemSelected = estimateMainService.getSelected();
				/* calculate and set quantity and quantity target of model object */
				let factors = getLineItemFactor(lineItemSelected);
				/* the estitem type is total for wq */
				let isCalcTotalWithWq =$injector.get('estimateMainService').getEstTypeIsTotalWq();

				calculateModelObjectQuantity(field, item, lineItemSelected, isCalcTotalWithWq);

				/* calculate the quantityTargetTotal and quantityTotal of modelObjectList */
				let quantityTotal = 0;
				let wqQuantityTargetTotal = 0;
				let aqQuantityTargetTotal = 0;

				let mdlobjectList = estimateMainLineItem2MdlObjectService.getList();
				_.each(mdlobjectList, function (item) {
					wqQuantityTargetTotal += (item.WqQuantityTarget && angular.isNumber(item.WqQuantityTarget) ? item.WqQuantityTarget : 0);
					aqQuantityTargetTotal += (item.QuantityTarget && angular.isNumber(item.QuantityTarget) ? item.QuantityTarget : 0);
					quantityTotal += ((isCalcTotalWithWq ? (item.WqQuantityTarget === undefined ? 0: item.WqQuantityTarget) : (item.QuantityTarget === undefined ? 0: item.QuantityTarget)) * item.Quantity * factors);

				});
				if(mdlobjectList.length < 1)
				{
					quantityTotal = 1;
					wqQuantityTargetTotal = 1;
					aqQuantityTargetTotal = 1;
				}
				/* calculate quantityTarget and quantity of lineItem */
				lineItemSelected.WqQuantityTargetDetail = lineItemSelected.WqQuantityTarget = wqQuantityTargetTotal;
				lineItemSelected.QuantityTargetDetail = lineItemSelected.QuantityTarget = aqQuantityTargetTotal;

				let quantityTarget = isCalcTotalWithWq ? lineItemSelected.WqQuantityTarget : lineItemSelected.QuantityTarget;

				let factor = quantityTarget * factors;
				if (factor !== 0) {
					lineItemSelected.QuantityDetail = lineItemSelected.Quantity = quantityTotal / factor;
				}

				lineItemSelected.HasSplitQuantities = mdlobjectList && (mdlobjectList.length > 0);

				if(!item.WqQuantityTarget && !item.QuantityTarget)
				{
					setLinqItemQuantityTargetReadonly(lineItemSelected, null);
				}
				else
				{
					setLinqItemQuantityTargetReadonly(lineItemSelected, lineItemSelected.HasSplitQuantities);
				}



				/* recalculate lineItem */
				recalculate(lineItemSelected, realFieldName);
			}

			function setLinqItemQuantityTargetReadonly(lineItem, readonly){
				let fields = [];
				fields.push({field: 'QuantityTarget', readonly: readonly});
				fields.push({field: 'QuantityTargetDetail', readonly: readonly});
				fields.push({field: 'WqQuantityTarget', readonly: readonly});
				fields.push({field: 'WqQuantityTargetDetail', readonly: readonly});
				platformRuntimeDataService.readonly(lineItem, fields);
			}

			let quantityToDetailMapping = {
					Quantity: 'QuantityDetail',
					QuantityTarget: 'QuantityTargetDetail',
					WqQuantityTarget: 'WqQuantityTargetDetail'
				},
				quantityDetailToQuantityMapping = _.invert(quantityToDetailMapping);

			function fieldChange(item, field) {
				let realFieldName = field;

				if (item && item.Id && field) {
					// eslint-disable-next-line no-prototype-builtins
					if (quantityDetailToQuantityMapping.hasOwnProperty(field)) {
						realFieldName = quantityDetailToQuantityMapping[field];
					}
				}

				calculateQuantity(field, item, realFieldName);
			}

			function valueChangeCallBack (item, field){
				fieldChange(item, field);
				return $q.when();
			}

			function calcLineItemQuantity (items, field, dataServiceName){
				if(dataServiceName === 'estimateMainService'){
					updateModelObjectQuantityFromLineItem(items, field);
				}

				if(dataServiceName === 'estimateMainLineItem2MdlObjectService'){
					angular.forEach(items, function(item){
						fieldChange(item, field);
					});
				}

				return $q.when();
			}
			return service;
		}]);

})();
