/**
 * Created by chi on 6/13/2016.
 */

(function (angular) {
	'use strict';

	angular.module('constructionsystem.main').directive('constructionSystemMainInstanceParameterPropertyNameCombobox', [
		'$q',
		'BasicsLookupdataLookupDirectiveDefinition',
		'constructionSystemMainInstanceParameterPropertyNameLookupService',
		function (
			$q,
			BasicsLookupdataLookupDirectiveDefinition,
			constructionSystemMainInstanceParameterPropertyNameLookupService) {

			var defaults = {
				version: 3,
				lookupType: 'CosMainInstanceParameterPropertyName',
				valueMember: 'Id',
				displayMember: 'PropertyName',
				showClearButton: true,
				disableDataCaching: true,
				columns: [
					{ id: 'propertyName', field: 'PropertyName', name: 'PropertyName', width: 150, name$tr$: 'constructionsystem.master.entityPropertyName' }
				],
				pageOptions: {
					enabled: true,
					size: 100
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					getSearchList: constructionSystemMainInstanceParameterPropertyNameLookupService.getSearchList,
					getItemByKey: constructionSystemMainInstanceParameterPropertyNameLookupService.getItemByKey
				}
			});
		}
	]);
})(angular);