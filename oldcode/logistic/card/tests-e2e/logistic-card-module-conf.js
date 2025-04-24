(function () {
	'use strict';

	// --------------------------------------------------------
	// Logistic card module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Card',
		url: 'card',
		mainEntity: 'Card',
		mainEntities: 'Cards',
		tile: 'logistic.card',
		desktop: 'desktopcfg',
		container: [{
			uid: '05fd352d74ef4f5aa179d259e056c367',
			permission: '05fd352d74ef4f5aa179d259e056c367',
			name: 'Cards',
			dependent: [{
				uid: 'b3cd04f14e0d4c37a17255d3315f2e0e',
				permission: '05fd352d74ef4f5aa179d259e056c367',
				name: 'Card Details',
				dependent: []
			},{
				uid: '9bfaa01af6254c799f2b878286395eb7',
				permission: '9bfaa01af6254c799f2b878286395eb7',
				name: 'Remarks',
				dependent: []
			},{
				uid: '8a2db2fa260e476a8928c2a56791b277',
				permission: '8a2db2fa260e476a8928c2a56791b277',
				name: 'Card Activities',
				dependent: [{
					uid: 'c3354dae2f434cd183862f01c2bb039b',
					permission: '8a2db2fa260e476a8928c2a56791b277',
					name: 'Card Activity Details',
					dependent: []
				},{
					uid: '1e6832ec58314f4bb772e0986f110d33',
					permission: '1e6832ec58314f4bb772e0986f110d33',
					name: 'Card Records',
					dependent: [{
						uid: '35eb529cbbc04fbaac20073663522425',
						permission: '1e6832ec58314f4bb772e0986f110d33',
						name: 'Card Record Details',
						dependent: []
					}]
				}]
			},{
				uid: '9bfaa01af6254c799f2b878286395eb7',
				permission: '9bfaa01af6254c799f2b878286395eb7',
				name: 'Remark',
				dependent: []
			}]
		}],
		forceLoad: false,
		mainRecords: 0
	});
})();