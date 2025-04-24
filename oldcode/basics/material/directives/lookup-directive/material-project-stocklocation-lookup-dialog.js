/**
 * Created by lcn on 9/06/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.material';
	/**
     * @ngdoc directive
     * @name basics.materia.directive: basicsMaterialProjectStockLocationLookupDialog
     * @element
     * @restrict
     * @priority
     * @scope
     * @description
     * #
     *a dialog directive for stock_projectStock.
     *
     */
	angular.module(moduleName).directive('basicsMaterialProjectStockLocationLookupDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				version: 2,
				lookupType: 'ProjectStock2ProjectStockLocation',
				valueMember: 'Id',
				displayMember: 'Code',
				dialogOptions: {
					width: '680px'
				},
				uuid: '26FF871C01CA4D6EAFE88C5B471B9993',
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
					name: 'ProjectStockLocation Search Dialog',
					name$tr$: 'stockList.stockLocationLookupDialogTitle'
				},
				treeOptions: {
					parentProp: 'StockLocationFk',
					childProp: 'SubLocations',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				},
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}]);

})(angular);

