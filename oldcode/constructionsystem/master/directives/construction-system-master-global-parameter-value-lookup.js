/**
 * Created by lvy on 4/17/2018.
 */
(function (angular) {
	'use strict';
	var modulename = 'constructionsystem.master';
	angular.module(modulename).directive('constructionSystemMasterGlobalParamValueLookup',
		['$q', 'cosGlobalParamValueLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
			function ($q, cosGlobalParamValueLookupService, BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'CosGlobalParamValueLookup',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated'
				};
				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: {
						getList: function () {
							return cosGlobalParamValueLookupService.getList();
						},
						getItemByKey: function (key) {
							return cosGlobalParamValueLookupService.getItemByIdAsync(key);
						},
						getSearchList: function () {
							return cosGlobalParamValueLookupService.getSearchList();
						},
						getDisplayItem: function (value) {
							return cosGlobalParamValueLookupService.getItemByIdAsync(value);
						}
					}
				});
			}]);
})(angular);