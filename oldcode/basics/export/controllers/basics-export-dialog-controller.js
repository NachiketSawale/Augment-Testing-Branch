(function () {
	'use strict';
	var moduleName = 'basics.export';

	angular.module(moduleName).controller('basicsExportDialogController', ['$scope', '$q', 'basicsExportService', 'platformTranslateService', 'basicsExportFormatService', 'basicsLookupdataLookupFilterService',
		function ($scope, $q, basicsExportService, platformTranslateService, basicsExportFormatService,basicsLookupdataLookupFilterService) {
			$scope.path = globals.appBaseUrl;
			$scope.entity = basicsExportService.getExportOptions();

			// default value
			if (!$scope.entity.data.hasOwnProperty('wizardParameter')) { $scope.entity.data.wizardParameter = {}; }

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
						rid: 'subContainers',
						label: 'Container',
						label$tr$: 'basics.export.entitySubContainers',
						type: 'directive',
						model: 'SubContainers',
						directive: 'platform-checked-listbox',
						options: {
							displayMember: 'Label',
							selectedMember: 'Selected',
							predicate: function(item) {
								return item.Visible;
							}
						},
						visible:	$scope.entity.data.SubContainers && $scope.entity.data.SubContainers.length > 0
					},
					{
						gid: '1',
						rid: 'ExcelProfile',
						label$tr$: 'basics.export.entityExcelProfile',
						type: 'directive',
						model: 'ExcelProfileId',
						directive: 'basics-export-formats-combobox',
						options: {
							events: [{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									setupControls(args.selectedItem);
								}
							}]
						},
						visible: true
					},
					{
						gid: '1',
						rid: 'JustifyPropertyNames',
						label: 'Remove special chars',
						label$tr$: 'basics.export.justifyPropertyNames',
						type: 'boolean',
						model: 'JustifyPropertyNames'
					}
				]
			};

			var setupControls = function(excelProfile) {
				var isFreeContext = excelProfile.ProfileContext==='General';

				$scope.entity.data.ExportFormat = (excelProfile.Id===1)                           ? 0 // Free CSV
														  : (excelProfile.Id===2)                           ? 1 // Free XML
														  : excelProfile.ProfileContext==='BoqBidder'       ? 4
														  : excelProfile.ProfileContext==='BoqPlanner'      ? 5
														  : excelProfile.ProfileContext==='MatBidder'       ? 6
														  : excelProfile.ProfileContext==='BoqPes'          ? 7
														  : excelProfile.ProfileContext==='BoqPlannerPrice' ? 8
														  :                                                   3; // Free Excel


				formConfig.rows[2].visible =  isFreeContext;   // JustifyPropertyNames

				$scope.$broadcast('form-config-updated');
			};

			// object holding translated strings
			$scope.translate = {};

			var loadTranslations = function () {
				platformTranslateService.translateFormConfig(formConfig);
				    $scope.$broadcast('form-config-updated');
			};

			// register translation changed event
			platformTranslateService.translationChanged.register(loadTranslations);

			// register a module - translation table will be reloaded if module isn't available yet
			if(!platformTranslateService.registerModule(moduleName)) {
				// if translation is already available, call loadTranslation directly
				loadTranslations();
			}

			$scope.formOptions = {
				configure: formConfig
			};

			$scope.canExecuteOkButton = function () {
				var canExecute = $scope.entity.data.ExcelProfileId;
				return canExecute;
			};

			var init = function() {
				var promises = [];

				basicsExportFormatService.addValidExcelProfileContexts($scope.entity.data.ExcelProfileContexts);

				promises.push(basicsExportFormatService.loadExcelProfiles());
				$q.all(promises).then(function() {
					var excelProfiles = basicsExportFormatService.getList();
					var defaultExcelProfile = _.find(excelProfiles, 'IsDefault') || excelProfiles[0];
					$scope.entity.data.ExcelProfileId = defaultExcelProfile.Id;
					setupControls(defaultExcelProfile);
				});
			};
			init();

			// un-register on destroy
			$scope.$on('$destroy', function () {
				platformTranslateService.translationChanged.unregister(loadTranslations);
			});
		}
	]);
})();
