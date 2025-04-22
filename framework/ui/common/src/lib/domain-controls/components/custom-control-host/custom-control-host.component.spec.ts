import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomControlHostComponent } from './custom-control-host.component';
import {
	ControlContextInjectionToken,
} from '../../model/control-context.interface';
import {
	ICustomComponentControlContext
} from '../../model/custom-component-control-context.interface';
import { Component, inject, InjectionToken } from '@angular/core';
import {IEntityContext, MinimalEntityContext} from '@libs/platform/common';

describe('CustomControlHostComponent', () => {
	let component: CustomControlHostComponent;
	let fixture: ComponentFixture<CustomControlHostComponent>;

	@Component({
		template: '<div></div>'
	})
	class TestComponent {}

	beforeEach(async () => {
		const ctlCtx: ICustomComponentControlContext = {
			fieldId: 'Code',
			readonly: false,
			validationResults: [],
			componentType: TestComponent,
			get entityContext(): IEntityContext<object> {
				return new MinimalEntityContext();
			}
		};

		await TestBed.configureTestingModule({
			declarations: [CustomControlHostComponent],
			providers: [
				{provide: ControlContextInjectionToken, useValue: ctlCtx}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(CustomControlHostComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

describe('CustomControlHostComponent with custom injections', () => {
	let component: CustomControlHostComponent;
	let fixture: ComponentFixture<CustomControlHostComponent>;

	interface IInfo {
		text: string;
	}

	const info: IInfo = {
		text: 'abc'
	};

	const infoToken = new InjectionToken<IInfo>('injected-info');

	@Component({
		template: '<div></div>'
	})
	class TestComponent {

		public constructor() {
			this.info.text = 'xyz';
		}

		public readonly info = inject(infoToken);
	}

	beforeEach(async () => {
		const ctlCtx: ICustomComponentControlContext = {
			fieldId: 'Code',
			readonly: false,
			validationResults: [],
			componentType: TestComponent,
			providers: [{
				provide: infoToken,
				useValue: info
			}],
			get entityContext(): IEntityContext<object> {
				return new MinimalEntityContext();
			}
		};

		await TestBed.configureTestingModule({
			declarations: [CustomControlHostComponent],
			providers: [
				{provide: ControlContextInjectionToken, useValue: ctlCtx}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(CustomControlHostComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should inject custom value', () => {
		expect(info.text).toBe('xyz');
	});
});
