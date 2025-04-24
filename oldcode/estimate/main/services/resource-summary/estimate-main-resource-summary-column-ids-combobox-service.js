/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainResourceSummaryColumnIdsComboboxService',[
		'platformLookupDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
		function (platformLookupDataServiceFactory, basicsLookupdataLookupDescriptorService) {

			let options = {
				lookupType: 'DynamicColumns',
				httpRead: { route: globals.webApiBaseUrl +'estimate/main/columnconfigdetail/', endPointRead: 'columnidforresource' }
			};
			let service = platformLookupDataServiceFactory.createInstance(options).service;

			angular.extend(service, {
				getItemByKey: getItemByKey
			});

			function getItemByKey(key) {
				return service.getItemById(key, options);
			}

			function init(){
				service.getList(options).then(function(data){
					basicsLookupdataLookupDescriptorService.attachData({ 'columnids' : data});
				});
			}

			init();

			return service;
		}
	]);
})(angular);
