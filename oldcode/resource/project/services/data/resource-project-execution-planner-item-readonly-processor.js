/**
 * Created by shen on 29.01.2025
 */

(function (angular) {
	'use strict';
	const myModule = angular.module('resource.project');

	myModule.service('resourceProjectExecPlannerItemReadOnlyProcessor', ResourceProjectExecPlannerItemReadOnlyProcessor);

	ResourceProjectExecPlannerItemReadOnlyProcessor.$inject = ['platformRuntimeDataService'];

	function ResourceProjectExecPlannerItemReadOnlyProcessor(platformRuntimeDataService) {
		this.processItem = function processExecPlannerItemEntity(item) {
			let isEntityReadOnly = item.ActionItemStatusFk === 7;
			platformRuntimeDataService.readonly(item, isEntityReadOnly ? true : [
				{ field: 'DocumentFk', readonly: !item.IsRequestPrjDocument },
				{ field: 'PlantCertificateFk', readonly: !item.IsRequestPlantCertificate },
				{ field: 'ContractHeaderFk', readonly: !item.IsRequestPrcContract },
				{ field: 'BusinessPartnerFk', readonly: !item.IsRequestBizPartner },
				{ field: 'ClerkResponsibleFk', readonly: !item.IsRequestClerk },
				{ field: 'IsRequestDate', readonly: true },
				{ field: 'IsRequestUrl', readonly: true },
				{ field: 'IsRequestPrjDocument', readonly: true },
				{ field: 'IsRequestPlantCertificate', readonly: true },
				{ field: 'IsRequestBizPartner', readonly: true },
				{ field: 'IsRequestPrcContract', readonly: true },
				{ field: 'IsRequestClerk', readonly: true },
			]);
		};
	}
})(angular);