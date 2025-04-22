/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableOverlayComponent } from './resizable-overlay.component';
import { ResizableOverlayContentComponent } from '../resizable-overlay-content/resizable-overlay-content.component';
import { Renderer2 } from '@angular/core';

const data = {
	preventDefault: () => {},
	pageX: 200,
	pageY: 200,
};
describe('ResizableOverlayComponent', () => {
	let component: ResizableOverlayComponent;
	let fixture: ComponentFixture<ResizableOverlayComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ResizableOverlayComponent, ResizableOverlayContentComponent],
			providers: [Renderer2],
		});
		fixture = TestBed.createComponent(ResizableOverlayComponent);
		component = fixture.componentInstance;
		component.dragDirection = 'topLeft';
		component.resizableOverlayDir.height = 200;
		component.resizableOverlayDir.width = 200;
		component['originalMouseX'] = 200;
		component['originalMouseY'] = 200;
		component.resizableOverlayDir.resizingPoints = {
			topLeft: true,
			topRight: false,
			bottomLeft: false,
			bottomRight: false,
		};
		component['maximumSize'] = 800;
		component['minimumSize'] = 200;
		jest.useFakeTimers();
		fixture.detectChanges();
	});

	it('should create', () => {
		jest.runAllTimers();
		expect(component).toBeTruthy();
	});

	it('test collapse div function', () => {
		component.collapseDiv();
		expect(component.collapsed).toBe(true);
	});

	it('test startResize function', () => {
		component['startResize'](data as MouseEvent);
	});

	it('test duringResize function for bottomRight', () => {
		component.resizableOverlayDir.resizingPoints = {
			topLeft: false,
			topRight: false,
			bottomLeft: false,
			bottomRight: true,
		};
		component['duringResize'](data as MouseEvent);
	});

	it('test duringResize function for bottomLeft', () => {
		component.resizableOverlayDir.resizingPoints = {
			topLeft: false,
			topRight: false,
			bottomLeft: true,
			bottomRight: false,
		};
		component['duringResize'](data as MouseEvent);
	});

	it('test duringResize function for topRight', () => {
		component.resizableOverlayDir.resizingPoints = {
			topLeft: false,
			topRight: true,
			bottomLeft: false,
			bottomRight: false,
		};
		component['duringResize'](data as MouseEvent);
	});

	it('test duringResize function for topLeft', () => {
		component.resizableOverlayDir.resizingPoints = {
			topLeft: true,
			topRight: false,
			bottomLeft: false,
			bottomRight: false,
		};
		fixture.detectChanges();
		component['duringResize'](data as MouseEvent);
	});

	it('test stopResize function', () => {
		component['stopResize']();
	});

	it('test updateStyle function', () => {
		component['adjustedHeight'] = 201;
		component['adjustedWidth'] = 300;
		component['updateStyle']();
	});
	it('test saveResizableDirData function', () => {
		component['saveResizableDirData']();
	});
});
