/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.changeset';

	/**
	 * @ngdoc service
	 * @name modelChangeSetUIConfigurationService
	 * @function
	 */
	angular.module(moduleName).service('modelChangeSetUIConfigurationService', ModelChangeSetUIConfigurationService);

	ModelChangeSetUIConfigurationService.$inject = ['$translate', 'modelProjectNiceNameService',
		'projectMainNiceNameService', 'basicsLookupdataConfigGenerator'];

	function ModelChangeSetUIConfigurationService($translate, modelProjectNiceNameService,
		projectMainNiceNameService, basicsLookupdataConfigGenerator) {

		this.getModelChangeSetLayout = function () {
			return {
				fid: 'model.changeset.modelChangesetform',
				version: '1.0.0',
				showGrouping: true,
				groups: [{
					gid: 'baseGroup',
					attributes: ['descriptioninfo', 'modelfk', 'modelcmpfk']
				}, {
					gid: 'optionsGroup',
					attributes: ['comparemodelcolumns', 'compareobjects', 'compareobjectlocations', 'compareproperties', 'excludeopenings']
				}, {
					gid: 'resultsGroup',
					attributes: ['changecount', 'status']
				}, {
					gid: 'logGroup',
					attributes: ['logginglevel', 'storedlog']
				}, {
					gid: 'entityHistory',
					isHistory: true
				}],
				overloads: {
					descriptioninfo: {
						readonly: true
					},
					modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectModelTreeLookupDataService',
						enableCache: true,
						filter: function (item) {
							return item.Model ? item.Model.ProjectFk : 0;
						},
						readonly: true
					}),
					modelcmpfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectModelTreeLookupDataService',
						enableCache: true,
						filter: function (item) {
							return item.ComparedModel ? item.ComparedModel.ProjectFk : 0;
						},
						readonly: true
					}),
					comparemodelcolumns: {
						readonly: true
					},
					compareobjects: {
						readonly: true
					},
					compareobjectlocations: {
						readonly: true
					},
					compareproperties: {
						readonly: true
					},
					excludeopenings: {
						readonly: true
					},
					changecount: {
						readonly: true,
						navigator: {
							moduleName: 'model.change',
							targetIdProperty: 'ModelFk'
						}
					},
					status: {
						formatterOptions: {
							appendContent: true,
							displayMember: 'Status.displayText'
						}
					},
					logginglevel: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCommonLogLevelLookupDataService',
						enableCache: true,
						readonly: true
					})

				}
			};
		};
	}
})(angular);
