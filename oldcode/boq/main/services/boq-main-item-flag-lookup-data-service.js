(function (angular) {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';
	angular.module(moduleName).factory('boqMainItemFlagLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('boqMainItemFlagLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 100
					},
					{
						id: 'Remark',
						field: 'Remark',
						name: 'Remark',
						formatter: 'remark',
						width: 100,
						name$tr$: 'DocumentBackup_Remark'
					}
				],
				uuid: '6CDB1487DC1B474C98908FDFA18CC0FE'
			});

			var businesspartnerAgreementLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'boq/main/itemflag/', endPointRead: 'listAll'}
			};

			var container = platformLookupDataServiceFactory.createInstance(businesspartnerAgreementLookupDataServiceConfig);

			container.data.handleSuccessfulLoad = function (loaded, data, key) {
				var itemList = null;
				if (loaded) {
					// remove resolved promise
					container.data.promiseCache.remove(key);
				}
				if (container.options.dataEnvelope) {
					itemList = loaded[container.options.dataEnvelope];
				} else {
					itemList = loaded;
				}

				// sort list before putting into cache
				itemList = _.sortBy(itemList, ['Sorting']);

				if (data.doProcessData) {
					data.doProcessData(itemList, data);
				}

				data.dataCache.update(key, itemList);

				return itemList;
			};

			return container.service;
		}]);

})(angular);