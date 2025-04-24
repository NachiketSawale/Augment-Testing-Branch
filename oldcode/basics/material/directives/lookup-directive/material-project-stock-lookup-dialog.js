/**
 * Created by lcn on 9/06/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.material';
	/**
     * @ngdoc directive
     * @name basics.materia.directive: basicsMaterialProjectStockLookupDialog
     * @element
     * @restrict
     * @priority
     * @scope
     * @description
     * #
     *a dialog directive for stock_projectStock.
     *
     */
	angular.module(moduleName).directive('basicsMaterialProjectStockLookupDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				version: 2,
				lookupType: 'ProjectStock2ProjectStock',
				valueMember: 'Id',
				displayMember: 'Code',
				dialogOptions: {
					width: '680px'
				},
				uuid: '26FF871C01CA4D6EAFE88C5B471B9993',
				dialogUuid: '2ababb3c718242c5b78c04a10f077686',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'description',
						field: 'Description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				title: {
					name: 'ProjectStock Search Dialog',
					name$tr$: 'stockList.stockLookupDialogTitle'
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}]);

})(angular);

