
(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateAllowanceConfigTypeDialogDataService', ['$q', '$injector', '$http', '$translate',  'PlatformMessenger', 'platformModalService',
		function ($q, $injector, $http, $translate,  PlatformMessenger,  platformModalService) {

			let  service = {};
			let  allowance = null;

			service.getCurrentAllowanceConfigType = function () {
				return allowance;
			};

			service.setCurrentAllowanceConfigType = function (value){
				allowance = value;
			};

			service.saveAllowanceConfig = function (saveAllowance) {
				let estAllowanceAssignmentToDelete = $injector.get ('estimateAllowanceAssignmentGridService').getItemsToDelete();

				saveAllowance.EstAllowanceAssignmentToSave =  $injector.get ('estimateAllowanceAssignmentGridService').getList();
				saveAllowance.EstAllowanceAssignmentToDelete = estAllowanceAssignmentToDelete;
				saveAllowance.MdcContextFk =saveAllowance.MasterdataContextFk;
				saveAllowance.EstAllowanceConfigFk =saveAllowance.AllowanceConfigFk;
				$http.post (globals.webApiBaseUrl + 'estimate/EstAllowanceConfigType/save', saveAllowance).then (function (response) {
					if(response && response.data){
						let customizeDataService = $injector.get('basicsCustomizeInstanceDataService');
						if (customizeDataService){
							customizeDataService.load();
						}
					}

				});
			};

			service.showDialog = function(currentAllowance) {

				let estAllowanceConfigFk = currentAllowance.AllowanceConfigFk ? currentAllowance.AllowanceConfigFk:-1;
				let masterdataContextFk = currentAllowance.MasterdataContextFk ? currentAllowance.MasterdataContextFk:-1;
				$injector.get('estimateAllowanceAssignmentGridService').setMdcContextId(currentAllowance.MasterdataContextFk);

				$http.get (globals.webApiBaseUrl + 'estimate/EstAllowanceConfigType/getEstAllowanceConfigNAssignment?estAllowanceConfigFk='+estAllowanceConfigFk+'&mdcContextFk='+masterdataContextFk).then (function (response) {
					if(response && response.data){
						currentAllowance.EstAllowanceConfigEntity = response.data.AllowanceConfig;
						currentAllowance.EstAllowanceConfigDesc = response.data.AllowanceConfig.DescriptionInfo;
						currentAllowance.AllowanceConfigFk =response.data.AllowanceConfig.Id;
						currentAllowance.EstAllowanceAssignmentEntities = response.data.AllowanceAssigments;
						$injector.get('estimateAllowanceLookupDataService').setList(response.data.AllowanceDtos);
					}

					service.setCurrentAllowanceConfigType (currentAllowance);
					$injector.get ('estimateAllowanceAssignmentGridService').clear();
					$injector.get('estimateMdcAllowanceCompanyService').setIsLoadData(false);
					$injector.get('estimateMdcAllowanceCompanyService').setIsReadOnlyContainer(true);
					let dialogOptions = {
						templateUrl: globals.appBaseUrl + 'estimate.main/templates/estimate-allowance-config-type/estimate-allowance-config-type-model.html',
						dataItem: currentAllowance,
						width: '900px',
						backdrop: false,
						headerText: $translate.instant ('estimate.main.allowanceConfig'),
						resizeable: true,
						uuid: 'CE36610FACEA4CEFBBBF0E90AB3C3689'
					};
					platformModalService.showDialog (dialogOptions).then (function (result) {
						if (result && result.ok) {
							service.saveAllowanceConfig(result.data);
						}
					}
					);
				});
			};


			return service;

		}]);
})();
