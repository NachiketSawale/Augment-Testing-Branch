/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateMainLineItemQuantityProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * estimateMainLineItemQuantityProcessor is the service to set LineItem Quantity readonly.
	 *
	 */
	angular.module('estimate.main').factory('estimateMainLineItemQuantityProcessor', ['platformRuntimeDataService', 'basicsCustomizeQuantityTypeLookupDataService',
		function (platformRuntimeDataService, basicsCustomizeQuantityTypeLookupDataService) {

			let service = {},
				lookupData = [];
			let quantityTypes = {
				FQ : 6
			};

			let getFields = function getFields(flag, item){
				let columns = [
					{field: 'Quantity', readonly: item.QuantityTypeFk === quantityTypes.FQ ? true :  flag},
					{field: 'QuantityTypeFk', readonly: item.QuantityTypeFk === quantityTypes.FQ ? true :  flag},
					{field: 'Date', readonly: item.QuantityTypeFk === quantityTypes.FQ ? true :  flag},
					{field: 'BoqItemFk', readonly: true},
					{field: 'PsdActivityFk', readonly: true}
				];

				if(item.QuantityTypeFk === quantityTypes.FQ){
					columns.push({field: 'MdlModelFk', readonly: true});
					columns.push({field: 'Comment', readonly: true});
				}

				return columns;
			};

			service.processItem = function processItem(item) {
				function setReadOnly(){
					let lookupItem = _.find(lookupData, {Id : item.QuantityTypeFk});
					if (lookupItem) {
						let fields = getFields(!lookupItem.Iseditable, item);
						if (fields.length > 0) {
							platformRuntimeDataService.readonly(item, fields);
						}
					}
				}
				if(lookupData && lookupData.length){
					setReadOnly();
				}else{
					basicsCustomizeQuantityTypeLookupDataService.getList({disableDataCaching : false}).then(function(data){
						lookupData = data;
						setReadOnly();
					});
				}
			};

			return service;
		}]);
})(angular);
