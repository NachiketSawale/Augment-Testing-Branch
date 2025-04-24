/**
 * Created by chk on 10/12/2016.
 */
(function (angular) {
	'use strict';
	/* global globals,_ */
	/* jshint -W072 */
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).factory('constructionSystemCommonOutputUiStandardService',
		['$state', '$filter', 'platformTranslateService', 'platformGridDomainService', 'basicsCommonGridFormatterHelper', 'cloudDesktopNavigationPermissionService',
			function ($state, $filter, platformTranslateService, platformGridDomainService, basicsCommonGridFormatterHelper, navigationPermissionService) {
				var cache = {};

				return function (moduleName) {
					if (cache[moduleName]) {
						return cache[moduleName];
					}

					var service = {};

					cache[moduleName] = service;

					var cosMaster = [
						{
							id: 'order',
							field: 'Order',
							name: '#',
							toolTip: 'Order',
							sortable: true,
							formatter: 'code',
							searchable: true
						},
						{
							id: 'errorType',
							field: 'ErrorType',
							name$tr$: 'constructionsystem.executionScriptOutput.category',
							toolTip: 'ErrorType',
							sortable: false,
							formatter: function (row, cell, value, columnDef, dataContext) {
								value = basicsCommonGridFormatterHelper.formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);
								return '<i class="block-image ' + $filter('constructionSystemScriptTypeFilter')(value) + '"></i>';
							}
						},
						{
							id: 'description',
							field: 'Description',
							name$tr$: 'constructionsystem.executionScriptOutput.description',
							toolTip: 'Description',
							sortable: true,
							searchable: true,
							width: 50,
							editor: 'lookup',
							editorOptions: {
								directive: 'construction-System-Common-Description-Dialog',
								lookupOptions: {
									showClearButton: false
								}
							},
							formatter: function (row, cell, value, columnDef, dataContext) {
								value = basicsCommonGridFormatterHelper.formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);
								return '<span>' + $filter('constructionSystemCommonDescFilter')(value) + '</span>';
							}
						},
						{
							id: 'line',
							field: 'Line',
							name$tr$: 'constructionsystem.executionScriptOutput.line',
							toolTip: 'Line',
							sortable: true,
							searchable: true,
							width: 50
						},
						{
							id: 'column',
							field: 'Column',
							name$tr$: 'constructionsystem.executionScriptOutput.column',
							toolTip: 'Column',
							sortable: true,
							searchable: true,
							width: 50
						},
						{
							id: 'modelObject',
							field: 'ModelObject',
							name$tr$: 'constructionsystem.executionScriptOutput.modelObject',
							toolTip: 'ModelObject',
							sortable: true,
							searchable: true,
							width: 100
						},
						{
							id: 'callStack',
							field: 'CallStack',
							name$tr$: 'constructionsystem.executionScriptOutput.callStack',
							toolTip: 'CallStack',
							sortable: true,
							searchable: true,
							width: 150,
							editor: 'lookup',
							editorOptions: {
								directive: 'construction-System-Common-stack-trace-Dialog',
								lookupOptions: {
									showClearButton: false
								}
							}
						}
					];

					var cosMain = [
						{
							id: 'loggingSource',
							field: 'LoggingSource',
							name$tr$: 'constructionsystem.executionScriptOutput.type',
							toolTip: 'type',
							sortable: true,
							searchable: true,
							width: 50,
							formatter: function (row, cell, value, columnDef, dataContext) {
								var formatterMarkup = '', navigatorMarkup = '';
								var colDef = _.cloneDeep(columnDef);

								if (value === 0) {
									formatterMarkup = 'scheduler';
								} else if (value === 1) {
									angular.extend(colDef, {
										navigator: {
											moduleName: 'model.main',// TODO  this case does not consider
											navFunc: function () {
												goModule('modelmain');
											}
										}
									});
									formatterMarkup = 'evaluation';
								} else if (value === 2) {
									formatterMarkup = 'calculation';
								} else if (value === 3) {
									angular.extend(colDef, {
										navigator: {
											moduleName: 'constructionsystem.master',
											navFunc: function () {
												goModule('constructionsystemmaster');
											}
										}
									});
									formatterMarkup = 'script';
									navigatorMarkup = platformGridDomainService.getNavigator(colDef, dataContext);
									if (navigatorMarkup && !navigationPermissionService.hasPermissionForModule('constructionsystem.master')) {
										navigatorMarkup = angular.element(navigatorMarkup).attr('disabled', true).appendTo('<div></div>').parent().html();
									}
								} else if (value === 4) {
									formatterMarkup = '2Q';
								} else if (value === 6) {
									formatterMarkup = 'Assign Objects';
								}
								return formatterMarkup + navigatorMarkup;
							}
						},
						{
							id: 'instance',
							field: 'Instance',
							name$tr$: 'constructionsystem.executionScriptOutput.instance',
							toolTip: 'Instance Code',
							sortable: true,
							searchable: true,
							width: 50
						}
					];

					function goModule(moduleName) {
						var defaultState = globals.defaultState;
						var url = defaultState + '.' + moduleName;
						$state.go(url).then(function () {

						});
					}

					platformTranslateService.translateGridConfig(cosMaster);

					angular.extend(service, {
						getStandardConfigForListView: getStandardConfigForListView
					});

					function getStandardConfigForListView() {
						if (moduleName === 'constructionsystem.master') {
							return {
								columns: cosMaster
							};
						}

						if (moduleName === 'constructionsystem.main') {
							return {
								columns: cosMaster.concat(cosMain)
							};
						}

						return {
							columns: cosMaster
						};
					}

					return service;
				};
			}
		]);
})(angular);