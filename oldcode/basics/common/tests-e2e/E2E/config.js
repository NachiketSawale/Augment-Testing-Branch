/**
 * Created by lva on 2015/4/28.
 */

'use strict';

// basic setting
var GLOBAL_URL_PREFIX = 'http://rib-vm-cloud2/cloud5d/debug/client/#/app/desktop';
var GLOBAL_URL_PREFIX1 = 'https://itwo40-int.rib-software.com/itwo40/Daily/Client/#/';

// var GLOBAL_URL_PREFIX1 = 'https://localhost/iTWO.Cloud/V1/Clients.Angular/#/';
// var GLOBAL_URL_PREFIX = 'https://rib-cn-dev409.rib-software.com/Cloud5D/DailyGE/Debug/Clients/#/';

var USER = {
	userName: 'autotest',// rje@rib-software.com',
	password: 'ribadmin',
	companyRole: 'D lan company'
};
var checkModule = [
	// cn team
	// 'cloud.common', cn problems is fixed, next is german
	{name: 'cloud.common', title: 'common'},
	{name: 'basics.lookupdata', title: 'lookupdata'},
	{name: 'basics.customize', title: 'customize'},
	{name: 'basics.billingschema', title: 'billingschema'},
	{name: 'basics.costgroups', title: 'Cost Groups'},
	{name: 'basics.material', title: 'Material'},
	{name: 'basics.materialcatalog', title: 'Material Catalog'},
	{name: 'basics.assetmaster', title: 'Asset Master'},
	{name: 'basics.characteristic', title: 'characteristic'},
	{name: 'basics.procurementstructure', title: 'Procurement Structure'},
	{name: 'basics.pricecondition', title: 'Price Condition'},
	{name: 'basics.procurementconfiguration', title: 'procurementconfiguration'},
	{name: 'procurement.common', title: 'common'},
	{name: 'procurement.contract', title: 'Contract'},
	{name: 'procurement.invoice', title: 'Invoice'},
	{name: 'procurement.pes', title: 'pes'},
	{name: 'procurement.pricecomparison', title: 'pricecomparison'},
	{name: 'procurement.quote', title: 'quote'},
	{name: 'procurement.requisition', title: 'Requisition'},
	{name: 'procurement.rfq', title: 'rfq'},
	{name: 'procurement.ticketsystem', title: 'Ticket System'},
	{name: 'qto.formula', title: 'QTO Formula'},
	{name: 'qto.main', title: 'main'},
	{name: 'businesspartner.main', title: 'main'},
	{name: 'businesspartner.certificate', title: 'certificate'},
	{name: 'businesspartner.evaluationschema', title: 'evaluationschema'},
	{name: 'procurement.Package', title: 'Package'}
];
var jsHintConfig = {
	js: checkModule,
	output: './output/jshint.xml'
};
var jsTodoConfig = {
	module: checkModule,
	output: './output/todo.xml'
};
var protractorConfig = {
	js: [
		'./system/login.js',
		// './basics.assetmaster/asset-master-header.js',
		// './basics.costgroups/cost-group1.js',
		// './basics.costgroups/cost-group2.js',
		// './basics.costgroups/cost-group3.js',
		//  './basics.costgroups/cost-group4.js',
		//  './basics.costgroups/cost-group5.js',
		'./procurement.ticketsystem/ticket-system-commodity-search.js',
		'./procurement.ticketsystem/ticket-system-cart-item.js',
		'./basics.procurementstructure/procurement-structure-header.js',
		//  './basics.procurementstructure/procurement-structure-generals.js',
		// './basics.procurementstructure/procurement-structure-certificates.js',
		//  './basics.procurementstructure/procurement-structure-accounts.js',
		// './basics.procurementstructure/procurement-structure-evaluation.js',
		// './basics.procurementstructure/procurement-structure-roles.js',
		// './basics.procurementstructure/procurement-structure-event.js',
		//  './basics.materialcatalog/material-catalog-header.js',
		// './basics.materialcatalog/material-catalog-groups.js',
		// './basics.materialcatalog/material-catalog-discount-groups.js',
		// './basics.materialcatalog/material-catalog-attributes.js',
		// './basics.materialcatalog/material-catalog-attribute-value.js',
		// './basics.material/material-records.js',
		// './basics.material/material-attribute.js',
		//  './basics.material/material-document.js',
		// './qto.formula/qto-formula-header.js',
		//  './qto.formula/qto-formula-uom.js',
		//  './qto.formula/qto-formula-comment.js',
		'./basics.pricecondition/price-condition-header.js',
		//  './basics.pricecondition/price-condition-detail.js',
		// './basics.procurementconfiguration/procurement-configuration-header.js',
		// './wizard/package-wizard.js',
		// './wizard/req-wizard.js',
		//  './basics/Requisition/requisition-certificate.js',
		//  './basics/Requisition/requisition-general.js',
		//  './basics/Requisition/requisition-contact.js',
		//  './basics/Requisition/requisition-headerText.js',
		//  './basics/Requisition/requisition-total.js',
		//  './basics/Requisition/requisition-subcontractor.js',
		//  './basics/Requisition/requisition-document.js',
		//  './basics/Requisition/requisition-milestone.js',
		//  './basics/Requisition/requisition-item.js',
		//  './basics/Requisition/requisition-deliverySchedule.js',
		//  './basics/Requisition/requisition-itemText.js',
		//  './basics/Requisition/requisition-procurementBoq.js',
		//  './basic/Requisition/requisition-boqStructure.js',
		//  './basic/Contract/contract-header.js',
		//  './basic/Contract/contract-headerText.js',
		//  './basic/Contract/contract-total.js',
		//  './basic/Contract/contract-general.js',
		//  './basic/Contract/contract-certificate.js',
		//  './basic/Contract/contract-contact.js',
		//  './basic/Contract/contract-subcontractor.js',
		//  './basic/Contract/contract-document.js',
		//  './basic/Contract/contract-milestone.js',
		//  './basic/Contract/contract-userform.js',
		//  './basic/Contract/contract-actualCertificate.js',
		//  './basic/Contract/contract-item.js',
		//  './basic/Contract/contract-deliverySchedule.js',
		//  './basic/Contract/contract-itemText.js',
		//  './basic/Contract/contract-procurementBoq.js',
		//  './basic/Contract/contract-boqStructure.js'
		'./procurement.package/package-header.js',
		'./procurement.requisition/requisition-header.js',
		'./procurement.contract/contract-header.js',
		'./procurement.invoice/invoice-header.js',
		//  './system/clearDatabase.js',

	],
	output: './output/e2e.xml'
};
var uuidsConfig = {
	module: checkModule,
	output: './output/uuids.xml'
};
var translationConfig = {
	module: checkModule,
	output: './output/translation.xml'
};
var config = {
	// systemRoot: 'D:\\RIBVisual-s\\BinPool\\Debug.Angular\\',
	systemRoot: 'D:\\RIBvisual\\BinPool\\Debug.Angular\\',
	jsHintConfig: jsHintConfig,
	jsTodoConfig: jsTodoConfig,
	protractorConfig: protractorConfig,
	uuidsConfig: uuidsConfig,
	translationConfig: translationConfig,
	checkModule: checkModule,

	GLOBAL_URL_PREFIX: GLOBAL_URL_PREFIX,
	START_URL: GLOBAL_URL_PREFIX + 'loginPage',
	LOGIN: {
		USERNAME: USER.userName,
		PASSWORD: USER.password,
		ASSERT_URL: GLOBAL_URL_PREFIX + 'company'
	},

	COMPANY_ROLE: {
		COMPANY: USER.companyRole,
		DESKTOP_URL: GLOBAL_URL_PREFIX + 'app/desktop'
	},

	DESKTOP: {
		MODULE: {
			Requisition: {
				MODULE_NAME: '',
				Url: GLOBAL_URL_PREFIX + 'procurement/requisition/1061/113'
			},
			TicketSystem: {
				MODULE_NAME: '',
				Url: ''
			},
			Contract: {
				MODULE_NAME: '',
				Url: GLOBAL_URL_PREFIX + 'procurement/contract/1638/1800'
			},
			Procurement: {
				MODULE_NAME: '',
				Url: GLOBAL_URL_PREFIX + 'basics/procurementstructure/1/1'
			},
			Material: {
				MODULE_NAME: 'Material',
				Url: GLOBAL_URL_PREFIX + 'basics/material/1821/1'
			},
			MaterialCatalog: {
				MODULE_NAME: 'Material Catalog',
				Url: GLOBAL_URL_PREFIX + 'basics/materialcatalog/1659/165'
			},
			AssertMaster: {
				MODULE_NAME: '',
				Url: GLOBAL_URL_PREFIX + 'basics/assetmaster/1/1'
			},
			CostGroup: {
				MODULE_NAME: '',
				Url: GLOBAL_URL_PREFIX + 'basics/costgroups/1667/3880'
			}
		}
	},

	DEFAULT_WAIT_SECONDS: 2000
};
config.Material = config.DESKTOP.MODULE.Material;
module.exports = config;