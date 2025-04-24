(function (angular) {
	'use strict';

	const moduleName = 'model.annotation';
	angular.module(moduleName).controller('modelAnnotationSendMessageController', modelAnnotationSendMessageController);

	modelAnnotationSendMessageController.$inject = ['$', '$scope', '_', '$http', 'globals', 'platformGridAPI', 'platformTranslateService', 'platformRuntimeDataService'];

	function modelAnnotationSendMessageController($, $scope, _, $http, globals, platformGridAPI, platformTranslateService, platformRuntimeDataService) {

		const gridId = '53fd8ad4c35f4c13bd41117e2d9c1663';

		const gridColumns = [
			{
				id: 'IsChecked',
				field: 'IsChecked',
				name$tr$: 'model.annotation.choose',
				formatter: 'boolean',
				editor: 'boolean',
				width: 80,
				headerChkbox: true
			},
			{
				id: 'Name',
				field: 'Name',
				name$tr$: 'model.annotation.name',
				formatter: 'description',
				width: 200
			}
		];

		let hasGridData = false;

		$scope.isLoading = false;

		$scope.gridData = {
			state: gridId
		};

		$scope.resultData = $scope.dialog.modalOptions.value.resultData;

		$scope.canUpdate = canUpdate;

		$scope.inputOpen = true;
		$scope.reportOpen = true;
		$scope.messageOpen=true;
		$scope.resultData.IsBCFAdded = false;
		$scope.bcfFileEnabled = true;
		$scope.resultData.BCFFileName = 'Annotations_{date}{.bcf}';
		$scope.resultData.BCFVersion='V3_0';
		$scope.reportFileEnabled = true;
		$scope.resultData.IsReportAdded = false;
		$scope.resultData.ReportFileName='Reports_{date}';
		$scope.resultData.ReportFileType='PDF_File';
		$scope.hideFileType=false;
		$scope.hideReports=true;

		$scope.bcfVersionlookupOptions = {
			events: [{
				name: 'onSelectedItemChanged', handler: function selectedVersionChanged(e, args) {
					reactOnSelectedItemChanged(args.selectedItem);
				}
			}],
			dataServiceName: 'modelAnnotationBcfVersionLookupDataService',
			displayMember: 'DisplayName',
			lookupModuleQualifier: 'modelAnnotationBcfVersionLookupDataService',
			lookupType: 'modelAnnotationBcfVersionLookupDataService',
			showClearButton: false,
			valueMember: 'BcfVersion',
			uuid: '64b0595ab29345e39e4680ee8060111f',
			disableDataCaching: true,
			readonly: false,
			disabled: true,
			filterOnSearchIsFixed: true,
			isClientSearch: true,
			columns: [
				{
					id: 'Description',
					field: 'DisplayName',
					name: 'Description',
					formatter: 'description',
					name$tr$: 'cloud.common.descriptionInfo'
				}
			],
			popupOptions: {
				width: 300
			}
		};

		$scope.reportFileTypeLookupOptions = {
			events: [],
			dataServiceName: 'modelAnnotationDocumentTypeLookupDataService',
			displayMember: 'DisplayName',
			lookupModuleQualifier: 'modelAnnotationDocumentTypeLookupDataService',
			lookupType: 'modelAnnotationDocumentTypeLookupDataService',
			showClearButton: false,
			valueMember: 'DocumentType',
			uuid: 'ed75251e8e304b01bc63198c904a5397',
			disableDataCaching: true,
			readonly: false,
			disabled: true,
			filterOnSearchIsFixed: true,
			isClientSearch: true,
			columns: [
				{
					id: 'Description',
					field: 'DisplayName',
					name: 'Description',
					formatter: 'description',
					name$tr$: 'cloud.common.descriptionInfo'
				}
			],
			popupOptions: {
				width: 300
			}
		};

		$scope.reportLookupOptions = {
			events: [],
			dataServiceName: 'modelAnnotationReportsLookupDataService',
			displayMember: 'DescriptionInfo.Translated',
			lookupModuleQualifier: 'modelAnnotationReportsLookupDataService',
			lookupType: 'modelAnnotationReportsLookupDataService',
			showClearButton: false,
			valueMember: 'Id',
			uuid: 'c8195a2b3a5c4a7dade69f6bb392112e',
			disableDataCaching: true,
			readonly: false,
			disabled: true,
			filterOnSearchIsFixed: true,
			isClientSearch: true,
			columns: [
				{
					id: 'Description',
					field: 'DescriptionInfo.Translated',
					name: 'Description',
					formatter: 'description',
					name$tr$: 'cloud.common.descriptionInfo'
				}
			],
			popupOptions: {
				width: 300
			}
		};

		initialize();

		// //////////////////////////////////////////

		function setupGrid() {

			const columns = angular.copy(gridColumns);

			if (!platformGridAPI.grids.exist(gridId)) {
				const resultGridConfig = {
					columns: columns,
					data: [],
					id: gridId,
					lazyInit: true,
					options: {
						tree: true,
						indicator: true,
						childProp: 'ContactTypes',
						treeWidth: 70
					}
				};
				platformGridAPI.grids.config(resultGridConfig);
				platformTranslateService.translateGridConfig(resultGridConfig.columns);
			}
		}

		function updateGrid(resultGridData) {
			platformGridAPI.grids.invalidate(gridId);
			platformGridAPI.items.data(gridId, resultGridData);
		}

		function canUpdate() {
			return hasGridData;
		}

		function initialize() {
			setupGrid();
			$scope.isLoading = true;
			$http.get(globals.webApiBaseUrl + 'model/annotation/contacts/list').then(function (response) {
				$scope.isLoading = false;
				for (let category of response.data) {
					const field = [{field: 'IsChecked', readonly: true}];
					platformRuntimeDataService.readonly(category, field);
					for (let contactTypes of category.ContactTypes) {
						_.assign(contactTypes, {
							image: 'control-icons ico-user-group'
						});
					}
				}
				const result = response.data;

				if (!result || result.length === 0) {
					return;
				}
				hasGridData = true;
				updateGrid(result);
				$scope.dialog.modalOptions.value.categories = result;
			}, function () {
				$scope.isLoading = false;
				hasGridData = false;
			});
		}

		function reactOnSelectedItemChanged(selectedItem) {
			$scope.selectedBcfVersion = selectedItem.DisplayName;
		}

		$scope.onCheckEvent = function (addBcfAnnotation) {
			$scope.resultData.IsBCFAdded = addBcfAnnotation;
			let ele = document.querySelectorAll('.bcf-version');
			let child = ele[0].childNodes[0].children[0];
			if ($scope.resultData.IsBCFAdded === true) {
				$scope.bcfFileEnabled = false;
				child.querySelector('input').readOnly = false;

				child.querySelector('span').childNodes.forEach((item) => {
					if (item.tagName === 'BUTTON') {
						item.disabled = false;
					}
				});
			} else {
				$scope.bcfFileEnabled = true;
				child.querySelector('input').readOnly = true;
				child.querySelector('span').childNodes.forEach((item) => {
					if (item.tagName === 'BUTTON') {
						item.disabled = true;
					}
				});
			}
		};

		$scope.onCheckReportEvent = function (addReportAnnotation) {
			$scope.IsReportAdded = addReportAnnotation;
			let ele = document.querySelectorAll('.report');
			let fileEle = document.querySelectorAll('.report-file');

			let child = ele[0].childNodes[0].children[0];
			let fileChild = fileEle[0].childNodes[0].children[0];
			if ($scope.IsReportAdded === true) {
				$scope.reportFileEnabled = false;
				child.querySelector('input').readOnly = false;
				fileChild.querySelector('input').readOnly = false;
				child.querySelector('span').childNodes.forEach((item) => {
					if (item.tagName === 'BUTTON') {
						item.disabled = false;
					}
				});
				fileChild.querySelector('span').childNodes.forEach((item) => {
					if (item.tagName === 'BUTTON') {
						item.disabled = false;
					}
				});
			} else {
				$scope.reportFileEnabled = true;
				child.querySelector('input').readOnly = true;
				child.querySelector('span').childNodes.forEach((item) => {
					if (item.tagName === 'BUTTON') {
						item.disabled = true;
					}
				});

				fileChild.querySelector('input').readOnly = true;
				fileChild.querySelector('span').childNodes.forEach((item) => {
					if (item.tagName === 'BUTTON') {
						item.disabled = true;
					}
				});
			}
		};
	}
})(angular);
