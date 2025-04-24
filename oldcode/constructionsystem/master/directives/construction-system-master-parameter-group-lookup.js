/**
 * Created by chk on 12/22/2015.
 */
/* jshint -W072 */
(function (angular) {
	'use strict';
	angular.module('constructionsystem.master').directive('constructionSystemMasterParameterGroupLookup',
		['$q', 'cosParameterGroupLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
			function ($q, cosParameterGroupLookupService, BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'CosParameterGroupLookup',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated'
				};
				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: {
						getList: function () {
							return cosParameterGroupLookupService.getList();
						},
						getItemByKey: function (key) {
							return cosParameterGroupLookupService.getItemByIdAsync(key);
						},
						getSearchList: function () {
							return cosParameterGroupLookupService.getSearchList();
						},
						getDisplayItem: function (value) {
							return cosParameterGroupLookupService.getItemByIdAsync(value);
						}
					}
				});
			}]);
})(angular);