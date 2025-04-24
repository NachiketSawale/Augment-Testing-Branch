/**
 * Created by chi on 4/19/2019.
 */
(function(angular){

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.pes';

	angular.module(moduleName).controller('procurementPesWizardCreateCOContractForNewDialogController', procurementPesWizardCreateCOContractForNewDialogController);

	procurementPesWizardCreateCOContractForNewDialogController.$inject = [
		'$scope',
		'$translate',
		'basicsCommonDialogGridControllerService',
		'procurementPesWizardCreateCOContractForNewUIService',
		'procurementPesWizardCreateCOContractForNewService',
		'procurementPesWizardCreateCOContractForNewValidationService',
		'platformModalService',
		'controllerOptions',
		'_',
		'cloudDesktopInfoService',
		'$injector',
		'platformGridAPI'
	];

	function procurementPesWizardCreateCOContractForNewDialogController(
		$scope,
		$translate,
		basicsCommonDialogGridControllerService,
		procurementPesWizardCreateCOContractForNewUIService,
		procurementPesWizardCreateCOContractForNewService,
		procurementPesWizardCreateCOContractForNewValidationService,
		platformModalService,
		controllerOptions,
		_,
		cloudDesktopInfoService,
		$injector,
		platformGridAPI
	) {
		var pesHeaderId = controllerOptions.pesHeaderId;
		var changeOrderContracts = controllerOptions.changeOrderContracts;
		var changeHeader = controllerOptions.changeHeader;
		var changeShowItems = controllerOptions.changeShowItems;
		var headerText = controllerOptions.headerText;
		var dataService = controllerOptions.dataService;
		var isLinkFrameworkContract = controllerOptions.isLinkFrameworkContract;
		var pesContractCode = controllerOptions.pesContractCode;
		var withDefaultStatus =  controllerOptions.withDefaultStatus;

		var gridConfig = {
			initCalled: false,
			columns: [],
			uuid: 'e5eca3b9844d466b94aa40a6c700fe97'
		};

		$scope.removeToolByClass = angular.noop;
		basicsCommonDialogGridControllerService.initListController(
			$scope,
			procurementPesWizardCreateCOContractForNewUIService,
			procurementPesWizardCreateCOContractForNewService,
			procurementPesWizardCreateCOContractForNewValidationService,
			gridConfig
		);
		$scope.isLinkFrameworkContract = isLinkFrameworkContract;

		$scope.modalOptions = {
			headerText: headerText,
			ok: ok,
			cancel: cancel,
			okBtnDisabled: okBtnDisabled,
			body: {
				title: $translate.instant('procurement.pes.createCOContractWizard.dialogInfo')
			}
		};
		$scope.projectChangeText = $translate.instant('procurement.pes.createCOContractWizard.projectChangeText');
		$scope.contractStatusText = $translate.instant('procurement.pes.createCOContractWizard.contractStatusText');
		$scope.fieldChangeOrderContractDesc = isLinkFrameworkContract ? $translate.instant('procurement.pes.createCOContractWizard.fieldFWContractDesc') : $translate.instant('procurement.pes.createCOContractWizard.fieldChangeOrderContractDesc');
		$scope.entity = {
			projectChange: changeHeader.ProjectChangeFk,
			changeOrderContractDesc: isLinkFrameworkContract ? pesContractCode : changeHeader.Description,
			ProjectFk: changeHeader.ProjectFk,
			ContractHeaderFk: changeHeader.ConHeaderFk,
			contractStatus: changeHeader.ConStatusFk
		};
		$scope.projectChangeOptions = {
			createOptions: {
				typeOptions: {
					isProcurement: true,
					isChangeOrder: true
				}
			},
			filterOptions: {
				serverKey: 'project-change-lookup-for-procurement-common-filter',
				serverSide: true,
				fn: function (dataContext) {
					return {
						ProjectFk: dataContext.ProjectFk === null ? -1 : dataContext.ProjectFk,
						IsProcurement : true
					};
				}
			}
		};
		$scope.contractStatusOptions = {
			filterOptions: {
				serverSide: false,
				fn: function (item) {
					if(withDefaultStatus === 1){
						return item && item.IsLive && item.IsDefault && item.Sorting !== 0;
					}else if (withDefaultStatus === 2){
						return item && item.IsLive  && item.Sorting !== 0 && item.IsPesCo;
					}
					else{
						return item && item.IsLive && item.Sorting !== 0;
					}

				}
			}
		};
		$scope.projectChangeConfig = {
			rt$readonly: function() {
				return isLinkFrameworkContract;
			}
		};
		$scope.statusConfig = {
			rt$readonly: function() {
				return withDefaultStatus === 1;
			}
		};

		$scope.progress = {
			isCreating: false,
			info: $translate.instant('procurement.common.createStatusTest')
		};

		// Define standard toolbar Icons and their function on the scope
		let toolbarItems = [
			{
				id: 't111',
				sort: 111,
				caption: 'cloud.common.gridlayout',
				iconClass: 'tlb-icons ico-settings',
				type: 'item',
				fn: function () {
					platformGridAPI.configuration.openConfigDialog($scope.gridId);
				}
			}
		];

		$scope.setTools = setTools;

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: toolbarItems
		});

		procurementPesWizardCreateCOContractForNewService.setData(changeShowItems);
		cloudDesktopInfoService.onCompanyModuleInfoUpdated.register(onCompanyModuleInfoUpdatedFunc);
		$scope.$on('$destroy', function (){
			procurementPesWizardCreateCOContractForNewService.reset();
			cloudDesktopInfoService.onCompanyModuleInfoUpdated.unregister(onCompanyModuleInfoUpdatedFunc);
		});

		function ok() {
			if (!$scope.entity.projectChange && !isLinkFrameworkContract) {
				platformModalService.showMsgBox($translate.instant('procurement.pes.createCOContractWizard.noItemSelectedOrProjectChangeEmpty'), $translate.instant('procurement.pes.createCOContractWizard.dialogTitle'));
				return;
			}

			$scope.progress.isCreating = true;
			var result = {
				isSuccess: 'unknown',
				newCOContracts: null
			};

			var code = $scope.entity.changeOrderContractDesc;
			var projectChange = $scope.entity.projectChange;
			var contractStatus = $scope.entity.contractStatus;
			if (_.isNil(code)) {
				var translationObject = $injector.get('platformTranslateService').instant('cloud.common.isGenerated');
				code = translationObject.cloud.common.isGenerated;
			}

			_.forEach(changeOrderContracts, function (item) {
				item.Description = code;
				item.ProjectChangeFk = projectChange;
				item.ConStatusFk = contractStatus;
				if (!item.Code) {
					item.Code = 'isgenerated';
				}
			});

			var promise;
			if (isLinkFrameworkContract) {
				promise = procurementPesWizardCreateCOContractForNewService.createFrameworkContracts(pesHeaderId,changeOrderContracts);
			}
			else {
				promise = procurementPesWizardCreateCOContractForNewService.createChangeOrderContracts(pesHeaderId,changeOrderContracts);
			}
			promise
				.then(function (response) {
					result.newCOContracts = response ? response.data : null;
					result.isSuccess = true;
				}, function(){
					result.isSuccess = false;
				})
				.finally(function(){
					$scope.progress.isCreating = false;
					$scope.$close(result);
				});
		}
		function cancel() {
			$scope.$close();
		}
		function okBtnDisabled() {
			return (!$scope.entity.projectChange && !isLinkFrameworkContract) || !$scope.entity.contractStatus;
		}
		function onCompanyModuleInfoUpdatedFunc(headerInfo) {
			dataService.changeBackToModuleHeaderInformation((headerInfo && headerInfo.moduleInfo) || null);
		}

		function setTools(tools) {
			tools.update = function () {
				tools.version += 1;
			};
			tools.refreshVersion = Math.random();
			tools.refresh = function () {
				tools.refreshVersion += 1;
			};
			$scope.tools = tools;
		}
	}

})(angular);