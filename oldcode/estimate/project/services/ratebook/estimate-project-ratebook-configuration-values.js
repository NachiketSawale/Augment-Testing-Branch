/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let mod = angular.module('estimate.project');

	// Layout specs
	mod.value('estimateProjectRateBookDetailLayout', {
		fid: 'project.ratebook.detailform',
		version: '0.0.1',
		showGrouping: true,
		addValidationAutomatically: true,
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['code', 'descriptioninfo']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		]
	});

})(angular);

