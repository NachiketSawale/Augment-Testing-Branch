/**
 * Created by chi on 4/19/2019.
 */
(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.pes';

	angular.module(moduleName).factory('procurementPesWizardCreateCOContractForNewService', procurementPesWizardCreateCOContractForNewService);

	procurementPesWizardCreateCOContractForNewService.$inject = ['_', '$http', '$translate', 'globals', 'platformDataServiceFactory'];

	function procurementPesWizardCreateCOContractForNewService(_, $http, $translate, globals, platformDataServiceFactory) {
		var localCache = [];
		var serviceOptions = {
			module: angular.module(moduleName),
			serviceName: 'procurementPesWizardCreateCOContractForNewService',
			httpRead: {
				useLocalResource: true,
				resourceFunction: function () {
					return localCache;
				}
			},
			presenter: {
				list: {}
			},
			entitySelection: {},
			modification: {},
			actions: {
				delete: false,
				create: false
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		service.setData = setData;
		service.reset = reset;
		service.getChangeOrderContractsByPesId = getChangeOrderContractsByPesId;
		service.createChangeOrderContracts = createChangeOrderContracts;
		service.createFrameworkContracts = createFrameworkContracts;
		service.markItemAsModified = function () {
		};
		return service;

		// ///////////////

		function setData(data) {
			localCache = angular.copy(data);
			service.load();
		}

		function reset() {
			localCache = [];
		}

		function getChangeOrderContractsByPesId(id) {
			return $http.get(globals.webApiBaseUrl + 'procurement/pes/wizard/getchangeordercontracts?pesHeaderId=' + id);
		}

		function createChangeOrderContracts(id, changeOrderContracts) {
			var data = {
				PesHeaderId: id,
				ChangeOrderContracts: changeOrderContracts
			};
			return $http.post(globals.webApiBaseUrl + 'procurement/pes/wizard/createchangeordercontracts', data);
		}

		function createFrameworkContracts(id, frameworkContracts) {
			var data = {
				PesHeaderId: id,
				FrameworkContracts: frameworkContracts
			};
			return $http.post(globals.webApiBaseUrl + 'procurement/pes/wizard/createframeworkcontracts', data);
		}
	}

})(angular);