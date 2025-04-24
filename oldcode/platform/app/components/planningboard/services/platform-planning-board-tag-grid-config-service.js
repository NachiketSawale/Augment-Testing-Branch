(function () {

	'use strict';

	angular.module('platform').service('platformPlanningBoardTagGridConfigService', PlatformPlanningBoardTagGridConfigService);

	PlatformPlanningBoardTagGridConfigService.$inject = ['_', 'platformGridAPI', 'platformTranslateService'];

	function PlatformPlanningBoardTagGridConfigService(_, platformGridAPI, platformTranslateService) {
		var service = this;
		service.uuid = '0e735eceaa2411eabb370242ac130002';
		service.createTagGrid = function createTagGrid(data) {
			var uuid = service.uuid;
			var columns = [
				{
					id: 'description',
					formatter: 'description',
					field: 'name',
					name: 'Description*',
					name$tr$: 'platform.planningboard.description',
					width: 120,
					readonly: true
				},
				{
					id: 'color',
					formatter: 'color',
					editor: 'color',
					field: 'color',
					name: 'Color*',
					name$tr$: 'platform.planningboard.color'
				},
				{
					id: 'sort',
					field: 'sort',
					editor: 'integer',
					formatter: 'integer',
					name: 'Order*',
					name$tr$: 'platform.planningboard.order'
				},
				{
					id: 'visible',
					field: 'visible',
					editor: 'boolean',
					formatter: 'boolean',
					name: 'Visible*',
					name$tr$: 'platform.planningboard.visible',
					width: 80
				}];

			columns.isTranslated = true;
			var gridConfig = {
				columns: angular.copy(columns),
				data: data,
				id: uuid,
				lazyInit: false,
				options: {
					idProperty: 'id',
					indicator: true,
					skipPermissionCheck: true,
					tools: null
				}
			};
			return gridConfig;

		};

		service.updateData = function updateData(gridData) {
			platformGridAPI.items.data(service.uuid, gridData);
		};
	}
})(angular);