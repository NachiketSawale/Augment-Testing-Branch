/**
 * Created by zpa on 2016/9/20.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.lookupdata';
	angular.module(moduleName).factory('businessPartnerMainSubsidiaryLookupDataService', [
		'_', '$q', '$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator','basicsLookupdataLookupDescriptorService',
		function (_, $q, $injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator,basicsLookupdataLookupDescriptorService) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('businessPartnerMainSubsidiaryLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				uuid: '7ad57f370fb745e2b518de209bce604e',
				columns: [
					{
						id: 'addressType',
						field: 'AddressTypeDto.DescriptionInfo.Translated',
						name: 'Address Type',
						name$tr$: 'businesspartner.main.addressType',
						width: 100
					},
					{
						id: 'isMainAddress',
						field: 'IsMainAddress',
						name: 'Is Main Address',
						name$tr$: 'businesspartner.main.isMainAddress',
						formatter: Slick.Formatters.CheckmarkFormatter,
						width: 80
					},
					{
						id: 'subDes',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 120
					},
					{
						id: 'street',
						field: 'AddressDto.Street',
						name: 'Street',
						name$tr$: 'cloud.common.entityStreet',
						width: 150
					},
					{
						id: 'zipCode',
						field: 'AddressDto.ZipCode',
						name: 'ZipCode',
						name$tr$: 'cloud.common.entityZipCode',
						width: 100
					},
					{
						id: 'city',
						field: 'AddressDto.City',
						name: 'City',
						name$tr$: 'cloud.common.entityCity',
						width: 100
					},
					{
						id: 'iso2',
						field: 'AddressDto.CountryISO2',
						name: 'Iso2',
						name$tr$: 'cloud.common.entityISO2',
						width: 100
					}
				],
				width: 500,
				height: 200
			});

			basicsLookupdataLookupDescriptorService.loadData('SubsidiaryStatus');
			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/subsidiary/', endPointRead: 'lookup'},
				filterParam: 'bpId'
			};

			var container = platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig);

			var service = container.service;

			container.service.getItemById = function getItemById(ID, options) {
				var cusSubsidiaryService = $injector.get('businesspartnerMainSubsidiaryDataService');
				var items = cusSubsidiaryService.getList();
				if (!angular.isArray(items) || items.length === 0) {
					items = container.data.dataCache.get(determineKey(options)) || [];
				}
				return _.find(items, function (item) {
					return item['Id'] === ID;
				});
			};

			container.service.getItemByIdAsync = function getItemByIdAsync(ID, options) {
				var defer = $q.defer();
				var item= container.service.getItemById(ID, options);
				defer.resolve(item);
				return defer.promise;
			};



			container.data.getByFilterAsync = function getByFilterAsync(filterFn, options) {
				var defer = $q.defer();
				service.getLookupData(options).then(function (itemList) {
					var item = _.find(itemList, function (item) {
						return filterFn(item);
					});
					defer.resolve(item);
				});
				return defer.promise;
			};

			service.getLookupData = function getLookupData(options) {
				var cusSubsidiaryService = $injector.get('businesspartnerMainSubsidiaryDataService');
                var statusData = basicsLookupdataLookupDescriptorService.getData('SubsidiaryStatus');

                var activeFkArray= [];
				for (var prop in statusData) {
					if (statusData.hasOwnProperty(prop)) {
						if (!!statusData[prop].IsActive && !!statusData[prop].IsLive )
						{
							activeFkArray.push(statusData[prop].Id);

						}
					}
				}
				if (cusSubsidiaryService && !_.isEmpty(cusSubsidiaryService.getList())) {
					var items = cusSubsidiaryService.getList();
					var activeArray=[];
					for (var i=0; i<items.length; i++)
					{
						for (var c=0; c<activeFkArray.length; c++)
						{
							if (items[i].SubsidiaryStatusFk === activeFkArray[c])
							{
								activeArray.push(items[i]);
							}
						}
					}
					container.data.dataCache.update(determineKey(options), activeArray); // update cache for new created item lookup formatter
					return $q.when(activeArray);
				} else {
					return service.getList(options);
				}
			};

			function determineKey(options) {
				var filter = container.data.filter;
				var key = null;

				if (angular.isDefined(filter) && filter !== null && filter !== '') {
					if (angular.isObject(filter)) {
						// In case we have a object containing various filter conditions we generate a unique key
						// by transforming it into a json string and generate a hash key based on this string.
						// This procedure should return a key that describes to internal state of the filter object
						// in a way that leads to a unique reprocducible key.
						key = angular.toJson(filter);
					} else {
						key = filter;
					}
				} else {
					key = options.lookupType;
				}

				return key;
			}

			return service;
		}
	]);
})(angular);
