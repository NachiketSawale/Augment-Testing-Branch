/**
 * Created by bel on 18.09.2017.
 */
(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainModifyResourceFieldsValuesUIConfigService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Modify Resource Fields Configuration Grid UI Config for modify estimate dialog.
	 */
	angular.module(moduleName).factory('estimateMainModifyResourceFieldsValuesUIConfigService',
		['basicsLookupdataConfigGenerator', 'platformTranslateService',
			function (basicsLookupdataConfigGenerator, platformTranslateService) {

				let service = {};

				let gridColumns = [
					{
						id: 'f1',
						field: 'Description',
						name$tr$: 'estimate.main.modifyResourceWizard.fieldsvalue.description',
						formatter: 'description',
						editor: null,
						readonly: true,
						width: 200
					},
					{
						id: 'f2',
						field: 'isFilter',
						name$tr$: 'estimate.main.modifyResourceWizard.fieldsvalue.isFilter',
						formatter: 'boolean',
						editor: 'boolean',
						isTransient: true,
						headerChkbox: true,
						width: 75
					}
				];

				platformTranslateService.translateGridConfig(gridColumns);

				service.getStandardConfigForListView = function () {
					return {
						addValidationAutomatically: false,
						columns: gridColumns
					};
				};

				return service;
			}
		]);
})(angular);
