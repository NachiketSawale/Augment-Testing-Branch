/**
 * @ngdoc directive
 * @name scheduling.main.directive:schedulingMainActivityLookupDirective
 * @element
 * @restrict A
 * @priority
 * @scope
 * @description
 * # ActivityLookupDirective
 * Control to display a simple lookup of activity properties with datasource ActivityLookupService
 */
angular.module('scheduling.main').directive('schedulingMainActivityLookupDirective', ['BasicsLookupdataLookupDirectiveDefinition', 'schedulingMainActivityLookupService', function (DirectiveDefinition, activitylookupservice) {
	'use strict';

	let result = new DirectiveDefinition('combobox-edit', {
		lookupType: 'activityproperties',
		valueMember: 'key',
		displayMember: 'description'
	},
	{
		dataProvider: activitylookupservice
	}
	);

	return result;

}]);
