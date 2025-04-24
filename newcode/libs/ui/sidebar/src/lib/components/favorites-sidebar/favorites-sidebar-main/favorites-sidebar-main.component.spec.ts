/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSidebarFavoritesSidebarMainComponent } from './favorites-sidebar-main.component';

import { MOCK_ACCORDION_FAVORITES_DATA } from '../../../model/data/mock-favorites-accordion-data';

describe('FavoritesSidebarMainComponent', () => {
	let component: UiSidebarFavoritesSidebarMainComponent;
	let fixture: ComponentFixture<UiSidebarFavoritesSidebarMainComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiSidebarFavoritesSidebarMainComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(UiSidebarFavoritesSidebarMainComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('check if onPanelExpand function emits event on panel expand', () => {
		component.favoriteAccordionData = MOCK_ACCORDION_FAVORITES_DATA;
		component.onPanelExpand(component.favoriteAccordionData[0]);
	});

	it('check if onPanelCollapse function emits event on panel collapse', () => {
		component.favoriteAccordionData = MOCK_ACCORDION_FAVORITES_DATA;
		component.onPanelCollapse(component.favoriteAccordionData[0]);
	});

	it('check if onPanelSelected function emits event on panel selection', () => {
		component.favoriteAccordionData = MOCK_ACCORDION_FAVORITES_DATA;
		component.onPanelSelected(component.favoriteAccordionData[0]);
	});
});
