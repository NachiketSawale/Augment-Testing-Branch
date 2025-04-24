/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { WebApiHelpMainHeaderComponent } from './webapihelp-main-header.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebApiHelpMainService } from '../../services/webapihelp-main.service';
import { of } from 'rxjs';

describe('WebApiHelpMainHeaderComponent', () => {
	let component: WebApiHelpMainHeaderComponent;
	let fixture: ComponentFixture<WebApiHelpMainHeaderComponent>;
	let webApiHelpService: WebApiHelpMainService;
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule, MatAutocompleteModule, FormsModule, ReactiveFormsModule],
			declarations: [WebApiHelpMainHeaderComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(WebApiHelpMainHeaderComponent);
		component = fixture.componentInstance;
		webApiHelpService = TestBed.inject(WebApiHelpMainService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('search', () => {
		jest.spyOn(component, 'search');
		component.search();
		expect(component.search).toBeDefined();
	});

	it('relaodFlag', () => {
		jest.spyOn(component, 'reloadbuttonEvent');
		component.reloadbuttonEvent();
		expect(component.reloadbuttonEvent).toBeDefined();
	});

	it('navigateToDownloadPage', () => {
		jest.spyOn(component, 'navigateToDownloadPage');
		component.navigateToDownloadPage();
		expect(component.navigateToDownloadPage).toBeDefined();
	});

	it('leftMenuSerachedValue', () => {
		component.leftMenuSerachedValue = '';
		expect(component.control.value).toEqual('');
	});

	it('debounceInputFiled', () => {
		jest.spyOn(component, 'debounceInputFiled');
		component.debounceInputFiled();
		expect(component.debounceInputFiled).toBeDefined();
	});

	it('inputChange', () => {
		jest.spyOn(component, 'inputChange');
		component.control.setValue('');
		fixture.detectChanges();
		component.inputChange();
		expect(component.inputChange).toBeDefined();
	});


	it('should debounce and call WebApiHelpService.searchData with distinct values', fakeAsync(() => {
		const control = component.control;
		const testData = ['result1', 'result2'];
		const spy = jest.spyOn(webApiHelpService, 'searchData').mockReturnValue(of(testData));
		const subspy = jest.spyOn(webApiHelpService.searchData(testData, 'input1'), 'subscribe');
		component.debounceInputFiled();
		control.setValue('input1');
		tick(500);
		control.setValue('input2');
		tick(500);
		tick(1500);
		expect(spy).toHaveBeenCalled();
		expect(subspy).toHaveBeenCalled();
	}));
});
