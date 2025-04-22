/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { UiCommonCodeConverterDirective } from './code-converter.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CodeConverterData } from '../../../mock-data/input-control-mock-data/code-converter-data';
@Component({
	template: ' <input type="text" id="in" uiCommonCodeConverter /> ',
})
class HostComponent {}
describe('UiCommonCodeConverterDirective', () => {
	let fixture: ComponentFixture<HostComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [HostComponent, UiCommonCodeConverterDirective],
		});
		fixture = TestBed.createComponent(HostComponent);
	});

	it('should create an instance', () => {
		const directive = new UiCommonCodeConverterDirective();
		expect(directive).toBeTruthy();
	});

	it('should return blank value', () => {
		const element: HTMLElement = fixture.nativeElement;
		const input1 = element.getElementsByTagName('input');
		const event = new Event('input', {});
		input1[0].value = '';
		input1[0].dispatchEvent(event);
		fixture.detectChanges();
		expect(input1[0].value).toBe('');
	});

	it('Should return value as is if input is not a string', () => {
		const element: HTMLElement = fixture.nativeElement;
		const input1 = element.getElementsByTagName('input');
		const event = new Event('input', {});
		input1[0].value = CodeConverterData.data1;
		input1[0].dispatchEvent(event);
		fixture.detectChanges();
		expect(input1[0].value).toBe(CodeConverterData.data1);
	});

	it('should allow numbers only', () => {
		const element: HTMLElement = fixture.nativeElement;
		const input1 = element.getElementsByTagName('input');
		const event = new Event('input', {});
		input1[0].value = CodeConverterData.data.toLowerCase();
		input1[0].dispatchEvent(event);
		fixture.detectChanges();
		expect(input1[0].value).toBe(CodeConverterData.data);
	});
});
