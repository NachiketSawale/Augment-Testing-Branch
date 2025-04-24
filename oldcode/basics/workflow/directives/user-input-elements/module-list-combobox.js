/**
 * Created by alisch on 27.06.2016.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsWorkflowModuleListCombobox
	 * @description Lookup for module list
	 */
	var moduleName = 'basics.workflow';

	angular.module(moduleName).directive('basicsWorkflowModuleListCombobox', ['BasicsLookupdataLookupDirectiveDefinition', '$http', 'platformModuleNavigationService', 'basicsWorkflowEntityUtilsService', '_',
		function (BasicsLookupdataLookupDirectiveDefinition, $http, platformModuleNavigationService, basicsWorkflowEntityUtilsService, _) {

			var defaults = {
				lookupType: 'basicsmodulelist',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			function getList() {
				return basicsWorkflowEntityUtilsService.getModulesWithNavigationEndpoint().then(function (response) {
					return _.sortBy(response, defaults.displayMember);
				});
			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: getList
				}
			});
		}
	]);
})(angular);
