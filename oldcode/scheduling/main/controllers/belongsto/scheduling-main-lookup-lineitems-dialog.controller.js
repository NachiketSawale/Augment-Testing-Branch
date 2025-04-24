/* global $ */
/**
 * Created by sprotte on 27.02.2015.
 */
/* jshint -W072 */
angular.module('scheduling.main').controller('schedulingMainLookupLineItemsDialogController', ['_', '$scope', '$injector', '$timeout',
	'schedulingMainLookupLineItemsDialogService', '$translate', '$modalInstance', 'platformGridAPI', 'keyCodes', 'platformTranslateService', 'basicsLookupdataLookupControllerFactory',
	function Controller(_, $scope, $injector, $timeout,
		mainService, $translate, $modalInstance, platformGridAPI, keyCodes, platformTranslateService, basicsLookupdataLookupControllerFactory) {
		'use strict';

		// setup modal-dialog style.
		// $scope.options.width = '900px';

		$scope.modalOptions = {
			closeButtonText: $translate.instant('cloud.common.cancel'),
			actionButtonText: $translate.instant('cloud.common.ok'),
			refreshButtonText: $translate.instant('basics.common.button.refresh'),
			headerText: $translate.instant('scheduling.main.insertLineItems')
		};

		$scope.displayText = '';
		let settings = mainService.getGridConfiguration();

		$modalInstance.opened.then(function () {
			$timeout(function () {
				$('div[modal-window]').find('input:first').focus();
			}, 300);
		});

		$scope.modalOptions.ok = function (result) {
			platformGridAPI.cells.selection({gridId: $scope.gridId, rows: [], cell: 1});
			result = $.extend(result, {isOK: true, data: mainService.getList(), applySplitResultTo: mainService.getApplySplitResultTo(), noRelation: $scope.entity.noRelation});
			$modalInstance.close(result);
		};
		$scope.modalOptions.close = function () {
			$modalInstance.dismiss('cancel');
		};

		$scope.modalOptions.cancel = function () {
			$scope.modalOptions.close();
		};

		$scope.modalOptions.refresh = function () {
			platformGridAPI.items.data($scope.gridId, mainService.getList());
		};

		$scope.modalOptions.disableOkButton = function () {
			return mainService.disableOkButton() || _.isNil($scope.entity.applySplitResultTo);
		};

		$scope.instantSearch = false;
		$scope.search = function (searchValue) {

			if (searchValue && searchValue.length > 0) {
				let searchValueLow = searchValue.toLowerCase();

				// filter assembly list
				mainService.setItemFilter(function (entity) {
					let code = entity.Code.toLowerCase();
					let desc = '';
					if (entity.DescriptionInfo && entity.DescriptionInfo.Translated) {
						desc = entity.DescriptionInfo.Translated.toLowerCase();
					}
					return (code.indexOf(searchValueLow) >= 0 || desc.indexOf(searchValueLow) >= 0) && entity.EstHeaderFk === $scope.entity.estimateHeaderFk;
				});
			} else {
				mainService.setItemFilter({'EstHeaderFk': $scope.entity.estimateHeaderFk});
			}
			platformGridAPI.items.data($scope.gridId, mainService.getList());
		};

		$scope.onSearchInputKeydown = function (event, searchValue) {
			if (event.keyCode === keyCodes.ENTER || $scope.instantSearch) {
				$scope.search(searchValue);
			}
		};
		// grid's id === container's uuid
		$scope.gridId = mainService.getGridUUID();

		$scope.gridData = {
			state: $scope.gridId
		};

		if (!settings.isTranslated) {
			platformTranslateService.translateGridConfig(settings.columns);
			settings.isTranslated = true;
		}

		if (!platformGridAPI.grids.exist($scope.gridId)) {
			let grid = {
				columns: angular.copy(settings.columns),
				gridData: [],
				id: $scope.gridId,
				gridId: $scope.gridId,
				lazyInit: true,
				idProperty: 'Id',
				multiSelect: true
			};
			basicsLookupdataLookupControllerFactory.create({grid: true, dialog: true, search: false}, $scope, grid);
		}

		$scope.attributes = mainService.getHeaders();
		$scope.entity = {
			'applySplitResultTo': mainService.getApplySplitResultTo(),
			'estimateHeaderFk': null,
			'noRelation': mainService.getNoRelation()
		};

		if ($scope.attributes.length === 1) {
			$scope.entity.estimateHeaderFk = $scope.attributes[0].Id;
			mainService.setItemFilter({'EstHeaderFk': $scope.entity.estimateHeaderFk});
			platformGridAPI.items.data($scope.gridId, mainService.getList());
		} else {
			mainService.setItemFilter({'EstHeaderFk': $scope.entity.estimateHeaderFk});
		}

		$scope.formOptions = {
			configure: {
				fid: 'scheduling.main.selectionfilter',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: 'selectionfilter',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [{
					gid: 'selectionfilter',
					rid: 'estimate',
					label: 'Estimate Code',
					label$tr$: $translate.instant('scheduling.main.entityEstimationHeader'),
					type: 'select',
					model: 'estimateHeaderFk',
					sortOrder: 1,
					change: function () {
						mainService.setItemFilter({'EstHeaderFk': $scope.entity.estimateHeaderFk});
						platformGridAPI.items.data($scope.gridId, mainService.getList());
					},
					options: {
						items: $scope.attributes, displayMember: 'Code', valueMember: 'Id',
						displayTemplateProvider: function (item) {
							return item.Code + ' ' + item.DescriptionInfo.Translated;
						}
					}
				},
				{
					gid: 'selectionfilter',
					sortOrder: 2,
					rid: 'lineitemReference',
					model: 'applySplitResultTo',
					type: 'radio',
					label: $translate.instant('estimate.main.splitLineItemWizard.applySplitResultTo'),
					label$tr$: 'estimate.main.splitLineItemWizard.applySplitResultTo',
					change: function () {
						mainService.setApplySplitResultTo($scope.entity.applySplitResultTo);
						let row = _.find($scope.formOptions.configure.rows, {rid:'noRelation'});
						if (row) {
							row.visible = $scope.entity.applySplitResultTo === 'QuantityTarget';
						}
						$scope.$broadcast('form-config-updated');
						mainService.recalculate();
					},
					options: {
						labelMember: 'Description',
						valueMember: 'Value',
						groupName: 'applySplitResultToConfig',
						items: [
							{
								Id: 0,
								Description: $translate.instant('estimate.main.splitLineItemWizard.splitQuantity'),
								Value: 'Quantity'
							},
							{
								Id: 1,
								Description: $translate.instant('estimate.main.splitLineItemWizard.splitQuantityItem'),
								Value: 'QuantityTarget'
							}
						]
					}
				}, {
					gid: 'selectionfilter',
					rid: 'noRelation',
					label: $translate.instant('scheduling.main.entityNoRelation'),
					label$tr$: $translate.instant('scheduling.main.entityNoRelation'),
					type: 'boolean',
					model: 'noRelation',
					sortOrder: 3,
					visible: $scope.entity.applySplitResultTo === 'QuantityTarget',
					change: function () {
						mainService.setNoRelation($scope.entity.noRelation);
					}
				}]
			}
		};

		$scope.$on('$destroy', function () {
			platformGridAPI.grids.unregister($scope.gridId);
		});
	}]);
