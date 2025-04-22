/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UiCommonStatusBarElementComponent } from '../status-bar-element/status-bar-element.component';
import { UiCommonStatusBarContentComponent } from './status-bar-content.component';

describe('UiCommonStatusBarContentComponent', () => {
	let component: UiCommonStatusBarContentComponent;
	let fixture: ComponentFixture<UiCommonStatusBarContentComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiCommonStatusBarContentComponent],
		}).compileComponents();
	});

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiCommonStatusBarContentComponent, UiCommonStatusBarElementComponent],
			imports: [HttpClientTestingModule, RouterTestingModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCommonStatusBarContentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render class="statusbar" in div tag,', () => {
		const element: HTMLElement = fixture.nativeElement;
		const object = element.getElementsByTagName('div');
		expect(object[0].className).toContain('statusbar');
		expect(object[0].className).toBeCalled;
		expect(object[0].className).toBeTruthy;
		expect(fixture).toMatchSnapshot;
		expect(object[0].className.length).toBeGreaterThanOrEqual(1);
	});

	it('should render <rib-platform-status-bar-element-component > in div tag,', () => {
		const element: HTMLElement = fixture.nativeElement;
		const object = element.getElementsByClassName('left-side');
		expect(object[0].tagName).toBeCalled;
		expect(object[0].tagName).toBeTruthy;
		expect(object[0].tagName.length).toBeGreaterThanOrEqual(1);
	});
});
