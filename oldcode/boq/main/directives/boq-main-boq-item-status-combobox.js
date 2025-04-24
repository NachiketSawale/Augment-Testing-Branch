/**
 * Created by bh on 26.03.2019.
 */
(function (angular) {
	/* global _ */ 
	'use strict';

	angular.module('boq.main').directive('boqMainBoqItemStatusCombobox', ['$q', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsCustomBoqItemStatusLookupDataService',
		function ($q, BasicsLookupdataLookupDirectiveDefinition, basicsCustomBoqItemStatusLookupDataService) {

			var defaults = {
				'lookupType': 'BoqItemStatus',
				'valueMember': 'Id',
				'displayMember': 'DescriptionInfo.Translated',
				'imageSelector': 'platformStatusIconService'
			};

			function getFilteredList(options) {
				return basicsCustomBoqItemStatusLookupDataService.getList(options).then(function (data) {
					return _.filter(data, function (statusItem) {
						return statusItem.IsLive;
					});
				});
			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {
					getList: getFilteredList,
					getItemByKey: basicsCustomBoqItemStatusLookupDataService.getItemById,
					getSearchList: getFilteredList
				}
			});
		}]);

})(angular);
