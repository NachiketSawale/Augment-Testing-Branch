/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { DialogDraggableDirective } from './dialog-draggable.directive';

@Component({
	template: `
		<div class="cdk-overlay-pane" style="margin-top: 30px;width:400px;">
			<div uiCommonDialogDraggable id="dragDirectiveElement">
				<div class="modal-header">Header</div>
				<div>Body</div>
				<div>
					<mat-dialog-actions class="modal-footer">
						<span>Custom Buttons</span>
						<span id="btnSpan"></span>
						<span>Standard Buttons</span>
					</mat-dialog-actions>
				</div>
			</div>
		</div>
	`,
})
class MockModalDialogWindowComponent {}
describe('DialogDraggableDirective', () => {
	let component: MockModalDialogWindowComponent;
	let fixture: ComponentFixture<MockModalDialogWindowComponent>;
	let parentDebugElement: DebugElement;
	let testDebugElement: DebugElement;
	let headElement: DebugElement;
	let hostElement: DebugElement;
	let mousedown: MouseEvent;
	let mouseup: MouseEvent;
	let mousemove: MouseEvent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [MockModalDialogWindowComponent, DialogDraggableDirective],
			imports: [MatDialogModule],
		}).compileComponents();
		fixture = TestBed.createComponent(MockModalDialogWindowComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		parentDebugElement = fixture.debugElement;
		testDebugElement = parentDebugElement.query(By.css('.modal-header'));
		headElement = parentDebugElement.query(By.css('.cdk-overlay-pane'));
		hostElement = parentDebugElement.query(By.css('#dragDirectiveElement'));
		mousedown = new MouseEvent('mousedown');
		mouseup = new MouseEvent('mouseup');
		mousemove = new MouseEvent('mousemove');
	});

	it('should create component', () => {
		expect(component).toBeTruthy();
	});

	it('should add style cursor:move to header element on mouse down and add style cursor:context-menu when mouse up', () => {
		//console.log(document.documentElement.innerHTML);
		console.log(testDebugElement.nativeElement);
		testDebugElement.nativeElement.dispatchEvent(mousedown);
		fixture.detectChanges();
		expect(testDebugElement.nativeElement.style.cursor).toBe('move');

		document.dispatchEvent(mouseup);
		fixture.detectChanges();
		expect(testDebugElement.nativeElement.style.cursor).toBe('context-menu');
	});

	it('should add style cursor:move to footer element on mouse down and add style cursor:context-menu when mouse up', () => {
		testDebugElement.nativeElement.dispatchEvent(mousedown);
		fixture.detectChanges();
		expect(testDebugElement.nativeElement.style.cursor).toBe('move');

		document.dispatchEvent(mouseup);
		fixture.detectChanges();
		expect(testDebugElement.nativeElement.style.cursor).toBe('context-menu');
	});

	it('Dragging element from header inside the viewport', () => {
		hostElement.nativeElement.getBoundingClientRect = jest.fn(() => ({
			x: 50,
			y: 50,
			width: 100,
			height: 30,
			top: 50,
			right: 150,
			bottom: 80,
			left: 50,
		}));
		// TODO: fix? innerWidth and innerHeight are read-only and cannot be directly assigned?
		window.resizeBy(500 - window.innerWidth, 400 - window.innerHeight);
		//window.innerWidth = 500;
		//window.innerHeight = 400;

		const mousedown = new MouseEvent('mousedown', { clientX: 40, clientY: 40 });
		testDebugElement.nativeElement.dispatchEvent(mousedown);
		fixture.detectChanges();

		const mouseMove = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
		testDebugElement.nativeElement.dispatchEvent(mouseMove);
		fixture.detectChanges();

		expect(headElement.nativeElement.style.transform).toBe('translate(10px, 10px)');

		const mouseup = new MouseEvent('mouseup');
		document.dispatchEvent(mouseup);
		fixture.detectChanges();
	});

	it('Dragging element from header outside the viewport( element.x<0) r ', () => {
		hostElement.nativeElement.getBoundingClientRect = jest.fn(() => ({
			x: -10,
			y: 0,
			width: 10,
			height: 17,
			top: 20,
			right: 30,
			bottom: 0,
			left: 10,
		}));

		document.dispatchEvent(mouseup);
		fixture.detectChanges();
		expect(headElement.nativeElement.style.transform).toBe('translate(0px,0px)');
	});

	it('Dragging element from header outside the viewport(element.y<0)  ', () => {
		hostElement.nativeElement.getBoundingClientRect = jest.fn(() => ({
			x: 0,
			y: -10,
			width: 10,
			height: 17,
			top: 20,
			right: 30,
			bottom: 0,
			left: 10,
		}));

		document.dispatchEvent(mouseup);
		fixture.detectChanges();
		expect(headElement.nativeElement.style.transform).toBe('translate(0px,0px)');
	});
/*
	it('Dragging element from header outside the viewport( element.x + element.width > window.innerwidth)', () => {
		hostElement.nativeElement.getBoundingClientRect = jest.fn(() => ({
			x: 110,
			y: 10,
			width: 500,
			height: 17,
			top: 20,
			right: 30,
			bottom: 0,
			left: 10,
		}));
		// TODO: fix? innerWidth and innerHeight are read-only and cannot be directly assigned
		window.resizeBy(500 - window.innerWidth, 0);
		//window.innerWidth = 500;
		document.dispatchEvent(mouseup);
		fixture.detectChanges();
		expect(headElement.nativeElement.style.transform).toBe('translate(0px,0px)');
	});

	it('Dragging element from header outside the viewport( element.y + element.height > window.innerheight)', () => {
		hostElement.nativeElement.getBoundingClientRect = jest.fn(() => ({
			x: 10,
			y: 110,
			width: 50,
			height: 500,
			top: 20,
			right: 30,
			bottom: 0,
			left: 10,
		}));
		// TODO: fix? innerWidth and innerHeight are read-only and cannot be directly assigned?
		window.resizeBy(0, 500 - window.innerHeight);
		//window.innerHeight = 500;
		document.dispatchEvent(mouseup);
		fixture.detectChanges();
		expect(headElement.nativeElement.style.transform).toBe('translate(0px,0px)');
	});*/
});
