(function() {
	'use strict';

	// Change main module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
	  name: 'Change',
	  url: 'main',
	  internalName: 'change.main',
	  mainEntity: 'Change',
	  mainEntities: 'Changes',
	  tile: 'change.main',
	  desktop: 'desktop',
	  container: [{
		  uid: '3aea93d116ae440eb92c414e817e3454',
		  permission: 'f86aa473785b4625adcabc18dfde57ac',
		  name: 'Changes',
		  dependent: [{
			  uid: '02f152811dd245c5a6eb51d3eaf93515',
			  permission: 'f86aa473785b4625adcabc18dfde57ac',
			  name: 'Change Details',
			  dependent: []
		  }]
	  }],
	  forceLoad: true,
		sidebarFilter: 'E2E-',
	  mainRecords: 0
	});
})();
