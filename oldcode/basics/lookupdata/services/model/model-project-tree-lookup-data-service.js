/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name modelProjectModelTreeLookupDataService
	 * @function
	 *
	 * @description
	 * modelTreeLookupDataService is the data service for model tree lookups.
	 */

	const moduleName = 'basics.lookupdata';

	const serviceName = 'modelProjectModelTreeLookupDataService';

	angular.module(moduleName).factory(serviceName, ['_', 'platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator', 'modelProjectModelDataService', '$log',
		function (_, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, modelProjectModelDataService, $log) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
				idProperty: 'Id',
				valMember: 'Id',
				dispMember: 'Code',
				showIcon: true,
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode',
						isSelector: true
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 120,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'Status',
						field: 'StatusFk',
						name: 'Status',
						name$tr$: 'cloud.common.entityState',
						formatter: 'lookup',
						width: 60,
						formatterOptions: {
							dataServiceName: 'basicsCustomMDLStatusLookupDataService',
							displayMember: 'DescriptionInfo.Translated'
						}
					},
					{
						id: 'ProjectNo',
						field: 'ProjectFk',
						name: 'ProjectNo',
						name$tr$: 'model.project.entityProjectNo',
						formatter: 'lookup',
						width: 100,
						formatterOptions: {
							lookupType: 'project',
							displayMember: 'ProjectNo'
						}

					},
					{
						id: 'Type',
						field: 'TypeFk',
						name: 'Type',
						name$tr$: 'cloud.common.entityType',
						formatter: 'lookup',
						width: 60,
						formatterOptions: {
							lookupType: 'MdlType',
							displayMember: 'DescriptionInfo.Translated'
						}
					},
					{
						id: 'ModelVersion',
						field: 'ModelVersion',
						name$tr$: 'model.project.modelSelWizard.modelVersion',
						formatter: 'description',
						width: 60

					},
					{
						id: 'ModelRevision',
						field: 'ModelRevision',
						name$tr$: 'model.project.modelSelWizard.modelRevision',
						formatter: 'description',
						width: 60

					},
					{
						id: 'CommentText',
						field: 'CommentText',
						name$tr$: 'cloud.common.entityCommentText',
						formatter: 'description',
						width: 60
					},
					{
						id: 'Remark',
						field: 'Remark',
						name$tr$: 'cloud.common.entityRemark',
						formatter: 'description',
						width: 60
					}
				],
				options: {
					skipPermissionCheck: true,
					tree: true,
					indicator: true,
					idProperty: 'Id',
					showIcon: true
				},
				uuid: '7591bccc23b9469284b93785fcb2e718'
			});

			const modelProjectModelTreeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'model/project/model/',
					endPointRead: 'listAllHeaders'
				},
				filterParam: 'mainItemId',
				prepareFilter: function (filterValue) {
					if (_.isInteger(filterValue)) {
						return '?mainItemId=' + filterValue;
					} else if (_.isString(filterValue)) {
						// verbatim filter string
						$log.warn('The use of a verbatim query string is discouraged. Please use the structured variant with an object instead.');
						return '?mainItemId=' + filterValue;
					} else if (_.isObject(filterValue)) {
						let filter = '?mainItemId=' + (_.isInteger(filterValue.projectId) ? filterValue.projectId : 0);

						if (!_.isNil(filterValue.includeComposite)) {
							filter += '&includeComposite=' + Boolean(filterValue.includeComposite);
						}

						if (_.isObject(filterValue.include)) {
							filter += '&include2D=' + Boolean(filterValue.include.models2D) +
								'&include3D=' + Boolean(filterValue.include.models3D);
						} else if (_.isObject(filterValue.exclude)) {
							filter += '&include2D=' + !filterValue.exclude.models2D +
								'&include3D=' + !filterValue.exclude.models3D;
						}

						return filter;
					} else {
						return '?mainItemId=0';
					}
				},
				modifyLoadedData: function (items) {
					let tree = modelProjectModelDataService.groupModelList(items);
					items.splice.apply(items, _.concat(0, items.length, tree));
				},
				tree: {
					parentProp: 'parentNodeId',
					childProp: 'modelVersions',
					childSort: false,
					isInitialSorted: true,
					sortOptions: {
						initialSortColumn: {field: 'Code', id: 'code'},
						isAsc: true
					}
				},
				selectableCallback: function (item) {
					return !item.IsParentItem;
				}
			};
			const container = platformLookupDataServiceFactory.createInstance(modelProjectModelTreeLookupDataServiceConfig);
			container.service.getlookupType = function () {
				return serviceName;
			};
			return container.service;
		}]);
})(angular);
