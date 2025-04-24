/**
 * Created by lav on 7/24/2020.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.cadimport';
	var angModule = angular.module(moduleName);

	angModule.factory('ppsCadImportPreviewDataService', DataService);
	DataService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor',
		'ppsCadimportDrawingDataService', 'ppsCadImportPreviewImageProcessor',
		'ppsCadImportHelperService', 'ppsCadImportPreviewProcessor',
		'platformDataServiceDataProcessorExtension'];

	function DataService($injector, platformDataServiceFactory, basicsCommonMandatoryProcessor,
						 parentService, ppsCadImportPreviewImageProcessor,
						 ppsCadImportHelperService, ppsCadImportPreviewProcessor,
						 platformDataServiceDataProcessorExtension) {

		var serviceInfo = {
			hierarchicalLeafItem: {
				module: moduleName,
				serviceName: 'ppsCadImportPreviewDataService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: function () {
						var tree = parentService.getSelected().PersistObject.Previews;
						ppsCadImportHelperService.refreshNodeInfo(tree);
						ppsCadImportHelperService.updateFolderLevel(tree);
						return tree;
					}
				},
				entityRole: {
					leaf: {
						itemName: 'ppsCadImportPreviews',
						parentService: parentService
					}
				},
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					tree: {
						parentProp: 'ParentFk',
						childProp: 'ChildItems'
					}
				},
				dataProcessor: [ppsCadImportPreviewImageProcessor, ppsCadImportPreviewProcessor]
			}
		};

		/*jshint-W003*/
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);
		var service = container.service;

		service.onPropertyChange = function (args) {
			if (args && args.entity && args.col === 'IsChecked') {
				var parentSelected = parentService.getSelected();
				parentSelected.ImportModel = 9;
				parentService.gridRefresh();
				ppsCadImportHelperService.cascadeCheck(args.entity);
				ppsCadImportHelperService.updateFolderLevel(service.getTree());
				service.gridRefresh();
			}
		};

		service.onParentPropertyChange = function (e, args) {
			if (args && args.entity && args.col === 'ImportModel') {
				ppsCadImportHelperService.updateFolderLevel(service.getTree());
				service.gridRefresh();
			}
		};

		service.refreshUI = function () {
			platformDataServiceDataProcessorExtension.doProcessData(container.data.itemList, container.data);
			service.gridRefresh();
		};

		return service;
	}
})(angular);
