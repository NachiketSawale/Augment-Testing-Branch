/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { SimpleChanges } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSidebarFavoritesSidebarEditComponent } from './favorites-sidebar-edit.component';

import { MOCK_ACCORDION_FAVORITES_DATA } from '../../../model/data/mock-favorites-accordion-data';

import { ISidebarFavoriteAccordionData } from '../../../model/interfaces/favorites/sidebar-favorites-accordion-data.interface';

describe('FavoritesSidebarEditComponent', () => {
	let component: UiSidebarFavoritesSidebarEditComponent;
	let fixture: ComponentFixture<UiSidebarFavoritesSidebarEditComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiSidebarFavoritesSidebarEditComponent],
			imports: [HttpClientModule],
		}).compileComponents();

		fixture = TestBed.createComponent(UiSidebarFavoritesSidebarEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('check if initializeFavoritesData function initializes the favorites data', () => {
		component.favoriteAccordionData = MOCK_ACCORDION_FAVORITES_DATA;
		component.initializeFavoritesData();
	});

	it('test ngOnChanges component', () => {
		const data = {
			favoriteAccordionData: {
				previousValue: [],
				currentValue: MOCK_ACCORDION_FAVORITES_DATA,
			},
		};

		component.ngOnChanges(data as unknown as SimpleChanges);
	});

	it('test if event is emited on delete click button', () => {
		component.onProjectDeleteClick(1007973);
	});

	it('test processSortItems function for sorting functionality', () => {
		component.favoriteAccordionData = MOCK_ACCORDION_FAVORITES_DATA;
		const event = {
			currentIndex: 1,
			previousIndex: 1,
		};
		component.processSortItems(event as CdkDragDrop<ISidebarFavoriteAccordionData[]>);
	});
});
