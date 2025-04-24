/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular){
	'use strict';
	let moduleName = 'qto.main';

	angular.module(moduleName).factory('qtoMainLineItemDynamicConfigService', qtoMainLineItemDynamicConfigService);

	qtoMainLineItemDynamicConfigService.$inject = ['estimateCommonDynamicConfigurationServiceFactory'];

	function qtoMainLineItemDynamicConfigService(estimateCommonDynamicConfigurationServiceFactory){

		return estimateCommonDynamicConfigurationServiceFactory.getService('qtoMainLineItemUIService');
	}

})(angular);