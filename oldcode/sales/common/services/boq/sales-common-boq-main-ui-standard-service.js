/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';

	var modName = 'sales.common';

	angular.module(modName).factory('salesCommonBoqMainUIStandardService',
		['_', '$translate', '$injector', 'boqMainStandardConfigurationServiceFactory',
			function (_, $translate,$injector,boqMainStandardConfigurationServiceFactory) {

				var service = {};
				var currentBoqMainService = null;
				var baseBoqMainConfigurationsService = null;

				var copyData = function(data){return angular.element.extend(true,{},data);};

				function onValueApplied(item, field, boqMainService) {

					var boqMainCommonService= $injector.get('boqMainCommonService');
					var boqMainChangeService= $injector.get('boqMainChangeService');

					boqMainChangeService.reactOnChangeOfBoqItem(item, field, boqMainService, boqMainCommonService);
				}

				function enhanceReferenceByInputSelectForListView(grids){

					var referenceColumn = _.find(grids.columns,{field:'Reference'});

					if(referenceColumn) {
						referenceColumn.editor = 'directive';
						referenceColumn.editorOptions = {
							directive: 'boq-main-base-boq-reference-input',
							boqMainService: currentBoqMainService,
							inputDomain: 'description'
						};

						// The following callback is called when the validation of the field succeeded and the value was applied.
						// This is very helpful when having asynchronous validations added to a property.
						// The '$$' prefix usually denotes a function not meant for official use, but after asking Kris about my problems
						// with asynchronous validation in the grid he allowed me to use it for it currently seems to be the only way to get
						// around the problems.
						referenceColumn.$$postApplyValue = function (grid, item, column) {
							onValueApplied(item, column.field, currentBoqMainService);
						};
					}
				}

				function enhanceReferenceByInputSelectForDetailView(details){

					var referenceRow = _.find(details.rows,{'model': 'Reference'});

					if(referenceRow){
						referenceRow.type = 'directive';
						referenceRow.directive = 'boq-main-base-boq-reference-input';
						referenceRow.options = {
							boqMainService: currentBoqMainService,
							inputDomain: 'description',
							onValueApplied: onValueApplied
						};
					}
				}

				function getConfigurationService() {
				// If there is an externally set baseBoqMainConfigurationsService return it.
				// If not create and return the default boqMainStandardConfigurationService.
					if(baseBoqMainConfigurationsService === null) {
						return boqMainStandardConfigurationServiceFactory.createBoqMainStandardConfigurationService({currentBoqMainService: currentBoqMainService});
					}

					return baseBoqMainConfigurationsService;
				}

				service.setCurrentBoqMainService = function setCurrentBoqMainService(salesBoqMainService) {
					currentBoqMainService = salesBoqMainService;
				};

				service.setBaseBoqMainConfigurationsService = function setBaseBoqMainConfigurationsService(configurationsService) {
					baseBoqMainConfigurationsService = configurationsService;
				};

				service.getStandardConfigForDetailView = function (/* moduleName */) {

					// Hint: Moved the creation  of the boqMainStandardConfigurationService to this place to be able to dynamically react on
					// the current value of the module name that changes between the different modules this general UI service is used in.
					var configurationsService = getConfigurationService();
					var listView = copyData(configurationsService.getStandardConfigForDetailView());
					enhanceReferenceByInputSelectForDetailView(listView);

					var allDetailColumns = listView.rows;
					var findIndex = -1;
					if(allDetailColumns && allDetailColumns.length){
						findIndex =  _.findIndex(allDetailColumns, {'rid':'rule'});
						allDetailColumns.splice(findIndex,1);

						findIndex =  _.findIndex(allDetailColumns, {'rid':'param'});
						allDetailColumns.splice(findIndex,1);

						findIndex =  _.findIndex(allDetailColumns, {'rid':'ruleformula'});
						allDetailColumns.splice(findIndex,1);

						findIndex =  _.findIndex(allDetailColumns, {'rid':'ruleformuladesc'});
						allDetailColumns.splice(findIndex,1);

						findIndex =  _.findIndex(allDetailColumns, {'rid':'divisiontypeassignment'});
						allDetailColumns.splice(findIndex,1);


						findIndex = _.findIndex(listView.groups ,{'gid':'ruleAndParam'});
						listView.groups.splice(findIndex,1);
					}

					return listView;
				};

				service.getStandardConfigForListView = function (/* moduleName */) {

					var configurationsService = getConfigurationService();
					var listView = copyData(configurationsService.getStandardConfigForListView());
					enhanceReferenceByInputSelectForListView(listView);


					// hidden the column rule and param on Package module
					var allListColumns = listView.columns;

					var findIndex = -1;
					if(allListColumns && allListColumns.length){
						findIndex =  _.findIndex(allListColumns, {'id':'rule'});
						allListColumns.splice(findIndex,1);

						findIndex =  _.findIndex(allListColumns, {'id':'param'});
						allListColumns.splice(findIndex,1);

						findIndex =  _.findIndex(allListColumns, {'id':'ruleformula'});
						allListColumns.splice(findIndex,1);

						findIndex =  _.findIndex(allListColumns, {'id':'ruleformuladesc'});
						allListColumns.splice(findIndex,1);

						findIndex =  _.findIndex(allListColumns, {'id':'divisiontypeassignment'});
						allListColumns.splice(findIndex,1);
					}

					return listView;
				};

				service.getDtoScheme = function () {
				// Reroot this call to configuration service
					var configurationsService = getConfigurationService();
					var dtoScheme = null;
					if(configurationsService) {
						dtoScheme = configurationsService.getDtoScheme();
					}
					return dtoScheme;
				};

				return service;
			}]);

})(angular);
