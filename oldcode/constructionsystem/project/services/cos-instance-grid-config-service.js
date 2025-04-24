/**
 * Created by wui on 3/1/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.project';

	angular.module(moduleName).factory('constructionSystemProjectCosInstanceGridConfigService', [
		'$filter',
		'constructionSystemProjectCosInstanceFlagImageService',
		function ($filter, constructionSystemProjectCosInstanceFlagImageService) {
			var service = {};

			service.getColumns = function () {
				return [
					{
						id: 'flag',
						field: 'Flag',
						name: 'Flag',
						width: 100,
						name$tr$: 'constructionsystem.project.entityFlag',
						formatter: function (row, cell, value) {
							var text = $filter('CosFlagFilter')(value);
							var url = constructionSystemProjectCosInstanceFlagImageService.getImage(value);

							return '<img src="$$src$$"/><span style="padding-left: 4px">$$text$$</span>'
								.replace(/\$\$src\$\$/gm, url)
								.replace(/\$\$text\$\$/gm, text);
						},
						grouping: {
							title: 'constructionsystem.project.entityFlag',
							getter: 'Flag',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 100,
						name$tr$: 'cloud.common.entityCode',
						searchable: true,
						formatter: 'code',
						grouping: {
							title: 'cloud.common.entityCode',
							getter: 'Code',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: function (row, cell, value) {
							return value ? value.Translated || value.Description : '';
						},
						width: 150,
						name$tr$: 'cloud.common.entityDescription',
						searchable: false,
						grouping: {
							title: 'cloud.common.entityDescription',
							getter: 'DescriptionInfo',
							aggregators: [],
							aggregateCollapsed: true
						}

					},
					{
						id: 'comment',
						field: 'CommentText',
						name: 'Comment',
						width: 150,
						name$tr$: 'constructionsystem.project.entityComment',
						searchable: false,
						grouping: {
							title: 'constructionsystem.project.entityComment',
							getter: 'CommentText',
							aggregators: [],
							aggregateCollapsed: true
						}

					}
				];
			};

			service.provideGridConfig = function (gridId) {
				var grid = {
					columns: service.getColumns(),
					data: [],
					id: gridId,
					options: {
						indicator: true,
						idProperty: 'Id',
						enableDraggableGroupBy: true,
						grouping: true,
						showFooter: false
					}
				};

				return grid;
			};

			return service;
		}
	]);

})(angular);