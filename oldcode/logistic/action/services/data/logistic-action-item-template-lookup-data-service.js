/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticActionItemTemplateLookupDataService
	 * @function
	 *
	 * @description
	 * logisticActionItemTemplateLookupDataService is the data service for action item templates
	 */
	angular.module('logistic.action').factory('logisticActionItemTemplateLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			// PKey1 = Action Target Fk
			var readData = {PKey1: null};
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticActionItemTemplateLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'RecordNo',
						field: 'RecordNo',
						name: 'RecordNo',
						formatter: 'integer',
						width: 100,
						name$tr$: 'logistic.action.entityRecordNo'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '211367776c1f49659bd074a378b51b46'
			});

			var logisticActionItemTemplateLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'logistic/action/item/',
					endPointRead: 'listbyactiontarget',
					usePostForRead: true
				},
				filterParam: readData
			};

			return platformLookupDataServiceFactory.createInstance(logisticActionItemTemplateLookupDataServiceConfig).service;
		}]);
})(angular);
