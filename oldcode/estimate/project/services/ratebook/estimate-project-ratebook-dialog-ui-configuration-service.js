/**
 * Created by bel on 01.08.2018.
 */

(function () {
	'use strict';

	let modulename = 'estimate.project';

	/**
	 * @ngdoc service
	 * @name
	 * @description
	 */
	angular.module(modulename).factory('estimateProjectRateBookDialogUIConfigService',
		['platformTranslateService', 'basicsLookupdataConfigGenerator',
			function (platformTranslateService, basicsLookupdataConfigGenerator) {

				let service = {};

				function getBaseFormConfig(){
					return {
						showGrouping: true,
						change:'change',
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'colConfig',
								header: 'Master Data Filter',
								header$tr$: 'estimate.main.masterDataFilterConfig.header',
								isOpen: true,
								visible: true,
								sortOrder: 1
							}
						],
						rows: [
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.projectcontenttype.internal', 'Description',
								{
									gid: 'colConfig',
									rid: 'projectContentTypeFk',
									model: 'ProjectContentTypeFk',
									sortOrder: 2,
									label: 'Project Content Type',
									label$tr$: 'estimate.main.masterDataFilterConfig.contentType',
									type: 'integer'
								}
							),
							{
								gid: 'colConfig',
								rid: 'contentDesc',
								label: 'Description',
								label$tr$: 'estimate.main.masterDataFilterConfig.description',
								type: 'description',
								model: 'contentDesc',
								readonly: false,
								visible: true,
								sortOrder: 20
							},
							{
								gid: 'colConfig',
								label: 'Project Content Details',
								label$tr$: 'estimate.main.masterDataFilterConfig.configDetail',
								rid: 'colConfigDetail',
								type: 'directive',
								model: 'columnConfigDetails',
								directive: 'estimate-project-ratebook-config-detail-grid',
								sortOrder: 30
							}
						],
						overloads: {},
						skipPermissionCheck : true
					};
				}

				/**
			 * @ngdoc function
			 * @name getFormConfig
			 * @function
			 * @methodOf estimateProjectRateBookDialogUIConfigService
			 * @description Builds and returns the form configuration for the project ratebook configuration dialog
			 */
				service.getFormConfig = function() {
					let formConfig = getBaseFormConfig();
					platformTranslateService.translateFormConfig(formConfig);
					return formConfig;
				};

				return service;
			}

		]);

})();
