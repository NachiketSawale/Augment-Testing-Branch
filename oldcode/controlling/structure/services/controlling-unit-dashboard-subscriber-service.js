/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular){
	'use strict';

	var controllingStructureModule = angular.module('controlling.structure');

	controllingStructureModule.factory('controllingStructureDashboardSubscriberService', [
		'globals',
		'$q',
		'$rootScope',
		'$http',
		'platformDataServiceFactory',
		'projectMainForCOStructureService',
		'controllingStructureMainService',
		function (
			globals,
			$q,
			$rootScope,
			$http,
			platformDataServiceFactory,
			projectMainForCOStructureService,
			controllingStructureMainService) {

			var serviceContainer = platformDataServiceFactory.createNewComplete({
				flatRootItem: {
					module: controllingStructureModule,
					serviceName: 'controllingStructureDashboardSubscriberService',
					entityRole: {
						root: {}
					}
				}
			});

			serviceContainer.service.subscribeDashboardEvent = function () {
				// // for testing
				// window.db1 = {
				//    uuid: '2ba099893ac6464bbaeb60979b519545',
				//    data: {
				//       'id_desc_filter': {
				//          name: "id_desc_filter",
				//          value: ["060401-03 | 03 des"],
				//          tableName: "",
				//          dataSourceName: "ITWO CONTROLLING"
				//       }
				//    }
				// };
				// window.db2 = {
				//    uuid: '2ba099893ac6464bbaeb60979b519545',
				//    data: {
				//       'id_desc_filter': {
				//          name: "id_desc_filter",
				//          value: ["060401-04 | 04des"],
				//          tableName: "",
				//          dataSourceName: "ITWO CONTROLLING"
				//       }
				//    }
				// };
				// window.rs = $rootScope;
				// // end for testing

				// #129299 - Controlling Units - Drill Down - Connect PES and Contract containers to dashboard event
				$rootScope.$on('dashboard:filtered-data', function (e, args) {
					console.log('dashboard:filtered-data', args);

					if (!args.data.id_desc_filter) {
						return;
					}

					const contrUnitFilter = 'CONTROLLING UNITS';
					const contrCostCodeFilter = 'CO COST CODES';
					let filter = args.data.id_desc_filter;
					let values = filter.value || filter.values;
					let filterData = {
						contrUnitCode: '',
						contrCostCode: ''
					};

					values.forEach(function (value, index) {
						let structureFilter = args.data['STRUCTURE_FILTER_' + (index + 1)];

						if (!structureFilter) {
							return;
						}

						let codeDesc = value.split('|');
						let code = codeDesc[0].trim();

						switch (structureFilter.value) {
							case contrUnitFilter:
								filterData.contrUnitCode = code;
								break;
							case contrCostCodeFilter:
								filterData.contrCostCode = code;
								break;
						}
					});

					$q.all([
						serviceContainer.service.getControllingUnit(filterData.contrUnitCode),
						serviceContainer.service.getControllingCostCode(filterData.contrCostCode)
					]).then(function (res) {
						serviceContainer.service.select(res[0] ? res[0].Id : null, res[1] ? res[1].Id : null);
					});
				});

				controllingStructureMainService.registerSelectionChanged(function () {
					const cu = controllingStructureMainService.getSelected();

					if (cu) {
						serviceContainer.service.select(cu.Id,null,!!cu.isCreate);
					} else {
						serviceContainer.service.select(null);
					}

				});
			};

			serviceContainer.data.doUpdate = null;

			serviceContainer.service.select = function (contrUnitId, contrCostCodeId, isCreate) {
				if (!contrUnitId && !contrCostCodeId) {
					serviceContainer.service.setSelected(null);
				} else {
					let entity = {
						Id: 'cu-' + contrUnitId + 'co' + contrCostCodeId,
						ControllingUnitId: contrUnitId,
						ControllingCostCodeId: contrCostCodeId,
						IsCreate: isCreate
					};
					serviceContainer.service.setSelected(entity);
				}
			};

			serviceContainer.service.getControllingUnit = function (code) {
				let selected = projectMainForCOStructureService.getSelected();

				if (!selected || !code) {
					return $q.when(null); // project is not selected
				}

				let projectId = selected.Id;
				let url = globals.webApiBaseUrl + 'controlling/structure/getcontrollingunitbycode?projectId=' + projectId + '&code=' + code;

				return $http.get(url).then(function (res) {
					return res.data;
				});
			};

			serviceContainer.service.getControllingCostCode = function (code) {
				if (!code) {
					return $q.when(null);
				}

				let url = globals.webApiBaseUrl + 'basics/controllingcostcodes/getbycode?&code=' + code;

				return $http.get(url).then(function (res) {
					return res.data;
				});
			};

			serviceContainer.service.subscribeDashboardEvent();

			return serviceContainer.service;
		}
	]);
})(angular);