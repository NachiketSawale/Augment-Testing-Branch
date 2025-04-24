(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.common';
	const angModule = angular.module(moduleName);

	angModule.service('ppsCommonToolbarGotoAndGobacktoBtnsExtension', Extension);
	Extension.$inject = ['mainViewService', 'platformModuleNavigationService', 'platformGridAPI', '$translate', '$rootScope'];

	function Extension(mainViewService, navigationService, platformGridAPI, $translate, $rootScope) {
		let createNavigationBtnItems = (service, navBtnCreationObjs) => {
			return navBtnCreationObjs.map(creationObj => {
				return {
					id: creationObj.id,
					caption: creationObj.caption,
					type: 'item',
					iconClass: creationObj.iconClass,
					fn: () => {
						if (!creationObj.disabled()) {
							creationObj.getNavigationEntity().then(response => {
								let navigationEntity = response.data || response;
								$rootScope.$emit('before-save-entity-data');
								platformGridAPI.grids.commitAllEdits();
								service.update().then(function () {
									navigationService.navigate(creationObj.navigator, navigationEntity, creationObj.triggerField);
									return $rootScope.$emit('after-save-entity-data');
								});
							});
						}
					},
					disabled: creationObj.disabled
				};
			});
		};

		let createGotoOrGobacktoBtns = (service, navBtnCreationObjs, isGoto = true) => {
			return {
				id: isGoto ? 'goto' : 'gobackto',
				caption: isGoto ? $translate.instant('cloud.common.Navigator.goTo') : $translate.instant('cloud.common.Navigator.goBackTo'),
				type: 'dropdown-btn',
				iconClass: isGoto ? 'tlb-icons ico-goto' : 'tlb-icons ico-goto-back',
				list: {
					showImages: true,
					listCssClass: 'dropdown-menu-right',
					items: createNavigationBtnItems(service, navBtnCreationObjs)
				},
				disabled: () => !service.getSelected(),
			};
		};

		this.createGotoBtns = (service, navBtnCreationObjs) => createGotoOrGobacktoBtns(service, navBtnCreationObjs);
		this.createGobacktoBtns = (service, navBtnCreationObjs) => createGotoOrGobacktoBtns(service, navBtnCreationObjs, false);
	}
})(angular);
