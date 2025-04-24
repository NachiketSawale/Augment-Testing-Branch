/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { UiSidebarFavoritesSidebarTabComponent } from './favorites-sidebar-tab.component';
import { UiCommonAccordionComponent } from '@libs/ui/common';
import { UiSidebarFavoritesSidebarMainComponent } from '../favorites-sidebar-main/favorites-sidebar-main.component';

import { TranslatePipe } from '@libs/platform/common';

import { MOCK_FAVORITES_DATA } from '../../../model/data/mock-favorites-api-data';
import { MOCK_ACCORDION_FAVORITES_DATA } from '../../../model/data/mock-favorites-accordion-data';

import { ISidebarFavorites } from '../../../model/interfaces/favorites/sidebar-favorites.interface';
import { ISidebarFavoriteAccordionData } from '../../../model/interfaces/favorites/sidebar-favorites-accordion-data.interface';

describe('UiSidebarFavoritesSidebarTabComponent', () => {
	let component: UiSidebarFavoritesSidebarTabComponent;
	let fixture: ComponentFixture<UiSidebarFavoritesSidebarTabComponent>;
	let httpTestingController: HttpTestingController;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiSidebarFavoritesSidebarTabComponent, TranslatePipe, UiSidebarFavoritesSidebarMainComponent, UiCommonAccordionComponent],
			imports: [HttpClientModule, HttpClientTestingModule, MatDialogModule],
		}).compileComponents();
	});

	beforeEach(() => {
		httpTestingController = TestBed.get(HttpTestingController);
		fixture = TestBed.createComponent(UiSidebarFavoritesSidebarTabComponent);
		component = fixture.componentInstance;
		localStorage.setItem('sidebarUserSettings', JSON.stringify({ sidebarpin: { lastButtonId: 'dummy' } }));
		fixture.detectChanges();
	});

	beforeEach(() => {
		const getReq = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/project/favorites/getprojectfavorites');
		getReq.flush(MOCK_FAVORITES_DATA);

		const observable = new Observable<Record<string | number, ISidebarFavorites>>((observer) => {
			observer.next(MOCK_FAVORITES_DATA.favoritesSetting);
		});
		jest.spyOn(component['sidebarFavoriteService'], 'saveFavoritesSetting$').mockReturnValue(observable);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('check if onAddProject function adds the project sucessfully', () => {
		component.onAddProject();
	});

	it('check if onProjectDeleteClick function deletes the selected project', () => {
		component.onProjectDeleteClick(1007973);
	});

	it('check if onPanelSelected function is called when clicked on certain item', () => {
		component.onPanelSelected(component.favoriteAccordionData[0]);
	});

	it('check if sortable is changing state when sort icon is clicked', () => {
		component.favoriteAccordionData = MOCK_ACCORDION_FAVORITES_DATA;
		component.processSortable();
		expect(component.isSortable).toBe(true);
		component.processSortable();
		expect(component.isSortable).toBe(false);
	});

	it('check if panel open function is changing the state of panel to true', () => {
		component.favoriteAccordionData = MOCK_ACCORDION_FAVORITES_DATA;
		component.onPanelOpen(component.favoriteAccordionData[0]);
		expect(component.favoriteAccordionData[0].expanded).toBe(true);
		component.onPanelOpen((<ISidebarFavoriteAccordionData[]>component.favoriteAccordionData[0].children)[0]);
		expect((<ISidebarFavoriteAccordionData[]>component.favoriteAccordionData[0].children)[0].expanded).toBe(true);
	});

	it('check if panel close function is changing the state of panel to false', () => {
		component.favoriteAccordionData = MOCK_ACCORDION_FAVORITES_DATA;
		component.onPanelClose(component.favoriteAccordionData[0]);
		expect(component.favoriteAccordionData[0].expanded).toBe(false);
	});
});
