(function (angular) {

	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonFormatterHelper',
		['_', 'platformObjectHelper', '$sanitize',
			function (_, platformObjectHelper) {
				const splitChar = '[column]', styleRegex = /{.*}/;

				return {
					getValue: function getValue(item, displayMember, formatters, noStyle) {
						if (angular.isString(displayMember)) {
							if (displayMember.indexOf(splitChar[0]) === -1) {
								return platformObjectHelper.getValue(item || {}, displayMember) || '';
							} else if (item && Object.getOwnPropertyNames(item).length) {
								return toElement(displayMember, formatters, item, noStyle);
							} else {
								return '';
							}
						}
					}
				};

				function toElement(str, formatters, item, noStyle) {
					let result = '', temp = '', defaultStyle = 'color:#0000ff',
						elementStr = '<em style="@style@">@value@</em>';
					const noColumns = [];
					for (let i = 0; i < str.length; i++) {
						if (str[i] === splitChar[0]) {
							result += getOtherContent(temp);
							temp = splitChar[0];
						} else if (str[i] === splitChar[splitChar.length - 1]) {
							if (temp[0] === splitChar[0]) {
								result += getFieldContent(temp.slice(1, temp.length), formatters, noColumns);
							} else {
								result += getOtherContent(temp + splitChar[splitChar.length - 1]);
							}
							temp = '';
						} else {
							temp += str[i];
						}
					}
					result = result || all(item, noColumns);

					while (/@defaultStyle@/.test(result)) {
						result = result.replace('@defaultStyle@', defaultStyle);
					}
					return result;

					function all($item, $noColumns) {
						let $result = '';
						angular.forEach($item, function (v, k) {
							if ($noColumns.indexOf(k) === -1) {
								$result += ($result ? getOtherContent(' | ') : '') + getFieldContent(k, formatters);
							}
						});
						return $result;
					}

					function getOtherContent(data) {
						if (noStyle || !data || !data.toLocaleString().trim()) {
							return data || '';
						} else {
							return elementStr.replace('@style@', '@defaultStyle@').replace('@value@', data);
						}
					}

					/* jshint -W074 */
					function getFieldContent(column, formatters, noColumns) {
						let value = platformObjectHelper.getValue(item || {}, column.replace(styleRegex, ''));
						let style = styleRegex.exec(column);
						if (style && style[0]) {
							style = style[0].slice(1, style[0].length - 1);
						}
						if (formatters && formatters[column]) {
							value = formatters[column](-1, -1, value, {field: column}, item);
						}
						return (function result() {
							if (column[0] === '!' && noColumns) {
								noColumns.push(column.slice(1, temp.length));
								return '';
							} else if (!column.replace(styleRegex, '') && style) {
								defaultStyle = style;
								return '';
							} else {
								if (noStyle || !style || !style[0]) {
									return (value || value === 0) ? value : '';
								} else {
									return elementStr.replace('@style@', style + '').replace('@value@', (value || value === 0) ? value : '');
								}
							}
						})();
					}
				}
			}]);

	angular.module(moduleName).factory('basicsCommonComplexFormatter',
		['basicsCommonFormatterHelper', 'platformGridDomainService', '$sanitize',
			function (basicsCommonFormatterHelper, platformGridDomainService, $sanitize) {
				return function complexFormatter(row, cell, value, columnDef, dataContext, plainText) {
					value = basicsCommonFormatterHelper.getValue(dataContext, columnDef.field);
					if (columnDef.formatterOptions) {
						const displayMember = columnDef.formatterOptions.displayMember;
						const domainTypeFormatter = platformGridDomainService.formatter(columnDef.formatterOptions.domainType);
						if (value && typeof value === 'object' && displayMember) {
							value = basicsCommonFormatterHelper.getValue(value, displayMember, columnDef.formatterOptions.formatterDictionary);
						}
						if (domainTypeFormatter && typeof domainTypeFormatter === 'function') {
							value = domainTypeFormatter(row, cell, value, columnDef, dataContext, plainText);
						}
					}
					return value ? $sanitize(value) : '';
				};
			}]);

	angular.module(moduleName).factory('basicsCommonComplexFormatterHtmlOptional',
		['basicsCommonFormatterHelper', 'platformGridDomainService',
			function (basicsCommonFormatterHelper, platformGridDomainService) {
				return function complexFormatter(row, cell, value, columnDef, dataContext) {
					value = basicsCommonFormatterHelper.getValue(dataContext, columnDef.field);
					if (columnDef.formatterOptions) {
						const displayMember = columnDef.formatterOptions.displayMember;
						const domainTypeFormatter = platformGridDomainService.formatter(columnDef.formatterOptions.domainType);
						if (value && typeof value === 'object' && displayMember) {
							value = basicsCommonFormatterHelper.getValue(value, displayMember, columnDef.formatterOptions.formatterDictionary);
						}
						if (domainTypeFormatter && typeof domainTypeFormatter === 'function') {
							value = domainTypeFormatter(row, cell, value, columnDef, dataContext);
						}
					}
					// different from 'basicsCommonComplexFormatter', 'basicsCommonComplexFormatter' will filter out html tag.
					return value || '';
				};
			}]);

	angular.module(moduleName).factory('basicsCommonInputDialogDirectiveFactory',
		['globals', '_', '$window', '$log', '$q', '$http', '$compile', '$timeout', '$injector', 'platformModalService', 'platformTranslateService', 'platformObjectHelper',
			'basicsLookupdataLookupFilterService', 'platformRuntimeDataService', 'platformDetailControllerService', 'basicsLookupdataLookupDescriptorService',
			'platformUserInfoService', 'basicsCommonFormatterHelper', 'platformDataServiceFactory', 'basicsLookupdataPopupService',
			'$templateCache', 'basicsLookupdataLookupViewService', '$', 'moment', 'platformUtilService', 'BasicsLookupdataLookupDirectiveDefinition',
			/* jshint -W072 */ // many parameters because of dependency injection
			function (globals, _, $window, $log, $q, $http, $compile, $timeout, $injector, platformModalService, platformTranslateService, platformObjectHelper, basicsLookupdataLookupFilterService, platformRuntimeDataService, platformDetailControllerService, basicsLookupdataLookupDescriptorService, platformUserInfoService, basicsCommonFormatterHelper, platformDataServiceFactory, basicsLookupdataPopupService, $templateCache, basicsLookupdataLookupViewService, $, moment, platformUtilService, BasicsLookupdataLookupDirectiveDefinition) {

				const dataCache = {context: {}, baseUrl: globals.appBaseUrl + moduleName};

				const initDataCache = function () {
					dataCache.inputUrl = dataCache.baseUrl + '/templates/input-dialog-directive-input.html';
					dataCache.dialogUrl = dataCache.baseUrl + '/templates/input-dialog-directive-dialog.html';
					dataCache.contextUrl = dataCache.baseUrl + '/templates/input-dialog-directive-context.html';

					$http.get(dataCache.dialogUrl).then(function (res) {
						dataCache.body = res.data;
					});
					$http.get(dataCache.contextUrl).then(function (res) {
						angular.forEach($(res.data), function (item) {
							if (item.id) {
								dataCache.context[item.id] = item.innerHTML;
							}
						});
					});
				};
				let hasDataModified = false;
				const httpService = {
					dueService: function () {
						const localStorageDueTime = 7 * 24 * 60 * 60 * 1000;
						return {
							check: function (oldTime) {
								/* jshint -W117 */
								return moment.utc().add(-localStorageDueTime).valueOf(null) < oldTime;
							}
						};
					},
					getTemplate: function (options) {
						const deferred = $q.defer();
						const succeed = function (replace) {
							const addStyle = options.dialogHeight ? ' style="height:660px"' : ' ';
							const section = '<section class="modal-body"',
								regSource = section + '>([\\s\\S]*)</section>';
							deferred.resolve((replace ? dataCache.body.replace(new RegExp(regSource), regSource.replace('([\\s\\S]*)', replace)) : dataCache.body).replace(section + '>', section + addStyle + '>'));
						};

						if (options.dialogTemplateDialog) {
							$http.get(globals.appBaseUrl + options.dialogTemplateDialog).then(function (res) {
								deferred.resolve(res.data);
							});
						} else {
							if (options.dialogTemplateDirective) {
								succeed('<div ' + options.dialogTemplateDirective + '><div>');
							} else if (options.dialogTemplate) {
								succeed(options.dialogTemplate);
							} else if (options.dialogTemplateUrl) {
								const urlOptions = options.dialogTemplateUrl.split('#');
								$http.get(globals.appBaseUrl + urlOptions[0]).then(function (res) {
									succeed(urlOptions[1] ? ('<div data-ng-controller="' + urlOptions[1] + '">' + res.data + '<div>') : res.data);
								});
							} else {
								succeed(dataCache.context[options.dialogTemplateId]);
							}
						}

						return deferred.promise;
					},
					operateUserLocalStorage: function (arg) {
						const useDataKey = globals.appBaseUrl + 'userData';
						const userId = platformUserInfoService.getCurrentUserInfo().UserId;
						localStorage[useDataKey] = localStorage[useDataKey] || '{}';
						const dataTempAll = JSON.parse(localStorage[useDataKey]);
						const dataTemp = dataTempAll[userId] = dataTempAll[userId] || {};
						if (angular.isString(arg) && dataTemp[arg]) {
							return httpService.dueService().check(dataTemp[arg].time) ? dataTemp[arg].value : null;
						} else if (arg && angular.isObject(arg)) {
							angular.forEach(arg, function (value, key, obj) {
								/* jshint -W117 */
								obj[key] = {value: value, time: moment.utc().valueOf(null)};
							});
							angular.extend(dataTemp, arg);
						} else if (angular.isFunction(arg)) {
							arg(dataTemp);
						}
						localStorage[useDataKey] = JSON.stringify(dataTempAll);
					},
					getOrCreateItem: function getOrCreateItem(dataService, oldItem, options, entity, func) {
						/** @namespace $scope.options.initCreate */
						const data = options.initCreate ? options.initCreate(entity) : entity;
						const succeed = function (res) {
							if (res.data.Main || res.data.dtos) {
								basicsLookupdataLookupDescriptorService.attachData(res.data || {});
							}
							if (options.succeedCreate && !res.isOld) {
								options.succeedCreate(res.data.Main || res.data.dtos || res.data, httpService.operateUserLocalStorage, data);

							}
							func(res.data.Main || res.data.dtos || res.data);
						};

						if (oldItem && !options.allwaysUseNew) {
							succeed({isOld: true, data: angular.copy(oldItem)});
						} else if (angular.isFunction(options.create)) {
							options.create($http, dataService, data).then(succeed);
						} else if (options.urlCreateGet) {
							$http.get(globals.webApiBaseUrl + options.urlCreateGet).then(succeed);
						} else if (options.urlCreatePost) {
							$http.post(globals.webApiBaseUrl + options.urlCreatePost, data).then(succeed);
						} else {
							succeed({});
						}
					},
					updateOptions: function updateOptions($scope, urlUpdate, urlResponseHandler) {
						const updateItemFormat = function () {
							const succeed = function (res) {
								if (res) {
									angular.extend($scope.currentItem, res.data);
								}
								$scope.isFormating = false;
							};
							const error = function (error) {
								$log.log(error);
								$scope.isFormating = false;
							};

							if (!$scope.isFormating && $scope.isNeedUpdate()) {
								$scope.isFormating = true;
								if (angular.isString(urlUpdate)) {
									$http.post(globals.webApiBaseUrl + urlUpdate, $scope.currentItem).then((res) => {
										if (urlResponseHandler) {
											res = urlResponseHandler($scope.currentItem, res);
										}
										succeed(res);
									}, error);
								}
								if (angular.isFunction(urlUpdate)) {
									succeed({data: urlUpdate($scope.currentItem)});
								}
							}
						};
						const isDataModified = function isDataModified() {
							hasDataModified = true;
						};
						const updateData = function (newVal, oldValue) {
							if (newVal !== oldValue) {
								isDataModified();
							}
						};
						const updateFmt = function (newVal, oldValue) {
							if (newVal !== oldValue) {
								updateItemFormat();
								isDataModified();
							}
						};
						$timeout(updateItemFormat, 500);
						return {
							updateItemFormat: updateItemFormat,
							updateFmt: updateFmt,
							isDataModified: isDataModified,
							updateData: updateData
						};
					}
				};

				function getSetVisible($scope) {
					return function setVisible(item, fields) {
						angular.forEach(fields, function (fieldItem) {
							const field = fieldItem.field.toLocaleLowerCase();
							const filter = function (row) {
								return row.model.toLocaleLowerCase() === field;
							};
							if (!$scope.formOptions.configure.rowsDict) {
								return;
							}
							angular.forEach(_.filter($scope.formOptions.configure.rowsDict, filter), function (row) {
								row.visible = fieldItem.visible;
							});
						});
						$scope.$broadcast('form-config-updated');
					};
				}

				function getTitle(options) {
					const translates = [], reg = /[,|;]/;
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

				function getValidationService(service) {
					const defaultService = {
						validateModel: function () {
							return true;
						}
					};
					if (!service) {
						return defaultService;
					} else if (angular.isString(service)) {
						return $injector.get(service);
					} else {
						return angular.extend(defaultService, service);
					}
				}

				function getDataService(options, service) {
					if (angular.isString(service)) {
						return $injector.get(service);
					} else {
						getDataService[options.title$tr$] = getDataService[options.title$tr$] || platformDataServiceFactory.createNewComplete({
							module: angular.module(moduleName),
							serviceName: options.title$tr$,
							entityRole: {
								root: {
									itemName: options.title$tr$,
									rootForModule: 'thereIsNoModuleTheseServiceIsResponsibleFor'
								}
							},
							presenter: {list: {}},
							entitySelection: {},
							modification: {simple: {}}
						});
						if (!service) {
							return getDataService[options.title$tr$].service;
						} else {
							return angular.extend(getDataService[options.title$tr$].service, service);
						}
					}
				}

				function initDetailController($scope, dialogOptions, dialogEntity, validationService, dataService) {
					const originalRows = angular.isString(dialogOptions.rows) ? $injector.get(dialogOptions.rows) : dialogOptions.rows;

					dataService.setSelected(runProcessItem(dataService, dialogEntity, originalRows)).finally(function () {
						$scope.currentItem = dialogEntity;
						($scope.selectAfter || function () {
						})(dialogEntity || {});
					});

					$scope.getContainerUUID = function () {
						return dialogOptions.UUID;
					};

					if (originalRows) {
						platformDetailControllerService.initDetailController($scope, dataService, validationService, getConfigure(originalRows), platformTranslateService);
					}

					function getConfigure(rows) {
						const gid = 'formGroup';
						let configure = {
							'fid': 'cloud.common.dialog.default.form',
							'version': '1.0.0',
							'showGrouping': false,
							'skipConfiguration':  angular.isDefined(dialogOptions.skipConfiguration) ? dialogOptions.skipConfiguration : false,
							'groups': [{
								'gid': gid,
								'header': 'Header',
								'isOpen': true,
								'visible': true,
								'sortOrder': 1
							}],
							'rows': [],
							'addValidationAutomatically': true,
							'skipPermissionCheck': angular.isDefined(dialogOptions.skipPermissionCheck) ? dialogOptions.skipPermissionCheck : true,
							'dirty': function () {
							}
						};

						if (!rows) {
							return null;
						} else if (angular.isFunction(rows.getStandardConfigForDetailView)) {
							const tempRows = angular.copy(rows);
							if (angular.isDefined(dialogOptions.skipPermissionCheck)) {
								const tempConfig = tempRows.getStandardConfigForDetailView();
								tempConfig.skipPermissionCheck = dialogOptions.skipPermissionCheck;
								tempRows.getStandardConfigForDetailView = function () {
									return tempConfig;
								};
							}
							return tempRows;
						} else {
							if (angular.isFunction(rows)) {
								configure = rows();
								rows = configure.rows;
								configure.rows = [];
							}
							angular.forEach(rows, function (row) {
								const count = _.filter(configure.rows, function (i) {
									return i.model === row.model;
								}).length;
								const copyRow = angular.extend({
									gid: gid,
									rid: row.model.toLocaleLowerCase() + (count ? ('-' + count) : '')
								}, row);

								if (copyRow.gid && !_.some(configure.groups, function (g) {
									return g.gid === copyRow.gid;
								})) {
									configure.groups.push({
										'gid': copyRow.gid,
										'header': copyRow.gid,
										'isOpen': false,
										'visible': true,
										'sortOrder': configure.groups.length + 1
									});
								}
								configure.rows.push(copyRow);
							});
							configure.showGrouping = (configure.groups.length > 1);

							return {
								getStandardConfigForDetailView: function () {
									return platformTranslateService.translateFormConfig(configure);
								}
							};
						}
					}

					function runProcessItem(dataService, item, rows) {
						if (angular.isFunction(rows.getStandardConfigForDetailView)) {
							rows = rows.getStandardConfigForDetailView().rows;
						}

						dialogOptions.readonlyFields = dialogOptions.readonlyFields || [];
						angular.forEach(dialogOptions.dataProcessor, function (processor) {
							processor.processItem(item);
						});
						const getReadonly = function getReadonly(item, field) { // TODO ada: fix the readonly can not work issue by ada
							return dialogOptions.isReadonly || dataService.isReadonly() || dialogOptions.readonlyFields.indexOf(field) !== -1;
						};
						if (item && Object.getOwnPropertyNames(item).length) {
							platformRuntimeDataService.readonly(item, _.map(rows, function (row) {
								return {
									field: row.model,
									readonly: getReadonly(item, row.model)
								};
							}));
						}
						angular.forEach(validationService, function (fun, property) {
							const field = property.replace('asyncValidate', '').replace('validate', '');
							if (angular.isFunction(fun) && _.some(rows, function (row) {
								return row.model === field;
							}) && !platformRuntimeDataService.isReadonly(item, field)) {
								if (/^validate.*/.test(property)) {
									platformRuntimeDataService.applyValidationResult(fun(item, platformObjectHelper.getValue(item, field), field), item, field);
								}
								if (/^asyncValidate.*/.test(property)) {
									fun(item, platformObjectHelper.getValue(item, field), field).then(function (res) {
										platformRuntimeDataService.applyValidationResult(res.data, item, field);
									});
								}
							}
						});
						return item;
					}
				}

				function dialogController(dialogEntity, dialogOptions, controllerFun, validationService, dataService) {
					return function ($scope) {

						initDetailController($scope, dialogOptions, dialogEntity, validationService, dataService);

						$scope.error = {};
						$scope.buttons = [];
						$scope.title = getTitle(dialogOptions);
						$scope.modalOptions = {};
						$scope.modalOptions.headerText = $scope.title.name;
						$scope.modalOptions.cancel = function cancel() {
							$scope.$close(false);
						};

						$scope.setReadonly = platformRuntimeDataService.readonly;
						$scope.setVisible = getSetVisible($scope);

						$scope.isNeedUpdate = function () {
							return !!$scope.currentItem;
						};
						$scope.beforeOk = function () {
						};

						if (controllerFun) {
							controllerFun($scope, validationService, httpService, dataService);
						}

						$scope.buttons.push({
								context$tr$: 'cloud.common.ok', execute: function () {
									const errorMessage = $scope.beforeOk($scope.currentItem, httpService.operateUserLocalStorage);
									if (errorMessage) {
										$scope.error = {
											show: true,
											messageCol: 1,
											message: errorMessage,
											iconCol: 1,
											type: 3
										};
									} else {
										$scope.$close($scope.currentItem);
									}
								}
							});
						$scope.buttons.push({
							context$tr$: 'cloud.common.cancel', execute: function () {
								$scope.$close(null);
							}
						});
					};
				}

				function showDialog($scope, dialogOptions, $element, controllerFun, validationService, dataService) {

					httpService.getOrCreateItem(dataService, $scope.ngModel, dialogOptions.createOptions, $scope.entity, function (dialogEntity) {
						httpService.getTemplate(dialogOptions).then(function (template) {
							const showOptions = {
								width: dialogOptions.dialogWidth || '600px',
								template: template,
								backdrop: false,
								resizeable: dialogOptions.resizeable || false,
								controller: ['$scope', dialogController(dialogEntity, dialogOptions, controllerFun, validationService, dataService)]
							};

							platformModalService.showDialog(showOptions).then(function (currentItem) {
								if (currentItem) {
									$scope.validator(currentItem).then(function () {
										if (!dialogOptions.isValidation || dialogOptions.isValidation(currentItem)) {
											applyValue($scope, currentItem);
										}
									}, function (result) {
										const apply = result.apply;
										if (apply) {
											applyValue($scope, currentItem);
										}
									});
								}

								$timeout(function () { // avoid angular $digest error.
									if (currentItem && hasDataModified && $scope.config && $scope.config.onPropertyChanged) { // TODO chi: add by cici
										$scope.config.onPropertyChanged();
									}
									hasDataModified = false;
									$scope.updateValue();
									$element.find('button:last').focus();
								}, 500);
							});

							function applyValue($scope, currentItem) {
								$scope.ngModel = null; // TODO chi: add by cici
								$scope.ngModel = angular.extend({}, currentItem);
								if ($scope.entity && dialogOptions.foreignKey) {
									const id = platformObjectHelper.getValue(currentItem, dialogOptions.valueMember || 'Id');
									platformObjectHelper.setValue($scope.entity, dialogOptions.foreignKey, id);
								}
								// if ($scope.config && $scope.config.onPropertyChanged) { // TODO chi: comment by cici
								// $scope.config.onPropertyChanged();
								// }
								if (dialogOptions.updateDate) {
									dialogOptions.updateDate($scope, dataService);
								}
							}
						});
					});
				}

				initDataCache();

				return function create(configOptions, controllerFun, validationService, dataService) {

					return {
						restrict: 'A',
						require: 'ngModel',
						scope: {
							entity: '=',
							options: '=',
							ngModel: '=',
							config: '='
						},
						templateUrl: dataCache.inputUrl,
						link: function ($scope, $element, attrs, ngModelCtrl) {
							let popupInstance = null;
							let popupHelper = null;

							$scope.initStyleAndData = function () {
								const cell = $element.parents('.slick-cell:first');
								if (cell && cell.length) {
									$scope.getInputStyle = function () {
										const zapWidth = $element.find('.input-group-btn').width() + ($scope.getImageHtml() ? $element.find('.lookup-img-box').width() : 0);
										return {
											width: cell.find('.input-group').width() - zapWidth + 'px',
											display: 'block'
										};
									};
									$scope.getInputGroupStyle = function () {
										return {
											width: cell.innerWidth() + 'px',
											overflow: 'hidden',
											background: 'white'
										};
									};
								} else {
									$scope.getInputStyle = function () {
										return {background: '#ececec', 'word-break': 'break-all'};
									};
									$scope.getInputGroupStyle = function () {
										return {overflow: 'hidden'};
									};
									$scope.getInputGroupCssClass = function () {
										return configOptions.cssClass ? configOptions.cssClass : '';
									};
								}

								$scope.options = angular.extend({imageCls: 'slick-cell'}, configOptions.formatterOptions, $scope.options);
								$scope.options.readOnly = attrs.readonly === 'true';
								$scope.options.rt$readonly = $scope.config && $scope.config.rt$readonly;

								// extend the customize popupOptions and popupLookupConfig
								$scope.options.showPopup = configOptions.showPopup;
								configOptions.popupLookupConfig = angular.extend(configOptions.popupLookupConfig || {}, $scope.options.popupLookupConfig);
								configOptions.popupOptions = angular.extend(configOptions.popupOptions || {}, $scope.options.popupOptions);

								if (configOptions.controllerFun) {
									configOptions.controllerFun($scope);
								}

								$scope.$on('$destroy', $scope.$watch('ngModel', $scope.updateValue));
							};

							// model -> view
							ngModelCtrl.$render = function () {
								$scope.ngModel = ngModelCtrl.$viewValue;
							};

							// call change callback from form control.
							ngModelCtrl.$viewChangeListeners.push(function () {
								$scope.$parent.$eval(attrs.config + '.rt$change()');
							});

							$scope.updateValue = function () {
								let result = '';
								if ($scope.options) {
									if ($scope.options.displayMember) {
										result = basicsCommonFormatterHelper.getValue($scope.ngModel, $scope.options.displayMember, $scope.options.formatterDictionary);
									} else if ($scope.options.getItemText) {
										result = $scope.options.getItemText($scope.ngModel || {});
									}
								}
								if (result && !_.isEmpty(result)) {
									$element.find('.value-input').text((result).replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
								} else {
									$element.find('.value-input').text('');
								}
								// check undefined
								if($scope.options){
									$scope.options.imageCls = $scope.getImageHtml() ? 'lookup-input-image' : '';
								}
							};

							// view -> model
							$scope.setViewValue = function (viewValue) {
								if (ngModelCtrl.$viewValue !== viewValue) {
									ngModelCtrl.$setViewValue(viewValue);
									ngModelCtrl.$commitViewValue();
								}
							};

							$scope.getImageHtml = function () {
								let imageSelector = $scope.options && $scope.options.imageSelector;
								if (angular.isString(imageSelector)) {
									imageSelector = $injector.get(imageSelector);
								}
								const image = $scope.ngModel && imageSelector ? imageSelector.select($scope.ngModel) : '';
								if (!image) {
									$element.find('.lookup-img-box').remove();
								} else {
									return '<img alt="" src="' + image + '" />';
								}

							};

							$scope.clearValue = function () {
								$scope.validator(null).then(function () {
									$scope.ngModel = null;
									$scope.setViewValue(null);
								});
							};

							$scope.editValue = function () {
								const myOptions = angular.extend({}, configOptions, $scope.options);
								angular.extend(myOptions.createOptions, $scope.options);
								showDialog($scope, myOptions, $element, controllerFun, getValidationService(validationService), getDataService(myOptions, dataService));
							};

							$scope.searchValue = function () {
								let config = {
									templateUrl: globals.appBaseUrl + 'procurement.contract/partials/prc-contract-address-dialog.html',
									controller: 'procurementContractAddressDialogController',
									width: '750px',
									resolve: {
										'params': function () {
											if($scope.options.hasOwnProperty('mainService')){
												let service =  $injector.get($scope.options.mainService);
												if(service.hasOwnProperty('getService')){
													service = service.getService();
												}
												return {serviceName:service};
											}else{

											}

										}
									},
								};
								let platformModalService = $injector.get('platformModalService');
								platformModalService.showDialog(config).then(function (result) {
								});
							};

							$scope.validator = function (newValue) {
								const defer = $q.defer();
								if ($scope.config && !angular.equals($scope.ngModel, newValue)) {
									if ($scope.config.asyncValidator) {
										return $q(function (resolve, reject) {
											$scope.config.asyncValidator($scope.entity, newValue, $scope.config.model).then(function (result) {
												result = platformRuntimeDataService.applyValidationResult(result, $scope.entity, $scope.config.model);
												if (result.valid) {
													if ($scope.config.validator) {
														result = $scope.config.validator($scope.entity, newValue, $scope.config.model);
														result = platformRuntimeDataService.applyValidationResult(result, $scope.entity, $scope.config.model);
													}
												}
												(result.valid ? resolve : reject)({
													apply: result.apply,
													valid: result.valid
												});
											}, function () {
												resolve(true);
											});
										});
									}

									if ($scope.config.validator) {
										let result = $scope.config.validator($scope.entity, newValue, $scope.config.model);
										result = platformRuntimeDataService.applyValidationResult(result, $scope.entity, $scope.config.model);
										defer.resolve(result.valid);
										return defer.promise;
									}
								}

								defer.resolve(true);
								return defer.promise;
							};

							if (configOptions.showPopup) {

								basicsLookupdataLookupViewService.config('lookup-edit', configOptions.popupLookupConfig);

								$scope.settings = configOptions.popupLookupConfig;

								$scope.settings.getFilterValue = function getFilterValue() {

									if ($scope.$parent && $scope.$parent.entity && Object.prototype.hasOwnProperty.call($scope.$parent.entity, configOptions.popupLookupConfig.referencedForeignKey)) {
										return $scope.$parent.entity[configOptions.popupLookupConfig.referencedForeignKey];
									}

									const dataService = getDataService({}, configOptions.popupLookupConfig.dataService);
									if (dataService && _.isFunction(dataService.getService)) {
										const service = dataService.getService();

										if (service) {
											const parentService = service.parentService();
											if (parentService) {
												const selected = parentService.getSelected();
												if (selected && Object.prototype.hasOwnProperty.call(selected, configOptions.popupLookupConfig.referencedForeignKey)) {
													return selected[configOptions.popupLookupConfig.referencedForeignKey];
												}
											}
										}
									}
									return null;
								};

								$scope.editModeHandler = {
									getSelectedRowId: function () {
										return null;
									}
								};

								$scope.canSelect = function canSelect(selectedItem) {
									return selectedItem;
								};

								$scope.togglePopup = function togglePopup(event) {
									if (!popupHelper) {
										popupHelper = basicsLookupdataPopupService.getToggleHelper();
									}

									const defaultPopupOptions = {
										scope: $scope,
										template: $templateCache.get('grid-popup-lookup.html'),
										footerTemplate: $templateCache.get('lookup-popup-footer.html'),
										controller: '',
										focusedElement: $(event.target),
										width: 400,
										height: 320,
										showLastSize: true
									};

									const popupOptions = $.extend(true, defaultPopupOptions, configOptions.popupOptions);

									popupInstance = popupHelper.toggle(popupOptions);
									if (popupInstance && popupInstance.result) {
										popupInstance.result.then(function (result) {
											if (result && result.isOk && result.value) {
												httpService.getOrCreateItem(dataService, $scope.ngModel, configOptions.createOptions, null, function (newEntity) {
													if ($scope.entity) {
														const newId = platformObjectHelper.getValue(newEntity, 'Id');
														const referenced = angular.extend({}, result.value);

														if (!$scope.ngModel) {
															referenced.Version = 0;
														} else {
															referenced.Version = $scope.ngModel.Version;
														}
														referenced.Id = newId;
														$scope.ngModel = null; // TODO chi: add by cici
														$scope.ngModel = angular.extend({}, referenced);
														platformObjectHelper.setValue($scope.entity, $scope.options.foreignKey, newId);

														$timeout(function () { // avoid angular $digest error.
															if ($scope.config && $scope.config.onPropertyChanged) { // TODO chi: add by cici
																$scope.config.onPropertyChanged();
															}
															$scope.updateValue();
															$element.find('button:last').focus();
														}, 500);
													}
												});
											}
										});
									}
								};
							}

							$scope.initStyleAndData();
						}
					};
				};

				function getFormContainerOptions() {
					return {
						title: 'cloud.common.advancedCriteria',
						entity: function entitySetting() {
							const mainItem = $injector.get('procurementContractHeaderDataService').getSelected();
							let entity = {};
							if (mainItem) {
								entity.CompanyFk = mainItem.CompanyFk;
								entity.ProjectFk = mainItem.ProjectFk;
							}
							return entity;
						},
						formOptions: {
							configure: {
								showGrouping: false,
								groups: [{
									gid: 'baseGroup',
									isOpen: true
								}],
								rows: [{
									gid: 'baseGroup',
									rid: 'company',
									label$tr$: 'cloud.common.entityCompany',
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-assigned-company-lookup',
										descriptionMember: 'CompanyName',
										lookupOptions: {
											showClearButton: true,
											events: [
												{
													name: 'onSelectedItemChanged',
													handler: function onSelectedItemChangedHandler(e, args) {
														if (args && args.entity) {
															let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
															if (!args.selectedItem) {
																args.entity.ProjectFk = null;
																platformRuntimeDataService.readonly(args.entity, [{field: 'ProjectFk', readonly: true}]);
															} else {
																if (args.selectedItem.Id !== args.entity.CompanyFk) {
																	args.entity.ProjectFk = null;
																}
																platformRuntimeDataService.readonly(args.entity, [{field: 'ProjectFk', readonly: false}]);
															}
														}
													}
												}
											]
										}
									},
									model: 'CompanyFk'
								}, {
									gid: 'baseGroup',
									rid: 'project',
									label$tr$: 'cloud.common.entityProject',
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'procurement-project-lookup-dialog',
										descriptionMember: 'ProjectName',
										lookupOptions: {
											lookupType: 'PrcProject',
											filterKey: 'project-main-project-for-rfq-requisition-filter',
											showClearButton: true
										}
									},
									model: 'ProjectFk',
									readonly: false
								}]
							}
						}
					};
				}

			}]);

})(angular);
