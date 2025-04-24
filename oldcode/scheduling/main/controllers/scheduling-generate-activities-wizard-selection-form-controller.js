(function (angular) {
	'use strict';

	angular.module('scheduling.main').controller('schedulingGenerateActivitiesWizardSelectionFormController',
		['_', '$scope', '$translate', '$injector', '$timeout', 'platformModalFormConfigService', 'platformTranslateService', 'platformRuntimeDataService', 'platformModalGridConfigService',
			'basicsLookupdataConfigGenerator', 'schedulingMainService', 'schedulingMainGenerateActivitiesSelectionService',
			function (_, $scope, $translate, $injector, $timeout, platformModalFormConfigService, platformTranslateService, platformRuntimeDataService, platformModalGridConfigService, basicsLookupdataConfigGenerator, schedulingMainService, schedulingMainGenerateActivitiesSelectionService) {

				$scope.entity = {
					isFreeOrEstimate: 'FreeSchedule',
					estimateFk: null,
					criteria1: null,
					criteria2: null,
					boqLevel: null,
					hideLevel: true,
					hide: true,
					readonly: false,
					updateOrGenerate: 'UpdateAndGenerate'
				};
				let boqMaxLevel = 9;
				// schedulingMainGenerateActivitiesSelectionService.setSelectedCriteria($scope.entity);

				$scope.entity = schedulingMainGenerateActivitiesSelectionService.getSelectedCriteria();

				validateReadOnly($scope.entity, $scope.entity.isFreeOrEstimate);

				function validateReadOnly(entity, value) {
					if (value === 'FreeSchedule') {
						entity.estimateFk = null;
					}
					schedulingMainGenerateActivitiesSelectionService.setMainOption(value, entity.estimateFk);
					schedulingMainGenerateActivitiesSelectionService.getCriteria1Cache(value, entity.estimateFk).then(function (data) {
						$scope.selectOptions1.items = data;
					});
					schedulingMainGenerateActivitiesSelectionService.getCriteria2Cache(value, entity.estimateFk).then(function (data) {
						$scope.selectOptions2.items = data;
					});
				}


				function validateCriteria(entity, value){
					schedulingMainGenerateActivitiesSelectionService.setMainOption(entity.isFreeOrEstimate, value);
					schedulingMainGenerateActivitiesSelectionService.getCriteria1Cache(entity.isFreeOrEstimate, value).then(function (data) {
						$scope.selectOptions1.items = data;
					});
				}
				function validateCriteria1(entity, value){
					schedulingMainGenerateActivitiesSelectionService.getCriteria2Cache(entity.isFreeOrEstimate, entity.estimateFk, value).then(function (data) {
						$scope.selectOptions2.items = data;
					});
					if (_.startsWith(value,'BOQ')) {
						entity.hideLevel = false;
						schedulingMainGenerateActivitiesSelectionService.getBoqLevel(value).then(function(response){
							boqMaxLevel = response;
						});
					} else {
						entity.hideLevel = true;
					}
				}

				$scope.lookupOptions = {
					dataServiceName: 'estimateMainHeaderLookupDataService',
					moduleQualifier: 'estimateMainHeaderLookupDataService',
					lookupModuleQualifier: 'estimateMainHeaderLookupDataService',
					lookupType: 'estimateMainHeaderLookupDataService',
					desMember: 'DescriptionInfo.Translated',
					additionalColumns: true,
					filter: function () {
						return schedulingMainService.getSelectedProjectId();
					},
					displayMember: 'Code',
					valueMember: 'Id',
					showClearButton: false,
					filterKey: null,
					disableDataCaching: true, //  always disable cache in lookup directive, because the lookup-data-service-factory already caches
					navigator: false,
					enableCache: false,
					columns: [
						{
							id: 'Code',
							field: 'Code',
							name: 'Code',
							formatter: 'code',
							name$tr$: 'cloud.common.entityCode',
							width: 100
						},
						{
							id: 'Description',
							field: 'DescriptionInfo',
							name: 'Description',
							formatter: 'translation',
							name$tr$: 'cloud.common.entityDescription',
							width: 150
						}
					],
					isClientSearch: true,
					isTextEditable: false,
					uuid: 'e38d7da7d36a48169c1b852679ddb85a'
				};
				$scope.selectOptions1 = {
					displayMember: 'Code',
					valueMember: 'Id',
					inputDomain: 'code',
					watchItems: true,
					items: []
				};
				$scope.selectOptions2 = {
					displayMember: 'Code',
					valueMember: 'Id',
					inputDomain: 'code',
					watchItems: true,
					items: []
				};
				$scope.readonly = $scope.entity.readonly;
				$scope.readOnly = $scope.entity.readonly;
				$scope.config1 = {
					validator: validateReadOnly,
					model: 'isFreeOrEstimate'
				};

				$scope.config2 = {
					validator: validateCriteria,
					model: 'estimateFk'
				};

				$scope.config3 = {
					validator: validateCriteria1,
					model: 'criteria1'
				};

				$scope.configOptions = {
					model: 'updateOrGenerate'
				};

				$scope.changeLevel = function changeLevel(){
					if ($scope.entity.boqLevel > boqMaxLevel){
						$scope.entity.boqLevel = boqMaxLevel;
					}
				};
			}
		]);

})(angular);
