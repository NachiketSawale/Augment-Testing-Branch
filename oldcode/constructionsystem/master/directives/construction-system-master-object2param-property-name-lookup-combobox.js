/**
 * Created by clv on 2/9/2018.
 */
(function(angular){

	'use strict';

	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).directive('constructionSystemMasterObject2paramPropertyNameCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition',
		'constructionSystemMasterObject2paramPropertyNameLookupService',
		function(BasicsLookupdataLookupDirectiveDefinition, Object2paramPropertyNameLookupService){

			var defaults = {

				lookupType: 'CosMasterParameterPropertyName',
				valueMember: 'Id',
				displayMember: 'PropertyName',
				showClearButton: true,
				disableCache: true
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: Object2paramPropertyNameLookupService.getList,
					getSearchList: Object2paramPropertyNameLookupService.getSearchList,
					getItemByKey: Object2paramPropertyNameLookupService.getItemByKey
				}
			});
		}]);
})(angular);