(function (angular) {
	'use strict';
	/*global angular, _*/
	var module = 'productionplanning.common';

	angular.module(module).factory('ppsCommonJobPinboardDataServiceFactory', ppsCommonJobPinboardDataServiceFactory);
	ppsCommonJobPinboardDataServiceFactory.$inject = ['basicsCommonCommentDataServiceFactory','basicsLookupdataLookupDescriptorService'];

	function ppsCommonJobPinboardDataServiceFactory(basicsCommonCommentDataServiceFactory, lookupService) {

		var serviceF = {}, serviceCache = {};

		serviceF.get= function (qualifier, parentDataServiceName, options, attributeName) {
			var cacheName = qualifier + parentDataServiceName;
			if (!serviceCache[cacheName]) {
				var service =  basicsCommonCommentDataServiceFactory.get(qualifier, parentDataServiceName, options);
				overWriteFn(service, attributeName);
				serviceCache[cacheName] = service;
			}
			return serviceCache[cacheName];
		};

		serviceF.noService = function (qualifier, parentDataServiceName) {
			var cacheName = qualifier + parentDataServiceName;
			return _.isNil(serviceCache[cacheName]);
		};

		function overWriteFn(service, attributeName) {
			service.getParentItem = function getParentItem(){
				var itemSelected =  service.parentDataService.getSelected();
				if(itemSelected && angular.isDefined(itemSelected[attributeName])){
					return  lookupService.getLookupItem('logisticJobEx',itemSelected[attributeName]);
				}
			};
		}

		return serviceF;
	}

})(angular);