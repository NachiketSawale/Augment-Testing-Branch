/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDesktopGroup } from '../model/interfaces/desktop-page-list.interface';

/**
 * default properties of desktop tiles data.
 */
export const desktopGroupList: IDesktopGroup[] = [
	{
		groupName: 'Enterprise',
		pageId: 'main',
		key: 'cloud.desktop.tileGroupEnterprise',
	},
	{
		groupName: 'Master Data',
		pageId: 'config',
		key: 'cloud.desktop.tileGroupMasterData',
	},
	{
		groupName: 'Master Data Second',
		pageId: 'config',
		key: 'cloud.desktop.tileGroupMasterDataSecond',
	},
	{
		groupName: 'Configuration',
		pageId: 'config',
		key: 'cloud.desktop.tileGroupConfiguration',
	},
	{
		groupName: 'Administration',
		pageId: 'config',
		key: 'cloud.desktop.desktopAdministration',
	},
	{
		groupName: 'Programs',
		pageId: 'main',
		key: 'cloud.desktop.tileGroupProject',
	},
	{
		groupName: 'Production Planning',
		pageId: 'main',
		key: 'cloud.desktop.tileGroupProductionPlanning',
	},
	{
		groupName: 'Sales',
		pageId: 'main',
		key: 'cloud.desktop.tileGroupSales',
  }
];
