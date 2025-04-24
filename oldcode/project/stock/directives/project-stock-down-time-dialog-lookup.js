// eslint-disable-next-line no-redeclare
/* global angular,globals */

(function (angular, globals) {
	'use strict';
	var moduleName = 'project.stock';

	globals.lookups.stockDownTime = function stockDownTime() {
		return {
			lookupOptions: {
				lookupType: 'ProjectStockDownTime',
				valueMember: 'Id',
				displayMember: 'Description',
				columns: [
					{id: 'desc',field: 'Description', name: 'Description', width: 120, name$tr$: 'cloud.common.entityDescription'},
					{ id: 'startDate', field: 'StartDate', name: 'Start Date', name$tr$: 'basics.customize.startdate', formatter: 'date'},
					{ id: 'endDate', field: 'EndDate', name: 'End Date', name$tr$: 'basics.customize.enddate', formatter: 'date'},
					{
						id: 'clerkFk',
						field: 'BasClerkFk',
						name: 'Clerk',
						name$tr$: 'cloud.common.Clerk',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'clerk',
							displayMember: 'Code'
						}
					}
				],
				uuid:'7175eefd68d440419b3b73ea2ea70ec2'
			}
		};
	};

	angular.module(moduleName).directive( 'projectStockDownTimeLookupDialog', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.stockDownTime().lookupOptions);
		}
	]);
})(angular, globals);
