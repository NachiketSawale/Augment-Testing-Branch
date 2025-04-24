/**
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { TimeComponent } from './time.component';

import { ControlContextInjectionToken } from '../../model/control-context.interface';
import { ITimeConfig, TimeConfigInjectionToken } from '../../model/time-config.interface';

import { FieldType } from '../../../model/fields';

describe('TimeComponent', () => {
	let component: TimeComponent;
	let fixture: ComponentFixture<TimeComponent>;
	const controlContextMock: { options: { format: string } | undefined } = {
		options: {
			format: 'HH:mm',
		},
	};
	const timeConfig: ITimeConfig = {
		type:FieldType.Time
	};
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TimeComponent],
			providers: [{ provide: ControlContextInjectionToken, useValue: controlContextMock },{provide: TimeConfigInjectionToken, useValue: timeConfig}],
			imports: [FormsModule]
		}).compileComponents();

		fixture = TestBed.createComponent(TimeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('returns false for Utc time not include', () => {
		expect(component.timeConfig.type.includes('utc')).toBe(false);
	});
	
	it('format should be HH:mm', () => {
		expect(component.controlContext.options.format).toEqual('HH:mm');
	});

	it('options should be checked if undefined', () => {
		controlContextMock.options = undefined;
		fixture.detectChanges();

		expect(controlContextMock.options).toBeUndefined();
	});
});

describe('TimeComponent with timeutc', () => {
	let component: TimeComponent;
	let fixture: ComponentFixture<TimeComponent>;
	const controlContextMock: { options: { format: string } | undefined } = {
		options: {
			format: 'HH:mm',
		},
	};
	let timeConfig: ITimeConfig = {
		type:FieldType.TimeUtc
	};
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TimeComponent],
			providers: [{ provide: ControlContextInjectionToken, useValue: controlContextMock },{provide: TimeConfigInjectionToken, useValue: timeConfig}],
		}).compileComponents();

		fixture = TestBed.createComponent(TimeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	it('utc time test', () => {
		controlContextMock.options = { format: 'HH:mm' };
		component.controlContext.value = new Date('2023.08.11 07:27:37');
		
		component.value = '07:30';
		fixture.detectChanges();
    
		expect(component.controlContext.value).toBeDefined();
	});

	it('returns true for Utc time include', () => {
		controlContextMock.options = { format: 'HH:mm' };
		timeConfig={type:FieldType.TimeUtc};
		fixture.detectChanges();
		expect(component.timeConfig.type.includes('utc')).toBe(true);
	});

});
