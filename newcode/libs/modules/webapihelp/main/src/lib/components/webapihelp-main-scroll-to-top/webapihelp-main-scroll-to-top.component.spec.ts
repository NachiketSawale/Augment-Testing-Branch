/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebApiHelpMainScrollToTopComponent } from './webapihelp-main-scroll-to-top.component';

describe('WebApiHelpMainScrollToTopComponent', () => {
	let component: WebApiHelpMainScrollToTopComponent;
	let fixture: ComponentFixture<WebApiHelpMainScrollToTopComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [WebApiHelpMainScrollToTopComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(WebApiHelpMainScrollToTopComponent);
		component = fixture.componentInstance;
		global.window = window;
		window.scroll = jest.fn();
		window.HTMLElement.prototype.scrollIntoView = jest.fn();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('checkScroll', () => {
		jest.spyOn(component, 'checkScroll');
		component.checkScroll();
		expect(component.checkScroll).toBeDefined();
	});

	it('scrollToTop', () => {
		jest.spyOn(component, 'scrollToTop');
		component.scrollToTop();
		expect(component.scrollToTop).toBeDefined();
	});
});
