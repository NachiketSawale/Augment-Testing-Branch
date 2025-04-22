/*
 * Copyright(c) RIB Software GmbH
 */
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CustomTranslateComponent } from './custom-translate.component';

import { ControlContextInjectionToken } from '../../model/control-context.interface';

import { ITranslationChangeData, ITranslationInitData } from '../../../model/fields';
import { ICustomTranslateControlContext } from '../../model/custom-translate/custom-translate-control-context.interface';
import {IEntityContext, MinimalEntityContext} from '@libs/platform/common';


const webApiBaseUrl: string = 'https://apps-int.itwo40.eu/itwo40/daily/services/';

const options = {
	section: 'testSection',
	id: 'testId',
	name: 'testName',
	structure: 'testStructure',
	onInitiated: (info: ITranslationInitData) => {
		expect(info).toBeTruthy;
	},
	onTranslationChanged: (info: ITranslationChangeData) => {
		expect(info).toBeTruthy;
	},
	cacheEnabled: false,
	watchId: true,
	watchStructure: true,
};

describe('CustomTranslateComponent', () => {
	let component: CustomTranslateComponent;
	let fixture: ComponentFixture<CustomTranslateComponent>;
	let httpTestingController: HttpTestingController;
	let cultureLan: string;

	beforeEach(async () => {
		const ctlCtx: ICustomTranslateControlContext = {
			fieldId: 'Code',
			readonly: false,
			validationResults: [],
			options: options,
			get entityContext(): IEntityContext<object> {
				return new MinimalEntityContext();
			}
		};
		await TestBed.configureTestingModule({
			imports: [FormsModule, HttpClientModule, HttpClientTestingModule,MatDialogModule],
			declarations: [CustomTranslateComponent],
			providers: [{ provide: ControlContextInjectionToken, useValue: ctlCtx }],
		}).compileComponents();

		httpTestingController = TestBed.get(HttpTestingController);
		fixture = TestBed.createComponent(CustomTranslateComponent);
		component = fixture.componentInstance;
		cultureLan = component['configurationService'].savedOrDefaultUiCulture;
		fixture.detectChanges();
	});

	beforeEach(() => {
		const key = '$cust.testSection.testId.testStructure.testName';
		const responseData = 'ribdemo';
		const req = httpTestingController.expectOne({
			method: 'GET',
			url: webApiBaseUrl + `cloud/translation/custom/load?translationKey=${key}&culture=${cultureLan}`,
		});

		req.flush(responseData);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('check if init watch properly subscribes to the watches', () => {
		component['options'].id = 'demo';
		component['customTranslateService'].idChange$.next('');
	});

	it('check if init watch properly subscribes to the watches', () => {
		component['options'].structure = 'demo';
		component['customTranslateService'].structureChange$.next('');
	});

	it('check if onTranslationChanged function saves the data', () => {
		const key = '$cust.testSection.testId.testStructure.testName';
		component['languageKey'] = key;
		const translation = 'demo';
		component.value = translation;
		component['currentControlValue'] = 'olddemo';

		component['onTranslationChanged']();
		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/save?translationKey=${key}&translation=${translation}&culture=${cultureLan}`,
		});

		req.flush(null);
	});

	it('check if clearLanguage function clears the data', () => {
		const key = '$cust.testSection.testId.testStructure.testName';
		component.clearLanguage();
		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/deletetranslationbykey?translationKey=${key}`,
		});

		req.flush(null);
	});
	it('check if clearLanguage function clears the data and value is same as prev', () => {
		const key = '$cust.testSection.testId.testStructure.testName';
		component.value = '';
		component.clearLanguage();
		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/deletetranslationbykey?translationKey=${key}`,
		});

		req.flush(null);
	});

	it('check if controlSetValue sets the value', () => {
		const key = '$cust.testSection.testId.testStructure.testName';
		const val = 'demoValue';
		component['controlSetValue']('demoValue');
		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/save?translationKey=${key}&translation=${val}&culture=${cultureLan}`,
		});

		req.flush(null);
	});

	it('check if controlSetValue sets the value', () => {
		const val = 'demoValue';
		component.value = val;
		component['controlSetValue'](val);
	});

	it('check if controlUpdateValue gets called', () => {
		const key = '$cust.testSection.testId.testStructure.testName';
		component['languageKey'] = key;

		component['controlUpdateValue']();
		const responseData = 'ribdemo';
		const req = httpTestingController.expectOne({
			method: 'GET',
			url: webApiBaseUrl + `cloud/translation/custom/load?translationKey=${key}&culture=${cultureLan}`,
		});

		req.flush(responseData);
	});

	it('check if onKeyup gets called', () => {
		const event = {
			preventDefault: () => {},
			stopPropagation: () => {},
			code: 'Space',
			target: {
				classList: {
					toggle: (val: string) => {
						expect(val).toBe('active');
					},
				},
			} as HTMLElement,
		} as unknown as KeyboardEvent;
		component.onKeyUp(event);
	});
	it('check if onKeydown gets called', () => {
		const event = {
			preventDefault: () => {},
			stopPropagation: () => {},
			code: 'Space',
			target: {
				classList: {
					toggle: (val: string) => {
						expect(val).toBe('active');
					},
				},
			} as HTMLElement,
		} as unknown as KeyboardEvent;
		component.onKeyDown(event);
	});
});
