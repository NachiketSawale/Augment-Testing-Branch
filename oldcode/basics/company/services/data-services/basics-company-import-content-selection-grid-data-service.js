/**
 * Created by lst on 5/30/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	angular.module(moduleName).factory('basicsCompanyImportContentSelectionGridDataService', [
		'$q', 'platformDataServiceFactory', 'PlatformMessenger', 'basicsCompanyImportContentAddSelectionService', 'basicsCompanyImportContentSelectionService',
		'basicsCompanyImportContentContentTypeService',
		function ($q, platformDataServiceFactory, PlatformMessenger, selectionItems, basicsCompanyImportContentSelectionService,
				  basicsCompanyImportContentContentTypeService) {

			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'basicsCompanyImportContentSelectionGridDataService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: function () {
						var items = [];
						angular.forEach(selectionItems, function (item, idx) {

							var newItem = angular.copy(item);
							newItem.id = idx;
							newItem.image = 'ico-accordion-root';
							newItem.selection = false;
							newItem.operation = 2; // 1 new, 2 overwrite
							newItem.children = [];
							newItem.pid = null;
							newItem.level = 0;
							newItem.contenttype = basicsCompanyImportContentContentTypeService.getContentTypeId(newItem.runtimeCode, newItem.level);
							newItem.idString = getIdString(newItem);

							if (item.level1Data) {
								_.forEach(item.level1Data, function (resultItem) {
									var child = angular.copy(resultItem);

									child.image = 'ico-accordion-pos';
									child.selection = newItem.selection;
									child.operation = newItem.operation;
									child.pid = newItem.id;
									child.level = 1;
									child.content = resultItem.code;
									child.id = resultItem.id;
									child.contenttype = basicsCompanyImportContentContentTypeService.getContentTypeId(child.runtimeCode, child.level);
									child.idString = getIdString(child);
									child.description = getDescription(resultItem);
									newItem.children.push(child);
								});
							}
							newItem.HasChildren = !!(newItem.children && newItem.children.length > 0);
							items.push(newItem);
						});
						return items;
					}
				},
				presenter: {tree: {parentProp: 'pid', childProp: 'children'}},
				entitySelection: {},
				modification: {}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = container.service;

			container.data.markItemAsModified = function () {
			};
			service.markItemAsModified = function () {
			};


			service.updateLevel1ByCompanyCode = function (companyCode, internalImport) {
				if (!companyCode) {
					return;
				}
				var rootItems = service.getList();
				var promises = [];
				angular.forEach(selectionItems, function (selectionItem) {
					promises.push(basicsCompanyImportContentSelectionService.getLevel1(selectionItem, companyCode, internalImport).then(function (response) {
						var resultArray = (response && response.data) ?
							(_.isString(response.data) ? JSON.parse(response.data) : response.data) : [];

						var findRootItem = _.find(rootItems, function (item) {
							return (item.code === selectionItem.code && item.level === 0);
						});

						var children = [];
						_.forEach(resultArray, function (resultItem) {
							var child = angular.copy(resultItem);

							child.image = 'ico-accordion-pos';
							child.selection = findRootItem.selection;
							child.operation = findRootItem.operation;
							child.pid = findRootItem.id;
							child.level = 1;
							child.content = resultItem.code;
							child.id = resultItem.id;
							child.runtimeCode = resultItem.runtimeCode || selectionItem.runtimeCode;
							child.contenttype = basicsCompanyImportContentContentTypeService.getContentTypeId(child.runtimeCode, child.level);
							child.idString = getIdString(child);
							child.description = getDescription(resultItem);
							
							updateLevel2ByCompanyCode(selectionItem, child, companyCode);

							children.push(child);
						});

						findRootItem.children = children;
						findRootItem.HasChildren = !!(children && children.length > 0);
						container.data.listLoaded.fire();
					}));
				});
			};

			function updateLevel2ByCompanyCode (selectionItem, level1Item, companyCode) {
				basicsCompanyImportContentSelectionService.getLevel2(selectionItem, level1Item, companyCode).then(function (response) {
					var resultArray = (response && response.data) ?
						(_.isString(response.data) ? JSON.parse(response.data) : response.data) : [];

					var children = [];
					_.forEach(resultArray, function (resultItem) {
						var child = angular.copy(resultItem);

						child.image = 'ico-accordion-pos';
						child.selection = level1Item.selection;
						child.operation = level1Item.operation;
						child.pid = level1Item.id;
						child.level = 2;
						child.content = resultItem.description;
						child.id = resultItem.id;
						child.runtimeCode = resultItem.runtimeCode || level1Item.runtimeCode;
						child.contenttype = basicsCompanyImportContentContentTypeService.getContentTypeId(child.runtimeCode, child.level);
						child.idString = getIdString(child);
						child.description = getDescription(resultItem);

						children.push(child);
					});

					level1Item.children = children;
					level1Item.HasChildren = !!(children && children.length > 0);
				});
			}

			function getIdString(item){
				var pidString = item.pid ? item.pid.toString() : '';
				return pidString + '-' + item.id.toString() + '-' + item.contenttype.toString();
			}

			function getDescription(resultItem) {
				let description = '';
				if (resultItem.description) {
					description = resultItem.description;
				} else {
					if (resultItem.descriptionInfo && resultItem.descriptionInfo.description) {
						description = resultItem.descriptionInfo.description;
					}
				}
				return description;
			}

			return service;
		}
	]);
})(angular);