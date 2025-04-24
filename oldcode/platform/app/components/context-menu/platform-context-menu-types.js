(() => {
	'use strict';

	angular.module('platform').value('platformContextMenuTypes', {
		gridColumnHeader: {
			type: 'grid-column-header'
		},
		gridRow: {
			type: 'grid-row'
		}
	});
})();