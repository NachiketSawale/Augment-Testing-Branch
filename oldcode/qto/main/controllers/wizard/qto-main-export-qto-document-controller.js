(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'qto.main';

	// reb import format of file type
	angular.module(moduleName).constant('RebFormat', {
		DA11: 0,
		X31: 1,
		CRBX: 2,
		XML: 3
	});

	angular.module(moduleName).controller('qtoMainExportQtoDocumentController', [
		'$scope', '$translate', '$injector', '$http', 'platformTranslateService', 'qtoMainSidebarWizardService', 'boqMainCrbSiaService', 'qtoBoqStructureService', 'boqMainStandardTypes', 'RebFormat', 'qtoRubricCategory',
		function ($scope, $translate, $injector, $http, platformTranslateService, qtoMainSidebarWizardService, boqMainCrbSiaService, qtoBoqStructureService, boqMainStandardTypes, RebFormat, qtoRubricCategory) {

			$scope.options = $scope.$parent.modalOptions;
			$scope.isOkDisabled = false;
			$scope.isNextHide = true;

			// init current item.
			$scope.currentItem = $scope.options.dataItem;

			$scope.modalOptions = {
				headerText: $scope.options.headerText,
				prevStepText: $translate.instant('cloud.common.previousStep'),
				nextStepText: $translate.instant('cloud.common.nextStep'),
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			// get basic row setting from options
			$scope.options.formRows = $scope.options.formRows || [];

			let formConfig = qtoMainSidebarWizardService.exportREBFormConfig();

			var items = {
				Default: [{Id: 3, Name: 'XML'}],
				CRB: [{Id: 2, Name: 'CRBX'}, {Id: 3, Name: 'XML'}],
				Reb: [{Id: 0, Name: 'DA11'}, {Id: 1, Name: 'X31'}, {Id: 3, Name: 'XML'}]
			};

			let rebFormatRow = _.find(formConfig.rows, {rid: 'rebFormatId'});
			rebFormatRow.options.items = items.Default;
			var qtoHeaderSelectedItem = $injector.get('qtoMainHeaderDataService').getSelected();
			let httpGetPromise = $http.get(globals.webApiBaseUrl + 'boq/main/getstructure4boqheader?headerId=' + qtoHeaderSelectedItem.BoqHeaderFk + '&withDetails=' + true);
			httpGetPromise.then(function (response) {
				var boqStructure = response.data;
				let rubricCategroyFk = qtoHeaderSelectedItem.BasRubricCategoryFk;
				if (_.isObject(boqStructure)) {
					switch (boqStructure.BoqStandardFk) {
						case 1:
							rebFormatRow.options.items = rubricCategroyFk === qtoRubricCategory.RebRubricCategory ? items.Reb : items.Default;
							$scope.currentItem.rebFormatId = rubricCategroyFk === qtoRubricCategory.RebRubricCategory ? RebFormat.DA11 : RebFormat.XML;
							break;
						case 4:
							rebFormatRow.options.items = items.CRB;
							$scope.currentItem.rebFormatId = RebFormat.CRBX;
							break;
						case 5:
							rebFormatRow.options.items = items.Default;
							$scope.currentItem.rebFormatId = RebFormat.XML;
							break;
						default:
							rebFormatRow.options.items = items.Default;
							$scope.currentItem.rebFormatId = RebFormat.XML;
							break;
					}
				}

				$scope.formContainerOptions.formOptions.configure = formConfig;
				$scope.$broadcast('form-config-updated');

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

			$scope.$watch('currentItem.rebFormatId', function (newRebFormatId) {
				$scope.isOkDisabled = !(newRebFormatId !== RebFormat.CRBX && newRebFormatId !== RebFormat.XML);
				$scope.isNextHide = newRebFormatId !== RebFormat.CRBX;

				let exportQtoDocInfoRow = _.find(formConfig.rows, {rid: 'exportQtoDocInfo'});
				if(exportQtoDocInfoRow){
					exportQtoDocInfoRow.readonly = newRebFormatId === RebFormat.CRBX;
					$scope.currentItem.ExportQtoDocInfo = false;
				}

				let scopeRow = _.find(formConfig.rows, {rid: 'qtoScope'});
				if(scopeRow){
					scopeRow.readonly = newRebFormatId === RebFormat.CRBX;
				}

				let additionalGroup = _.find(formConfig.groups, {gid:'additional'});
				if(additionalGroup && newRebFormatId === RebFormat.XML){
					additionalGroup.visible = true;
					showAdditionalGroup();
				}else{
					additionalGroup.visible = false;
				}

				$scope.formContainerOptions.formOptions.configure = formConfig;

				$scope.$broadcast('form-config-updated');
			});

			function updateIsOkDisabled() {
				$scope.isOkDisabled = !($scope.currentItem.IncludeQtoDetail || $scope.currentItem.IncludeSheets || $scope.currentItem.IncludeGenerateDate);
			}

			$scope.$watch('currentItem.IncludeQtoDetail', updateIsOkDisabled);
			$scope.$watch('currentItem.IncludeSheets', updateIsOkDisabled);
			$scope.$watch('currentItem.IncludeGenerateDate', updateIsOkDisabled);

			$scope.modalOptions.ok = function onOK() {
				$scope.$close(
					{
						ok: true,
						data: $scope.currentItem
					});
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};

			function showAdditionalGroup() {
				let qtoScope = $scope.currentItem.qtoScope,
					IncludeSheets = $scope.currentItem.IncludeSheets,
					IncludeQtoDetail = $scope.currentItem.IncludeQtoDetail,
					IncludeGenerateDate = $scope.currentItem.IncludeGenerateDate;
				if ($scope.currentItem.rebFormatId === RebFormat.CRBX) {
					let boqHeader = $injector.get('qtoMainHeaderDataService').getSelected();
					let boqTempService = {
						getRootBoqItem: function () {
							return {BoqHeaderFk: boqHeader.BoqHeaderFk};
						},
						getQtoHeaderId: function () {
							return boqHeader.Id;
						},
						isWicBoq: function () {
							return false;
						},
						configOption: function (option) {
							option.buttons = option.buttons || [];
							option.buttons.push({
								id: 'previousStep', caption$tr$: 'basics.common.button.previousStep', autoClose: true, fn: function () {
									$injector.get('qtoMainSidebarWizardService').exportREB({
										rebFormatId: RebFormat.CRBX,
										qtoScope: qtoScope,
										IncludeSheets: IncludeSheets,
										IncludeQtoDetail: IncludeQtoDetail,
										IncludeGenerateDate: IncludeGenerateDate
									});
								}
							});
						}
					};
					boqMainCrbSiaService.exportCrbSia(boqTempService);
					$scope.$close(false);
				} else if ($scope.currentItem.rebFormatId === RebFormat.XML) {
					updateIsOkDisabled();
				}
			}

			$scope.modalOptions.next = function next() {
				let qtoScope = $scope.currentItem.qtoScope,
					IncludeSheets = $scope.currentItem.IncludeSheets,
					IncludeQtoDetail = $scope.currentItem.IncludeQtoDetail,
					IncludeGenerateDate = $scope.currentItem.IncludeGenerateDate;
				if($scope.currentItem.rebFormatId === RebFormat.CRBX){
					let boqHeader = $injector.get('qtoMainHeaderDataService').getSelected();
					let boqTempService = {
						getRootBoqItem: function (){
							return {BoqHeaderFk: boqHeader.BoqHeaderFk};
						},
						getQtoHeaderId: function (){
							return boqHeader.Id;
						},
						isWicBoq: function (){return false;},
						configOption: function (option){
							option.buttons = option.buttons || [];
							option.buttons.push({id: 'previousStep', caption$tr$: 'basics.common.button.previousStep', autoClose: true, fn: function () {
									$injector.get('qtoMainSidebarWizardService').exportREB({
										rebFormatId: RebFormat.CRBX,
										qtoScope: qtoScope,
										IncludeSheets: IncludeSheets,
										IncludeQtoDetail: IncludeQtoDetail,
										IncludeGenerateDate: IncludeGenerateDate
									});
								}});
						}
					};
					boqMainCrbSiaService.exportCrbSia(boqTempService);
					$scope.$close(false);
				}
			};

			$scope.$on('$destroy', function () {
				$scope.currentItem = {};
			});
		}
	]);
})(angular);