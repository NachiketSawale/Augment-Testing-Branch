/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UiSidebarFavoritesService } from './sidebar-favorites.service';

import { MOCK_FAVORITES_DATA } from '../model/data/mock-favorites-api-data';

describe('LocalStorageService', () => {
	let service: UiSidebarFavoritesService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
		});
		service = TestBed.inject(UiSidebarFavoritesService);
		httpTestingController = TestBed.get(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('check if addProjectToFavorites function is creating favorites project object', () => {
		const isAdded = service.addProjectToFavorites(1007973, '999-999-04', true);
		expect(isAdded).toBe(true);
		const isAddedAgain = service.addProjectToFavorites(1007973, '999-999-04', true);
		expect(isAddedAgain).toBe(false);
	});

	it('check if removeProjectFromFavorites function removes the project', () => {
		let isRemoved = service.removeProjectFromFavorites(1007973);
		expect(isRemoved).toBe(false);
		service.addProjectToFavorites(1007973, '999-999-04', true);
		isRemoved = service.removeProjectFromFavorites(1007973);
		expect(isRemoved).toBe(true);
	});

	it('check if isJsonObj function returns correct status of data', () => {
		const object = JSON.stringify({ name: 'itwo40', sort: 4 });
		let isObj = service.isJsonObj(object);
		expect(isObj).toBe(true);
		isObj = service.isJsonObj('itwo40');
		expect(isObj).toBe(false);
	});

	it('check if readFavorites$ function gets favorites data from API', () => {
		service.readFavorites$().subscribe((data) => {
			expect(data).toBe(MOCK_FAVORITES_DATA);
		});
		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/project/favorites/getprojectfavorites');
		req.flush(MOCK_FAVORITES_DATA);
	});

	it('check if saveFavoritesSetting function saves project data to database.', () => {
		service.addProjectToFavorites(1007973, '999-999-04', true);
		service.saveFavoritesSetting$();
	});
});
