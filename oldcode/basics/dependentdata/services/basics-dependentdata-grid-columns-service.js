/**
 * Created by reimer on 14.01.2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.dependentdata';

	/**
	 * @ngdoc service
	 * @name
	 * @description
	 * Loads the column definition of a dependent grid from the server
	 */
	angular.module(moduleName).factory('basicsDependentDataGridColumnsService', ['$http',
		'$q',
		'platformGridDomainService',
		'$state',
		'platformContextService',
		'cloudDesktopSidebarService',
		'basicsDependentDataModuleLookupService',
		'basicsCommonContentViewerDialogService',
		'basicsCommonFileDownloadService',
		'basicsCommonDocumentPreviewService',
		function ($http,
		          $q,
		          platformGridDomainService,
		          $state,
		          platformContextService,
		          cloudDesktopSidebarService,
		          basicsDependentDataModuleLookupService,
		          basicsCommonContentViewerDialogService,
		          fileDownloadService,
			basicsCommonDocumentPreviewService) {

			var service = {};

			var defaultCols = [{id: 'id', field: 'Id', name: 'ID'}];

			var generateGridCols = function (data) {

				var gridCols = [];
				for (var i = 0; i < data.length; i++) {

					if (data[i].IsVisible) {

						var domainType = data[i].DisplayDomainEntity.Id === 0 ? 'description' : data[i].DisplayDomainEntity.DomainName;
						var formatter = domainType;
						var field = data[i].DatabaseColumn.toLowerCase() === 'id' ? 'Id' : data[i].DatabaseColumn;
						var formatterOptions = {};
						var actionList = [];
						// var grouping = {};

						//var formatterOptions = data[i].ModuleInternalName ? {
						//	navigator: {
						//		moduleName: data[i].ModuleInternalName,
						//		boundColumn: data[i].BoundColumn,
						//		sourceColumn: data[i].SourceColumn,
						//		navFunc: service.navigateToObject
						//	}
						//} : null;

						switch (domainType) {

							case 'json':

								actionList.push({
									toolTip: 'View content in a popup',
									icon: 'tlb-icons ico-view-json',
									callbackFn: showJsonContent
								});

								formatterOptions.appendContent = true;
								formatter = 'action'; // enforce to show action button
								break;

							case 'filedownload':

								actionList.push({
									toolTip: 'Download file',
									icon: 'tlb-icons ico-download',
									callbackFn: downloadFile
								});

								if (data[i].SourceColumn) {
									formatterOptions.displayMember = data[i].DatabaseColumn;
									field = data[i].SourceColumn;
								}

								formatterOptions.appendContent = true;
								formatter = 'action'; // enforce to show action button
								break;
							case 'filepreview':
								actionList.push({
									toolTip: 'Preview file',
									icon: 'tlb-icons ico-preview-form',
									callbackFn: previewFile
								});

								if (data[i].SourceColumn) {
									formatterOptions.displayMember = data[i].DatabaseColumn;
									field = data[i].SourceColumn;
								}

								formatterOptions.appendContent = false;
								formatter = 'action'; // enforce to show action button
								break;
							case 'url':
								if (data[i].SourceColumn) {
									formatterOptions = {
										displayMember: data[i].DatabaseColumn
									};
									field = data[i].SourceColumn; // contains the url fieldname!
								}
								break;
							default:
								if (data[i].ModuleInternalName) {
									formatterOptions = {
										navigator: {
											moduleName: basicsDependentDataModuleLookupService.isDynamicLinkModule(data[i].ModuleFk) ? '' : data[i].ModuleInternalName,
											moduleId: data[i].ModuleFk,
											boundColumn: data[i].BoundColumn,
											sourceColumn: data[i].SourceColumn || data[i].DatabaseColumn,
											navFunc: service.navigateToObject,
											force: true // allow navigate inside a module
										}
									};
								}
								break;
						}

						var col = {
							id: data[i].DatabaseColumn,
							domain: domainType,
							field: field, //data[i].DatabaseColumn,
							name: data[i].DescriptionInfo.Translated || data[i].DatabaseColumn,
							formatter: formatter,
							searchable: domainType === 'description' || domainType === 'translation',
							// linkinfo: { boundmodule: data[i].ModuleInternalName, boundcolumn: data[i].BoundColumn, sourcecolumn: data[i].SourceColumn }
							formatterOptions: formatterOptions, // navigatorProperty now obsolet.
							navigator: (formatterOptions && formatterOptions.navigator) ? formatterOptions.navigator : false,
							actionList: actionList
						};

						col.grouping = {
							title: col.name,
							// title$tr$: '',
							getter: col.field,
							aggregators: [],
							aggregateCollapsed: true
						};

						// col.sortable = col.searchable;
						col.sortable = true;

						gridCols.push(col);
					}

				}
				return gridCols;
			};

			service.getDefaultCols = function () {
				return defaultCols;
			};

			service.navigateToObject = function (options, entity) {

				//var targetModuleName = options.navigator.moduleName;
				//if (basicsDependentDataModuleLookupService.isDynamicLinkModule(options.navigator.moduleId)) {
				//	var moduleIdColumn = null;
				//	for (var propName in entity) {
				//		if (propName.toLowerCase() === 'module_fk' || propName.toLowerCase() === 'modulefk') {
				//			moduleIdColumn = propName;
				//			break;
				//		}
				//	}
				//	var linkModuleId = entity[moduleIdColumn];
				//	if (linkModuleId === null || isNaN(linkModuleId))
				//	{
				//		throw new Error('View must have a "MODULE_FK" column!');
				//	}
				//	targetModuleName = basicsDependentDataModuleLookupService.getItemByKey(linkModuleId).InternalName;
				//}

				var getNavigate2ModuleName = function(navigate2ModuleId, entity) {

					if (basicsDependentDataModuleLookupService.isDynamicLinkModule(navigate2ModuleId)) {
						// get navigate to module id from the entity
						var found = false;
						for (var propName in entity) {
							if (propName.toLowerCase() === 'module_fk' || propName.toLowerCase() === 'modulefk') {
								navigate2ModuleId = entity[propName];
								found = true;
								break;
							}
						}
						if (!found) {
							throw new Error('To use the dynamic link option the view must have a "MODULE_FK" column!');
						}
					}

					var targetModule = basicsDependentDataModuleLookupService.getItemByKey(navigate2ModuleId);
					return targetModule.InternalName;
				};

				var moduleName = getNavigate2ModuleName(options.navigator.moduleId, entity);

				// fit ID column
				var sourceColumn = options.navigator.sourceColumn.toLowerCase() === 'id' ? 'Id' : options.navigator.sourceColumn;
				if (!entity.hasOwnProperty(sourceColumn))
				{
					throw new Error('Can\'t get value of column \'' + sourceColumn + '\'!');
				}

				var objectId = entity[sourceColumn];
				if (objectId === null || isNaN(objectId))
				{
					throw new Error('Filter value should be a number!');
				}

				var url = globals.defaultState + '.' + moduleName.replace('.', '');

				if (url.startsWith($state.current.name)) { 
					cloudDesktopSidebarService.filterSearchFromPKeys([objectId]);
				} else {
					try {
						cloudDesktopSidebarService.setStartupFilter( {filter: [objectId]} );
						$state.go(url).then(function () {
							// do nothing
						});
					}
					catch (ex) {

						cloudDesktopSidebarService.removeStartupFilter();
						console.log('Navigate to module ' + url + ' failed');
					}
				}
			};

			var init = function () {

				// add translation is's to the column name
				//angular.forEach(gridcols, function (value) {
				//	if (angular.isUndefined(value.name$tr$)) {
				//		value.name$tr$ = modulename + '.entity.' + value.field;
				//	}
				//});

			};
			init();

			function showJsonContent(entity, field) {

				var content;
				try {
					var obj = JSON.parse(entity[field]);   // create json object
					content = JSON.stringify (obj, null , '\t' );  // convert json object into a string
				}
				catch (e) {
					content = entity[field];
				}

				basicsCommonContentViewerDialogService.showContentDialog(content);

			}

			function downloadFile(entity, field) {

				fileDownloadService.download(entity[field]);
			}

			function previewFile(entity,field){
				var initDoc={
					document: null,
					documentTitle: null,
					documentType: null
				};
				basicsCommonDocumentPreviewService.setOptionByDocSelect(initDoc);
				basicsCommonDocumentPreviewService.show(entity[field]);
			}

			var _gridCols = null;
			var _viewData = null;

			service.loadData = function(dependentDataId) {

				var deffered = $q.defer();

				//$http.get(globals.webApiBaseUrl + 'basics/dependentdata/columnslist?dependentDataId=' + dependentDataId)
				$http.get(globals.webApiBaseUrl + 'basics/dependentdata/viewinfo?dependentDataId=' + dependentDataId)
					.then(function (response) {
						_gridCols = generateGridCols(response.data.DependentDataColumnDto);
						_viewData = response.data;
						_viewData.gridCols = _gridCols; 
						deffered.resolve(_viewData);
					});

				return deffered.promise;
			};

			service.getGridColumns = function() {
				return _gridCols;
			};

			service.getViewInfo = function() {
				return _viewData;
			};

			return service;
		}

	]);

})(angular);


