/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { ControlContextInjectionToken, IControlContext } from '../../model/control-context.interface';

import { IEntityContext, MinimalEntityContext, PlatformCommonModule, PlatformTranslateService, TranslatePipe } from '@libs/platform/common';
import { UrlComponent } from './url.component';

describe('UrlComponent', () => {
	let component: UrlComponent;
	let fixture: ComponentFixture<UrlComponent>;

	beforeEach(async () => {
		const ctlCtx: IControlContext = {
			fieldId: 'SingleLineText',
			readonly: false,
			validationResults: [],
			get entityContext(): IEntityContext<object> {
				return new MinimalEntityContext();
			},
		};
		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, PlatformCommonModule],
			declarations: [UrlComponent],
			providers: [TranslatePipe, PlatformTranslateService, HttpClient, HttpHandler, { provide: ControlContextInjectionToken, useValue: ctlCtx }],
		}).compileComponents();
	});
	beforeEach(() => {
		fixture = TestBed.createComponent(UrlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should return null for a valid URL with http', () => {
		const control = new FormControl('http://www.example.com');
		const result = component.urlValidator(control);
		expect(result).toBe(null);
	});

	it('should return null for a valid URL with https', () => {
		const control = new FormControl('https://www.example.com');
		const result = component.urlValidator(control);
		expect(result).toBe(null);
	});

	it('should open the provided URL in a new tab if it starts with a protocol', () => {
		const url = 'http://example.com';
		const openSpy = jest.spyOn(window, 'open').mockReturnValue(null);

		component.controlContext.value = url;
		component.openUrl(new MouseEvent('click'));

		expect(openSpy).toHaveBeenCalledWith(url, '_blank');
	});

	it('should open the provided URL with "https://" prefix in a new tab if it does not start with a protocol', () => {
		const url = 'example.com';
		const expectedUrl = 'https://example.com';
		const openSpy = jest.spyOn(window, 'open').mockReturnValue(null);

		component.controlContext.value = url;
		component.openUrl(new MouseEvent('click'));

		expect(openSpy).toHaveBeenCalledWith(expectedUrl, '_blank');
	});

	it('should return true if urlString is touched and has "urlInvalid" error', () => {
		component.urlString.markAsTouched();
		component.urlString.setErrors({ urlInvalid: true });

		const result = component.hasError();

		expect(result).toBe(true);
	});

	it('should return true if urlString is touched and has "required" error', () => {
		component.urlString.markAsTouched();
		component.urlString.setErrors({ required: true });

		const result = component.hasError();

		expect(result).toBe(true);
	});

	it('should return false if urlString is untouched and has "urlInvalid" error', () => {
		component.urlString.setErrors({ urlInvalid: true });

		const result = component.hasError();

		expect(result).toBe(false);
	});

	it('should return true if urlString is both touched, has "urlInvalid" error, and is dirty', () => {
		component.urlString.markAsTouched();
		component.urlString.markAsDirty();
		component.urlString.setErrors({ urlInvalid: true });

		const result = component.hasError();

		expect(result).toBe(true);
	});

	it('should return false if urlString is untouched and has no errors', () => {
		const result = component.hasError();

		expect(result).toBe(false);
	});
});
