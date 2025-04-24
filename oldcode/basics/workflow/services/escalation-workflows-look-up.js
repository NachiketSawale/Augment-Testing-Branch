(function (angular) {
	'use strict';

	function lookUpFactory(typeId, lookupType) {
		return function workflowsLookUp(BasicsLookupdataLookupDirectiveDefinition, basicsWorkflowTemplateService, _) {
			var defaults = {
				lookupType: lookupType,
				valueMember: 'Id',
				displayMember: 'Description',
				showClearButton: true
			};

			function getList() {
				return basicsWorkflowTemplateService.getListHeader().then(function (response) {
					if (typeId) {
						return _.filter(response, {TypeId: typeId});
					} else {
						return response;
					}
				});
			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: getList,
					getItemByKey: function (id) {
						return basicsWorkflowTemplateService.getListHeader().then(function (response) {
							return _.find(response, {Id: id});
						});
					}
				}
			});
		};
	}

	var escalationLookUp = lookUpFactory(2, 'basicsWorkflowEscalationWorkflowsComboBox');
	var wfLookUp = lookUpFactory(null, 'basicsWorkflowComboBox');

	var injects = ['BasicsLookupdataLookupDirectiveDefinition', 'basicsWorkflowTemplateService', '_'];
	escalationLookUp.$inject = injects;
	wfLookUp.$inject = injects;

	angular.module('basics.workflow').directive('basicsWorkflowEscalationWorkflowsComboBox', escalationLookUp);
	angular.module('basics.workflow').directive('basicsWorkflowComboBox', wfLookUp);

})(angular);
