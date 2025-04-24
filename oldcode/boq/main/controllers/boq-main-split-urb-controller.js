(function () {
	/* global globals, _ */ 
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

	angular.module(moduleName).controller('boqMainSplitUrbController', ['$scope',
		'$q',
		'$timeout',
		'platformTranslateService',
		'boqMainSplitUrbService',
		function ($scope,
			$q,
			$timeout,
			platformTranslateService,
			boqMainSplitUrbService) {

			var _options = $scope.$parent.modalOptions.options;

			// default value
			$scope.entity = {
				optScope: 0,     // all
				optMode: 0        // create
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
							rid: 'optScope',
							model: 'optScope',
							type: 'radio',
							// label: 'Select BoQ items',
							label$tr$: 'boq.main.splitUrbWizardOptScopeLabel',
							options: {
								valueMember: 'value',
								labelMember: 'label',
								items: [
									{
										value: 0,
										// label: 'All items',
										label$tr$: 'boq.main.splitUrbWizardOptScopeOptAllItems'
									},
									{
										value: 1,
										// label: 'Only selected items',
										label$tr$: 'boq.main.splitUrbWizardOptScopeLabel',
									}
								]
							}
						},
						{
							gid: '1',
							rid: 'optMode',
							model: 'optMode',
							type: 'radio',
							// label: 'Select mode',
							label$tr$: 'boq.main.splitUrbWizardOptModeLabel',
							options: {
								valueMember: 'value',
								labelMember: 'label',
								items: [
									{
										value: 0,
										// label: 'Create Unit Rate Breakdown',
										label$tr$: 'boq.main.splitUrbWizardOptModeCreate'
									},
									{
										value: 1,
										// label: 'Remove Unit Rate Breakdown',
										label$tr$: 'boq.main.splitUrbWizardOptModeRemove'
									}
								]
							}
						}
					]
				};

			$scope.formOptions = {
				configure: formConfig
				// validationMethod:
			};

			$scope.canExecuteOkButton = function () {
				return true;
			};

			$scope.okClicked = function () {
				_options.scope = $scope.entity.optScope;
				_options.mode = $scope.entity.optMode;
				_options.selectedIds = [];

				if (_options.scope === 1) // only selected items
				{
					var selected = _options.boqStructureService.getSelectedEntities();
					_.each(selected, function (item) {
						_options.selectedIds.push(item.Id);
					});
				}

				boqMainSplitUrbService.splitUrbItems(_options).then(function () {
					$timeout(function () {
						$scope.close(true);
					}, 0);
				}
				);
			};

			$scope.close = function (success) {
				$scope.$parent.$close(success || false);
			};

			var init = function () {
				platformTranslateService.translateFormConfig(formConfig);
			};
			init();

			// un-register on destroy
			$scope.$on('$destroy', function () {
			});
		}
	]);
})();