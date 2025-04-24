/**
 * Created by lav on 12/9/2019.
 */

(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsItemUpstreamItemListController', ListController);

	ListController.$inject = ['$scope',
		'platformContainerControllerService', 'platformGridAPI',
		'$translate', 'platformGridControllerService',
		'productionplanningItemUpstreamItemSplitService',
		'basicsCommonToolbarExtensionService', '$rootScope'];

	function ListController($scope,
		platformContainerControllerService, platformGridAPI,
		$translate, platformGridControllerService,
		UpstreamItemSplitService,
		basicsCommonToolbarExtensionService, $rootScope) {

		const guid = $scope.getContentValue('uuid');
		const moduleName_ = $scope.getContentValue('moduleName') || moduleName;
		let containerInfoService = platformContainerControllerService.getModuleInformationService(moduleName_);
		let containerInfo = containerInfoService.getContainerInfoByGuid(guid);
		let dataService = containerInfo.dataServiceName;

		platformContainerControllerService.initController($scope, moduleName_, guid);

		// register cell changed
		let onCellChange = function (e, args) {
			const field = args.grid.getColumns()[args.cell].field;
			dataService.onPropertyChanged(args.item, field);
		};
		let onPropertyChange = function (e, args) {
			if (['UpstreamResult', 'PpsUpstreamTypeFk'].includes(args.field)) {
				let docService = dataService.getChildServices().find((child) =>
					child.getServiceName() && child.getServiceName().endsWith('PpsDocumentDataService'));
				if (docService) {
					docService.clearModifications();
					docService.load();
					docService.onUpdateToolsEvent.fire();
				}
				let materialService = dataService.getChildServices().find((child) =>
					child.getServiceName() && child.getServiceName().endsWith('ppsItem2MdcMaterialDataService'));
				if(materialService){
					materialService.resetFilter(args.entity);
					materialService.load();
					materialService.onUpdateToolsEvent.fire(args.entity);
				}
			}
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
		dataService.onPropertyChangeEvent.register(onPropertyChange);

		let hasCopy = $scope.getContentValue('hasCopy');
		if(hasCopy === 'true')
		{
			let additionalButtons = [{
				id: 'copyUpStreamItem',
				caption: $translate.instant('cloud.common.taskBarShallowCopyRecord'),
				type: 'item',
				iconClass: 'tlb-icons ico-copy-paste-deep',
				fn: function () {
					dataService.copy();
				},
				disabled: function () {
					return !dataService.getSelected();
				}
			}];

			platformGridControllerService.addTools(additionalButtons);
		}

		const hasFilter = $scope.getContentValue('hasFilter');
		if(hasFilter === 'true'){
			dataService.listGuid = guid;
			basicsCommonToolbarExtensionService.insertBefore($scope, {
				id: 'onlyShowCurrentUpstreams',
				caption: $translate.instant('productionplanning.item.upstreamItem.onlyShowCurrentUpstreams'),
				type: 'check',
				value: dataService.onlyShowCurrentUpstreams,
				iconClass: 'tlb-icons ico-filtering',
				fn: function () {
					dataService.onlyShowCurrentUpstreams = !dataService.onlyShowCurrentUpstreams;
					dataService.showListByFilter();
				},
				disabled: function () {
					return !dataService.getPpsItem();
				}
			});
		}

		function getRootService() {
			let rootService = dataService;
			while (rootService.parentService()) {
				rootService = rootService.parentService();
			}
			return rootService;
		}

		const upstreamItemContainerUuids = [
			'23edab57edgb492d84r2gv47e734fh8u', // ppsItemUpstreamItemListContainerGuid
			'23edab99edgb492d84r29947e734fh99', // ppsHeaderUpstreamItemListContainerGuid
			'33edab57edgb492d84r2gv47e734fh8u' // engineeringUpstreamItemListContainerGuid
		];
		if(upstreamItemContainerUuids.some(id => id === guid)) {
			basicsCommonToolbarExtensionService.insertBefore($scope, {
				id: 'splitUpStreamItem',
				sort: 0,
				caption: $translate.instant('productionplanning.item.upstreamItem.split'),
				type: 'item',
				iconClass: 'tlb-icons ico-dividing-sum',
				fn: function () {
					getRootService().update().then(()=>{
						let selected = dataService.getSelected();
						UpstreamItemSplitService.showSplitDialog(selected);
					});
				},
				disabled: function () {
					return !dataService.getSelected();
				}
			});
		}

		const onGridClick = (e, args) => {
			let selectedItem = args.grid.getDataItem(args.row);
			$rootScope.$emit('documentsproject-parent-grid-click', {
				clickedItem: selectedItem,
				title: $translate.instant('productionplanning.item.upstreamItem.entity')
			});
		};
		platformGridAPI.events.register($scope.gridId, 'onClick', onGridClick);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			dataService.onPropertyChangeEvent.unregister(onPropertyChange);
			platformGridAPI.events.unregister($scope.gridId, 'onClick', onGridClick);
		});
	}

})(angular);
