
(function(angular) {

	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainBoqUnitRateGenerateController', ['$scope','$translate', 'platformTranslateService', 'dialogUserSettingService',
		function ($scope,$translate, platformTranslateService, dialogUserSettingService) {

			$scope.modalOptions.headerText = $translate.instant('estimate.main.options');

			$scope.dataItem = $scope.options.dataItem;

			let dialogId = '3c0c658bbb954c5d83eefadea7f43f14';

			defaultOption();
			function defaultOption() {
				if($scope.dataItem && !$scope.dataItem.HighlightAssignments){
					$scope.dataItem.HighlightAssignments = 2;
					$scope.dataItem.CopyLineItemRete = true;
				}
			}
			function loadDialogSetting() {
				if(dialogUserSettingService.getCustomConfig(dialogId, 'dataItem')) {
					$scope.dataItem = dialogUserSettingService.getCustomConfig(dialogId, 'dataItem');
				}
			}

			function saveDialogSetting() {
				let dataItem = $scope.dataItem;
				dialogUserSettingService.setCustomConfig(dialogId, 'dataItem', dataItem);
			}

			loadDialogSetting();

			function getFormConfiguration() {
				let formConfiguration = {
					fid: 'estimate.main.updateItemsFromProject',
					version: '0.1.1',
					showGrouping: true,
					change : function(){},
					groups: [
						{
							gid: 'baseGroup',
							header: 'Select BoQ Unit Rate Generate Criteria',
							header$tr$: 'estimate.main.selectUnitRate',
							isOpen: true,
							attributes: []
						},
						{
							gid: 'selectScope',
							header$tr$:'estimate.main.updateBoqHeaderOption',
							header: 'Select BoQ Update Scope',
							isOpen: true,
							attributes: []
						}
					],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'PriceColumns',
							label: 'Project BoQ Unit Rate Generate Criteria',
							label$tr$: 'estimate.main.prjBoqUnitRateCri',
							type: 'directive',
							directive: 'estimate-main-create-bid-boq-unit-assign',
							model: 'PriceColumns',
							sortOrder: 1
						},
						{
							gid: 'baseGroup',
							rid: 'updateFpBoqUnitRate',
							label: 'Update Unit Rate of fixed price BoQ items',
							label$tr$: 'estimate.main.updateFpBoqUnitRate',
							type: 'boolean',
							model: 'UpdateFpBoqUnitRate',
							sortOrder: 2
						},
						{
							gid: 'selectScope',
							rid: 'selectUpdatePolicy',
							model: 'HighlightAssignments',
							type: 'radio',
							label: 'BoQ Update Scope',
							label$tr$: 'estimate.main.updateBoqFromEstimate',
							change: function(){
								// if(scope){
								// 	scope.refreshForm();
								// }
							},
							options: {
								valueMember: 'value',
								labelMember: 'label',
								items: [
									{
										value: 1,
										label: 'All BoQs',
										label$tr$: 'estimate.main.allBoQs'
									},
									{
										value: 2,
										label: 'Highlighted/Selected BoQs',
										label$tr$: 'estimate.main.highlightedBoQs',
									}
								]
							}
						}
					]
				};

				platformTranslateService.translateFormConfig(formConfiguration);
				return formConfiguration;
			}


			$scope.formOptions = {
				configure: getFormConfiguration()
			};

			$scope.formContainerOptions = {
				formOptions: $scope.formOptions,
				setTools: function () {
				}
			};


			$scope.onOK = function () {
				saveDialogSetting();
				$scope.$close({ok: true, data: $scope.dataItem});
			};

			$scope.onCancel = function () {
				saveDialogSetting();
				$scope.$close({});
			};

			$scope.modalOptions.cancel = function () {
				saveDialogSetting();
				$scope.$close(false);
			};

			$scope.$on('$destroy', function () {

			});

		}]);
})(angular);
