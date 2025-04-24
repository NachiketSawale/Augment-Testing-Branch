/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('project.main').factory('projectMainDocumentsProjectService',
		['$translate','documentsProjectDocumentDataService', 'projectMainService',
			function ($translate,documentsProjectDocumentDataService, projectMainService) {

				function register() {

					var config = {
						moduleName: 'project.main',
						title: $translate.instant('project.main.projectListTitle'),
						parentService: projectMainService,
						columnConfig: [
							{documentField: 'PrjProjectFk', dataField: 'Id', readOnly: false},
							{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
							{documentField: 'ConHeaderFk', readOnly: false},
							{documentField: 'MdcControllingUnitFk', readOnly: false},
							{documentField: 'MdcMaterialCatalogFk', readOnly: false},
							{documentField: 'PrcPackageFk', readOnly: false},
							{documentField: 'InvHeaderFk', readOnly: false},
							{documentField: 'PrcStructureFk', readOnly: false},
							{documentField: 'PesHeaderFk', readOnly: false},
							{documentField: 'BpdCertificateFk',readOnly: false},
							{documentField: 'EstHeaderFk', readOnly: false},
							{documentField: 'PrjLocationFk', readOnly: false},
							{documentField: 'PsdActivityFk', readOnly: false},
							{documentField: 'PsdScheduleFk', readOnly: false},
							{documentField: 'QtnHeaderFk', readOnly: false},
							{documentField: 'RfqHeaderFk', readOnly: false},
							{documentField: 'ReqHeaderFk', readOnly: false}
						],
						subModules: [
							{
								service: 'estimateProjectService',
								title: $translate.instant('project.main.estimate'),
								columnConfig: [
									{documentField: 'EstHeaderFk', dataField: 'EstHeader.Id', readOnly: false},
									{
										documentField: 'PrjProjectFk',
										dataField: 'PrjEstimate.PrjProjectFk',
										readOnly: false
									}
								]
							},
							{
								service: 'projectLocationMainService',
								title: $translate.instant('project.main.locationContainerTitle'),
								columnConfig: [
									{documentField: 'PrjLocationFk', dataField: 'Id', readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false}
								]
							},
							{
								service: 'schedulingScheduleEditService',
								title: $translate.instant('scheduling.schedule.listTitle'),
								columnConfig: [
									{documentField: 'PsdScheduleFk', dataField: 'Id', readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false}
								]
							},
							{
								service: 'modelProjectModelDataService',
								title: $translate.instant('project.main.modelContainerTitle'),
								columnConfig: [
									{documentField: 'ModelFk', dataField: 'Id', readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false}
								]
							},
							{
								service: 'modelProjectModelVersionDataService',
								title: $translate.instant('project.main.modelversion'),
								columnConfig: [
									{documentField: 'ModelFk', dataField: 'Id', readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false}
								]
							}
						]
					};
					documentsProjectDocumentDataService.register(config);
				}

				function unRegister() {
					documentsProjectDocumentDataService.unRegister();
				}

				return {
					register: register,
					unRegister: unRegister
				};
			}]);
})(angular);
