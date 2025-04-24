/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { FavoritesSettings } from './favorite-setting.class';

describe('favorites setting class', () => {
	let instance: FavoritesSettings;
	beforeEach(() => {
		instance = new FavoritesSettings(1007973, '999-999-04', true);
	});

	it('expect instance to be truthy', () => {
		expect(instance).toBeTruthy();
	});

	it('check instance when expanded is false', () => {
		instance = new FavoritesSettings(1007973, '999-999-04', false);
		expect(instance).toBeTruthy();
	});
});
