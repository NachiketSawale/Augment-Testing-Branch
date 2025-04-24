/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('estimateMainWicBoqLookupService', ['platformLookupDataServiceFactory','estimateMainService',
		function (platformLookupDataServiceFactory,estimateMainService) {

			let filterParam = {};
			let estimateMainWicBoqLookupServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'estimate/main/createboqpackage/',
					endPointRead: 'getwicgrouplist'
				},
				filterParam: filterParam, // 'companyId'
				prepareFilter: function () {
					let lineItemIds = [];
					if(filterParam && filterParam.estimateScope === 2 && estimateMainService.getSelectedEntities() && estimateMainService.getSelectedEntities().length >0 ){ // if highlight line item
						let lineItems =  estimateMainService.getSelectedEntities();
						lineItemIds = _.map(lineItems,'Id');
						filterParam.lineItemIds =lineItemIds;
					}

					return filterParam;
				}
				// dataProcessor: [new ServiceDataProcessArraysExtension(['Companies']), basicsCompanyImageProcessor],
				// tree: {parentProp: 'CompanyFk', childProp: 'Companies'}
			};

			let service = platformLookupDataServiceFactory.createInstance(estimateMainWicBoqLookupServiceConfig).service;

			service.refresh = function (entity) {
				filterParam = entity;
				service.resetCache({lookupType: 'estimateMainWicBoqLookupService'});
			};

			return service;
		}
	]);
})(angular);
