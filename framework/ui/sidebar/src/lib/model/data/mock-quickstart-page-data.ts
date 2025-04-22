/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Mock data for quickstart pages
 */
export const QUICKSTART_PAGE_DATA = [
	{
		defaultSorting: 1,
		description: { text: 'workspace', key: 'cloud.desktop.desktopWorkspace' },
		displayName: { text: 'workspace', key: 'cloud.desktop.desktopWorkspace' },
		iconClass: 'ico-page',
		id: 'main',
		permissionGuid: 'aaf74523d08849eb9752a842bec64827',
		targetRoute: 'app/main',
	},
	{
		defaultSorting: 2,
		description: { text: 'Administration', key: 'cloud.desktop.desktopAdministration' },
		displayName: { text: 'Administration', key: 'cloud.desktop.desktopAdministration' },
		iconClass: 'ico-page',
		id: 'config',
		permissionGuid: 'aaf74523d08849eb9752a842bec64827',
		targetRoute: 'app/config',
	},
];
