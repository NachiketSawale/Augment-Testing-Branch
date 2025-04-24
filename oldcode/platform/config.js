// init globals var and load configuration json file from backend
// noinspection SpellCheckingInspection

// eslint-disable-next-line no-unused-vars
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

	'productName': 'iTWO 4.0',
	'productversion': '6.2.0-2022-12-05',
	'buildversion': '6.2.x.x',
	'productdate': '2022-12-05T00:00:00',
	'installationdate': '2022-12-05T00:00:00',
	'productLogoUrl': 'cloud.style/content/images/app/rib-logo.svg',
	'productLogoPrimaryUrl': 'app-icons ico-rib-40-white',
	'identityBaseUrl': 'https://apps-int.itwo40.eu/itwo40/identityserver500/core/',
	'__identityBaseUrl': 'https://apps.itwo40.eu/itwo40/rel620/identityservercore/core/',
	'i18nCustom': false,
	'aad': {
		'authority': 'https://login.microsoftonline.com',
		'tenant': 'common',
		'office365ClientId': '8851e90d-306a-4475-903c-704c54a1c4a2',
		'resource': {
			'msGraph': 'https://graph.microsoft.com',
			'skype': 'https://webdir.online.lync.com'
		},
		'officeViewerServerUrl': 'https://view.officeapps.live.com'
	},
	'userlanePropertyId': '',
	'showImpressumLink': false,
	'showDataprotectionLink': false,
	'errorOnUnhandledRejections': true,
	'dashboard': {
		'url': 'https://itwobi-admin.itwo40.eu/mvc/organizations/Cl0ghYAnYtW6JXsOCCQNy2',
		'ssoCallbackKey': 'itwo40'
	},
	'devFeatureFlags': {
		'lookupSearchPopup': true,
		'searchTranslationDialog': false
	}
};
