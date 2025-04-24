(function () {
	/* global globals */ 
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 *
	 * @description
	 *
	 **/

	angular.module(moduleName).controller('boqMainValidateGaebController', ['$scope',
		'$q',
		'$timeout',
		'platformTranslateService',
		'basicsLookupdataLookupFilterService',
		'boqMainGaebHelperService',
		function ($scope,
			$q,
			$timeout,
			platformTranslateService,
			basicsLookupdataLookupFilterService,
			boqMainGaebHelperService) {

			var _defaultGaebExt = $scope.$parent.modalOptions.options;

			// default value
			$scope.entity = {
				gaebTypeId: boqMainGaebHelperService.getGaebTypeId(_defaultGaebExt || '.x83')
			};

			$scope.path = globals.appBaseUrl;

			var formConfig =
				{
					showGrouping: false,
					groups: [
						{
							gid: '1',
							header: '',
							header$tr$: '',
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows: [
						{
							gid: '1',
							rid: 'GaebType',
							label: 'Gaeb Type',
							label$tr$: 'boq.main.Gaebtype',
							type: 'directive',
							model: 'gaebTypeId',
							directive: 'boq-main-gaeb-export-type-combobox',
							visible: true,
							sortOrder: 1
						}
					]
				};

			$scope.formOptions = {
				configure: formConfig
			};

			$scope.canExecuteOkButton = function () {
				return true;
			};

			$scope.okClicked = function () {
				$scope.close(boqMainGaebHelperService.getGaebExt(2, $scope.entity.gaebTypeId));
			};

			$scope.close = function (success) {
				$scope.$parent.$close(success || false);
			};

			$scope.isBusy = false;
			$scope.busyInfo = '';

			var init = function () {
				platformTranslateService.translateFormConfig(formConfig);
			};
			init();
		}
	]);
})();