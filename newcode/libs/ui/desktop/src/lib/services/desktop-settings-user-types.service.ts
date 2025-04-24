/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})

/**
 * service for settings-user-type and this service is returns values. Replacement of value service.
 * @param {string}  user
 * @param {string} system
 * @param {string} portal
 */
export class DesktopSettingsUserTypesService {
	user: string = 'user';
	system: string = 'system';
	portal: string = 'portal';
	constructor() {}
}
