/* eslint-disable no-unused-vars */
// init globals var and load configuration json file from backend
// eslint-disable-next-line no-unused-vars
// noinspection SpellCheckingInspection
let globals = { // jshint ignore:line
	// !!! important: do not add further properties here. They must be in config.json
	'webApiBaseUrl': '/',
	'appBaseUrl': '/',
	'defaultState': 'app',
	'defaultUrl': '/app',
	'modules': [],
	'lookups': {},
	'portal': false,
	'preloadTranslations': ['app', 'cloud.common', 'basics.common', '$userLabel'],
	'debugMode': true,
	'timestamp': '',

	'productName': 'RIB 4.0',
	'productversion': '%productversion%',
	'buildversion': '%buildversion%',
	'productdate': '%productdate%',
	'installationdate': '%installationdate%',
	'additionalInfo': '%additionalInfo%',
	'productLogoUrl': 'cloud.style/content/images/app/rib-logo.svg',
	'productLogoPrimaryUrl': 'app-icons ico-rib-40-white',
	'identityBaseUrl': '%identityBaseUrl%',
	'i18nCustom': '%i18nCustom%',
	'aad': {
		'authority': '%aad.authority%',
		'tenant': '%aad.tenant%',
		'office365ClientId': '%aad.office365ClientId%',
		'resource': {
			'msGraph': '%aad.resource.msGraph%',
			'skype': '%aad.resource.skype%'
		},
		'officeViewerServerUrl': '%aad.officeViewerServerUrl%'
	},
	'userlanePropertyId': '%userlanePropertyId%',
	'showImpressumLink': false,
	'showDataprotectionLink': false,
	'errorOnUnhandledRejections': true,
	'dashboard': {
		'url': '%dashboard.url%',
		'ssoCallbackKey': '%dashboard.ssoCallbackKey%'
	},
	'devFeatureFlags': {
		'lookupSearchPopup': true,
		'searchTranslationDialog': false
	}
};
