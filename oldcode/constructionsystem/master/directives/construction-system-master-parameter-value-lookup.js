/**
 * Created by chk on 12/22/2015.
 */
/* jshint -W072 */
(function (angular) {
	'use strict';
	angular.module('constructionsystem.master').directive('constructionSystemMasterParameterValueLookup',
		['$q', 'cosParameterValueLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
			function ($q, cosParameterValueLookupService, BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'CosParameterValueLookup',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated'
				};
				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: {
						getList: function () {
							return cosParameterValueLookupService.getList();
						},
						getItemByKey: function (key) {
							return cosParameterValueLookupService.getItemByIdAsync(key);
						},
						getSearchList: function () {
							return cosParameterValueLookupService.getSearchList();
						},
						getDisplayItem: function (value) {
							return cosParameterValueLookupService.getItemByIdAsync(value);
						}
					}
				});
			}]);
})(angular);