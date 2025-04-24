/**
 * Created by sus on 2015/8/4.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'procurement.common';
	/**
	 * @ngdoc directive
	 * @name procurement.pes.directive:procurementPesHeaderStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module(moduleName).factory('procurementCommonInputArgumentDialog', [
		'_', '$q', '$injector', 'platformModalService', 'platformDetailControllerService', 'platformRuntimeDataService',
		'platformTranslateService', 'platformObjectHelper', 'platformSchemaService', 'platformDataServiceFactory',
		/* jshint -W072 */ // many parameters because of dependency injection
		function (_, $q, $injector, platformModalService, platformDetailControllerService, platformRuntimeDataService,
			platformTranslateService, platformObjectHelper, platformSchemaService, platformDataServiceFactory) {

			return {
				showDialog: argumentsDialog
			};

			/**
			 * @name argumentsDialog
			 * @dataService  dataService of the controller
			 * @validationService validationService of the controller
			 * @dialogOptions
			 */
			function argumentsDialog(dataService, data, validationService, updateSelectedItem, dialogOptions, checkMandatoryAtBeginning, isCreateByMaterials) {
				checkMandatoryAtBeginning = checkMandatoryAtBeginning !== null && angular.isDefined(checkMandatoryAtBeginning) ? checkMandatoryAtBeginning : true;
				if (!angular.isFunction(updateSelectedItem)) {
					dialogOptions = dialogOptions || updateSelectedItem;
					updateSelectedItem = function () {
					};
				}

				var qDef = $q.defer();
				var config = getConfigure(dialogOptions);
				var showOptions = {
					height: dialogOptions.dialogHeight,
					width: dialogOptions.dialogWidth || '660px',
					templateUrl: globals.appBaseUrl + 'basics.common/templates/input-dialog-directive-dialog.html',
					backdrop: false,
					resizeable: true,
					controller: ['$scope', dialogController(dialogOptions)]
				};

				if (config.checkingMandatory(data.selectedItemDailog) && checkMandatoryAtBeginning) {
					qDef.resolve(data.selectedItemDailog);
				} else {
					var getServiceName = dataService.getServiceName;
					dataService.getServiceName = function () {
						return getServiceName() + 'CreationArgumentDialog';
					};
					config.initValue(data.selectedItemDailog, dataService.updateRowStatus);
					platformModalService.showDialog(showOptions).then(function (result) {
						dataService.getServiceName = getServiceName;
						qDef.resolve(result);
					});
				}
				return qDef.promise;

				function dialogController(options) {

					return function ($scope) {
						$scope.okBtnReadonly = false;
						$scope.getContainerUUID = function () {
							if(options.UUID) {
								return options.UUID;
							}
							return dataService.getServiceName() + '-UUID';
						};
						var serviceOptions = {
							flatNodeItem: {
								module: angular.module(moduleName),
								presenter: {
									list: {}
								},
								entityRole: {leaf: {itemName: 'ProcumentCreationDailog', parentService: dataService}}
							}
						};
						var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
						serviceContainer.data.selectedItem = data.selectedItemDailog;
						platformDetailControllerService.initDetailController($scope, serviceContainer.service, validationService, config, platformTranslateService);

						updateSelectedItem($scope.currentItem);
						$scope.buttons = [];
						$scope.requirement = false;
						$scope.title = getTitle(angular.extend({title$tr$: 'procurement.common.creationDailogTitle'}, options));
						$scope.setReadonly = platformRuntimeDataService.readonly;
						$scope.formOptions.onLeaveLastRow = null;
						$scope.hasContractItem = options.hasContractItem || false;
						$scope.modalOptions = {};
						$scope.modalOptions.headerText = $scope.title.name;
						$scope.modalOptions.cancel = function cancel() {
							$scope.$close(false);
						};
						var bottonContent = 'cloud.common.ok';
						if (isCreateByMaterials) {
							bottonContent = 'cloud.common.nextStep';
						}

						if (!Object.prototype.hasOwnProperty.call(options,'showSettings')|| options.showSettings) {
							$scope.tools = {
								showImages: true,
								showTitles: true,
								cssClass: 'tools',
								update: function () {
								},
								items: [
									{
										id: 't111',
										sort: 111,
										caption: 'cloud.common.gridlayout',
										caption$tr$: 'cloud.common.detailslayout',
										iconClass: 'tlb-icons ico-settings',
										type: 'item',
										fn: function () {
											$scope.formOptions.showConfigDialog();
										}
									}
								]
							};
						}

						$scope.buttons.push({
							context$tr$: bottonContent, execute: function() {
								if (config.checkingMandatory($scope.currentItem) || (options.customValidate && options.customValidate($scope.currentItem, config))) {
									$scope.$close($scope.currentItem);
								} else {
									var errorMessage = 'Something field is null.';
									if (dataService.updateRowStatus) {
										dataService.updateRowStatus($scope.currentItem);
										dataService.gridRefresh();
										errorMessage = config.getErrorText($scope.currentItem) || errorMessage;
									}
									platformModalService.showErrorDialog({
										ErrorCode: 0,
										ErrorMessage: errorMessage,
										ErrorDetails: ''
									});

								}
							}, disabled: function() {
								return options.disableButton ? options.disableButton($scope.currentItem, config) : !config.checkingMandatory($scope.currentItem);
							}
						});
						$scope.buttons.push({
							context$tr$: 'cloud.common.cancel', execute: function () {
								$scope.$close(false);
							}
						});

						watchGroup($scope, options);
					};
				}

				function watchGroup($scope, options) {
					var watchConfigures = _.map($scope.formOptions.configure.groups, function (group, index) {
						return $scope.$watch('formOptions.configure.groups[$index$].isOpen'.replace('$index$', index), function (newValue, oldValue) {
							(group.watchIsOpen || options.watchIsOpen || function () {
							})($scope.formOptions.configure.groups, group, newValue, oldValue);
						});
					});

					$scope.$on('$destroy', function () {
						angular.forEach(watchConfigures, function (func) {
							func();
						});
					});
				}

				function getTitle(options) {
					var translates = [], reg = /[,|;]/;
					if (options.title$tr$) {
						angular.forEach(options.title$tr$.split(reg), function (item) {
							translates.push({name: item, name$tr$: item});
						});
					}
					if (options.titleField) {
						angular.forEach(options.titleField.split(reg), function (item) {
							translates.push({name: item, name$tr$: item});
						});
					}

					return {
						name: _.map(platformTranslateService.translateGridConfig(translates), function (item) {
							return item.name;
						}).join(' - '),
						name$tr$: options.titleField + 'DialogTitle'
					};
				}

				function getConfigure(dialogOptions) {
					var rows = dialogOptions.rows, displayFields = [];
					var unitClerkAttributeDomains = dialogOptions.schema ? platformSchemaService.getSchemaFromCache(dialogOptions.schema).properties : null;

					dialogOptions.noDisplay = angular.isString(dialogOptions.noDisplay) ? dialogOptions.noDisplay.split(',') : (dialogOptions.noDisplay || ['InsertedAt', 'InsertedBy', 'Version']);

					if (angular.isString(dialogOptions.rows)) {
						var tempRowData = dialogOptions.rows.split(':');
						// noinspection JSCheckFunctionSignatures
						rows = $injector.get(tempRowData[0], null);
						displayFields = tempRowData[1] ? tempRowData[1].split(',') : [];
					}
					var mandatory = function mandatory(row) {// row
						if (_.some(dialogOptions.additional, function (i) {
							return i.model === row.model;
						})) {
							return true;
						} else if ((angular.isFunction(dialogOptions.noDisplay) && dialogOptions.noDisplay(row)) ||
							(angular.isArray(dialogOptions.noDisplay) && dialogOptions.noDisplay.indexOf(row.model) !== -1)) {
							return false;
						} else if (unitClerkAttributeDomains) {
							return unitClerkAttributeDomains[row.model] && unitClerkAttributeDomains[row.model].mandatory;
						} else {
							return displayFields.indexOf(row.model) !== -1;
						}
					};

					var sort = function ($configure, $displayFields) {
						for (var i = 0; i < $displayFields.length; i++) {
							for (var j = i + 1; j < $displayFields.length; j++) {
								swap($displayFields[i], $displayFields[j]);
							}
						}

						function swap(iModel, jModel) {
							var iRow = _.findIndex($configure.rows, function ($rowTemp) {
								return $rowTemp.model === iModel;
							});
							var jRow = _.findIndex($configure.rows, function ($rowTemp) {
								return $rowTemp.model === jModel;
							});
							if (iRow !== -1 && jRow !== -1 && $configure.rows[iRow] !== undefined && $configure.rows[jRow] !== undefined &&
								$configure.rows[iRow].sortOrder > $configure.rows[jRow].sortOrder && $configure.rows[iRow].gid === $configure.rows[jRow].gid) {
								var swapTemp = $configure.rows[iRow].sortOrder;
								$configure.rows[iRow].sortOrder = $configure.rows[jRow].sortOrder;
								$configure.rows[jRow].sortOrder = swapTemp;
							}
						}
					};

					var sortGroup = function ($configure, $groupSort) {
						for (var i = 0; i < $groupSort.length; i++) {
							for (var j = i + 1; j < $groupSort.length; j++) {
								swap($groupSort[i], $groupSort[j]);
							}
						}

						function swap(iGid, jGid) {
							var iGroup = _.findIndex($configure.groups, function ($groupTemp) {
								return $groupTemp.gid === iGid;
							});
							var jGroup = _.findIndex($configure.groups, function ($groupTemp) {
								return $groupTemp.gid === jGid;
							});
							if (iGroup !== -1 && jGroup !== -1 && iGroup > jGroup) {
								var swapTemp = $configure.groups[iGroup];
								$configure.groups[iGroup] = $configure.groups[jGroup];
								$configure.groups[jGroup] = swapTemp;
							}
						}
					};

					var gid = 'formGroup';
					var groups = [{'gid': gid, 'header': 'Header', 'isOpen': true, 'visible': true, 'sortOrder': 1}];
					var configure = {
						'fid': 'cloud.common.dialog.default.form',
						'version': '1.0.0',
						'showGrouping': false,
						'groups': groups,
						'rows': [],
						'addValidationAutomatically': true,
						'skipPermissionCheck': true,
						'skipConfiguration': true,
						'dirty': function () {
						}
					};

					if (!rows) {
						return null;
					} else if (angular.isFunction(rows.getStandardConfigForDetailView)) {
						rows = rows.getStandardConfigForDetailView;
					}
					if (angular.isFunction(rows)) {
						var configureTemp = rows();
						rows = angular.copy(configureTemp.rows);
						groups = configureTemp.groups;
						configure.rows = [];
						configure.groups = [];
					}
					if (dialogOptions.additional) {
						rows.push.apply(rows, dialogOptions.additional);
					}
					/* jshint -W074 */
					angular.forEach(rows, function (row) {

						if ((row.readonly || (row.options && (row.options.readOnly || (row.options.lookupOptions && row.options.lookupOptions.readOnly)))) ||
							displayFields.indexOf('!' + row.model) !== -1 || !(displayFields.indexOf(row.model) !== -1 || (mandatory(row)))) {
							return;
						}

						var replace = dialogOptions.replace && dialogOptions.replace[row.model];
						var count = _.filter(configure.rows, function (i) {
							return i.model === row.model;
						}).length;
						var copyRow = angular.extend({gid: gid, rid: row.model.toLocaleLowerCase() + (count ? ('-' + count) : '')}, row);

						if (replace && angular.element && angular.element.extend) {
							copyRow = angular.element.extend(true, copyRow, replace);
						}

						if (copyRow.gid && !_.some(configure.groups, function (g) {
							return g.gid === copyRow.gid;
						})) {
							var group = _.find(groups, {gid: copyRow.gid}) || {'gid': copyRow.gid, 'header': copyRow.gid, 'isOpen': false, 'visible': true, 'sortOrder': configure.groups.length + 1};
							configure.groups.push(angular.extend({}, group, dialogOptions.replace && dialogOptions.replace[group.gid]));
						}

						configure.rows.push(tidyRow(copyRow));
					});

					if (dialogOptions.customProcessRows && angular.isFunction(dialogOptions.customProcessRows)){
						dialogOptions.customProcessRows(configure.rows);
					}

					configure.showGrouping = (configure.groups.length > 1);

					sort(configure, displayFields);
					sortGroup(configure, Object.getOwnPropertyNames(dialogOptions.replace || {}));
					return {
						initValue: initValue,
						checkingMandatory: checking,
						getErrorText: getError,
						getStandardConfigForDetailView: function () {
							return platformTranslateService.translateFormConfig(configure);
						}
					};

					function tidyRow(tempRow) {
						delete tempRow.navigator;

						return tempRow;
					}

					function initValue(currentItem, updateRowStatus) {
						angular.forEach(configure.rows, function (row) {
							if (row.type === 'directive' && !Object.prototype.hasOwnProperty.call(currentItem,row.model)) {
								platformObjectHelper.setValue(currentItem, row.model, null);
							}
						});
						if (Object.getOwnPropertyNames(currentItem)) {
							angular.extend(currentItem, {$fromDialog: true});
						}
						if (updateRowStatus) {
							updateRowStatus(currentItem);
						}
					}

					function checking(currentItem) {
						return !_.some(configure.rows, function (row) {
							/** @namespace row.noCheck */
							return !row.noCheck && mandatory(row) && !platformObjectHelper.getValue(currentItem, row.model);
						});
					}

					function getError(item) {
						return _.filter(_.map(configure.rows, function (row) {
							return platformRuntimeDataService.getErrorText(item, row.model);
						}), function (i) {
							return !!i;
						}).join(' <br> ');
					}
				}

			}
		}]);

})(angular);