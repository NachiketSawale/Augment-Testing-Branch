(() => {
	'use strict';

	angular.module('basics.config').constant('basicsConfigNavCommandConstantTypes', {
		noConfigurationItems: {
			caption$tr$: 'basics.config.toggleOverlay.noConfigurationCaption'
		},
		refreshItems: {
			caption$tr$: 'basics.config.toggleOverlay.refreshCaption'
		},
		CombarPortalEnabled: {
			hasBarConfig: 'HasCommandBarPortalConfig',
			entityKeyName: 'CombarPortalEnabled',
			overlay: {
				title$tr$: 'basics.config.toggleOverlay.cmdBarPortalTitle',
				caption$tr$: 'basics.config.toggleOverlay.cmdBarPortalCaption',
				image: 'cloud.style/content/images/background/commandbar.png',
				imagePosRight: true,
				cssClass: 'toggle-overlay-container'
			},
			isPortal: true
		},
		NavbarEnabled: {
			hasBarConfig: 'HasNavBarConfig',
			entityKeyName: 'NavbarEnabled',
			overlay: {
				title$tr$: 'basics.config.toggleOverlay.navBarSystemTitle',
				caption$tr$: 'basics.config.toggleOverlay.navBarSystemCaption',
				image: 'cloud.style/content/images/background/navbar.png',
				cssClass: 'toggle-overlay-container overlay-wrapper'
			},
			isPortal: false
		},
		NavbarPortalEnabled: {
			hasBarConfig: 'HasNavBarPortalConfig',
			entityKeyName: 'NavbarPortalEnabled',
			overlay: {
				title$tr$: 'basics.config.toggleOverlay.navBarPortalTitle',
				caption$tr$: 'basics.config.toggleOverlay.navBarPortalCaption',
				image: 'cloud.style/content/images/background/navbar.png',
				cssClass: 'toggle-overlay-container overlay-wrapper'
			},
			isPortal: true
		},
		CombarEnabled: {
			hasBarConfig: 'HasCommandBarConfig',
			entityKeyName: 'CombarEnabled',
			overlay: {
				title$tr$: 'basics.config.toggleOverlay.cmdBarSystemTitle',
				caption$tr$: 'basics.config.toggleOverlay.cmdBarSystemCaption',
				image: 'cloud.style/content/images/background/commandbar.png',
				imagePosRight: true,
				cssClass: 'toggle-overlay-container'
			},
			isPortal: false
		}
	});
})();