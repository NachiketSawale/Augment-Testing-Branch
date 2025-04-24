/**
 * Created by lnt on 11/3/2017.
 */

(function (angular) {
	/* global _ */
	'use strict';
	var moduleName = 'qto.main';

	angular.module(moduleName).value('qtoMainRenumberDetailFormConfig', {

		'fid': 'qot.wizard.renumberQtoDetail',
		'version': '1.1.0',
		showGrouping: false,
		title$tr$: '',
		skipPermissionCheck: true,
		change: 'change',
		'groups': [
			{
				'gid': 'RenumberQtoDetail',
				'header$tr$': '',
				'isOpen': true,
				'visible': true,
				'sortOrder': 1
			}
		],
		'rows': [
			{
				'rid': 'PageNumber',
				'gid': 'RenumberQtoDetail',
				'label$tr$': 'qto.main.PageNumber',
				'model': 'PageNumber',
				'type': 'directive',
				'directive': 'basics-common-limit-input',
				'options': {
					validKeys: {
						regular: '^[0-9]{0,4}$'
					}
				}
			},
			{
				'rid': 'LineReference',
				'gid': 'RenumberQtoDetail',
				'label$tr$': 'qto.main.LineReference',
				'model': 'LineReference',
				'formatter': 'description',
				'type': 'directive',
				'directive': 'qto-limit-input',
				'options': {
					validKeys: {
						regular: '^[A-Za-z]{0,1}$'
					}
				}
			},
			{
				'rid': 'LineIndex',
				'gid': 'RenumberQtoDetail',
				'label$tr$': 'qto.main.LineIndex',
				'model': 'LineIndex',
				'type': 'directive',
				'directive': 'basics-common-limit-input',
				'options': {
					validKeys: {
						regular: '^[0-9]{0,1}$'
					}
				}
			},
			{
				'rid': 'Increment',
				'gid': 'RenumberQtoDetail',
				'label': 'Increment',
				'label$tr$': 'qto.main.Increment',
				'model': 'Increment',
				'type': 'directive',
				'directive': 'basics-common-limit-input',
				'options': {
					validKeys: {
						regular: '^[1-9][0-9]{0,6}$'
					}
				}
			},
			{
				gid: 'RenumberQtoDetail',
				rid: 'scope',
				model: 'qtoDetailScope',
				type: 'radio',
				label: 'Select Scope',
				label$tr$: 'qto.main.wizard.wizardDialog.scopeLabel',
				options: {
					valueMember: 'value',
					labelMember: 'label',
					items: [
						{
							value: 1,
							label: 'Start as',
							label$tr$: 'qto.main.wizard.wizardDialog.allItems'
						},
						{
							value: 0,
							label: 'For all selected items',
							label$tr$: 'qto.main.wizard.wizardDialog.selectItems'
						}]
				}
			}
		]
	});

	/**
	 * @ngdoc controller
	 * @name qtoMainRenumberDetailDialogController
	 * @requires $scope
	 * @description
	 * #
	 * qtoMainRenumberDetailDialogController
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('qtoMainRenumberDetailDialogController', [
		'$scope', '$translate', '$injector', 'platformTranslateService', 'qtoMainRenumberDetailFormConfig', 'qtoMainDetailService', 'platformModalService', 'qtoMainRenumberDetailDataService',
		function ($scope, $translate, $injector, platformTranslateService, formConfig, qtoMainDetailService, platformModalService, qtoMainRenumberDetailDataService) {

			$scope.options = $scope.$parent.modalOptions;
			$scope.isOkDisabled = false;

			var selectItems = qtoMainDetailService.getSelectedEntities();

			// init current item.
			$scope.currentItem = {
				qtoDetailScope: 1,
				LineIndex: 0,
				LineReference: 'A',
				PageNumber: 1,
				Increment: 10
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

			angular.forEach(formConfig.rows, function (row){
				if (row.rid === 'PageNumber'){
					row.options = {
						validKeys: {
							regular: qtoMainDetailService.getQtoTypeFk() === 1 ? '^[0-9]{0,5}$' : '^[0-9]{0,4}$'
						}
					};
				} else if (row.rid === 'LineIndex'){
					row.options = {
						validKeys: {
							regular: qtoMainDetailService.getQtoTypeFk() === 1 ? '^[0-9]{0,2}$' : '^[0-9]{0,1}$'
						}
					};
				}
			});

			angular.forEach($scope.options.formRows, function (row) {
				row.rid = row.rid || 'formrowid' + index++;
				row.gid = 'RenumberQtoDetail';
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

			$scope.change = function change() {
				var PageNumber = $scope.currentItem.PageNumber;
				var LineIndex = $scope.currentItem.LineIndex;
				var LineReference = $scope.currentItem.LineReference;
				var Increment = $scope.currentItem.Increment;

				$scope.isOkDisabled = ((!_.isNumber(PageNumber) &&_.isEmpty(PageNumber)) || (!_.isNumber(LineIndex) &&_.isEmpty(LineIndex)) || _.isEmpty(LineReference) || (!_.isNumber(Increment) &&_.isEmpty(Increment)));
			};

			$scope.modalOptions.ok = function onOK() {
				var itemsToSave;
				var renumberConfig = $scope.currentItem;
				var lineIndex = parseInt(renumberConfig.LineIndex);
				var lineReference = renumberConfig.LineReference;
				var pageNumber = parseInt(renumberConfig.PageNumber);
				var increment = parseInt(renumberConfig.Increment);
				var currentItem = qtoMainDetailService.getSelected();
				var items = qtoMainDetailService.getList();
				var isLineToSave = false;
				if(renumberConfig.qtoDetailScope === 0){ // for all selected items
					if(selectItems.length > 0) {
						isLineToSave =  qtoMainRenumberDetailDataService.isItemsToSave(selectItems);
						if(isLineToSave) {
							selectItems = _.filter(selectItems, function (item) {
								return (item.WipHeaderFk === null && item.PesHeaderFk === null && !item.IsReadonly);
							});
							itemsToSave = qtoMainRenumberDetailDataService.renumberSelectQtoDetails(items, selectItems, pageNumber, lineReference, lineIndex, increment);
						}
					}
				}
				else { // start as
					if (currentItem) {
						var targetIndex = items.findIndex(function (item) {
							return item.Id === currentItem.Id;
						});
						var restItems = [];
						for (var i = 0; i < items.length; i++) {
							if (i >= targetIndex) {
								restItems.push(items[i]);
							}
						}

						isLineToSave =  qtoMainRenumberDetailDataService.isItemsToSave(restItems);
						if(isLineToSave) {
							restItems = _.filter(restItems, function (item) {
								return (item.WipHeaderFk === null && item.PesHeaderFk === null && !item.IsReadonly);
							});
							itemsToSave = qtoMainRenumberDetailDataService.renumberSelectQtoDetails(items, restItems, pageNumber, lineReference, lineIndex, increment);
						}
					} else {
						isLineToSave =  qtoMainRenumberDetailDataService.isItemsToSave(items);
						if(isLineToSave) {
							items = _.filter(items, function (item) {
								return (item.WipHeaderFk === null && item.PesHeaderFk === null && !item.IsReadonly);
							});
							itemsToSave = qtoMainRenumberDetailDataService.renumberQtoDetails(items, items, pageNumber, lineReference, lineIndex, increment);
						}
					}
				}

				// assign qtoSheetFk to qto line
				if(itemsToSave && itemsToSave.length > 0) {
					var pageNumberList = [];
					var qtoHeader = $injector.get('qtoMainHeaderDataService').getSelected();
					var qtoSheets = $injector.get('qtoMainStructureDataService').getList();
					var qtoHeaderId = qtoHeader.Id;
					_.forEach(itemsToSave, function(item){
						item.IsCalculate = true;
						var index1 = _.findIndex(qtoSheets, {'PageNumber': item.PageNumber});
						var index2 = pageNumberList.indexOf(item.PageNumber);
						// page number exists in qto sheets
						if(index1 !== -1){
							item.QtoSheetFk = qtoSheets[index1].Id;
						}

						if (index1 === -1 && index2 === -1) {
							pageNumberList.push(item.PageNumber);
						}
					});
					if(pageNumberList.length > 0) {
						$injector.get('qtoMainStructureDataService').createQtoStructures(qtoHeaderId, itemsToSave, pageNumberList, qtoHeader.QtoTypeFk).then(function () {
							// save items
							qtoMainDetailService.markEntitiesAsModified(itemsToSave);
							$injector.get('qtoMainHeaderDataService').update().then(function(){
								$injector.get('qtoMainDetailService').load();
							});
						});
					}
					else{
						// save items
						qtoMainDetailService.markEntitiesAsModified(itemsToSave);
						$injector.get('qtoMainHeaderDataService').update().then(function(){
							$injector.get('qtoMainDetailService').load();
						});
					}
				}

				$scope.$close(false);
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