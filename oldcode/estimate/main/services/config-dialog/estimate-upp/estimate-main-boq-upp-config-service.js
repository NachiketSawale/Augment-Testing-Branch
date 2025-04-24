(function (angular){
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('estimateMainBoqUppConfigService', ['$http', '$injector','estimateMainDialogDataService','estimateMainEstUppDataService','estimateMainService','salesCommonBaseBoqLookupService',
		function ($http, $injector, estimateMainDialogDataService, estimateMainEstUppDataService,estimateMainService, salesCommonBaseBoqLookupService){
			let service = {};

			service.showDialog = function (){
				let dialogConfig = {
					contextId: '',
					editType : 'estBoqUppConfig',
					columnConfigTypeId:'',
					totalsConfigTypeId:'',
					structureConfigTypeId:'',
					costBudgetConfigTypeId:'',
					columnConfigFk:'',
					totalsConfigFk:'',
					structureConfigFk:'',
					uppConfigFk: 0,
					uppConfigTypeId: 0,
					costBudgetConfigFk:'',
					isInUse : false
				};

				let projectFk = estimateMainService.getSelectedProjectId();
				// filter the boq structure by project
				salesCommonBaseBoqLookupService.setCurrentProject(projectFk);
				$injector.get('estimateMainEstUppConfigTypeService').setFilterByMdcContextId(true);
				estimateMainDialogDataService.showDialog(dialogConfig);
			};

			service.reloadUrpConfig = function (boqHeaderId){
				let estHeaderId = $injector.get('estimateMainService').getSelectedEstHeaderId();
				if(!estHeaderId){
					let option = {
						headerTextKey: 'cloud.common.informationDialogHeader',
						showOkButton: true,
						bodyTextKey: 'estimate.main.estimateCodeEmptyErrMsg',
						iconClass: 'ico-warning'
					};
					$injector.get('platformModalService').showDialog(option);
					return;
				}
				if(boqHeaderId){
					estimateMainEstUppDataService.clear();
					estimateMainEstUppDataService.loadByEstNBoq(null,boqHeaderId);
				}
			};

			return service;
		}]);


})(angular);