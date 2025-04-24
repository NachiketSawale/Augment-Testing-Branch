/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { DialogResizableDirective } from './dialog-resizable.directive';

const data = {
	dialog: {
		alarm: {
			text: 'copy to clipboard sucess',
		},
		modalOptions: {
			resizeable: true,
			minWidth: '300px',
		},
	},
};

const datawithMinHeight = {
	dialog: {
		alarm: {
			text: 'copy to clipboard sucess',
		},
		modalOptions: {
			resizeable: undefined,
			minWidth: '300px',
			minHeight: '400px',
		},
	},
};

@Component({
	template: `
		<div class="cdk-overlay-pane">
			<div uiCommonDialogResizable id="resizeDirectiveElement">
				<div class="modal-header">Header</div>
				<div>
					<div class="top-description">Top Description</div>
					<div class="modal-body">Dialog Body</div>
					<div class="bottom-description">Bottom Description</div>
				</div>
				<div>
					<footer class="modal-footer">
						<span>Custom Buttons</span>
						<span></span>
						<span>Standard Buttons</span>
					</footer>
				</div>
			</div>
		</div>
	`,
})
class MockModalDialogWindowComponent {}
describe('DialogResizableDirective', () => {
	let component: MockModalDialogWindowComponent;
	let fixture: ComponentFixture<MockModalDialogWindowComponent>;
	let mousedown: MouseEvent;
	let mouseup: MouseEvent;
	let mousemove: MouseEvent;

	let element;
	let parentElement: DebugElement;
	let hostElement: DebugElement;
	let resizeElement: DebugElement;
	let headerElement: DebugElement;
	let topDescriptionElement: DebugElement;
	let bodyElement: DebugElement;
	let bottomDescriptionElement: DebugElement;
	let footerElement: DebugElement;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [MockModalDialogWindowComponent, DialogResizableDirective],
			imports: [MatDialogModule],
			providers: [{ provide: MAT_DIALOG_DATA, useValue: data }],
		}).compileComponents();
		fixture = TestBed.createComponent(MockModalDialogWindowComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	beforeEach(() => {
		mousedown = new MouseEvent('mousedown');
		mouseup = new MouseEvent('mouseup');
		mousemove = new MouseEvent('mousemove');

		element = fixture.debugElement;
		parentElement = element.query(By.css('.cdk-overlay-pane'));
		hostElement = element.query(By.css('#resizeDirectiveElement'));
		resizeElement = element.query(By.css('.ui-resizable-handle'));
		headerElement = element.query(By.css('.modal-header'));
		topDescriptionElement = element.query(By.css('.top-description'));
		bodyElement = element.query(By.css('.modal-body'));
		bottomDescriptionElement = element.query(By.css('.bottom-description'));
		footerElement = element.query(By.css('.modal-footer'));

		jest.spyOn(hostElement.nativeElement, 'clientWidth', 'get').mockImplementation(() => 400);
		jest.spyOn(hostElement.nativeElement, 'clientHeight', 'get').mockImplementation(() => 500);
		jest.spyOn(headerElement.nativeElement, 'offsetHeight', 'get').mockImplementation(() => 50);
		jest.spyOn(topDescriptionElement.nativeElement, 'offsetHeight', 'get').mockImplementation(() => 25);
		jest.spyOn(bottomDescriptionElement.nativeElement, 'offsetHeight', 'get').mockImplementation(() => 25);
		jest.spyOn(footerElement.nativeElement, 'offsetHeight', 'get').mockImplementation(() => 50);
	});

	it('Increasing the size of element', () => {
		const mousedown = new MouseEvent('mousedown', { screenX: 730, screenY: 500 });

		resizeElement.nativeElement.dispatchEvent(mousedown);

		const mousemove = new MouseEvent('mousemove', { screenX: 830, screenY: 600 });
		document.dispatchEvent(mousemove);
		document.dispatchEvent(mouseup);
		expect((bodyElement.nativeElement as HTMLDivElement).getAttribute('style')).toBe('min-height: 500px;');
		expect(parentElement.nativeElement.style.width).toBe('500px');
	});

	it('Decreasing the size of element', () => {
		const mousedown = new MouseEvent('mousedown', { screenX: 730, screenY: 500 });
		resizeElement.nativeElement.dispatchEvent(mousedown);

		const mousemove = new MouseEvent('mousemove', { screenX: 630, screenY: 400 });
		document.dispatchEvent(mousemove);
		document.dispatchEvent(mouseup);
		expect((bodyElement.nativeElement as HTMLDivElement).getAttribute('style')).toBe('min-height: 300px;');
		expect(parentElement.nativeElement.style.width).toBe('300px');
	});
});

describe('DialogResizableDirective with minHeight provided', () => {
	let component: MockModalDialogWindowComponent;
	let fixture: ComponentFixture<MockModalDialogWindowComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [MockModalDialogWindowComponent, DialogResizableDirective],
			imports: [MatDialogModule],
			providers: [{ provide: MAT_DIALOG_DATA, useValue: datawithMinHeight }],
		}).compileComponents();
		fixture = TestBed.createComponent(MockModalDialogWindowComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('providing the min height', () => {});
});
