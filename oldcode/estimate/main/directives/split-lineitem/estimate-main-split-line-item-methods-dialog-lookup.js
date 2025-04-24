/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc directive
	 * @name estimateMainSplitLineItemQuantityDialog
	 * @description
	 */
	angular.module('estimate.main').directive('estimateMainSplitLineItemMethodsDialogLookup', ['BasicsLookupdataLookupDirectiveDefinition','estimateMainSplitLineItemMethodsLookupService',

		function (BasicsLookupdataLookupDirectiveDefinition,estimateMainSplitLineItemMethodsLookupService) {
			let defaults = {
				lookupType: 'EstMainSplitLineItemMethodsLookup',
				valueMember: 'Id',
				displayMember: 'Description',
				onDataRefresh: function ($scope) {
					estimateMainSplitLineItemMethodsLookupService.refresh().then(function (data) {
						if(data){
							$scope.refreshData(data);
						}
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults,
				{dataProvider: 'estimateMainSplitLineItemMethodsLookupService'}
			);
		}]);

})(angular);

