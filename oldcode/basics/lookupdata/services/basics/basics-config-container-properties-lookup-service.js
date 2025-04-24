(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').directive('basicLookupDataContainerProperties', ['$injector', 'basicsLookupDataContainerPropertyListService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, containerPropertyService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'containerProperties',
				valueMember: 'id',
				displayMember: 'name'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'basicsLookupDataContainerPropertyListService',
				dataProvider: {
					getList: function () {
						return containerPropertyService.getPropsByContainerUUID();
					},
					getItemByKey: function (key) {
						return containerPropertyService.getItemByIdAsync(key);
					}
				}
			});
		}
	]);
})(angular);

(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').factory('basicsLookupDataContainerPropertyListService', ['basicsLookupDataPropertyListService', 'basicsConfigGenWizardContainerDataService',

		function (propertyService, containerDataService) {

			function getSelectedContainerUUID() {
				var containerUuid = containerDataService.getSelected() ? containerDataService.getSelected().ContainerUuid : null;
				return containerUuid;
			}

			return {
				getItemByIdAsync: function (key) {
					return propertyService.getItemByIdAsync(getSelectedContainerUUID(), key);
				},
				//force the use of getItemByIdAsync
				getItemById: function () {
					return null;
				},
				getPropsByContainerUUID: function () {
					return propertyService.getList(getSelectedContainerUUID(), true);
				}
			};
		}]);
})(angular);

