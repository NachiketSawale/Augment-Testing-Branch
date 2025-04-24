(function () {
	'use strict';

	function eventLookUp(BasicsLookupdataLookupDirectiveDefinition, basicsWorkflowEventService) {
		var defaults = {
			lookupType: 'basicsWorkflowEventLookUp',
			valueMember: 'uuid',
			displayMember: 'description'
		};

		function getList() {
			return basicsWorkflowEventService.getEvents();
		}

		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
			dataProvider: {
				getList: getList,
				getItemByKey: function (uuid) {
					return basicsWorkflowEventService.getEvent(uuid);
				}
			}
		});
	}

	eventLookUp.$inject = ['BasicsLookupdataLookupDirectiveDefinition', 'basicsWorkflowEventService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowEventLookUp', eventLookUp);
})();
