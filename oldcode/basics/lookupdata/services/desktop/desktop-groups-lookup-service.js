/**
 * Created by alisch on 07/5/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	/**
	 * @ngdoc service
	 * @name cloudDesktopGroupsLookupService
	 * @function
	 *
	 * @description
	 * Lookup service to show group names from customizing
	 */
	angular.module(moduleName).factory('basicsLookupdataDesktopGroupsLookupService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator', 'cloudDesktopDesktopLayoutSettingsService',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, cloudDesktopDesktopLayoutSettingsService) {
			let readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsLookupdataDesktopGroupsLookupService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '71f31d138eac4c24a0601846cc1314ae'
			});

			let basicsLookupdataDesktopGroupsLookupService = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/desktopgroup/', endPointRead: 'list', usePostForRead: true},
				filterParam: readData,
				prepareFilter: function prepareFilter() {
					return readData;
				},
				modifyLoadedData: function (data) {
					let pagesStructure = _.get(cloudDesktopDesktopLayoutSettingsService.getCurrentSettings(), 'desktopPagesStructure');

					_.forEach(pagesStructure, function(page){
						if (page.rib) {
							_.forEach(page.groups, function(group) {
								data.unshift({ Id: group.id, DescriptionInfo: {
									Description: group.groupName,
									DescriptionModified: false,
									Modified: false,
									OtherLanguages: null,
									Translated: group.groupName,
									VersionTr: 0,
									Rib: true
								} });
							});
						}

						data.sort(function (l,u) {
							return l.DescriptionInfo.Description && l.DescriptionInfo.Description.toLowerCase().localeCompare(u.DescriptionInfo.Description.toLowerCase());
						});
					});
				},
				selectableCallback: function selectableCallback(dataItem, entity, settings) {
					//set groupName by selected an item in selectbox
					entity.groupName = _.get(dataItem, settings.displayMember) || '';

					return true;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsLookupdataDesktopGroupsLookupService).service;
		}]);
})(angular);
