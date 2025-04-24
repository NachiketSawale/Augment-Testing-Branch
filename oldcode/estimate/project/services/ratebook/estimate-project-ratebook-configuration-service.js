/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.project';

	/**
	 * @ngdoc service
	 * @name estimateProjectRateBookConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in project main module
	 */
	angular.module(moduleName).factory('estimateProjectRateBookConfigurationService',

		['_', 'platformUIStandardConfigService', 'projectMainTranslationService', 'estimateProjectRateBookDetailLayout', 'platformSchemaService',

			function (_, platformUIStandardConfigService, projectMainTranslationService, estimateProjectRateBookDetailLayout, platformSchemaService) {

				let BaseService = platformUIStandardConfigService;

				let projectRateBookAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'RateBookDto', moduleSubModule: 'Project.Main'} );
				if(projectRateBookAttributeDomains) {
					projectRateBookAttributeDomains = projectRateBookAttributeDomains.properties;
				}

				function RateBookUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				RateBookUIStandardService.prototype = Object.create(BaseService.prototype);
				RateBookUIStandardService.prototype.constructor = RateBookUIStandardService;

				let service = new BaseService(estimateProjectRateBookDetailLayout, projectRateBookAttributeDomains, projectMainTranslationService);

				let columns = angular.copy(service.getStandardConfigForListView().columns);

				let colDef = {
					id: 'ischecked',
					field: 'IsChecked',
					name$tr$: 'basics.material.record.filter',
					formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
						let html = '';

						if (value === true) {
							html = '<input type="checkbox" checked '+(function () {
								return dataContext.IsReadOnly? ' disabled ' : '';
							})(dataContext)+' />';
						}
						else if (value === 'unknown') {
							setTimeout(function () {
								angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
							});

							html = '<input type="checkbox" '+(function () {
								return dataContext.IsReadOnly? ' disabled ' : '';
							})(dataContext)+'/>';
						}
						else {
							html = '<input type="checkbox" unchecked '+(function () {
								return dataContext.IsReadOnly? ' disabled ' : '';
							})(dataContext)+'/>';
						}
						return '<div class="text-center">' + html + '</div>';
					},
					editor: 'directive',
					editorOptions: {
						directive: 'basics-material-checkbox'
					},
					width: 50,
					isTransient: true,
					validator: 'isCheckedValueChange'
				};

				let isAdded = false;
				service.getStandardConfigForListView = function () {
					let existCol = _.find(columns, function (col) {
						return col.id === 'ischecked';
					});
					if(!existCol && !isAdded){
						columns.unshift(colDef);
						isAdded = true;
					}
					return {columns: columns};
				};

				return service;
			}
		]);
})();
