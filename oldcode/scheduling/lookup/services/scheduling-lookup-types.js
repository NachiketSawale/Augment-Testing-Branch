/**
 * The constant contains lookup types which can be used in lookup directive.
 */
angular.module('scheduling.lookup').value('schedulingLookupTypes', {
	'activityconstraint': 'scheduling/lookup/constrainttypes',
	'activityprogressreportmethod': 'scheduling/lookup/progressreportmethods',
	'activityrelationkind': 'scheduling/lookup/relationkinds',
	'activityschedulingmethod': 'scheduling/lookup/schedulingmethods',
	'activitystate': 'scheduling/lookup/activitystates',
	'activitytasktype':'scheduling/lookup/tasktypes',
	'eventtype':'scheduling/lookup/eventtype'
});