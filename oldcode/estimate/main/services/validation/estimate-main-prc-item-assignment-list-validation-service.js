(function (angular) {
	/* global  globals */
	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module (moduleName);

	estimateMainModule.factory ('estimateMainPrcItemAssignmentListValidationService',
		['$q', '$translate', '$http', '$injector', 'platformDataValidationService', 'estimateMainPrcItemAssignmentListService', 'platformRuntimeDataService', 'platformGridAPI', 'procurementPackageBoqLookupService', 'cloudCommonGridService',
			function ($q, $translate, $http, $injector, platformDataValidationService, dataService, platformRuntimeDataService, platformGridAPI, procurementPackageBoqLookupService, cloudCommonGridService) {

				let service = {};

				service.validatePrcPackageFk = function validatePrcPackageFk(entity,value,model) {
					let res =  platformDataValidationService.isMandatory(value, model);
					entity.BoqHeaderFk = entity.BoqItemFk = entity.PrcItemFk = entity.BoqHeaderReference = null;
					platformRuntimeDataService.applyValidationResult(res, entity, model);
					return platformDataValidationService.finishValidation(res, entity, value, model, service, dataService);
				};

				service.validateEstResourceFk = function validatePrcPackageFk(entity, value) {
					entity.PrcItemFk = !value ? null : entity.PrcItemFk;
					dataService.setColumnsReadOnly (entity, ['PrcItemFk'], !value);
					return true;
				};

				service.asyncValidatePrcPackageFk = function asyncValidatePrcPackageFk(entity, value) {
					let defer = $q.defer();
					entity.PrcPackageFk = value;

					getUniqueResult(entity,value,defer);
					return defer.promise;
				};

				service.asyncValidateEstResourceFk = function asyncValidateEstResourceFk(entity, value) {
					let defer = $q.defer();
					entity.EstResourceFk = value;

					getUniqueResult(entity,value,defer);
					return defer.promise;
				};

				function getUniqueResult(entity, value,defer) {
					let prcItemAssignmentList = dataService.getList ();
					let res = {valid:true};

					let url = globals.webApiBaseUrl + 'procurement/common/prcitemassignment/getPrcItemAssignments';
					let param = {
						LineItemFk: entity.EstLineItemFk,
						EstHeaderFk: entity.EstHeaderFk,
						ResourceFk: entity.EstResourceFk,
					};
					$http.post (url, param).then (function (readData) {
						prcItemAssignmentList = prcItemAssignmentList.concat (readData.data.dtos);

						for (let i = 0; i < prcItemAssignmentList.length; i++) {
							let pItem = prcItemAssignmentList[i];
							if (pItem.Id !== entity.Id && (pItem.EstLineItemFk === entity.EstLineItemFk && pItem.EstResourceFk === entity.EstResourceFk && pItem.PrcPackageFk === entity.PrcPackageFk)) {
								res.valid = false;
								break;
							}
						}

						if (!res.valid) {
							res.error = $translate.instant ('estimate.main.resourceUniqueError');
						}
						platformRuntimeDataService.applyValidationResult (res, entity, 'EstResourceFk');
						platformDataValidationService.finishValidation (res, entity, value, 'EstResourceFk', service, dataService);
						if(entity.PrcPackageFk){
							platformRuntimeDataService.applyValidationResult (res, entity, 'PrcPackageFk');
							platformDataValidationService.finishValidation (res, entity, value, 'PrcPackageFk', service, dataService);
						}


						platformGridAPI.grids.resize ('4cf3bc54dd38437b8aaae2005cc80ae4');
						defer.resolve (res);
					});
				}

				function getBoqRootItem(item) {
					let rootItem = null;
					if (item && angular.isDefined (item.Id)) {
						let list = procurementPackageBoqLookupService.getList ();
						if (list && list.length > 0) {
							let output = [];
							cloudCommonGridService.flatten (list, output, 'BoqItems');
							rootItem = cloudCommonGridService.getRootParentItem (item, output, 'BoqItemFk');
						}
					}
					return rootItem && angular.isDefined (rootItem.Id) ? rootItem : null;
				}

				service.validateBoqItemFk = function validateBoqItemFk(entity, value) {
					if (value) {
						let boqItem = procurementPackageBoqLookupService.getItemById (value);
						let rootItem = getBoqRootItem (boqItem);
						if (rootItem && angular.isDefined (rootItem.Id)) {
							entity.BoqHeaderFk = boqItem.BoqHeaderFk;
							entity.BoqHeaderReference = rootItem.Reference;
						}
					} else {
						entity.BoqHeaderFk = null;
						entity.BoqHeaderReference = null;
					}

					return true;
				};

				return service;
			}
		]);

})(angular);
