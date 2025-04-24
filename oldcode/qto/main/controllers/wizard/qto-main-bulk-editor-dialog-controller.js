/**
 * Created by lnt on 1/29/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'qto.main';

	/* row config for bulk edit */
	angular.module(moduleName).service('qtoBulkEditorColumnsDef', ['qtoMainHeaderDataService',
		function (qtoMainHeaderDataService) {
			var service = {};
			service.getStandardConfigForDetailView = function () {
				return {
					'fid': 'qot.wizard.BuldEditotQtoDetail',
					'version': '1.1.0',
					showGrouping: false,
					title$tr$: '',
					skipPermissionCheck: true,
					change: 'change',
					'groups': [
						{
							'gid': 'BuldEditotQtoDetail',
							'header$tr$': '',
							'isOpen': true,
							'visible': true,
							'disable': false,
							'sortOrder': 1
						}
					],
					'rows': [
						{
							'rid': 'BoqItemFk',
							'gid': 'BuldEditotQtoDetail',
							'label$tr$': 'qto.main.boqItem',
							'model': 'BoqItemFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-lookup-data-by-custom-data-service',
								descriptionMember: 'BriefInfo.Description',
								lookupOptions: {
									'lookupType': 'boqItemLookupDataService',
									'dataServiceName': 'boqItemLookupDataService',
									'valueMember': 'Id',
									'displayMember': 'Reference',
									'filter': function () {
										if (qtoMainHeaderDataService.getSelected()) {
											return qtoMainHeaderDataService.getSelected().BoqHeaderFk;
										}
									},
									'lookupModuleQualifier': 'boqItemLookupDataService',
									'columns': [
										{
											'id': 'Brief',
											'field': 'BriefInfo.Description',
											'name': 'Brief',
											'formatter': 'description',
											'name$tr$': 'cloud.common.entityBrief'
										},
										{
											'id': 'Reference',
											'field': 'Reference',
											'name': 'Reference',
											'formatter': 'description',
											'name$tr$': 'cloud.common.entityReference'
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
										'parentProp': 'BoqItemFk', 'childProp': 'BoqItems'
									}
								}
							},
							'disable': false
						}
					]
				};
			};

			return service;
		}]);

	/**
	 * @ngdoc controller
	 * @name qtoMainBulkEditorDialogController
	 * @requires $scope
	 * @description
	 * #
	 * qtoMainBulkEditorDialogController
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('qtoMainBulkEditorDialogController', [
		'$scope', '$translate', '$injector', 'platformTranslateService', 'qtoBulkEditorColumnsDef', 'qtoMainSearchDataDetailDialogService',
		function ($scope, $translate, $injector, platformTranslateService, formConfig, qtoMainSearchDataDetailDialogService) {

			$scope.options = $scope.$parent.modalOptions;
			$scope.isOkDisabled = false;

			$scope.currentItem = {
			};

			$scope.modalOptions = {
				headerText: $scope.options.headerText,
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			// get basic row setting from options
			$scope.options.formRows = $scope.options.formRows || [];
			var index = 0;
			formConfig = angular.copy(formConfig);
			var columnsConfig = formConfig.getStandardConfigForDetailView();
			angular.forEach($scope.options.formRows, function (row) {
				row.rid = row.rid || 'formrowid' + index++;
				row.gid = 'BuldEditotQtoDetail';
				columnsConfig.rows.unshift(row);
			});

			// translate form config.
			platformTranslateService.translateFormConfig(columnsConfig);

			$scope.formContainerOptions = {
				statusInfo: function () {
				}
			};

			$scope.formContainerOptions.formOptions = {
				configure: columnsConfig,
				showButtons: [],
				validationMethod: function () {
				}
			};

			/* $scope.change = function change(item, model) {

			}; */

			$scope.modalOptions.ok = function onOK() {
				if($scope.currentItem.BoqItemFk) {
					var items = qtoMainSearchDataDetailDialogService.dataService.getSelectedEntities();
					var qtoHeader = $injector.get('qtoMainHeaderDataService').getSelected();
					angular.forEach(items, function (item) {
						item.BoqItemReferenceFk = null;
						item.BoqSubItemFk = null;
						item.BoqSubitemReferenceFk = null;
						item.BoqHeaderFk = qtoHeader.BoqHeaderFk;
						item.BoqItemFk = $scope.currentItem.BoqItemFk;
						$injector.get('qtoMainSearchDetailDialogValidationService').validateBoqItemFk(item, $scope.currentItem.BoqItemFk, 'BoqItemFk');
					});
					qtoMainSearchDataDetailDialogService.dataService.gridRefresh();

				}
				$scope.$close(false);
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close(false);
			};

			$scope.$on('$destroy', function () {
				$scope.currentItem = {};
			});
		}
	]);
})(angular);