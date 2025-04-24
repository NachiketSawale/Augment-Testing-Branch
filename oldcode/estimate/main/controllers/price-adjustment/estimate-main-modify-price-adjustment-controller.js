(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name estimate.main.controller:estimateMainModifyPriceAdjustmentController
	 */
	angular.module('estimate.main').controller('estimateMainModifyPriceAdjustmentController', ['$scope', '$injector','_','platformModalService', '$modalInstance', '$translate',
		'estimateMainModifyPriceAdjustmentService', 'estimateMainService','keyCodes',
		function ($scope, $injector, _,platformModalService, $modalInstance, $translate,
			estimateMainModifyPriceAdjustmentService, estimateMainService,keyCodes) {

			$scope.modifyOption = {
				'boqHeaderId': null,
				'FromBoq': '',
				'ToBoq': '',
				'FromRefNo': '',
				'ToRefNo': '',
				'Prices': true,
				'Factor': '1.000',
				'BaseUnitRateType': 1,
				'TargetUnitRateType': 1,
				'OverwriteExistPrices': false,
				'AddComment': false,
				'AqFromWqQuantity': false,
				'AqDivWq': '0.000',
				'DelAdjustPrices': false,
				'DelTenderPrices': false,
				'DelFixedPriceFlag': false,
				'ResetAqToWqQuantity': false,
				'DelComment': false,
				'SelectAreaType': 1,
				'ResetAqFromBoqAqQuantity':false
			};

			_.extend($scope.modifyOption, estimateMainModifyPriceAdjustmentService.getPrevEntity());

			$scope.baseUnitRateTypeChange = function () {
				if ([3, 4].indexOf($scope.modifyOption.BaseUnitRateType) > -1) {
					$scope.modifyOption.TargetUnitRateType = 2;
				}
			};

			$scope.formConfiguration = {
				'FromRefNo': {
					gid: 'target',
					rid: 'FromBoqItemId',
					label$tr$: 'boq.main.fromRN',
					type: 'directive',
					model: 'FromBoqItemId',
					directive: 'basics-lookupdata-lookup-composite',
					'options': {
						'lookupDirective': 'basics-lookup-data-by-custom-data-service',
						'descriptionMember': 'BriefInfo.Translated',
						'lookupOptions':
							{
								'dataServiceName': 'estimateMainPriceAdjustmentModifyLookupService',
								'valueMember': 'Id',
								'displayMember': 'Reference',
								'disableDataCaching': true,
								'filter': function (entity) {
									return {
										projectId: estimateMainService.getSelectedProjectId(),
										boqHeaderId: entity.ToBoq
									};
								},
								'isClientSearch': true,
								'lookupModuleQualifier': 'estimateMainPriceAdjustmentModifyLookupService',
								'columns': [
									{
										'id': 'Reference',
										'field': 'Reference',
										'name': 'Reference',
										'formatter': 'description',
										'name$tr$': 'cloud.common.entityReference'
									},{
										'id': 'Brief',
										'field': 'BriefInfo.Description',
										'name': 'Brief',
										'formatter': 'description',
										'name$tr$': 'cloud.common.entityBrief'
									},{
										'id': 'BasUomFk',
										'field': 'BasUomFk',
										'name': 'Uom',
										'formatter': 'lookup',
										'formatterOptions': {
											lookupType: 'uom',
											displayMember: 'Unit'
										},
										'name$tr$': 'cloud.common.entityUoM'
									}
								],
								'treeOptions': {
									'parentProp': 'BoqItemFk',
									'childProp': 'BoqItems'
								},
								'events': [{
									name: 'onSelectedItemChanged', handler: function selectedBoqHeaderChanged() {
										let entity = arguments[1].entity;
										let selectItem = arguments[1].selectedItem;
										entity.FromBoq = selectItem ? selectItem.BoqHeaderFk : null;
									}
								}],
								'lookupType': 'estimateMainPriceAdjustmentModifyLookupService',
								'showClearButton': true,
							}
					},
					'sortOrder': 3
				},
				'ToRefNo': {
					gid: 'target',
					rid: 'ToBoqItemId',
					label$tr$: 'boq.main.toRN',
					type: 'directive',
					model: 'ToBoqItemId',
					directive: 'basics-lookupdata-lookup-composite',
					'options': {
						'lookupOptions':
							{
								'dataServiceName': 'estimateMainPriceAdjustmentModifyLookupService',
								'valueMember': 'Id',
								'displayMember': 'Reference',
								'filter': function (entity) {
									return {
										projectId: estimateMainService.getSelectedProjectId(),
										boqHeaderId: entity.FromBoq
									};
								},
								'events': [{
									name: 'onSelectedItemChanged', handler: function selectedBoqHeaderChanged() {
										let entity = arguments[1].entity;
										let selectItem = arguments[1].selectedItem;
										entity.ToBoq = selectItem ? selectItem.BoqHeaderFk : null;
									}
								}],
								'lookupType': 'estimateMainPriceAdjustmentModifyLookupService',
								'disableDataCaching': true,
								'showClearButton': true,
								'isClientSearch': true,
								'lookupModuleQualifier': 'estimateMainPriceAdjustmentModifyLookupService',
								'columns': [
									{
										'id': 'Reference',
										'field': 'Reference',
										'name': 'Reference',
										'formatter': 'description',
										'name$tr$': 'cloud.common.entityReference'
									},{
										'id': 'Brief',
										'field': 'BriefInfo.Description',
										'name': 'Brief',
										'formatter': 'description',
										'name$tr$': 'cloud.common.entityBrief'
									},
									{
										'id': 'BasUomFk',
										'field': 'BasUomFk',
										'name': 'Uom',
										'formatter': 'lookup',
										'formatterOptions': {
											lookupType: 'uom',
											displayMember: 'Unit'
										},
										'name$tr$': 'cloud.common.entityUoM'
									}
								],
								'treeOptions': {
									'parentProp': 'BoqItemFk',
									'childProp': 'BoqItems'
								}
							},
						'lookupDirective': 'basics-lookup-data-by-custom-data-service',
						'descriptionMember': 'BriefInfo.Translated',
					},
					sortOrder: 4
				}
			};

			$scope.readOnlyOption = {
				SelectAreaType: function (type) {
					return parseInt($scope.modifyOption.SelectAreaType) !== type;
				},
				BaseUnitRateType: function () {
					return !(parseInt($scope.modifyOption.SelectAreaType) === 1 && $scope.modifyOption.Prices);
				},
				priceAdjust: function () {
					return !(parseInt($scope.modifyOption.SelectAreaType) === 1 && $scope.modifyOption.Prices && (parseInt($scope.modifyOption.BaseUnitRateType) === 1 || parseInt($scope.modifyOption.BaseUnitRateType) === 2));
				},
				AddComment: function () {
					return !(parseInt($scope.modifyOption.SelectAreaType) === 1 && ($scope.modifyOption.Prices || $scope.modifyOption.AqFromWqQuantity));
				},
				AqDivWq: function () {
					return !(parseInt($scope.modifyOption.SelectAreaType) === 1 && $scope.modifyOption.AqFromWqQuantity);
				},
				ResetAqFromWq: function () {
					return parseInt($scope.modifyOption.SelectAreaType) === 1 ||  (parseInt($scope.modifyOption.SelectAreaType) === 2 && $scope.modifyOption.ResetAqFromBoqAqQuantity);
				},
				ResetAqFromBoqAq: function () {
					return parseInt($scope.modifyOption.SelectAreaType) === 1 || (parseInt($scope.modifyOption.SelectAreaType) === 2 && $scope.modifyOption.ResetAqToWqQuantity);
				}
			};

			$scope.modalOptions = {
				headerText: $translate.instant('estimate.main.priceAdjust.title'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				ok: function () {
					estimateMainModifyPriceAdjustmentService.validateModifyOption($scope).then(function (result) {
						if (!result.valid) {
							platformModalService.showMsgBox(result.msg, 'Error', 'error');
							return;
						}
						$modalInstance.close({ok: true});
					});
				},
				closeButtonText: $translate.instant('cloud.common.cancel'),
				cancel: function () {
					$modalInstance.close({cancel: true});
				},
				findButtonText: $translate.instant('estimate.main.priceAdjust.find'),
				find: function () {

				}
			};

			$scope.showAreaGroup = $scope.showGenerateGroup = $scope.showResetGroup = true;

			$scope.toggleOpen = function (index) {
				switch (index) {
					case 0:
						$scope.showAreaGroup = !$scope.showAreaGroup;
						break;
					case 1:
						$scope.showGenerateGroup = !$scope.showGenerateGroup;
						break;
					case 2:
						$scope.showResetGroup = !$scope.showResetGroup;
						break;
				}
			};

			$scope.factorChange = function (target) {
				let factor = $scope.modifyOption[target];
				if (!factor || factor === '') {
					$scope.modifyOption[target] = '1.000';
				}

				if (factor.indexOf('.') < 0) {
					factor = factor + '.000';
				} else {
					let idx = factor.lastIndexOf('.');
					let rigthPart = factor.substr(idx, factor.length - idx - 1);
					let i = 3 - rigthPart.length;
					while (i > 0) {
						factor = factor + '0';
						i--;
					}
				}

				$scope.modifyOption[target] = factor;
			};

			$scope.stopEnter = function(event) {
				if (event.keyCode === keyCodes.ENTER) {
					event.preventDefault();
					event.stopPropagation();
				}
			};

			function initModalData() {
				let estimateMainPriceAdjustmentDataService = $injector.get('estimateMainPriceAdjustmentDataService');
				let selected = estimateMainPriceAdjustmentDataService.getSelected();
				if (selected && selected.Id !== -1) {
					$scope.modifyOption.FromRefNo = selected.Id;
					$scope.modifyOption.FromBoq = selected.BoqHeaderFk;
					$scope.modifyOption.ToRefNo = selected.Id;
					$scope.modifyOption.ToBoq = selected.BoqHeaderFk;
				}
			}

			initModalData();

			$scope.$on('$destroy', function () {

			});
		}]);
})();
