/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { IntegerComponent } from './integer.component';

import {
	ControlContextInjectionToken
} from '../../model/control-context.interface';
import { INumericControlContext } from '../../model/numeric-control-context.interface';
import { IEntityContext, MinimalEntityContext } from '@libs/platform/common';
import { HttpClientModule } from '@angular/common/http';

describe('IntegerComponent', () => {
	let component: IntegerComponent;
	let fixture: ComponentFixture<IntegerComponent>;
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

		await TestBed.configureTestingModule({
			imports: [FormsModule, HttpClientModule],
			declarations: [IntegerComponent],
			providers: [
				{provide: ControlContextInjectionToken, useValue: ctlCtx}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(IntegerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should accept numeric values', () => {
		component.value = '165';

		expect(lastAssignedValue).toBe(165);
	});

	it('should reject non-numeric values', () => {
		component.value = 'xx';
		expect(lastAssignedValue).toBe(0);
	});

	it('should shorten the value', () => {
		component.value = '65656565656565656565656566565656';

		expect(lastAssignedValue).toBe(6);

	});

	it('number value should be converted to string', () => {
		jest.spyOn(component, 'format').mockImplementation(() => {
			return 41;
		});
		component.value = '41';

		expect(lastAssignedValue).toBe(41);
	});

	it('decimal value should be removed', () => {
		const event = {
			target: {
				value: '12.3'
			}
		};

		component.removeDecimal(event as unknown as Event);

		expect(event.target.value).toBe('123');
	});

	it('exponential value should be shorten ', () => {
		component.value = '6565656565656565656565e+30';

		expect(lastAssignedValue).toBe(6);

	});

	/*
	// TODO: revise (also do not hard-code locales, but make dependent on settings)
		it('should reject English floating-point values', () => {
			const previousValue = lastAssignedValue;

			component.value = '500.2';

			expect(lastAssignedValue).toBe(previousValue);
		});

		it('should reject German floating-point values', () => {
			const previousValue = lastAssignedValue;

			component.value = '700,2';

			expect(lastAssignedValue).toBe(previousValue);
		});
	*/
	it('should accept undefined', () => {
		component.value = undefined;

		expect(lastAssignedValue).toBeUndefined();

	});
});
