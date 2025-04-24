(function (angular) {
	'use strict';
	angular.module('basics.lookupdata').directive('basicLookupDataGenericWizardNamingParameterLookup', ['basicsLookupDataGenericWizardNamingParameterListService', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsConfigGenWizardNamingParameterDataService',
		function (basicsLookupDataGenericWizardNamingParameterListService, BasicsLookupdataLookupDirectiveDefinition, basicsConfigGenWizardNamingParameterDataService) {
			const defaults = {
				lookupType: 'basicLookupDataGenericWizardNamingParameterLookup',
				valueMember: 'id',
				displayMember: 'title',
				selectableCallback: function (dataItem) {
					let list = _.map(basicsConfigGenWizardNamingParameterDataService.getList(), 'NamingType');
					return !list.includes(dataItem.id);
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'basicLookupDataGenericWizardNamingParameterLookup',
				dataProvider: {
					myUniqueIdentifier: 'basicLookupDataGenericWizardNamingParameterLookup',
					getList: function () {
						return basicsLookupDataGenericWizardNamingParameterListService.getList();
					},
					getItemByKey: function (key) {
						return basicsLookupDataGenericWizardNamingParameterListService.getItemById(key);
					}
				}
			});
		}
	]);
})(angular);

(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').factory('basicsLookupDataGenericWizardNamingParameterListService', ['$q', '$translate', 'basicsConfigGenWizardInstanceDataService', 'genericWizardNamingParameterConstantService',

		function ($q, $translate, instanceDataService, namingParameterConstantService) {

			const defaultGenericWizardUuid = 'c420c85a094043d8bd9b830ba25fc334';

			return {
				getList: function () {
					let selectedWizardInstance = instanceDataService.getSelected();

					if (selectedWizardInstance.WizardConfiGuuid !== defaultGenericWizardUuid) {
						return $q.when(namingParameterConstantService.getAllowedNamingParameterTypes(selectedWizardInstance.WizardConfiGuuid));
					} else {
						return $q.when([]);
					}
				},
				getItemByIdAsync: function (id) {
					return this.getList().then(function then(list) {
						return _.find(list, {id: id});
					});
				},
				getItemById: function (id) {
					let selectedWizardInstance = instanceDataService.getSelected();

					if (selectedWizardInstance.WizardConfiGuuid !== defaultGenericWizardUuid) {
						return _.find(namingParameterConstantService.getAllowedNamingParameterTypes(selectedWizardInstance.WizardConfiGuuid), {id: id});
					} else {
						return null;
					}
				}
			};
		}]);
})(angular);