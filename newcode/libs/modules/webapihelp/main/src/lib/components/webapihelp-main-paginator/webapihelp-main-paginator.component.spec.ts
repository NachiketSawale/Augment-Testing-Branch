/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { WebApiHelpMainPaginatorComponent } from './webapihelp-main-paginator.component';

describe('WebApiHelpMainPaginatorComponent', () => {
	let component: WebApiHelpMainPaginatorComponent;
	let fixture: ComponentFixture<WebApiHelpMainPaginatorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [HttpClient, HttpHandler],
			declarations: [WebApiHelpMainPaginatorComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(WebApiHelpMainPaginatorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call ngOnchanges', () => {
		component.totalCount = 1;
		//directly call ngOnChanges
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.maxPageSize).toEqual(component.totalCount);
		expect(component.rulerLength).toEqual(component.totalCount);
	});

	it('should call ngOnchanges - for gretor then 10 pages', () => {
		component.totalCount = 11;
		//directly call ngOnChanges
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.rulerLength).toEqual(10);
	});

	it('should call ngOnInit - for gretor then 10 pages', () => {
		component.totalCount = 11;
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.rulerLength).toEqual(10);
	});

	it('navigateToPage', () => {
		jest.spyOn(component, 'navigateToPage');
		component.navigateToPage(1);
		expect(component.navigateToPage).toBeDefined();
		expect(component.index).toEqual(1);
	});

	it('index', () => {
		component.isAllowNavigation(1, 0, 10);
		expect(component.isAllowNavigation).toBeDefined();
	});
});
