/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */

	angular.module('estimate.assemblies').factory('estimateAssembliesAssemblyLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',
		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {

			let estimateAssembliesAssemblyLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'estimate/assemblies/structure/', endPointRead: 'tree'},
				dataProcessor: [new ServiceDataProcessArraysExtension(['AssemblyCatChildren'])],
				tree: {parentProp: 'EstAssemblyCatFk', childProp: 'AssemblyCatChildren'}
			};

			return platformLookupDataServiceFactory.createInstance(estimateAssembliesAssemblyLookupDataServiceConfig).service;
		}]);
})();
