/**
 * Created by ltn on 5/9/2017.
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainBidCreationService
     * @function
     *
     * @description
     * The service that handles the creation of a bid and subsequent bid boq based on the various settings that are done
     * in the related wizard dialog.
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateMainCreateMaterialPackageService', ['$q', '$http', '$timeout', '$injector', 'platformDialogService', 'platformTranslateService',
		'basicsLookupdataLookupDescriptorService', 'estimateMainService','platformWizardDialogService',
		function ($q, $http, $timeout, $injector, platformDialogService, translateService, basicsLookupdataLookupDescriptorService, estimateMainService, platformWizardDialogService) {

			let service = {};

			// local buffers
			let _loadingStatus = false;
			let resultDatas = null;
			let tempGridData = null;
			let tempItemData = null;
			let creationFlag = 0;

			service.getCreationFlag = function(){
				return creationFlag;
			};

			service.setCreationFlag = function(flag){
				creationFlag = flag;
			};

			service.setResultData = function(datas){
				resultDatas = datas;
			};

			service.getResultData = function(){
				return resultDatas;
			};

			service.setTempGridData = function(datas){
				tempGridData = datas;
			};

			service.getTempGridData = function(){
				return tempGridData;
			};

			service.setTempMaterialAndCostCodeData= function(datas){
				tempItemData = datas;
			};

			service.getTempMaterialAndCostCodeData= function(){
				return tempItemData;
			};

			service.getLoadingStatus = function () {
				return _loadingStatus;
			};

			service.showCreateMaterialPackageWizardDialog = function () {
				let wzConfig = {
					title$tr$: 'estimate.main.createMaterialPackageWizard.createMaterialPackage',
					steps: [{
						id: '779f6c18200e44649b5e5c680af56c22',
						stepSettingsId: '779f6c18200e44649b5e5c680af56c22',
						width: '650px',
						height:'300px',
						disallowBack: false,
						disallowNext: false,
						canFinish: false
					},{
						id: '5ce17d9a3afe41fe95975d175aba299b',
						stepSettingsId: '5ce17d9a3afe41fe95975d175aba299b',
						width: '900px',
						height:'720px',
						title$tr$: 'estimate.main.createMaterialPackageWizard.criteriaSelection',
						topDescription$tr$: 'estimate.main.createMaterialPackageWizard.criteriaSelection',
						disallowBack: false,
						disallowNext: false,
						canFinish: false
					},{
						id: '633e446c5e6c40f4b9a09b1d5d76c845',
						stepSettingsId: '633e446c5e6c40f4b9a09b1d5d76c845',
						title$tr$: 'estimate.main.createMaterialPackageWizard.packageAssignment',
						topDescription$tr$: 'estimate.main.createMaterialPackageWizard.packageAssignment',
						width: '1200px',
						disallowBack: false,
						disallowNext: false,
						canFinish: true
					}],
					onChangeStep: function (/* info */) {
					}
				};

				platformWizardDialogService.translateWizardConfig(wzConfig);

				let obj = {
					selector: {},
					__selectorSettings: {}
				};

				let dlgConfig = {
					id: '93d83cb6a86547dcbb40ff76d4d0cc2c',
					headerText$tr$: 'estimate.main.createMaterialPackageWizard.createMaterialPackage',
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/sidebar/wizard/estimate-main-create-material-package-wizard.html',
					resizeable: true,
					width: '650px',
					minWidth: '650px',
					height:'300px',
					value: {
						wizard: wzConfig,
						entity:obj,
						wizardName: 'wzdlg'
					}
				};

				return platformDialogService.showDialog(dlgConfig);
			};

			service.getSelections = function getSelections(itemData){
				return $http.post(globals.webApiBaseUrl + 'estimate/main/wizard/creatematerialpackage', itemData);
			};

			service.getMaterialSelections = function getMaterialSelections(lineItems){
				return $http.post(globals.webApiBaseUrl + 'estimate/main/wizard/getMaterialSelections', lineItems);
			};

			service.getSimulation = function getSimulation(matchItems){
				return $http.post(globals.webApiBaseUrl + 'estimate/main/wizard/getSimulationDatas', matchItems);
			};

			service.getClerkPrc = function getClerkPrc(item){
				return $http.get(globals.webApiBaseUrl + 'basics/procurementstructure/clerk/getClerkPrc?structureId='+item.StructureFk+'&companyFk='+item.CompanyFk);
			};

			service.updateOrCreatePackage = function updateOrCreatePackage(updateCreateDatas){
				return $http.post(globals.webApiBaseUrl + 'estimate/main/wizard/updateOrCreatePackage', updateCreateDatas);
			};

			service.getDynamicUniqueFields = function getDynamicUniqueFields(projectId) {
				return $http.get(globals.webApiBaseUrl + 'basics/costgroupcat/list?projectId='+projectId);
			};

			return angular.extend(service, {
			});
		}
	]);
})(angular);
