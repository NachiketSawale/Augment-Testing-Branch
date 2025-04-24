/**
 * Created by baf on 24.08.2016
 */
(function () {
	'use strict';
	const modName = 'project.inforequest';
	let module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name cloudTranslationResourceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for grid / form for translation resource entities
	 */
	module.service('projectInfoRequestLayoutService', ProjectInfoRequestLayoutService);

	ProjectInfoRequestLayoutService.$inject = ['$injector', 'platformSchemaService', 'platformUIConfigInitService', 'projectInfoRequestContainerInformationService', 'projectInfoRequestTranslationService', 'basicsLookupdataLookupFilterService'];

	function ProjectInfoRequestLayoutService($injector, platformSchemaService, platformUIConfigInitService, projectInfoRequestContainerInformationService, projectInfoRequestTranslationService, basicsLookupdataLookupFilterService) {
		let self = this;
		let conf = null;

		let filters = [
			{
				key: 'project-info-request-contact-by-bizpartner-filter',
				serverSide: true,
				serverKey: 'project-info-request-contact-by-bizpartner-filter',
				fn: function (entity) {
					return {
						BusinessPartnerFk: entity.BusinesspartnerFk
					};
				},
			},{
				key: 'info-request-rubric-category-by-rubric-filter',
				fn: function (rc) {
					return rc.RubricFk === 39;
				}
			},{
				key: 'project-inforequest-contract-by-project-filter',
				serverKey:'document-project-document-Contract-filter',
				serverSide: true,
				fn:function(item) {
					return {
						ProjectFk: item.ProjectFk
					};
				}
			},{
				key: 'project-inforequest-by-project-filter',
				serverKey:'project-inforequest-filter',
				serverSide: true,
				fn:function() {
					let service = $injector.get('projectInfoRequestDataService');
					let rfi = service.getSelected();
					let filter = { ProjectFk: 0 };
					if(rfi){
						filter.ProjectFk = rfi.ProjectFk;
					}
					return filter;
				}
			},
			{
				key: 'info-request-rubric-category-by-rubric-company-filter',
				serverKey: 'rubric-category-by-rubric-company-lookup-filter',
				serverSide: true,
				fn: function () {
					return { Rubric: 39 };
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		this.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
			if(conf === null) {
				conf =  self.createConfiguration();
			}

			return conf.detailLayout;
		};

		this.getStandardConfigForListView = function getStandardConfigForListView() {
			if(conf === null) {
				conf =  self.createConfiguration();
			}

			return conf.listLayout;
		};

		this.getDtoScheme = function getDtoScheme() {
			return platformSchemaService.getSchemaFromCache({
				moduleSubModule: 'Project.InfoRequest',
				typeName: 'InfoRequestDto'
			}).properties;
		};

		this.createConfiguration = function createConfiguration() {
			let scheme = self.getDtoScheme();
			angular.extend(scheme,{Action: {domain: 'action'}});

			let configs = {};

			let layout = projectInfoRequestContainerInformationService.getRequestForInformationLayout();
			configs.detailLayout = platformUIConfigInitService.provideConfigForDetailView(layout, scheme, projectInfoRequestTranslationService);
			configs.listLayout = platformUIConfigInitService.provideConfigForListView(layout, scheme, projectInfoRequestTranslationService);

			return configs;
		};

	}
})();
