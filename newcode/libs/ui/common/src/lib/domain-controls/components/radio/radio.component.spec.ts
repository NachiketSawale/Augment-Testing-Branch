/**
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioComponent } from './radio.component';

import { ControlContextInjectionToken } from '../../model/control-context.interface';

describe('RadioComponent', () => {
	let component: RadioComponent;
	let fixture: ComponentFixture<RadioComponent>;

	const controlContextMock = {
		itemsSource: {
			items: [
				{
					id: true,
					displayName: 'Picture',
					iconCSS: 'tlb-icons ico-info',
				},
			],
		},
	};

	const data = [
		{
			id: true,
			displayName: 'Picture',
			iconCSS: 'tlb-icons ico-info',
		},
	];

	beforeEach(async () => {
		const ctlCtx = {
			value: 'Picture',
			fieldId: 'IsActive',
			readonly: false,
			validationResults: [],
		};

		await TestBed.configureTestingModule({
			declarations: [RadioComponent],
			providers: [{ provide: ControlContextInjectionToken, useValue: ctlCtx }],
		}).compileComponents();

		fixture = TestBed.createComponent(RadioComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('check if getRadioItems function retrun the data', () => {
		component.controlContext.itemsSource = controlContextMock.itemsSource;
		expect(component['getRadioItems']()).toStrictEqual(data);
	});
});
