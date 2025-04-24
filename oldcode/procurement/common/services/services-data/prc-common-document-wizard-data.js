/**
 * Created by jie on 2022-10-10.
 */
(function (angular) {
	'use strict';
	let moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementDocumentChangeStatus', ['_', '$injector','basicsCommonChangeStatusService','procurementContextService', 'basicsLookupdataSimpleLookupService',
		function (_, $injector,basicsCommonChangeStatusService,procurementContextService, basicsLookupdataSimpleLookupService) {
			function provideStatusChangeInstance(mainService, moduleName, id) {
				let config = {};
				if($injector.get('procurementContextService').getMainService().getServiceName()==='procurementRequisitionHeaderDataService'||$injector.get('procurementContextService').getMainService().getServiceName() ==='procurementContractHeaderDataService'){
					config.mainService = $injector.get('procurementContextService').getMainService();
					config.getDataService = function () {
						let leadingService = $injector.get('procurementContextService').getMainService();
						let dataService = $injector.get('procurementCommonDocumentCoreDataService');
						return dataService.getService(leadingService);
					};
				}else{
					config.mainService = $injector.get('procurementContextService').getMainService().parentService();
					config.getDataService = function () {
						let leadingService = $injector.get('procurementContextService').getMainService().parentService();
						let dataService = $injector.get('procurementCommonDocumentCoreDataService');
						return dataService.getService(leadingService);
					};
				}
				config.statusName = 'prcdocument';
				config.codeField = 'Description';
				config.descField = 'Description';
				config.statusField = 'PrcDocumentStatusFk';
				config.statusDisplayField = 'Description';
				config.projectField = 'ProjectFk';
				config.title = 'basics.common.changePrcDocumentStatus';
				config.statusProvider = function (entity) {
					return basicsLookupdataSimpleLookupService.refreshCachedData({
						valueMember: 'Id',
						displayMember: 'Description',
						lookupModuleQualifier: 'prc.common.documentstatus'
					}).then(function (respond) {
						return _.filter(respond, function (item) {
							return (item.isLive) || (entity.PrcDocumentStatusFk === item.Id);
						});
					});
				};
				//config.updateUrl = 'procurement/common/prcdocument/changestatus';
				config.id = id || 12345;

				return basicsCommonChangeStatusService.provideStatusChangeInstance(config);
			}
			return {
				provideStatusChangeInstance: provideStatusChangeInstance
			};
		}]);
})(angular);