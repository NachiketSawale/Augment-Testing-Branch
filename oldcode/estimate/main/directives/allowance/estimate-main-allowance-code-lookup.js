(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).directive('estimateMainAllowanceCodeLookup',
		['$q', '_', '$injector', 'platformGridAPI', 'BasicsLookupdataLookupDirectiveDefinition','estimateMainAllowanceCodeLookupService',
			function ($q, _, $injector, platformGridAPI, BasicsLookupdataLookupDirectiveDefinition,estimateMainAllowanceCodeLookupService) {

				var defaults = {
					lookupType: 'EstAllowanceCode',
					valueMember: 'Id',
					displayMember: 'Code',
					onDataRefresh: function ($scope) {
						estimateMainAllowanceCodeLookupService.getList().then(function (output) {
							$scope.refreshData(output);
						});
					},
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								let lookupItem = args.selectedItem;
								estimateMainAllowanceCodeLookupService.setSelectedId(lookupItem);
								estimateMainAllowanceCodeLookupService.setSelectedCode(lookupItem);
							}
						}],
					regex:'^[\\s\\S]{0,16}$'
				};

				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: estimateMainAllowanceCodeLookupService 
				});
			}]);
})(angular);
