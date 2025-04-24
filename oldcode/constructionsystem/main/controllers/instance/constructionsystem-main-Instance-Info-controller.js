/**
 * Created by jes on 12/21/2016.
 */

(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).controller('constructionSystemInstanceInfoController', constructionSystemInstanceInfoController);

	constructionSystemInstanceInfoController.$inject = [
		'$scope',
		'platformGridAPI',
		'platformTranslateService',
		'constructionSystemMainInstanceProgressService',
	];

	function constructionSystemInstanceInfoController(
		$scope,
		platformGridAPI,
		platformTranslateService,
		constructionSystemMainInstanceProgressService
	) {

		var InstanceInfoGridColumns = [
			{
				id: 'status',
				field: 'Status',
				name: 'Status',
				name$tr$: 'cloud.common.entityStatus',
				formatter: constructionSystemMainInstanceProgressService.formatter,
				width:120
			},
			{
				id: 'Code',
				field: 'Code',
				name: 'Code',
				formatter: 'code',
				name$tr$: 'cloud.common.entityCode',
				width:120
			},
			{
				id: 'Description',
				field: 'DescriptionInfo.Description',
				name: 'Description',
				formatter: 'description',
				name$tr$: 'cloud.common.entityDescription',
				width:300
			}
		];

		var InstanceInfoGridId = '7D567CBA0DC24644BF0E8A285514DD1D';

		$scope.getInstanceInfo = {
			state: InstanceInfoGridId
		};
		var instanceList=$scope.modalOptions.instances;

		function setupQuoteGrid() {

			if (!platformGridAPI.grids.exist(InstanceInfoGridId)) {
				var InstanceInfoGridConfig = {
					columns: angular.copy(InstanceInfoGridColumns),
					data: [],
					id: InstanceInfoGridId,
					lazyInit: true,
					options: {
						tree: false,
						indicator: true,
						idProperty: 'Id',
						iconClass: ''
					}
				};
				platformGridAPI.grids.config(InstanceInfoGridConfig);
				platformTranslateService.translateGridConfig(InstanceInfoGridConfig.columns);
			}
		}
		function updateQuoteGrid(instanceList) {

			platformGridAPI.grids.invalidate(InstanceInfoGridId);
			platformGridAPI.items.data(InstanceInfoGridId, instanceList);
		}
		setupQuoteGrid();
		updateQuoteGrid(instanceList);
	}

})(angular);