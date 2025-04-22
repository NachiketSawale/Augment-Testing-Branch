/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPickerComponent } from './color-picker.component';
import { FormsModule } from '@angular/forms';
import { ControlContextInjectionToken } from '../../model/control-context.interface';
import { IColorControlContext } from '../../model/color-control-context.interfacets';
import { ColorFormat, ColorType, IEntityContext, RgbColor } from '@libs/platform/common';

describe('ColorPickerComponent', () => {
	let component: ColorPickerComponent;
	let fixture: ComponentFixture<ColorPickerComponent>;
	let lastAssignedValue: ColorType | undefined | unknown = new RgbColor(100, 100, 100);

	beforeEach(async () => {
		const ctlCtx: IColorControlContext = {
			fieldId: 'Value',
			readonly: false,
			validationResults: [],
			get value(): RgbColor {
				return new RgbColor(10, 20, 30);
			},
			set value(assignedValue: unknown | undefined) {
				lastAssignedValue = assignedValue;
			},
			entityContext: {} as unknown as IEntityContext<RgbColor>,
		};

		await TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [ColorPickerComponent],
			providers: [{ provide: ControlContextInjectionToken, useValue: ctlCtx }],
		}).compileComponents();

		fixture = TestBed.createComponent(ColorPickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('test get value for checck RgbaValue condition', () => {
		component.controlContext.format = ColorFormat.RgbaValue;
		expect(component.value).not.toBeUndefined();
	});

	it('test get value for checck ArgbValue condition ', () => {
		component.controlContext.format = ColorFormat.ArgbValue;
		expect(component.value).not.toBeUndefined();
	});

	it('test set value for RgbColor', () => {
		component.controlContext.format = ColorFormat.RgbColor;
		component.value = '#FF00AA';
		expect(component.value).not.toBeUndefined();
	});

	it('test set value for RgbaValue', () => {
		component.controlContext.format = ColorFormat.RgbaValue;
		component.value = '#FF00AA';
		expect(component.value).not.toBeUndefined();
	});

	it('test set value for ArgbValue', () => {
		component.controlContext.format = ColorFormat.ArgbValue;
		component.value = '#FF00AA';
		expect(component.value).not.toBeUndefined();
	});

	it('test set value for else undefined', () => {
		component.controlContext.format = ColorFormat.ArgbValue;
		component.value = '';
		expect(component.value).not.toBeUndefined();
	});

	it('test set value for else undefined', () => {
		component.controlContext.format = ColorFormat.ArgbValue;
		component.value = '';
		expect(component.value).not.toBeUndefined();
	});

	it('test get value for checck undefined condition', () => {
		component.controlContext.value = undefined;
		expect(component.value).not.toBeUndefined();
	});

	it('test clearClolor function', () => {
		component.clearColor();
	});
});
