/**
 * Created by alisch on 02.02.2018.
 */
(function () {
	/* global angular */
	'use strict';

	angular.module('cloud.desktop').value('cloudDesktopSettingsUserTypes', {
		user: 'user',
		system: 'system',
		portal: 'portal'
	});
})();