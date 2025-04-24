/**
 * Created by wed on 09/04/2019.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).value('basicsCostGroupFilterCatalogFilterTypes', {
		moduleType: {
			UNDEFINED: '',
			ACTIVITY_CRITERIA: 'activitycriteria',
			ASSEMBLY: 'assembly',
			CONSTRUCTION_SYSTEM: 'constructionsystem',
			CUSTOMIZE: 'customize',
			EMPLOYEE: 'employee',
			MATERIAL: 'material',
			PROJECT: 'project',
			WIC: 'wic'
		},
		moduleName: {
			UNDEFINED: '',
			BOQ: 'boq',
			CONSTRUCTURE_SYSTEM: 'constructionsystem',
			ENGINEERING: 'engineering',
			ESTIMATE: 'estimate',
			MODEL: 'model',
			PROCUREMENT: 'procurement',
			PRODUCTION_SYSTEM: 'productionsystem',
			QUANTITY_TAKE_OFF: 'quantitytakeoff'
		}
	});

})(angular);