
(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateAllowanceDialogDataService', ['_','$q', '$injector', '$http', '$translate',  'PlatformMessenger', 'platformModalService','estimateMdcAllowanceAreaService',
		function (_,$q, $injector, $http, $translate,  PlatformMessenger,  platformModalService,estimateMdcAllowanceAreaService) {

			let  service = {};
			let  allowance = null;
			let costCodeAssignmentGridService = $injector.get ('estimateAllowanceMarkUp2CostCodeAssignmentGridService');

			service.getCurrentAllowance = function () {
				return allowance;
			};

			service.setCurrentAllowance = function (value){
				allowance = value;
			};

			service.saveAllowance = function (saveAllowance) {
				let markUp2CostCode = costCodeAssignmentGridService.getItemsToSave();

				_.forEach(markUp2CostCode,function (d) {
					d.CostCodes =null;
				});
				markUp2CostCode =_.uniqBy(markUp2CostCode,'Id');
				let markUp2Delete = costCodeAssignmentGridService.getItemsToDelete();
				saveAllowance.MdcAllMarkup2CostCodes = markUp2CostCode;
				saveAllowance.BasQuantityTypeFk = saveAllowance.QuantityTypeFk;
				saveAllowance.MdcAllMarkup2CostCodesToDelete = markUp2Delete;

				let allowanceAreaToSave = estimateMdcAllowanceAreaService.getItemsToSave();
				let allowanceAreaToDelete = estimateMdcAllowanceAreaService.getItemsToDelete();
				let allowanceValueToSave = estimateMdcAllowanceAreaService.getValuesToSave();
				let allowanceValueToDelete = estimateMdcAllowanceAreaService.getValuesToDelete();
				saveAllowance.AllowanceAreaToSave = allowanceAreaToSave;
				saveAllowance.AllowanceAreaToDelete = allowanceAreaToDelete;
				saveAllowance.AllowanceValueToSave = allowanceValueToSave;
				saveAllowance.AllowanceValueToDelete = allowanceValueToDelete;
				saveAllowance.IsDeleteOldData = !((saveAllowance.OldAllowanceTypeFk < 3 && saveAllowance.AllowanceTypeFk < 3) || (saveAllowance.OldAllowanceTypeFk > 2 && saveAllowance.AllowanceTypeFk > 2));
				saveAllowance.MdcAllAreaGroupTypeFk = saveAllowance.AllAreaGroupTypeFk;

				let estimateMdcAllowanceCompanyService = $injector.get('estimateMdcAllowanceCompanyService');
				saveAllowance.MdcAllowanceCompanyFkToDelete = estimateMdcAllowanceCompanyService.getMdcAllowanceCompanyFkToDelete();
				saveAllowance.MdcAllowanceCompanyFkToSave = estimateMdcAllowanceCompanyService.getMdcAllowanceCompanyFkToSave();
				$http.post (globals.webApiBaseUrl + 'estimate/main/mdcAllowance/save', saveAllowance).then (function (response) {
					if(response && response.data){
						let customizeDataService = $injector.get('basicsCustomizeInstanceDataService');
						if (customizeDataService){
							customizeDataService.load();
						}
					}

				});
			};

			service.afterChangeAllowanceTypeFk = new PlatformMessenger();

			service.showDialog = function(entity) {
				let currentAllowance = angular.copy(entity);
				$injector.get ('estimateMainCostCodeAssignmentDetailLookupDataService').setContextId (currentAllowance.MasterContextFk);
				$injector.get ('estimateMainCostCodeAssignmentDetailLookupDataService').setEditType ('customizing');
				$injector.get ('basicsLookupdataLookupDefinitionService').load(['estimateMainCostCodeAssignmentDetailLookup']);
				currentAllowance.OldAllowanceTypeFk = currentAllowance.AllowanceTypeFk;
				currentAllowance.AllAreaGroupTypeFk = currentAllowance.AllowanceTypeFk !== 3 ? null : 1;
				costCodeAssignmentGridService.clearData();
				let estimateMdcAllowanceCompanyService = $injector.get('estimateMdcAllowanceCompanyService');
				estimateMdcAllowanceCompanyService.setMdcAllowanceFk(currentAllowance.Id);
				estimateMdcAllowanceCompanyService.setMdcContextId(currentAllowance.MasterContextFk);
				estimateMdcAllowanceCompanyService.setIsReadOnlyContainer(false);
				estimateMdcAllowanceCompanyService.setIsLoadData(true);

				service.setCurrentAllowance (currentAllowance);
				let dialogOptions = {
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/estimate-allowance/estimate-allowance-properties-model.html',
					dataItem: currentAllowance,
					width: '950px',
					backdrop: false,
					headerText: $translate.instant ('estimate.main.estimateAllowance'),
					height: '1000px',
					resizeable: true,
					uuid: '2B2A5BDF32434hd9BD78C99AFB135dy8'
				};
				platformModalService.showDialog (dialogOptions).then (function (result) {
					if (result.ok) {
						currentAllowance.AllAreaGroupTypeFk = currentAllowance.AllowanceTypeFk !== 3 ? null : currentAllowance.AllAreaGroupTypeFk;
						service.saveAllowance(result.data);
					}
				}
				);
			};


			return service;

		}]);
})();
