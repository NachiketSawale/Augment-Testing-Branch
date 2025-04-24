/**
 * Created by lcn on 2017-11-28.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementCommonGenerateDeliveryScheduleController', [
		'$scope', '$translate', 'params', '$http', 'platformGridAPI', 'moment', 'platformModalService', 'platformTranslateService',
		function ($scope, $translate, params, $http, platformGridAPI, moment, platformModalService, platformTranslateService) {

			var mulationPrcItemGridId = '850284D1E74B450EBB5E8D5307B420AA';

			var mulationPrcItemGridColumns = [];

			var repeatoption = [
				{id: 1, value: $translate.instant('procurement.common.wizard.generateDeliverySchedule.weekly')},
				{id: 2, value: $translate.instant('procurement.common.wizard.generateDeliverySchedule.monthly')},
				{id: 3, value: $translate.instant('procurement.common.wizard.generateDeliverySchedule.quarterly')},
				{id: 4, value: $translate.instant('procurement.common.wizard.generateDeliverySchedule.userSpecified')}
			];

			$scope.modalOptions = {
				linkedActivity: false,
				linkedEstLineItem: false,
				descriptionPrefix: null,
				repeat: '1',
				startDate: null,
				occurence: null,
				endDate: null,
				timeRequired: null,
				initStartDate: params.selectedLead.DateDelivery || params.selectedLead.DateRequired || new moment.utc(),
				initEndDate: null,
				selectItems: null,
				repeatOption: repeatoption,
				roundUpQuantity: false
			};
			$scope.modalOptions.cancel = function onCancel() {
				$scope.$close(false);
			};

			$scope.modalOptionsIsDisable = {
				occurence: true
			};

			$scope.modalOptionsError = {
				rt$hasError: hasError,
				rt$errorText: null
			};

			initContainItem();

			$scope.steps = [
				{
					number: 0,
					title: 'procurement.common.wizard.generateDeliverySchedule.wizard',
					buttons: [
						{
							label: 'cloud.common.ok',
							action: goToOk,
							disable: function () {
								return !canToOk();
							}
						},
						{
							label: 'cloud.common.cancel',
							action: close
						}
					]
				},
				{
					number: 1,
					title: 'procurement.common.wizard.generateDeliverySchedule.succeed',
					buttons: [
						{
							label: 'basics.common.ok',
							action: close
						}
					]
				}];

			$scope.currentStep = angular.copy($scope.steps[0]);
			$scope.modalOptions.headerText = $translate.instant($scope.currentStep.title);

			$scope.gridData = {
				state: mulationPrcItemGridId
			};

			$scope.repeatOptionChanged = function () {
				if ($scope.modalOptions.repeat === '4') {
					$scope.modalOptionsIsDisable.occurence = false;
					$scope.modalOptions.occurence = 1;
				} else {
					$scope.modalOptionsIsDisable.occurence = true;
					calculatetion();
				}
			};

			$scope.startDateChanged = function () {
				calculatetion();
			};

			$scope.endDateChanged = function () {
				calculatetion();
			};

			$scope.$on('$destroy', function () {
				platformGridAPI.grids.unregister(mulationPrcItemGridId);
				platformGridAPI.events.unregister(mulationPrcItemGridId, 'onHeaderCheckboxChanged', checkAll);
				platformGridAPI.events.unregister(mulationPrcItemGridId, 'onCellChange', onCellChange);
			});

			function initMulationPrcItemGrid(itemsData) {
				mulationPrcItemGridColumns = [
					{
						id: 'Selected',
						field: 'Selected',
						name: 'All',
						editor: 'boolean',
						headerChkbox: true,
						formatter: function (row, cell, value) {
							var html = '';
							var quantity = params.selectedPrcItems[row].Quantity;
							if (quantity === 0) {
								html = '<input type="checkbox" unchecked disabled/>';
							}
							else {
								if (value === true) {
									html = '<input type="checkbox" checked />';
								}
								else {
									html = '<input type="checkbox" unchecked/>';
								}
							}
							return '<div class="text-center" >' + html + '</div>';
						},
						width: 50,
						name$tr$: 'procurement.common.wizard.generateDeliverySchedule.all'
					},
					{
						id: 'MaterialCode',
						field: 'MdcMaterialFk',
						name: 'Material Code',
						width: 100,
						name$tr$: 'basics.common.entityMaterialCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialRecord',
							displayMember: 'Code'
						}
					},
					{
						id: 'MaterialDescription',
						field: 'Description1',
						width: 120,
						name: 'Material Description',
						formatter: 'description',
						name$tr$: 'basics.common.entityMaterialDescription',
						readonly: true
					},
					{
						id: 'Quantity',
						field: 'Quantity',
						name: 'Quantity',
						formatter: 'quantity',
						width: 100,
						name$tr$: 'basics.common.Quantity'
					},
					{
						id: 'BasUomFk',
						field: 'BasUomFk',
						name: 'Uom',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						},
						name$tr$: 'cloud.common.entityUoM'
					},
					{
						id: 'dateRequired',
						field: 'DateRequired',
						name: 'Required',
						name$tr$: 'cloud.common.entityRequiredBy',
						formatter: 'date',
						width: 100,
						searchable: false
					}];

				var mulationPrcItemGridConfig = {
					columns: angular.copy(mulationPrcItemGridColumns),
					data: itemsData,
					id: mulationPrcItemGridId,
					lazyInit: true,
					options: {
						indicator: true,
						idProperty: 'Id'
					}
				};
				platformGridAPI.grids.config(mulationPrcItemGridConfig);
				platformTranslateService.translateGridConfig(mulationPrcItemGridConfig.columns);
				platformGridAPI.events.register(mulationPrcItemGridId, 'onHeaderCheckboxChanged', checkAll);
				platformGridAPI.events.register(mulationPrcItemGridId, 'onCellChange', onCellChange);
			}

			function initContainItem() {
				$scope.itemsData = params.selectedPrcItems;
				initMulationPrcItemGrid(filterPrcItem($scope.itemsData, true));
				onCellChange();
			}

			function hasError() {
				if ($scope.modalOptions.timeRequired === undefined) {
					$scope.modalOptionsError.rt$errorText = $translate.instant('procurement.common.wizard.generateDeliverySchedule.invalidDateFormat');
					return true;
				}
				if ($scope.modalOptions.startDate && $scope.modalOptions.endDate) {
					var duration = _.round(moment.duration($scope.modalOptions.endDate.diff($scope.modalOptions.startDate)).asDays(), 0) + 1;
					if (duration > 0) {
						if (duration < $scope.modalOptions.occurence) {
							$scope.modalOptionsError.rt$errorText = $translate.instant('procurement.common.wizard.generateDeliverySchedule.deliveryModifyOccurenceByError');
							return true;
						}
						return false;
					}
					else {
						$scope.modalOptionsError.rt$errorText = $translate.instant('procurement.common.wizard.generateDeliverySchedule.deliveryModifyTimeByError');
						return true;
					}
				}
				return false;
			}

			function filterPrcItem(items, IsSelected) {
				_.forEach(items, function (item) {
					if (item.Quantity > 0) {
						item.Selected = IsSelected;
					}
				});
				return items;
			}

			function filter(items) {
				return _.filter(items, function (item) {
					return item.Quantity !== 0;
				});
			}

			function GetIds(items) {
				return _.map(_.filter(items, function (item) {return item.Quantity !== 0;}), 'Id');
			}

			function checkAll() {
				var gridData = platformGridAPI.items.data(mulationPrcItemGridId);
				platformGridAPI.items.data(mulationPrcItemGridId, gridData);
				$scope.$apply(function () {
					onCellChange();
				});
			}

			function onCellChange() {
				var gridData = platformGridAPI.items.data(mulationPrcItemGridId);
				if (_.isNil(gridData)) {
					gridData = filterPrcItem($scope.itemsData, true);
				}
				var items = _.filter(gridData, function (item) {
					return item.Selected === true;
				});
				$scope.modalOptions.selectItems = items;
				var value = _.minBy(items, 'DateRequired');
				if (value) {
					$scope.modalOptions.startDate = value.DateRequired;
					$scope.modalOptions.endDate = $scope.modalOptions.initEndDate;
				} else {
					if (items.length > 0) {
						$scope.modalOptions.startDate = $scope.modalOptions.initStartDate;
						$scope.modalOptions.endDate = $scope.modalOptions.initEndDate;
					}
					else {
						$scope.modalOptions.startDate = null;
						$scope.modalOptions.endDate = null;
						$scope.modalOptions.occurence = null;
						$scope.modalOptions.timeRequired = null;

					}
				}
				calculatetion();
			}

			function calculatetion() {
				if ($scope.modalOptions.startDate && $scope.modalOptions.endDate && $scope.modalOptions.repeat !== '4') {
					var repeat = $scope.modalOptions.repeat;
					var occurence = 1;
					if (repeat === '1') {// weekly
						occurence = $scope.modalOptions.endDate.diff($scope.modalOptions.startDate, 'week') + 1;
					}
					else if (repeat === '2') {// monthly
						occurence = $scope.modalOptions.endDate.diff($scope.modalOptions.startDate, 'month') + 1;
					}
					else {// quarterly
						occurence = $scope.modalOptions.endDate.diff($scope.modalOptions.startDate, 'quarter') + 1;
					}
					$scope.modalOptions.occurence = occurence;
				}
				else {
					if ($scope.modalOptions.startDate === null || $scope.modalOptions.endDate === null) {
						$scope.modalOptions.occurence = null;
					}
				}
			}

			function close() {
				$scope.$close({isOk: isCurrentStep(1)});
			}

			function canToOk() {
				return !_.isNil($scope.modalOptions.selectItems)&& filter($scope.modalOptions.selectItems).length > 0 && !_.isNil($scope.modalOptions.startDate)&& !_.isNil($scope.modalOptions.endDate) && $scope.modalOptions.occurence !== '' && !_.isNil($scope.modalOptions.occurence)&& hasError() === false;
			}

			function goToOk() {
				var requestData = {
					LinkedActivity: false,
					LinkedEstLineItem: false,
					DescriptionPrefix: $scope.modalOptions.descriptionPrefix,
					Repeat: $scope.modalOptions.repeat,
					StartDate: $scope.modalOptions.startDate,
					Occurence: $scope.modalOptions.occurence,
					EndDate: $scope.modalOptions.endDate,
					TimeRequired: getTimeRequired(),
					SelectIds: GetIds($scope.modalOptions.selectItems),
					IsContinue: false,
					RoundUpQuantity: $scope.modalOptions.roundUpQuantity
				};
				$scope.isLoading = true;
				$http.post(globals.webApiBaseUrl + 'procurement/common/deliveryschedule/save', requestData).then(function () {
					setCurrentStep(1);
					$scope.isLoading = false;
				});
			}

			function getTimeRequired() {
				var timeRequired = $scope.modalOptions.timeRequired;
				if (timeRequired === null || timeRequired === 'Invalid date') {
					return null;
				}
				else {
					return toLocalDate(timeRequired);
				}
			}

			function toLocalDate(date) {
				date = !angular.isDate(date) ? new Date(date) : date;
				var utcString = date.toUTCString();
				return new Date(utcString).getHours() + ':' + new Date(utcString).getMinutes() + ':00';
			}

			function setCurrentStep(value) {
				$scope.currentStep = angular.copy($scope.steps[value]);
				$scope.modalOptions.headerText = $translate.instant($scope.currentStep.title);
			}

			function isCurrentStep(value) {
				return $scope.currentStep.number === value;
			}

		}
	]);

})(angular);