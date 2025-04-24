/**
 * Created by clv on 1/7/2019.
 */
(function(angular, globals){

	'use strict';
	var moduleName = 'procurement.package';


	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.changeProject = function changeProject($injector) {

		var procurementPackageDataService = $injector.get('procurementPackageDataService');
		var projectChangeLookupDataService = $injector.get('projectChangeLookupDataService');

		var packageItem = procurementPackageDataService.getSelected();
		var filter = packageItem ? packageItem.ProjectFk : 0;
		projectChangeLookupDataService.setFilter(filter);

		return {
			lookupOptions: {
				lookupType: 'ChangeProject',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '4a87175230504e539e4bf288b32f27ca',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 140,
						toolTip: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'desc',
						field: 'Description',
						name: 'Description',
						width: 240,
						toolTip: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				]
			},
			dataProvider: projectChangeLookupDataService
		};
	};

	angular.module(moduleName).directive('changeOrderContractProjectChangeLookup', changeOrderContractProjectChangeLookup);
	changeOrderContractProjectChangeLookup.$inject = ['$injector', 'BasicsLookupdataLookupDirectiveDefinition'];
	function changeOrderContractProjectChangeLookup($injector, BasicsLookupdataLookupDirectiveDefinition){

		var defaults = globals.lookups.changeProject($injector);
		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions,{
			dataProvider: defaults.dataProvider
		});
	}
})(angular, globals);