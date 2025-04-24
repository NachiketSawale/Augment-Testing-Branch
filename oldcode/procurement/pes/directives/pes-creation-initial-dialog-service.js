/**
 * Created by jie on 2023/08/10
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pes';
	var contractMainModule = angular.module(moduleName);
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc service
	 * @name pesCreationInitialDialogService
	 * @function
	 *
	 * @description
	 * pesCreationInitialDialogService is the data service for all creation initial dialog related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	contractMainModule.service('pesCreationInitialDialogService', PesCreationInitialDialogService);

	PesCreationInitialDialogService.$inject = ['_', '$q', 'procurementContextService', '$injector', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService',
		'$http','cloudDesktopPinningContextService','procurementPesNumberGenerationSettingsService'];

	function PesCreationInitialDialogService(_, $q, procurementContextService, $injector, basicsLookupdataLookupDescriptorService, platformRuntimeDataService,
		$http,cloudDesktopPinningContextService,procurementPesNumberGenerationSettingsService) {

		function requestDefaultForPes(createItem,conf,data) {
			let validationService = $injector.get('procurementPesHeaderValidationService');
			return  $http.get(globals.webApiBaseUrl + 'procurement/pes/header/getdefaultvalues').then(function callback(response){
				var defaultPes = response.data;
				defaultPes.DateDelivered=moment.utc(defaultPes.DateDelivered);
				defaultPes.DateEffective=moment.utc(defaultPes.DateEffective);
				defaultPes.DocumentDate=moment.utc(defaultPes.DocumentDate);
				_.extend(createItem.dataItem, defaultPes);
				if (response !== null && response.data !== null) {
					var projectVal = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
					response.data.ProjectFk = projectVal ? projectVal.id : null;
					if (data.onCreateSucceeded) {
						if (response.data.ProjectFk && !response.data.ControllingUnitFk) {
							return getControllingUnits(response.data.ProjectFk).then(function (controllingUnits) {
								if (controllingUnits) {
									var ctrlUnits = [];
									getAllLevelUnits(controllingUnits, ctrlUnits);
									return  $http.get(globals.webApiBaseUrl + 'controlling/structure/lookup/controllingunitstatus')
										.then(function (unitStatuses) {
											var controllingUnitStatuses = unitStatuses.data;
											if (controllingUnitStatuses) {
												var filterByProjectId = _.filter(ctrlUnits, function (item) {
													var found = _.find(controllingUnitStatuses, {
														Id: item.ControllingunitstatusFk,
														IsOpen: true
													});
													return item.IsDefault && item.IsAccountingElement && found;
												});
												var sortedData = _.sortBy(filterByProjectId, function (n) {
													return n.Id;
												});
												var firstItem = sortedData[0];
												if (firstItem) {
													response.data.ControllingUnitFk = firstItem.Id;
												}
											}
											createSuccessed(createItem);
										});
								} else {
									return createSuccessed(createItem);
								}
							});
						} else {
							return createSuccessed(createItem);
						}
					}
				}
			});
		}

		function requestPesCreationData(modalCreateProjectConfig,conf,data) {
			return $q.all([
				requestDefaultForPes(modalCreateProjectConfig,conf,data)
			]);
		}


		this.adjustCreateConfiguration = function adjustCreateConfiguration(dlgLayout,conf,data) {

			return requestPesCreationData(dlgLayout,conf,data).then(function () {
				return dlgLayout;
			});
		};
		function getControllingUnits(projectId) {
			var defer = $q.defer();
			$http.get(globals.webApiBaseUrl + 'controlling/structure/tree?mainItemId=' + projectId).then(function (response) {
				defer.resolve(response.data);
			});
			return defer.promise;
		}
		function getAllLevelUnits(Units, resultUnits) {
			_.forEach(Units, function (unit) {
				resultUnits.push(unit);
				if (unit.ControllingUnits !== null) {
					getAllLevelUnits(unit.ControllingUnits, resultUnits);
				}
			});
		}
		function createSuccessed(createItem){
			var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: createItem.dataItem.PrcConfigurationFk});
			platformRuntimeDataService.readonly(createItem.dataItem, [{
				field: 'Code',
				readonly: procurementPesNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk)
			}]);
			createItem.dataItem.Code = procurementPesNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, createItem.dataItem.Code);
			return createItem;
		}
	}
})(angular);
