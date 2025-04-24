(function() {
	'use strict';

	// --------------------------------------------------------
	// Logistic job module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Job',
		url: 'job',
		internalName: 'logistic.job',
		mainEntity: 'Job',
		mainEntities: 'Jobs',
		tile: 'logistic.job',
		desktop: 'desktop',
		container: [{
			uid: '11091450f3e94dc7ae58cbb563dfecad',
			permission: '11091450f3e94dc7ae58cbb563dfecad',
			name: 'Jobs',
			dependent: [{
				uid: 'b0e4433e826b44c69f422d42e9788e49',
				permission: '11091450f3e94dc7ae58cbb563dfecad',
				name: 'Job Details',
				dependent: []
			},
			{
				uid: 'f7a4c2016e614d21834c50e44c6a65dd',
				permission: 'f7a4c2016e614d21834c50e44c6a65dd',
				name: 'Comment',
				dependent: []
			},{
				uid: '20e85d49386d410c85988b42e384759f',
				permission: '20e85d49386d410c85988b42e384759f',
				name: 'Job Documents',
				noCreateDelete: true,
				dependent: [{
					uid: '8893ada79e704d60ac11c87235d95c0e',
					permission: '20e85d49386d410c85988b42e384759f',
					name: 'Job Document Details',
					dependent: []
				}]
			},{
				uid: '361273dab16942fa97c7c51b43b9d361',
				permission: '361273dab16942fa97c7c51b43b9d361',
				name: 'Plant Catalog Pricelists',
				dependent: [{
					uid: '1f657746606c440fbac058367512dcef',
					permission: '361273dab16942fa97c7c51b43b9d361',
					name: 'Plant Catalog Pricelist Details',
					dependent: []
				}]
			},{
				uid: '01f5e790a9e9416da8f7c4171e9ece5d',
				permission: '01f5e790a9e9416da8f7c4171e9ece5d',
				name: 'Material Catalog Pricelists',
				noCreateDelete: true,
				dependent: [{
					uid: '2f3c295af8024ecc8f8fd55518417e84',
					permission: '01f5e790a9e9416da8f7c4171e9ece5d',
					name: 'Material Catalog Pricelist Details',
					dependent: []
				},{
					uid: '19ee8d84d00c4b9d936713e302ae49f0',
					permission: '19ee8d84d00c4b9d936713e302ae49f0',
					name: 'Material Rates',
					dependent: [{
						uid: '265fbb21125d4d749f72f47922a8ad4f',
						permission: '19ee8d84d00c4b9d936713e302ae49f0',
						name: 'Material Rate Details',
						dependent: []
					}]
				}]
			},{
				uid: '36d8fdec018141e6b4b3a450425849b0',
				permission: '36d8fdec018141e6b4b3a450425849b0',
				name: 'Project Materials',
				dependent: [{
					uid: '34673772740a46fda71000928bf0eb7d',
					permission: '36d8fdec018141e6b4b3a450425849b0',
					name: 'Project Material Details',
					dependent: []
				},{
					uid: '89bf60f70caf4d6db646a941b632e40b',
					permission: '89bf60f70caf4d6db646a941b632e40b',
					name: 'Project Material Price Conditions',
					dependent: [{
						uid: '9618d193861547efa8a8b233ed80c00d',
						permission: '89bf60f70caf4d6db646a941b632e40b',
						name: 'Project Material Price Condition Details',
						dependent: []
					}]
				}]
			},{
				uid: 'b40fb36b82954bfaa734500d03c6bde4',
				permission: 'b40fb36b82954bfaa734500d03c6bde4',
				name: 'Project Cost Codes',
				noCreateDelete: true,
				dependent: [{
					uid: '5bc265dd5ce24bebbb8a962add4da06b',
					permission: 'b40fb36b82954bfaa734500d03c6bde4',
					name: 'Project Cost Code Details',
					dependent: []
				}]
			},{
				uid: 'e8ceec4dc6d54974a27159588c65962d',
				permission: 'e8ceec4dc6d54974a27159588c65962d',
				name: 'Plant Prices',
				dependent: [{
					uid: '4c30f0a003a047eea2528d8c44eddbde',
					permission: 'e8ceec4dc6d54974a27159588c65962d',
					name: 'Plant Price Details',
					dependent: []
				}]
			},{
				uid: 'd7891ba1840c4b82959112b06d70afab',
				permission: 'd7891ba1840c4b82959112b06d70afab',
				name: 'Sundry Service Prices',
				dependent: [{
					uid: '0d5b4fcb1a204c9ab52e75bec5561bde',
					permission: 'd7891ba1840c4b82959112b06d70afab',
					name: 'Sundry Service Price Details',
					dependent: []
				}]
			},{
				uid: '432068179c654b419d3d42d7153d10f8',
				permission: '432068179c654b419d3d42d7153d10f8',
				name: 'Plant Allocations',
				dependent: [{
					uid: 'f683b9900aa54c5db4eb359a1ab85115',
					permission: '432068179c654b419d3d42d7153d10f8',
					name: 'Plant Allocation Details',
					dependent: []
				}]
			},{
				uid: 'c28c50fa5c7f4be3bb0f44b175a1e1a0',
				permission: 'c28c50fa5c7f4be3bb0f44b175a1e1a0',
				name: 'Remarks',
				dependent: []
			},{
				uid: 'ca4314096bea4206a6423df7b0864c7a',
				permission: 'ca4314096bea4206a6423df7b0864c7a',
				name: 'Delivery Address Remark',
				dependent: []
			},{
				uid: 'c70abb89e2f04eadaf3f5e044e6b3ed6',
				permission: 'c70abb89e2f04eadaf3f5e044e6b3ed6',
				name: 'Delivery Address Sketch',
				dependent: []
			},{
				uid: '4eaa47c530984b87853c6f2e4e4fc67e',
				permission: '4eaa47c530984b87853c6f2e4e4fc67e',
				name: 'Project Documents',
				dependent: [{
					uid: '8bb802cb31b84625a8848d370142b95c',
					permission: '4eaa47c530984b87853c6f2e4e4fc67e',
					name: 'Project Document Details',
					dependent: []
				}]
			},{
				uid: '0a4b9b45b59445c9b536b1d20fb40be8',
				permission: '0a4b9b45b59445c9b536b1d20fb40be8',
				name: 'Tasks',
				dependent: [{
					uid: '173d56eae5954d47a7f63559dcc0076b',
					permission: '0a4b9b45b59445c9b536b1d20fb40be8',
					name: 'Task Details',
					dependent: []
				}]
			},{
				uid: '4d9433f0057343948c6b6a20a58f3e45',
				permission: '0a4b9b45b59445c9b536b1d20fb40be8',
				name: 'Task Article Details',
				dependent: []
			},{
				uid: '036e468f170041568771dcef1a4708e0',
				permission: '432068179c654b419d3d42d7153d10f8',
				name: 'Plant Allocations (Summarized)',
				noCreateDelete: true,
				dependent: [{
					uid: '2ffdfe986c504939857e1171b8a10610',
					permission: '432068179c654b419d3d42d7153d10f8',
					name: 'Plant Allocation (Summarized) Details',
					dependent: []
				}]
			}]
		}
		],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 0
	});
})();
