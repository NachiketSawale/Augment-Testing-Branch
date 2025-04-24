/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { desktopGroupList } from '../constant/desktopGroupList';

@Injectable({
	providedIn: 'root',
})
export class DesktopGroupListService {
	public constructor() {}

	/**
	 * To get the desktop list default Data.
	 * @param defaultGroupId
	 * @returns
	 */
	public loadDomain(defaultGroupId: string | undefined | number) {
		const desktopListDefaultData = desktopGroupList.filter((v) => defaultGroupId === v.groupName);
		return desktopListDefaultData;
	}
}
