

(function (angular) {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateAllowanceAssignmentValidationServices',['$translate','platformDataValidationService','estimateAllowanceAssignmentGridService',
		function ($translate, platformDataValidationService,dataService) {
			let service = {};

			service.validateMdcAllowanceFk = function (entity, value, model){
				return service.validateCode(entity, value, model);
			};
			service.validateCode = function (entity, value, model){
				let res = platformDataValidationService.isMandatory(value, model) && platformDataValidationService.isUnique(dataService.getList(), 'MdcAllowanceFk', value, entity.MdcAllowanceFk);
				if(!res.valid){
					// mdcAllowanceFkEmptyErrMsg.
					res.error =  $translate.instant('estimate.main.mdcAllowanceFkEmptyErrMsg');
					res.error$tr$ =  $translate.instant('estimate.main.mdcAllowanceFkEmptyErrMsg');
				}
				return platformDataValidationService.finishValidation(res, entity, entity.MdcAllowanceFk, 'MdcAllowanceFk', service, dataService);
			};

			service.validateIsActive = function (entity, value){
				entity.IsActive = value;
				if(value){
					let list = dataService.getList();
					_.forEach(list,function (d) {
						if(d.Id !== entity.Id){
							d.IsActive = false;
						}else{
							d.IsActive = entity.IsActive;
						}
					});
				}
				dataService.refreshGrid();
				return  true;
			};

			return service;

		}]);
})(angular);
