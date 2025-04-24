(function (angular) {
	'use strict';

	function masterDataLookUpFactory(type) {
		return function masterDataLookUpFactory(_, BasicsLookupdataLookupDirectiveDefinition, basicsWorkflowMasterDataService) {
			var defaults = {
				lookupType: 'basicsWorkflow' + type + 'LookUp',
				valueMember: 'Id',
				displayMember: type !== 'Entities' ? 'Description' : 'EntityName'
			};

			function getList() {
				return basicsWorkflowMasterDataService['get' + type]();
			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: getList,
					getItemByKey: function (id) {
						return getList().then(function (response) {
							return _.find(response, {id: id});
						});
					}
				}
			});
		};
	}

	var injects = ['_', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsWorkflowMasterDataService'];
	var types = ['Entities', 'Events'];
	var lookup;

	for (var i = 0; i < types.length; i++) {
		lookup = masterDataLookUpFactory(types[i]);
		lookup.$inject = injects;
		angular.module('basics.workflow').directive('basicsWorkflow' + types[i] + 'ComboBox', lookup);
	}
})(angular);
