(function () {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainGenerateEstimateFromLeadingStructureController',
		['$scope',
			'_',
			'$injector',
			'$http',
			'$translate',
			'platformGridAPI',
			'platformUtilService',
			'$timeout',
			'platformTranslateService',
			'estimateMainService',
			'estimateMainGenerateEstimateFromLeadingStructureDialogService',
			'estimateMainGenerateEstimateOptionProfileService',
			function ($scope,
				_,
				$injector,
				$http,
				$translate,
				platformGridAPI,
				platformUtilService,
				$timeout,
				platformTranslateService,
				estimateMainService,
				dialogService,
				optionProfileServic) {

				$scope.dataItem = $scope.options.dataItem;

				let formConfig = dialogService.getFormConfig();
				platformTranslateService.translateFormConfig(formConfig);
				$scope.formOptions = {
					configure: formConfig
				};

				$scope.submitting = false;

				$scope.concurrencyInfo = {
					show: false,
					messageCol: 1,
					message: '',
					iconCol: 1,
					type: 2
				};

				$scope.$watch('dataItem.StructureId', function (){
					$scope.submitting = false;
					$scope.concurrencyInfo.show = false;
				});

				$scope.isDisable = function () {
					return $scope.submitting || (!$scope.dataItem.UpdateExistedItem && !$scope.dataItem.CreateNew) || !$scope.dataItem.StructureId;
				};

				$scope.formContainerOptions = {
					formOptions: $scope.formOptions,
					setTools: function () {
					}
				};

				$scope.onOK = function () {
					$scope.submitting = true;
					dialogService.generateItemFromLeadingStructure($scope);
				};

				$scope.onCancel = function () {
					$scope.$close({});
				};

				$scope.modalOptions.cancel = function () {
					$scope.$close(false);
				};

				$scope.serviceoptions1 = {
					service: $injector.get('estimateMainGenerateEstimateOptionProfileService')
				};

				function updateUpdateOptions(scope) {
					scope.UpdateOptions.CreateNew = scope.dataItem.CreateNew;
					scope.UpdateOptions.UpdateExistedItem = scope.dataItem.UpdateExistedItem;
					scope.UpdateOptions.StructureId = scope.dataItem.StructureId;
					scope.UpdateOptions.StructureName = scope.dataItem.StructureName;
					scope.UpdateOptions.EstStructureId = scope.dataItem.EstStructureId;
					scope.UpdateOptions.RootItemId = scope.dataItem.RootItemId;
					scope.UpdateOptions.CreateOnlyNewLineItem = scope.dataItem.CreateOnlyNewLineItem;
					scope.UpdateOptions.UpdateExistedItem = scope.dataItem.UpdateExistedItem;
					scope.UpdateOptions.EstHeaderFk = scope.dataItem.EstHeaderFk;
					scope.UpdateOptions.ProjectFk = scope.dataItem.ProjectFk;
					scope.UpdateOptions.EstStructureId = scope.dataItem.EstStructureId;
					scope.UpdateOptions.CopyCostGroup = scope.dataItem.CopyCostGroup;
					scope.UpdateOptions.CopyPrjCostGroup = scope.dataItem.CopyPrjCostGroup;
					scope.UpdateOptions.CopyWic = scope.dataItem.CopyWic;
					scope.UpdateOptions.CopyControllingUnit = scope.dataItem.CopyControllingUnit;
					scope.UpdateOptions.CopyLocation = scope.dataItem.CopyLocation;
					scope.UpdateOptions.CopyProcStructure = scope.dataItem.CopyProcStructure;
					scope.UpdateOptions.CopyBoqFinalPrice = scope.dataItem.CopyBoqFinalPrice;
					scope.UpdateOptions.CopyRelatedWicAssembly = scope.dataItem.CopyRelatedWicAssembly;
					scope.UpdateOptions.IsBySplitQuantity = scope.dataItem.IsBySplitQuantity;
					scope.UpdateOptions.IsGenerateAsReferenceLineItems = scope.dataItem.IsGenerateAsReferenceLineItems;
					scope.UpdateOptions.CopyLeadingStructrueDesc = scope.dataItem.CopyLeadingStructrueDesc;
					scope.UpdateOptions.UpdateLeadStrucDescToExistingItem = scope.dataItem.UpdateLeadStrucDescToExistingItem;
					scope.UpdateOptions.CopyUserDefined1 = scope.dataItem.CopyUserDefined1;
					scope.UpdateOptions.CopyUserDefined2 = scope.dataItem.CopyUserDefined2;
					scope.UpdateOptions.CopyUserDefined3 = scope.dataItem.CopyUserDefined3;
					scope.UpdateOptions.CopyUserDefined4 = scope.dataItem.CopyUserDefined4;
					scope.UpdateOptions.CopyUserDefined5 = scope.dataItem.CopyUserDefined5;
				}

				$scope.UpdateOptions = {
					'CreateNew':0,
					'StructureId': 0,
					'StructureName': '',
					'EstStructureId':-1,
					'RootItemId': 0,
					'CreateOnlyNewLineItem': 0,
					'UpdateExistedItem': 0,
					'EstHeaderFk': estimateMainService.getSelectedEstHeaderId(),
					'ProjectFk': estimateMainService.getSelectedProjectId(),
					'CopyCostGroup':0,
					'CopyPrjCostGroup':0,
					'CopyWic':0,
					'CopyControllingUnit':0,
					'CopyLocation': 0,
					'CopyProcStructure':0,
					'CopyBoqFinalPrice': 0,
					'CopyRelatedWicAssembly': 0,
					'IsBySplitQuantity': 0,
					'IsGenerateAsReferenceLineItems':0,
					'CopyLeadingStructrueDesc':0,
					'UpdateLeadStrucDescToExistingItem':0,
					'CopyUserDefined1':0,
					'CopyUserDefined2': 0,
					'CopyUserDefined3': 0,
					'CopyUserDefined4': 0,
					'CopyUserDefined5': 0
				};

				function init(){
					optionProfileServic.load($scope.dataItem.updateModel).then(function (response){
						$scope.UpdateOptions.optionProfile = optionProfileServic.getDescription(response);
					});
				}
				init();

				function onSelectOptionItemChanged(defaultProfile) {
					let profile = optionProfileServic.getSelectedItem();
					profile = profile?profile:defaultProfile;
					if(profile) {
						$scope.UpdateOptions.optionProfile = optionProfileServic.getDescription(profile);
						let propertyconfig = profile.PropertyConfig;
						if (propertyconfig) {
							let optionItem = JSON.parse(propertyconfig);
							doOptionSetting($scope,optionItem);
						}
						else{
							doOptionSetting($scope,null,true);
						}
					}
				}
				function doOptionSetting(scope, optionItem, setDefautValue) {

					let structureId = optionItem ? optionItem.StructureId : -1;
					let structureType = $injector.get('estimateWizardGenerateSourceLookupService').getItemByKey(structureId);
					if (!structureType && optionItem) {
						let leadingSource = $injector.get('basicsLookupdataLookupDescriptorService').getData('EstimateGenerate4LeadingSource');
						if (optionItem.EstStructureId) {
							structureType = _.find(leadingSource, {'EstStructureId': optionItem.EstStructureId});
						}
						if (!structureType) {
							structureType = _.find(leadingSource, {'StructureName': optionItem.StructureName});
						}
						optionItem.StructureId = structureType ? structureType.Id : null;
						optionItem.EstStructureId = structureType ? structureType.EstStructureId : null;
						optionItem.StructureName = structureType ? structureType.StructureName : null;
					}

					let isFromOptionItem = (structureType && optionItem);
					scope.dataItem.CreateNew = isFromOptionItem ? optionItem.CreateNew : false;
					scope.dataItem.UpdateExistedItem = isFromOptionItem ? optionItem.UpdateExistedItem : false;
					scope.dataItem.StructureId = isFromOptionItem ? optionItem.StructureId : null;
					scope.dataItem.EstStructureId = isFromOptionItem ? optionItem.EstStructureId : null;
					scope.dataItem.StructureName = isFromOptionItem ? optionItem.StructureName : null;
					scope.dataItem.RootItemId = isFromOptionItem ? optionItem.RootItemId : null;
					scope.dataItem.CreateOnlyNewLineItem = isFromOptionItem ? optionItem.CreateOnlyNewLineItem : false;
					scope.dataItem.EstHeaderFk = isFromOptionItem ? optionItem.EstHeaderFk : scope.dataItem.EstHeaderFk;
					scope.dataItem.ProjectFk = isFromOptionItem ? optionItem.ProjectFk : scope.dataItem.ProjectFk;
					scope.dataItem.CopyCostGroup = isFromOptionItem ? optionItem.CopyCostGroup : false;
					scope.dataItem.CopyPrjCostGroup = isFromOptionItem ? optionItem.CopyPrjCostGroup : false;
					scope.dataItem.CopyWic = isFromOptionItem ? optionItem.CopyWic : false;
					scope.dataItem.CopyControllingUnit = isFromOptionItem ? optionItem.CopyControllingUnit : false;
					scope.dataItem.CopyLocation = isFromOptionItem ? optionItem.CopyLocation : false;
					scope.dataItem.CopyProcStructure = isFromOptionItem ? optionItem.CopyProcStructure : false;
					scope.dataItem.CopyBoqFinalPrice = isFromOptionItem ? optionItem.CopyBoqFinalPrice : false;
					scope.dataItem.CopyRelatedWicAssembly = isFromOptionItem ? optionItem.CopyRelatedWicAssembly : false;
					scope.dataItem.IsBySplitQuantity = isFromOptionItem ? optionItem.IsBySplitQuantity : false;
					scope.dataItem.IsGenerateAsReferenceLineItems = isFromOptionItem ? optionItem.IsGenerateAsReferenceLineItems : false;
					scope.dataItem.CopyLeadingStructrueDesc = isFromOptionItem ? optionItem.CopyLeadingStructrueDesc : false;
					scope.dataItem.UpdateLeadStrucDescToExistingItem = isFromOptionItem ? optionItem.UpdateLeadStrucDescToExistingItem : false;
					scope.dataItem.CopyUserDefined1 = isFromOptionItem ? optionItem.CopyUserDefined1 : false;
					scope.dataItem.CopyUserDefined2 = isFromOptionItem ? optionItem.CopyUserDefined2 : false;
					scope.dataItem.CopyUserDefined3 = isFromOptionItem ? optionItem.CopyUserDefined3 : false;
					scope.dataItem.CopyUserDefined4 = isFromOptionItem ? optionItem.CopyUserDefined4 : false;
					scope.dataItem.CopyUserDefined5 = isFromOptionItem ? optionItem.CopyUserDefined5 : false;

					let notByBoq = (structureType && structureType.StructureName) !== 'Boq';
					let notByAct = (structureType && structureType.StructureName) !== 'Schedule';

					if (setDefautValue || !structureType) {
						scope.dataItem.CreateNew = true;
						scope.dataItem.CopyLeadingStructrueDesc = true;
					}

					$injector.get('platformRuntimeDataService').readonly(scope.dataItem, [
						{field: 'CopyCostGroup', readonly: notByBoq},
						{field: 'CopyPrjCostGroup', readonly: notByBoq},
						{field: 'CopyWic', readonly: notByBoq},
						{field: 'CopyControllingUnit', readonly: notByBoq && notByAct},
						{field: 'CopyLocation', readonly: notByBoq && notByAct},
						{field: 'CopyProcStructure', readonly: notByBoq && notByAct},
						{field: 'CopyBoqFinalPrice', readonly: notByBoq},
						{field: 'CopyRelatedWicAssembly', readonly: notByBoq || !scope.dataItem.CreateNew},

						{field: 'IsBySplitQuantity', readonly: notByBoq},
						{field: 'IsGenerateAsReferenceLineItems', readonly: !scope.dataItem.IsBySplitQuantity},
						{field: 'CopyUserDefined1', readonly: notByBoq},
						{field: 'CopyUserDefined2', readonly: notByBoq},
						{field: 'CopyUserDefined3', readonly: notByBoq},
						{field: 'CopyUserDefined4', readonly: notByBoq},
						{field: 'CopyUserDefined5', readonly: notByBoq}
					]);

					dialogService.processUpdateExistedItem(scope.dataItem);
					updateUpdateOptions(scope);
				}

				optionProfileServic.selectItemChanged.register(onSelectOptionItemChanged);

				$scope.$on('$destroy', function () {
					optionProfileServic.selectItemChanged.unregister(onSelectOptionItemChanged);
				});
			}]);
})();
