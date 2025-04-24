/**
 * Created by lvi on 12/15/2014.
 */
(function (angular, globals) {
	'use strict';
	/* globals globals */
	/**
	 * @ngdoc directive
	 * @name scheduling-lookup-activity-task-type
	 * @requires  schedulingLookupService
	 * @description ComboBox to select a task type for an activity
	 */

	globals.lookups.qtoFormulaIcon = function qtoFormulaIcon(){
		return {
			lookupOptions:{
				lookupType: 'qtoFormulaIcon',
				valueMember: 'Id',
				displayMember: 'Description'
			},
			dataProvider: 'qtoFormulaIconDataService'
		};
	};

	angular.module('qto.formula').directive('qtoFormulaIconCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'qtoFormulaIcon',
				valueMember: 'Id',
				displayMember: 'Description',
				imageSelector: 'qtoFormulaIconProcessor'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}
	]);

})(angular, globals);
