/**
 * Created by wul on 10/19/2018.
 */

(function (angular) {

	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainTextConfigRemarkLookup
	 */
	angular.module(moduleName).directive('boqMainTextConfigRemarkLookup', ['$q', '$translate', 'boqMainTextConfigRemarkService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, $translate, boqMainTextConfigRemarkService, BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				lookupType: 'boqMainTextConfigRemarkLookupType',
				valueMember: 'Code',
				displayMember: 'Description',
				showClearButton: false,
				isTextEditable: true,
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {

					getList: function (param) {
						return boqMainTextConfigRemarkService.getList(param);
					},
					getItemByKey: function (key, param) {
						return boqMainTextConfigRemarkService.getItemByKey(key, param);
					},
					getSearchList: function (param, displayField, scope, searchListSettings) {
						return boqMainTextConfigRemarkService.getSearchList(searchListSettings.searchString);
					},
					getDisplayItem: function (value, param) {
						return boqMainTextConfigRemarkService.getItemByIdAsync(value, param);
					},
					getItemById: function (id, param) {
						return boqMainTextConfigRemarkService.getItemByKey(id, param);
					}
				}
			});
		}
	]);
})(angular);
