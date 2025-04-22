/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { FloatComponent } from './float.component';

import {
	ControlContextInjectionToken
} from '../../model/control-context.interface';
import { INumericControlContext } from '../../model/numeric-control-context.interface';
import { FloatConfigInjectionToken, IFloatConfig } from '../../model/float-config.interface';
import {IEntityContext, MinimalEntityContext} from '@libs/platform/common';
import { HttpClientModule } from '@angular/common/http';




describe('FloatComponent', () => {
	let component: FloatComponent;
	let fixture: ComponentFixture<FloatComponent>;
	let lastAssignedValue: number | undefined = 42;

	beforeEach(async () => {
		const ctlCtx: INumericControlContext = {
			fieldId: 'Value',
			readonly: false,
			validationResults: [],
			get value(): number {
				return 42;
			},
			set value(assignedValue: number | undefined) {
				lastAssignedValue = assignedValue;
			},
			get entityContext(): IEntityContext<object> {
				return new MinimalEntityContext();
			}
		};

		const floatConfig: IFloatConfig = {
			decimalPlaces: 3
		};

		await TestBed.configureTestingModule({
			imports: [FormsModule, HttpClientModule],
			declarations: [FloatComponent],
			providers: [
				{ provide: ControlContextInjectionToken, useValue: ctlCtx },
				{ provide: FloatConfigInjectionToken, useValue: floatConfig }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(FloatComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});


	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should accept numeric values', () => {
		component.value = '165';
		setTimeout(() => {
			fixture.detectChanges();
			expect(lastAssignedValue).toBe(165);

		}, 2000);

	});

	it('should reject non-numeric values', () => {
		const previousValue = lastAssignedValue;
		component.value = 'xx';
		expect(lastAssignedValue).toBe(previousValue);
	});
	/*
	// TODO: revise (also do not hard-code locales, but make dependent on settings)
		it('should accept English floating-point values', () => {
			const previousValue = lastAssignedValue;

			component.value = '500.2';

			expect(lastAssignedValue).toBe(500.2);
		});

		it('should reject German floating-point values', () => {
			const previousValue = lastAssignedValue;

			component.value = '700,2';

			expect(lastAssignedValue).toBe(previousValue);
		});
		 */

	it('should **not** assign zero by default', () => {
		component.value = undefined;
		expect(lastAssignedValue).toBe(42);
	});

	it('should call formatToDecimal with empty input value', () => {
		component.value = '';
		expect(component.formatToDecimal(component.value));
		expect(lastAssignedValue).toBe(42);
	});

	it('should call formatToDecimal with maximum number of digits as input value', () => {
		component.value = '6666666666666666666666666666666666666666';
		setTimeout(() => {
			fixture.detectChanges();
			expect(component.formatToDecimal(component.value));
			expect(lastAssignedValue).toBe(6.667);

		}, 2000);


	});



	it('should call convertToNumber', () => {
		const convertToNummberSpy = jest.spyOn(component, 'convertToNumber');
		component.value = '12';
		expect(convertToNummberSpy).not.toHaveBeenCalled();
		expect(component.convertToNumber(component.value));
		setTimeout(() => {
			expect(convertToNummberSpy).toHaveBeenCalled();
		}, 2000);

	});


	it('should return number with provided decimal places', () => {
		component.inputValue = '22.23456';
		setTimeout(() => {
			fixture.detectChanges();
			expect(component.removedDecimal(component.inputValue as string));
			expect(lastAssignedValue).toBe(22.234);
		}, 2000);


	});



	it('should allow negative numbers', () => {
		component.value = '-22';
		setTimeout(() => {
			fixture.detectChanges();
			expect(component.removedDecimal(component.value));
			expect(lastAssignedValue).toBe(-22.00);
		}, 2000);
	});

	it('should convert value to number', () => {
		component.value = '23,560';
		setTimeout(() => {
			fixture.detectChanges();
			expect(component.convertToNumber(component.value));
			expect(lastAssignedValue).toBe(23560);
		}, 2000);
	});

	it('hostlistener', () => {
		const element: HTMLElement = fixture.nativeElement;
		const input1 = element.getElementsByTagName('input');
		const event = new Event('input', {});
		input1[0].value = '123';

		fixture.detectChanges();
		input1[0].dispatchEvent(event);
		element.dispatchEvent(event);
		fixture.detectChanges();

		expect(input1[0].value).toEqual('123');
	});

	it('should call handleInput on input event', () => {
		const mockEvent = {
			target: {
				value: '12'
			}
		};
		const inputElement = fixture.nativeElement.querySelector('input');
		inputElement.value = '12.0000';

		inputElement.dispatchEvent(new Event('input'));

		expect(component.handleInput(mockEvent as unknown as Event));
		expect(inputElement.value).toBe('12.0000');
		setTimeout(() => {
			fixture.detectChanges();
			expect(lastAssignedValue).toBe(12);
		}, 2000);

	});


});
