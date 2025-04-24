/**
 * Created by alisch on 07/5/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	/**
	 * @ngdoc service
	 * @name cloudDesktopPagesLookupService
	 * @function
	 *
	 * @description
	 * Lookup service to show page names from customizing
	 */
	angular.module(moduleName).factory('basicsLookupdataDesktopPagesLookupService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator', 'cloudDesktopDesktopLayoutSettingsService',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, cloudDesktopDesktopLayoutSettingsService) {
			let readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsLookupdataDesktopPagesLookupService', {
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

			var basicsLookupdataDesktopPagesLookupService = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/desktoppage/', endPointRead: 'list', usePostForRead: true},
				filterParam: readData,
				prepareFilter: function prepareFilter() {
					return readData;
				},
				modifyLoadedData: function (data) {
					let pagesStructure = _.get(cloudDesktopDesktopLayoutSettingsService.getCurrentSettings(), 'desktopPagesStructure');

					//Add the RIB pages (no customize pages). Desktop / Administration.
					_.forEach(pagesStructure, function(page) {
						if (page.rib) {
							data.unshift({ Id: page.id, DescriptionInfo: {
								Description: page.pageName,
								DescriptionModified: false,
								Modified: false,
								OtherLanguages: null,
								Translated: page.pageName,
								VersionTr: 0,
								Rib: true
							} });
						}

						data.sort(function (l,u) {
							return l.DescriptionInfo.Description && l.DescriptionInfo.Description.toLowerCase().localeCompare(u.DescriptionInfo.Description.toLowerCase());
						});
					});
				},
				selectableCallback: function selectableCallback(dataItem, entity, settings) {
					entity.pageName = _.get(dataItem, settings.displayMember);

					return true;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsLookupdataDesktopPagesLookupService).service;
		}]);
})(angular);
