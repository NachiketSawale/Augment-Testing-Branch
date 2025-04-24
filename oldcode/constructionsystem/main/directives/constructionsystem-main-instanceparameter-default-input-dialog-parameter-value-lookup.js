/**
 * Created by chi on 6/13/2016.
 */
(function (angular) {
	'use strict';
	angular.module('constructionsystem.main').directive('constructionSystemMainInstanceParameterDialogParameterValueLookup',
		['$q',  'BasicsLookupdataLookupDirectiveDefinition', 'constructionSystemMainInstanceParameterLookupService',
			function ($q,  BasicsLookupdataLookupDirectiveDefinition, constructionSystemMainInstanceParameterLookupService) {

				var defaults = {
					lookupType: 'CosMainInstanceParameterValue',
					valueMember: 'Id',
					displayMember: 'Description',
					filterKey: 'constructionsystem-main-instanceparameter-dialog-parameter-value-filter',
					uuid: '69f3e66b55ef4ff2986b14b4897f9d3c',
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
						getSearchList: constructionSystemMainInstanceParameterLookupService.getSearchList,
						getList: constructionSystemMainInstanceParameterLookupService.getList,
						getItemByKey: constructionSystemMainInstanceParameterLookupService.getItemByKey
					}
				});

			}]);
})(angular);