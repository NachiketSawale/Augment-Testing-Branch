/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCostCodesImageProcessor
	 * @function
	 *
	 * @description
	 * The basicsCostCodesImageProcessor adds cimages as per cost codes types.
	 */

	angular.module('basics.costcodes').factory('basicsCostCodesImageProcessor', ['_','basicsCostCodesLookupService', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService',
		function (_,basicsCostCodesLookupService, basicsLookupdataLookupDescriptorService, platformRuntimeDataService) {

			let service = {};


			service.processData = function processData(dataList) {
				angular.forEach(dataList, function (item) {
					service.insertImages(item);
					if (item.CostCodes && item.CostCodes.length > 0) {
						service.processData(item.CostCodes);
					}
				});

				return dataList;
			};

			service.processItem = function processItem(costCodeItem) {
				if (costCodeItem) {
					service.insertImages(costCodeItem);
				}
			};

			// get Image according to Cost Code Type
			service.getImagePath = function (icon) {
			/* jshint -W074 */ // simple switch generates cyclomatic complexity
				let imagePath = '';

				if (!(icon && angular.isDefined(icon))) {
					return '';
				}
				switch (icon) {
					case 1:
						imagePath = 'ico-ccode-estimate';
						break;
					case 2:
						imagePath = 'ico-ccode-revenue';
						break;
					case 3:
						imagePath = 'ico-ccode-subcontractor';
						break;
					case 4:
						imagePath = 'ico-cc-inhouse-work';
						break;
				}
				return imagePath;
			};

			// insert Images to CostCode Item according to Cost Code Type
			service.insertImages = function (costCodeItem) {
				if (!costCodeItem) {
					return;
				}
				// Set correct image path
				let types = basicsCostCodesLookupService.getCostCodeTypes();
				if(!types){
					types = basicsLookupdataLookupDescriptorService.getData('costcodetype');
				}
				if (types) {
					let iconItem = _.find(types, {Id: costCodeItem.CostCodeTypeFk});
					costCodeItem.image = service.getImagePath(iconItem ? iconItem.Icon : '');
				}
				return costCodeItem;
			};

			// insert Images to List of CostCode Items according to Cost Code Type
			service.insertImagesInList = function (costCodeItems) {
				let icon = 0;
				if (!costCodeItems || !angular.isArray(costCodeItems)) {
					return; // return if undefined or not an object
				}
				let types = basicsCostCodesLookupService.getCostCodeTypes();

				if(!types){
					types = basicsLookupdataLookupDescriptorService.getData('costcodetype');
				}
				if (types) {
					// Set correct image path
					angular.forEach(costCodeItems, function (item) {
						angular.forEach(types, function (type) {
							if (type.Id === item.CostCodeTypeFk) {
								icon = type.Icon;
								item.image = service.getImagePath(icon);
							}
						});
					});
				}
				return costCodeItems;
			};

			service.processLookupItem = function processLookupItem(item) {
				if(item){
					let fields = [];
					fields = [
						{field: 'CurrencyFk', readonly: true}
					];
					platformRuntimeDataService.readonly(item, fields);
				}
				return item;
			};

			return service;

		}]);
})(angular);