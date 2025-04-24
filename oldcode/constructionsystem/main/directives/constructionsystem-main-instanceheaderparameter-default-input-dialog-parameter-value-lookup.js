/**
 * Created by lvy on 4/26/2018.
 */

(function (angular) {
	'use strict';

	var modulename = 'constructionsystem.main';
	angular.module(modulename).directive('constructionSystemMainInstanceHeaderParameterDialogParameterValueLookup', [
		'$q',
		'BasicsLookupdataLookupDirectiveDefinition',
		'constructionSystemMainInstanceHeaderParameterLookupService',
		function (
			$q,
			BasicsLookupdataLookupDirectiveDefinition,
			constructionSystemMainInstanceHeaderParameterLookupService
		) {
			var defaults = {
				lookupType: 'CosMainInstanceParameterValue',
				valueMember: 'Id',
				displayMember: 'Description',
				filterKey: 'constructionsystem-main-instanceheaderparameter-dialog-parameter-value-filter',
				uuid: '6d5d2c36aea24a62a642d11d7efef870',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'ParameterValue',
						field: 'ParameterValue',
						name: 'ParameterValue',
						width: 150,
						name$tr$: 'constructionsystem.main.entityParameterValue'
					}
				],
				width: 80,
				height: 200,
				showClearButton: true
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					getSearchList: constructionSystemMainInstanceHeaderParameterLookupService.getSearchList,
					getList: constructionSystemMainInstanceHeaderParameterLookupService.getList,
					getItemByKey: constructionSystemMainInstanceHeaderParameterLookupService.getItemByKey
				}
			});

		}
	]);
})(angular);