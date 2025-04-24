/**
 * Created by lnt on 10/10/2023.
 */

(function (angular) {
	/* global globals */

	'use strict';

	let moduleName = 'qto.main';

	angular.module(moduleName).value('qtoMainSourceDetailConfigForm', {

		'fid': 'qot.main.sourceqtodetailconfig',
		'version': '1.1.0',
		showGrouping: false,
		title$tr$: '',
		skipPermissionCheck: true,
		'groups': [
			{
				'gid': 'SourceDetailConfig',
				'header$tr$': '',
				'isOpen': true,
				'visible': true,
				'sortOrder': 1
			}
		],
		'rows': [
			{
				gid: 'SourceDetailConfig',
				rid: 'IsLocation',
				label: 'Location',
				label$tr$: 'qto.main.location',
				type: 'boolean',
				model: 'IsLocation',
				visible: true,
				sortOrder: 1
			},
			{
				gid: 'SourceDetailConfig',
				rid: 'IsAssetMaster',
				label: 'Asset Master',
				label$tr$: 'qto.main.AssetMaster',
				type: 'boolean',
				model: 'IsAssetMaster',
				visible: true,
				sortOrder: 2
			},
			{
				gid: 'SourceDetailConfig',
				rid: 'IsControllingUnit',
				label: 'Controlling Unit',
				label$tr$: 'cloud.common.entityControllingUnitCode',
				type: 'boolean',
				model: 'IsControllingUnit',
				visible: true,
				sortOrder: 3
			},
			{
				gid: 'SourceDetailConfig',
				rid: 'IsSortCode',
				label: 'Sort Code',
				label$tr$: 'qto.main.sortCode',
				type: 'boolean',
				model: 'IsSortCode',
				visible: true,
				sortOrder: 4
			},
			{
				gid: 'SourceDetailConfig',
				rid: 'IsCostGroup',
				label: 'Cost Group',
				label$tr$: 'qto.main.costGroup',
				type: 'boolean',
				model: 'IsCostGroup',
				visible: true,
				sortOrder: 5
			},
			{
				gid: 'SourceDetailConfig',
				rid: 'IsPrc',
				label: 'Procurement Structure code',
				label$tr$: '',
				type: 'boolean',
				model: 'IsPrc',
				visible: true,
				sortOrder: 6
			},
			{
				gid: 'SourceDetailConfig',
				rid: 'IsBillTo',
				label: 'Bill To',
				label$tr$: '',
				type: 'boolean',
				model: 'IsBillTo',
				visible: true,
				sortOrder: 7
			},
			{
				gid: 'SourceDetailConfig',
				rid: 'IsContract',
				label: 'Contract',
				label$tr$: '',
				type: 'boolean',
				model: 'IsContract',
				visible: true,
				sortOrder: 8
			}
		]
	});

	/**
	 * @ngdoc controller
	 * @name qtoMainSourceDetailConfigController
	 * @requires $scope
	 * @description
	 * #
	 * qtoMainSourceDetailConfigController
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('qtoMainSourceDetailConfigController', [
		'$scope', '$http', '$translate', '$injector', 'platformTranslateService', 'qtoMainSourceDetailConfigForm',
		function ($scope, $http, $translate, $injector, platformTranslateService, formConfig) {

			$scope.options = $scope.$parent.modalOptions;
			$scope.isOkDisabled = false;

			// init current item.
			$scope.currentItem = $scope.options.currentItem;

			$scope.modalOptions = {
				headerText: $scope.options.headerText,
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			// get basic row setting from options
			$scope.options.formRows = $scope.options.formRows || [];
			let index = 0;
			formConfig = angular.copy(formConfig);

			angular.forEach($scope.options.formRows, function (row) {
				row.rid = row.rid || 'formrowid' + index++;
				row.gid = 'SourceDetailConfig';
				formConfig.rows.unshift(row);
			});

			// translate form config.
			platformTranslateService.translateFormConfig(formConfig);

			$scope.formContainerOptions = {
				statusInfo: function () {
				}
			};

			$scope.formContainerOptions.formOptions = {
				configure: formConfig,
				showButtons: [],
				validationMethod: function () {
				}
			};

			$scope.setTools = function (tools) {
				$scope.tools = tools;
			};

			$scope.modalOptions.ok = function onOK() {
				let profile= {};
				profile.ProfileName= 'Source QTO Lines';
				profile.ProfileAccessLevel = 'User';
				$scope.currentItem.optionProfile = 'Source QTO Lines(System)';
				profile.GroupKey = 'qto.main.sourceLinesCopy';
				profile.AppId = '1840b2391ae9454cad1a053b773f84d5';
				profile.PropertyConfig = JSON.stringify($scope.currentItem);
				profile.IsDefault = true;

				$http.post(globals.webApiBaseUrl + 'procurement/common/option/saveprofile',profile).then(function (){
					$scope.$close(false);
				});
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};

			$scope.$on('$destroy', function () {
				$scope.currentItem = {};
			});
		}
	]);
})(angular);