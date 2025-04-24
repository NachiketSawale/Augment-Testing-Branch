(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name logistic.dispatching.directive: logistic-dispatching-header-lookup-dialog
	 * @element
	 * @restrict
	 * @priority
	 * @scope
	 * @description
	 * #
	 *a dialog directive for dispatch header
	 *
	 */
	angular.module('logistic.dispatching').directive('logisticDispatchingHeaderLookupDialog', ['basicsLookupdataSimpleLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		'logisticDispatchingHeaderLookupDataService',
		function (basicsLookupdataSimpleLookupService, BasicsLookupdataLookupDirectiveDefinition,
			logisticDispatchingHeaderLookupDataService) {

			var defaults = {
				lookupType: 'dispatchHeader',
				valueMember: 'Id',
				displayMember: 'Code',
				dialogOptions: {
					width: '680px'
				},
				uuid: '978a0803f85e4500b7013fac341e79d4',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				events: [],
				title: { name: 'Assign Dispatching Header', name$tr$: 'logistic.dispatching.assignHeaderTitle' }
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults,
				{dataProvider: logisticDispatchingHeaderLookupDataService});
		}]);
})(angular);
