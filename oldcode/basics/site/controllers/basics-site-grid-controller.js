(function (angular) {

	'use strict';
	/**
     * @ngdoc controller
     * @name basics.SiteGridController
     * @require $scope
     * @description controller for basics procurement structure grid controller
     */
	var moduleName = 'basics.site';
	angular.module(moduleName).controller('basicsSiteGridController', BasicsSiteGridController);

	BasicsSiteGridController.$inject = ['$scope', '$translate', 'platformGridControllerService', 'basicsSiteMainService',
		'basicsSiteUIStandardService', 'basicsSiteValidationService',
		'basicsTreeClipboardServiceFactory', 'platformGridAPI'];

	function BasicsSiteGridController($scope, $translate, gridControllerService, dataService,
		uiStandardService,
		validationService,
		basicsTreeClipboardServiceFactory,
		platformGridAPI) {
        
		var type = 'site';

		var basicsSiteClipboardService = basicsTreeClipboardServiceFactory.getOrCreateService(dataService, 'site');
		// remark: the original implementation by lav(with old svn-revision 482476) has risk of memory leakage(each time when initialize the container, a site clipboard service will be created), so refactor it.(by zwz 2021/10/15)

		var gridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'SiteFk',
			childProp: 'ChildItems',
			type: type,
			dragDropService: basicsSiteClipboardService
		};

		gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [{
				id: 't12',
				caption: $translate.instant('basics.site.downgradeSite'),
				type: 'item',
				iconClass: 'tlb-icons ico-demote',
				fn: dataService.downgrade,
				disabled: function () {
					return !dataService.canDowngrade();
				}
			}, {
				id: 't13',
				caption: $translate.instant('basics.site.upgradeSite'),
				type: 'item',
				iconClass: 'tlb-icons ico-promote',
				fn: dataService.upgrade,
				disabled: function () {
					return !dataService.canUpgrade();
				}
			}, {
				id: 't14',
				caption: $translate.instant('cloud.common.toolbarCut'),
				type: 'item',
				iconClass: 'tlb-icons ico-cut',
				fn: function () {
					basicsSiteClipboardService.cut(dataService.getSelected(), type);
				},
				disabled: function () {
					return _.isEmpty(dataService.getSelected());
				}
			}, {
				id: 't15',
				caption: $translate.instant('cloud.common.toolbarPasteSelectedItem'),
				type: 'item',
				iconClass: 'tlb-icons ico-paste',
				fn: function () {
					basicsSiteClipboardService.paste(dataService.getSelected(), type);
				},
				disabled: function () {
					return !basicsSiteClipboardService.canPaste(type, dataService.getSelected());
				}
			}]
		});

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

		function onSelectedRowsChanged() {
			$scope.updateTools();
		}

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			basicsSiteClipboardService.clearClipboard(); //clear clipboard when destroy site grid container
		});
	}

})(angular);