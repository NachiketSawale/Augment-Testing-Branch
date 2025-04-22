/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBodyDescriptionComponent } from './dialog-body-description.component';

import { TranslatePipe } from '@libs/platform/common';

describe('DialogBodyDescriptionComponent', () => {
	let component: DialogBodyDescriptionComponent;
	let fixture: ComponentFixture<DialogBodyDescriptionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [DialogBodyDescriptionComponent, TranslatePipe]
		}).compileComponents();

		fixture = TestBed.createComponent(DialogBodyDescriptionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should cope with the absence of a value', () => {
		component.value = undefined;

		expect(component.text).toBeUndefined();
		expect(component.iconClass).toBeUndefined();
	});

	it('should use a string', () => {
		component.value = 'some test';

		expect(component.text).toBe('some test');
		expect(component.iconClass).toBeUndefined();
	});

	it('should use a Translatable', () => {
		component.value = {
			key: 'my.test'
		};

		expect(component.text).toEqual({
			key: 'my.test'
		});
		expect(component.iconClass).toBeUndefined();
	});

	it('should use a description with a string', () => {
		component.value = {
			iconClass: 'ico-error',
			text: 'just a text'
		};

		expect(component.text).toBe('just a text');
		expect(component.iconClass).toBe('ico-error');
	});

	it('should use a description with a Translatable', () => {
		component.value = {
			iconClass: 'ico-question',
			text: {
				key: 'other.text'
			}
		};

		expect(component.text).toEqual({
			key: 'other.text'
		});
		expect(component.iconClass).toBe('ico-question');
	});
});
