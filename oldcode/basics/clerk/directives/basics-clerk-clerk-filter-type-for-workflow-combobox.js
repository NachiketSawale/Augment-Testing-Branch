/**
 * Created by lst on 9/23/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.clerk';

	// basics-clerk-clerk-filter-type-for-workflow-combobox
	angular.module(moduleName).directive('basicsClerkClerkFilterTypeForWorkflowCombobox',
		['$q', '$translate', 'BasicsLookupdataLookupDirectiveDefinition',
			function ($q, $translate, BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'ClerkFilterTypeForWorkflow',
					valueMember: 'Id',
					displayMember: 'Description',
					disableInput: true
				};

				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: 'basicsClerkClerkFilterTypeForWorkflowComboboxService',
					controller: ['$scope', '$rootScope', 'basicsClerkClerkFilterTypeForWorkflowComboboxService',
						function ($scope, $rootScope, basicsClerkClerkFilterTypeForWorkflowComboboxService) {
							function refresh() {
								if ($scope.$$childTail && $scope.$$childTail.displayItem && $scope.$$childTail.displayText !== $scope.$$childTail.displayItem.Description) {
									$scope.$$childTail.displayText = $scope.$$childTail.displayItem.Description;
								}
							}

							basicsClerkClerkFilterTypeForWorkflowComboboxService.translationChanged.register(refresh);
						}]
				});
			}]);
})(angular);
