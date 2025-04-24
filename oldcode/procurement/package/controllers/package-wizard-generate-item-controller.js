(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'procurement.package';

	angular.module(moduleName).controller('procurementWizardGenerateItemController', ['$scope', '$translate', 'procurementPackageWizardGenerateItemsService',
		'basicsCommonUniqueFieldsProfileService', 'basicsCommonEstimateLineItemFieldsValue', 'procurementPackageDataService', 'procurementPackagePackage2HeaderService',
		'platformModalService', 'procurementCommonPrcItemDataService', 'procurementCommonTotalDataService', 'procurementPackageItemAssignmentDataService',
		'procurementPackageEstimateLineItemDataService',
		function ($scope, $translate, procurementPackageWizardGenerateItemsService, basicsCommonUniqueFieldsProfileService, basicsCommonEstimateLineItemFieldsValue,
			packageDataService, package2HeaderService, platformModalService, procurementCommonPrcItemDataService, procurementCommonTotalDataService,
			procurementPackageItemAssignmentDataService, procurementPackageEstimateLineItemDataService
		) {

			var identityName = 'generate.packageitem.from.packageWizard';
			var uniqueFieldsProfileService = basicsCommonUniqueFieldsProfileService.getService(identityName);
			var specialData = [{model: 'DescriptionInfo'}, {model: 'BasUomTargetFk'}];
			$scope.serviceoptions = {service: uniqueFieldsProfileService};
			uniqueFieldsProfileService.setReadonlyData(specialData);
			$scope.wizardName = $scope.modalOptions.value.wizardName;
			$scope.entity = $scope.modalOptions.value.entity;
			$scope.aggregateProfileFlg = true;
			$scope.modeFlg = 1;
			init();

			function init() {
				uniqueFieldsProfileService.selectItemChanged.register(onSelectItemChanged);
				uniqueFieldsProfileService.reset();
				var header = packageDataService.getSelected();
				if (header) {
					updateDynamicUniqueFields(header.ProjectFk, header.Id);
				} else {
					var fields = getUniqueFields();
					$scope.entity.uniqueFields = fields;
					uniqueFieldsProfileService.updateDefaultFields(fields);
					uniqueFieldsProfileService.load();
				}
			}

			function onSelectItemChanged() {
				var profile = uniqueFieldsProfileService.getSelectedItem();
				$scope.uniqueFieldsProfile = uniqueFieldsProfileService.getDescription(profile);
			}

			function getUniqueFields(dynamicFields) {
				// var arrModels = ['DescriptionInfo', 'BasUomTargetFk', 'MdcControllingUnitFk', 'LicCostGroup1Fk', 'LicCostGroup2Fk', 'LicCostGroup3Fk', 'LicCostGroup4Fk', 'LicCostGroup5Fk', 'PrjCostGroup1Fk', 'PrjCostGroup2Fk', 'PrjCostGroup3Fk', 'PrjCostGroup4Fk', 'PrjCostGroup5Fk',
				// ];
				var arrModels = ['DescriptionInfo', 'BasUomTargetFk', 'MdcControllingUnitFk'];
				var allFileds = angular.copy(basicsCommonEstimateLineItemFieldsValue.getWithDynamicFields(dynamicFields));
				return _.filter(allFileds, function (item) {
					if (item.id) {
						return true;
					}
					if (_.indexOf(arrModels, item.model) > -1) {

						item.isSelect = item.model === 'DescriptionInfo' || item.model === 'BasUomTargetFk';
						return true;
					}
					return false;
				});
			}

			$scope.entity.uniqueFields = getUniqueFields();

			$scope.onModeResult = function (value) {
				$scope.modeFlg = value;
			};

			$scope.generateItem = function () {
				var aggregateProfileFlg = $scope.aggregateProfileFlg;
				var sameItemMergeFlg = 1 === $scope.modeFlg;
				var allProfiles = uniqueFieldsProfileService.getSelectedItem().UniqueFields;
				var uniqueFields = _.filter(allProfiles, {isSelect: true}).map(function (field) {
					return {
						id: field.id,
						code: field.model
					};
				});
				var header = packageDataService.getSelected();
				var modalOptions = {
					headerTextKey: $translate.instant('cloud.common.informationDialogHeader'),
					bodyTextKey: $translate.instant('procurement.package.wizard.createRequisition.noPackageHeader'),
					showCancelButton: true,
					iconClass: 'ico-info'
				};
				if (!header || !header.Id) {
					platformModalService.showDialog(modalOptions);
					return;
				}
				var package2Header = package2HeaderService.getSelected();
				if (!package2Header) {
					modalOptions.bodyTextKey = $translate.instant('procurement.package.wizard.createRequisition.noPackage2Header');
					platformModalService.showDialog(modalOptions);
					return;
				}
				var paramPost = {
					PrcPackageId: package2Header.PrcPackageFk,
					SubPackageId: package2Header.Id,
					PrcHeaderId: package2Header.PrcHeaderFk,
					aggregateProfileFlg: aggregateProfileFlg,
					sameItemMergeFlg: sameItemMergeFlg,
					uniqueFieldsProfile: uniqueFields
				};
				var prcItemDataService = procurementCommonPrcItemDataService.getService(package2HeaderService);
				var prcTotalDataService = procurementCommonTotalDataService.getService(package2HeaderService);
				$scope.modalOptions.cancel();
				procurementPackageWizardGenerateItemsService.onGenerateItems(paramPost).then(function (res) {
					if (res.data === 0) {
						platformModalService.showMsgBox('procurement.package.wizard.generateItems.failWithoutAssign', 'cloud.common.informationDialogHeader', 'ico-error');
					} else { // noinspection JSValidateTypes
						if (res.data === 1) { // noinspection JSValidateTypes
							prcItemDataService.loadSubItemsList();
							prcTotalDataService.loadSubItemsList();
							procurementPackageItemAssignmentDataService.loadSubItemsList();
							procurementPackageEstimateLineItemDataService.loadSubItemsList();
							platformModalService.showMsgBox('procurement.package.wizard.generateItems.generateSuccess', 'cloud.common.informationDialogHeader', 'ico-info');
						} else { // noinspection JSValidateTypes
							if (res.data === 2) {
								platformModalService.showMsgBox('procurement.package.wizard.generateItems.failWithoutItems', 'cloud.common.informationDialogHeader', 'ico-error');
							}
						}
					}
				});

			};

			$scope.modalOptions.close = function () {
				$scope.$parent.$close(!!$scope.selectedStep.stepDefinition.disallowCancel);
			};

			function updateDynamicUniqueFields(projectId, packageId) {
				var dynamicUniqueFields = [];
				var packageInfo = {
					ProjectId: projectId,
					PackageId: packageId
				};
				return procurementPackageWizardGenerateItemsService.getDynamicUniqueFields(packageInfo).then(function (response) {
					if (!response) {
						return dynamicUniqueFields;
					}
					var lic = response.data.LicCostGroupCats;
					var prjCostGroup = response.data.PrjCostGroupCats;
					var allCats = _.concat(lic, prjCostGroup);
					var showCats = [];
					_.forEach(allCats, function (item) {
						showCats.push({Id: item.Id, Code: item.Code});
					});
					dynamicUniqueFields = showCats;
					return dynamicUniqueFields;
				}).finally(function () {
					var fields = getUniqueFields(dynamicUniqueFields);
					$scope.entity.uniqueFields = fields;
					uniqueFieldsProfileService.updateDefaultFields(fields);
					uniqueFieldsProfileService.load();
				});
			}
		}]);

})(angular);