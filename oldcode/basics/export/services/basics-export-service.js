/**
 * Created by reimer on 29.04.2015.
 */

(function () {

	'use strict';

	var moduleName = 'basics.export';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsExportService', [
		'$q',
		'$http',
		'$timeout',
		'platformModalService',
		'basicsLookupdataLookupDescriptorService',
		'cloudDesktopSidebarService',
		'$window',
		'mainViewService',
		'platformGridAPI',
		'$translate',
		'$rootScope',
		'platformTranslateService',
		'$injector',
		function ($q,
		          $http,
		          $timeout,
		          platformModalService,
		          basicsLookupdataLookupDescriptorService,
		          cloudDesktopSidebarService,
		          $window,
		          mainViewService,
		          platformGridAPI,
		          $translate,
		          $rootScope,
		          translateService,
							$injector) {

			var service = {};
			translateService.registerModule(moduleName);

			// local buffers
			var _exportOptions = {};

			var _pendingRequest = null;
			var _actualState = null; // store actual state

			$rootScope.$on('$stateChangeSuccess', function (event, toState/*, toParams, fromState, fromParams*/) {

				// cancel pending requests
				if (_pendingRequest !== null && _actualState !== toState.name) {
					_pendingRequest.cancel('module was leaved');
				}
				_actualState = toState.name;
			});

			service.showExportDialog = function(exportOptions) {

				var modalOptions = {
					templateUrl: globals.appBaseUrl + 'basics.export/templates/basics-export-dialog.html',
					backdrop: false,
					windowClass: 'form-modal-dialog',
					headerTextKey: 'cloud.common.exportDialogTitle'
				};

				// region gather additional container info
				var containers = mainViewService.getAllViews();

				// automatically add all dependent data container to the subcontainer list
				angular.forEach(containers, function(container) {
					if (exportOptions.WizardId != 'ExcelExport')
					{
					if (container.hasOwnProperty('dependentDataId')) {
						var exists = _.find(exportOptions.SubContainers, function(item) {
							return item.hasOwnProperty('DependentDataId') && item.DependentDataId === container.dependentDataId;
						});
						if (!exists) {
							exportOptions.SubContainers.push(
								{
									Id: container.id,
									Qualifier: 'dependentdata',
									Label: container.title,
									Selected: false,
									DependentDataId: container.dependentDataId
								}
							);
						}
					}
				}
				});

				// main container
				addColInfo2Options(containers, exportOptions.MainContainer);

				if (!exportOptions.MainContainer.GridId ) {
					throw('Can\'t  get columns of container "' + exportOptions.MainContainer.Label + '" - Please ensure its visibilty!' );
				}

				// sub containers
				angular.forEach(exportOptions.SubContainers, function(subContainer) {
					addColInfo2Options(containers, subContainer);
				});

				if(exportOptions.HandlerSubContainer){
					exportOptions.HandlerSubContainer(exportOptions.SubContainers);
				}

				//check sub containers other config
				_.forEach(exportOptions.SubContainers, function (item) {
					if(item.EverVisible && !item.Visible){
						item.Visible = true;
					}
				});

				//special sub  containers
				angular.forEach(exportOptions.SpecialSubContainers,function(specialContainer){
					if(specialContainer.Label){
						specialContainer.Label = $translate.instant(specialContainer.Label);
					}
					var res = _.find(exportOptions.SubContainers,{Id:specialContainer.Id});
					if(!res){
						exportOptions.SubContainers.push(specialContainer);
					}else{
						res.Visible = true;
					}
				});


				// endregion

				function addColInfo2Options(containers, containerOptions) {

					containerOptions.Visible = false;   // default: container not in layout

					var container = _.find(containers, function(item) {

						if (containerOptions.hasOwnProperty('uuid')) {
							return item.uuid.toLowerCase() === containerOptions.uuid.toLowerCase();
						}
						else
						{
							return item.id === containerOptions.Id;
						}
					});

					if (container) {

						if (containerOptions.hasOwnProperty('Label')) {
							containerOptions.Label = $translate.instant(containerOptions.Label);
						}
						else
						{
							containerOptions.Label = $translate.instant(container.title);
						}

						if (container.hasOwnProperty('sectionId')) {
							containerOptions.SectionId = container.sectionId;
						}

						var gridId = container.uuid;
						var grid = platformGridAPI.grids.element('id', gridId);
						if (grid) {
							containerOptions.GridId   = gridId;
							containerOptions.Visible = true;
						}
					}
				}

				// store current exportOptions (wrapped in property 'data' to avoid loosing of reference!)
				_exportOptions.data = exportOptions;

				//getSelectedItems

				var canExecuteExport = true;

				// extend export options with current filter
				exportOptions.Filter = cloudDesktopSidebarService.getFilterRequestParams();

				// use filter callback fn when available
				if (angular.isFunction(exportOptions.FilterCallback)) {
					var id = exportOptions.FilterCallback();
					exportOptions.Filter.PKeys = id;
					canExecuteExport = id !== null;
				}

				if(exportOptions.Service && _.isObject(exportOptions.Service)){
					var items = exportOptions.Service.getList();
					var filterdata=exportOptions.Service.getFilterData();
					if(!_.isEmpty(filterdata)&&filterdata.GroupIds&&filterdata.MaterialCatalogIds){
						if(filterdata.MaterialCatalogIds.length>0) {
							exportOptions.Filter.PageSize = null;
							exportOptions.Filter.FurtherFilters = [];
							exportOptions.Filter.FurtherFilters.push({
								Token: 'GroupIds',
								Value: filterdata.GroupIds.join(',')
							});
							exportOptions.Filter.FurtherFilters.push({
								Token: 'MaterialCatalogIds',
								Value: filterdata.MaterialCatalogIds.join(',')
							});
						}
					}
					else if(items.length>0){
						exportOptions.Filter = {PKeys : _.map(items,'Id')};
					}
					canExecuteExport = items && items.length > 0;
				}

				if(exportOptions.OptionTranslation && _.isFunction(exportOptions.OptionTranslation)){
					exportOptions.OptionTranslation(exportOptions);
				}

				if(canExecuteExport){
					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result) {

							$timeout(function () {

								var link = angular.element(document.querySelectorAll('#downloadLink'));

								// var iFrame = angular.element(document.querySelector('#downloadFrame'));
								// console.log('downloadLink: ' + link);

								//if (link !== undefined && link.length > 0) {
								//	// extend export options with current filter
								//	exportOptions.filter = cloudDesktopSidebarService.filterRequest;
								//	// need get! Therefore send exportOptions as base64 decoded json object
								//	var json = angular.toJson(exportOptions, 0);
								//	var base64EncodedString = window.btoa(json);
								//	var endpoint = globals.webApiBaseUrl + 'basics/export/list?data=' + base64EncodedString;
								//	link[0].href = endpoint;
								//	link[0].click();
								//
								//}

								if (_pendingRequest !== null) {
									_pendingRequest.cancel('new request started');
								}

								_pendingRequest = createImportFile(exportOptions);

								_pendingRequest.promise.then(
									function(response) {
										var fileName = response.headers('Content-Disposition').slice(21);
										link[0].href = response.data;
										link[0].download = fileName.split('"').join(''); // bre: ALM125928 Removes the unexpected set of quotes by 'HttpResponseMessage.Content.Headers.ContentDisposition.FileName' on ther server which might effect a download filename like "_*.xslx_".
										link[0].click();
										// iFrame solution will not work for xml files?
										// iFrame[0].src = response.data;
									},
									function(reason) {
										console.log('createImportFile canceled - reason: ' + reason.config.timeout.$$state.value);
									}).finally(function() {
									_pendingRequest = null;
								});

							}, 0);
						}
					}
					);
				}else{
					var infoMsg =  $translate.instant('cloud.common.noSelected');
					platformModalService.showMsgBox(infoMsg, 'cloud.common.informationDialogHeader', 'info');
				}

				let createImportFile = function createImportFile(exportOptions) {
					let canceller = $q.defer();
					let cancel = function(reason) {
						canceller.resolve(reason);
					};

					let gridConfig  = platformGridAPI.columns.configuration(exportOptions.MainContainer.GridId);
					let gridColumns = [];
					if (gridConfig){
						gridColumns = angular.copy(exportOptions.ExcelProfileId>3 ?  gridConfig.current : gridConfig.visible);
					} else if (exportOptions.uiStandardServiceName) {
						let viewConfig = mainViewService.getViewConfig(exportOptions.MainContainer.GridId);
						let allColumns = $injector.get(exportOptions.uiStandardServiceName).getStandardConfigForListView().columns;
						let configColumns = [];
						if (viewConfig && viewConfig.Propertyconfig) {
							configColumns = _.isArray(viewConfig.Propertyconfig) ? viewConfig.Propertyconfig : JSON.parse(viewConfig.Propertyconfig);
						}
						gridColumns = angular.copy(_.intersectionBy(allColumns, configColumns, 'id'));
					}

					if (gridColumns.length>0 && gridColumns[0].field==='indicator') {
						gridColumns.splice(0, 1);
					}

					exportOptions.MainContainer.SelectedColumns     = _.map(gridColumns, 'id');
					exportOptions.MainContainer.InternalFieldNames  = _.map(gridColumns, 'field');
					exportOptions.MainContainer.ColumnLabels        = [];
					_.forEach(gridColumns, function (column) {
						exportOptions.MainContainer.ColumnLabels.push(column.userLabelName ? column.userLabelName : column.name);
					});
					if(exportOptions.ModuleName==='procurement.package.prcitems'){
						//Special Handle field-plantstatus
						let fieldIndex = exportOptions.MainContainer.SelectedColumns.indexOf('plantfkplantstatus');
						if(fieldIndex>-1){
							exportOptions.MainContainer.InternalFieldNames[fieldIndex] = 'PlantStatusFk';
						}
					}
					if(exportOptions.ModuleName === 'procurement.invoice' || exportOptions.ModuleName === 'procurement.pes') {
						if (exportOptions.MainContainer)
							_.forEach(exportOptions.SubContainers, (subContainer) => {
								if (!_.isNil(subContainer.GridId)) {
									if (subContainer.Selected) {
										var gridConfig = platformGridAPI.columns.configuration(subContainer.GridId);
										var gridColumns = angular.copy(exportOptions.ExcelProfileId > 3 ? gridConfig.current : gridConfig.visible);

										if (gridColumns.length > 0 && gridColumns[0].field === 'indicator') {
											gridColumns.splice(0, 1);
										}
										subContainer.SelectedColumns = _.map(gridColumns, 'id');
										subContainer.InternalFieldNames = _.map(gridColumns, 'field');
										subContainer.ColumnLabels = [];
										_.forEach(gridColumns, function (column) {
											subContainer.ColumnLabels.push(column.userLabelName ? column.userLabelName : column.name);
										});
									}
								}
							});
					}

					let promise = $http.post(globals.webApiBaseUrl + 'basics/export/list', exportOptions, { timeout: canceller.promise })
										 .then(function(response) {
							return response;
						});

					return { promise: promise, cancel: cancel };
				};
			};

			// #region exportOptions
			service.getExportOptions = function() {
				return _exportOptions;
			};
			// #endregion

			return service;

		}
	]);
})(angular);
