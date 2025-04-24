/**
 * Created by xai on 8/24/2017.
 */
(function () {
	'use strict';

	function basicsWorkflowTableDisplayDirective(_, platformModuleNavigationService, platformGridConfigService, platformGridAPI, platformTranslateService, platformCreateUuid, platformManualGridService) {
		var manualGridService = platformManualGridService;
		return {
			restrict: 'A',
			scope: {
				options: '='
			},
			replace: true,
			template: '<div class="flex-element flex-box flex-column subview-container"> <div class="toolbar"> <h3 class="title font-bold">Table</h3> </div> <div class="flex-element flex-box flex-column subview-content"><platform-Grid data="tableGridData"></platform-Grid> </div> </div>',
			compile: function () {
				return {
					pre: function (scope) {
						scope.flexColumns = [];
						//init grid
						scope.gridId = platformCreateUuid();
						scope.tableGridData = {
							state: scope.gridId
						};
						if (scope.options.displayText !== 'undefined') {
							var gridData = scope.options.displayText;
							if (_.isArray(gridData)) {
								throw 'Table data is not array!';
							}
							gridData.forEach(function (dataObj) {
								var originalObj = gridData[0];
								if (!validateJson(dataObj, originalObj)) {
									throw 'Table data formatter is not right!';
								}
							});
							_.each(gridData[0], function (itemObj) {
								scope.flexColumns.push({
									id: itemObj,
									field: itemObj,
									name: itemObj,
									width: 150
								});
							});
						}
						if (!platformGridAPI.grids.exist(scope.gridId)) {
							var grid = {
								columns: scope.flexColumns,
								data: [],
								lazyInit: true,
								id: scope.gridId,
								options: {
									tree: false,
									indicator: true,
									idProperty: 'id'
								}
							};

							platformGridAPI.grids.config(grid);
						}
						if (scope.options.displayText !== 'undefined') {
							var gridData1 = scope.options.displayText;
							if (!_.isArray(gridData1)) {
								throw 'Table data is not array!';
							}
							gridData1.forEach(function (dataObj) {
								var originalObj = gridData[0];
								if (!validateJson(dataObj, originalObj)) {
									throw 'Table data formatter is not right!';
								}
							});
							gridData1.forEach(function (item) {
								var itemId = {id: _.uniqueId()};
								var newItem = mergeJson(itemId, item);
								manualGridService.addNewRowInGrid(scope.gridId, newItem);
							});
						}

						function mergeJson(jsonObj1, jsonObj2) {
							var resultJsonObj = {};
							for (var attr in jsonObj1) {
								if (jsonObj1.hasOwnProperty(attr)) {
									resultJsonObj[attr] = jsonObj1[attr];
								}

							}
							for (var attr2 in jsonObj2) {
								if (jsonObj2.hasOwnProperty(attr2)) {
									resultJsonObj[attr2] = jsonObj2[attr2];
								}
							}
							return resultJsonObj;
						}

						function isJson(obj) {
							var result = typeof (obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length;
							return result;
						}

						function validateJson(jsonObj1, jsonObj2) {
							if (!isJson(jsonObj1) || !isJson(jsonObj2)) {
								return false;
							}
							for (var key in jsonObj1) {
								if (jsonObj1.hasOwnProperty(key)) {
									if (!jsonObj2.hasOwnProperty(key)) {
										return false;
									}
								}
							}
							return true;
						}
					}
				};
			}

		};
	}

	basicsWorkflowTableDisplayDirective.$inject = ['_', 'platformModuleNavigationService', 'platformGridConfigService', 'platformGridAPI', 'platformTranslateService', 'platformCreateUuid', 'platformManualGridService'];

	angular.module('basics.workflow').directive('basicsWorkflowTableDisplayDirective', basicsWorkflowTableDisplayDirective);
})();
