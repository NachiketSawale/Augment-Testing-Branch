/*
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CustomTranslateService } from './custom-translate.service';

import { ITranslationInitData, ITranslationChangeData } from '../../model/fields';

import { ICustomTranslateControlInfo } from '../model/custom-translate/custom-translate-control-info.interface';

const webApiBaseUrl: string = 'https://apps-int.itwo40.eu/itwo40/daily/services/';

const info = {
	cacheEnabled: false,
	changeValue: {
		setValue: function (value: string, info?: ICustomTranslateControlInfo | undefined): void {
			console.log(value, info);
		},
		updateValue: function (info?: ICustomTranslateControlInfo | undefined): void {
			console.log(info);
		},
	},
};

const infoWithCacheEnabled = {
	cacheEnabled: true,
	changeValue: {
		setValue: function (value: string, info?: ICustomTranslateControlInfo | undefined): void {
			console.log(value, info);
		},
		updateValue: function (info?: ICustomTranslateControlInfo | undefined): void {
			console.log(info);
		},
	},
};

const options = {
	section: 'testSection',
	id: 'testId',
	name: 'testName',
	onInitiated: (info: ITranslationInitData) => {
		console.log(info);
	},
	onTranslationChanged: (info: ITranslationChangeData) => {
		console.log(info);
	},
	cacheEnabled: false,
};

const optionsWithStructure = {
	section: 'testSection',
	id: 'testId',
	name: 'testName',
	structure: 'testStructure',
	onInitiated: (info: ITranslationInitData) => {
		console.log(info);
	},
	onTranslationChanged: (info: ITranslationChangeData) => {
		console.log(info);
	},
	cacheEnabled: false,
};

describe('CustomTranslateService', () => {
	let httpTestingController: HttpTestingController;
	let service: CustomTranslateService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
		});
		service = TestBed.inject(CustomTranslateService);
		httpTestingController = TestBed.get(HttpTestingController);
	});
	afterEach(() => {
		httpTestingController.verify();
	});

	it('createTranslationKey function should return key prepared', () => {
		let key = service.createTranslationKey(options);
		expect(key).toBe('$cust.testSection.testId.testName');

		key = service.createTranslationKey(optionsWithStructure);
		expect(key).toBe('$cust.testSection.testId.testStructure.testName');
	});

	it('Check if loadTranslationFromServer$ returns Translation data', () => {
		const key = '$cust.testSection.testId.testName';
		const culture = 'en';
		const responseData = 'ribdemo';
		service['loadTranslationFromServer$'](key, culture).subscribe((response) => {
			expect(response).toBe(responseData);
		});
		const req = httpTestingController.expectOne({
			method: 'GET',
			url: webApiBaseUrl + `cloud/translation/custom/load?translationKey=${key}&culture=${culture}`,
		});

		req.flush(responseData);
	});

	it('check if loadTranslation$ returns the Translation data when cacheEnebled is false', () => {
		const key = '$cust.testSection.testId.testName';
		const culture = 'en';
		const responseData = { data: 'ribdemo' };

		service.registerControl(key, info, undefined);

		service['loadTranslation$'](key, culture, false).subscribe((response) => {
			expect(response).toBe(responseData);
		});
		const req = httpTestingController.expectOne({
			method: 'GET',
			url: webApiBaseUrl + `cloud/translation/custom/load?translationKey=${key}&culture=${culture}`,
		});

		req.flush(responseData);
	});

	it('check if loadTranslation$ returns the Translation data when cacheEnebled is true', () => {
		const key = '$cust.testSection.testId.testName';
		const culture = 'en';
		const responseData = { data: 'ribdemo' };

		service.registerControl(key, infoWithCacheEnabled, undefined);

		service['loadTranslation$'](key, culture, false).subscribe((response) => {
			expect(response).toBe(responseData);
		});

		const req = httpTestingController.expectOne({
			method: 'GET',
			url: webApiBaseUrl + `cloud/translation/custom/loadlist?translationKey=${key}`,
		});

		req.flush(responseData);
	});

	it('check if loadTranslation$ returns the Translation data when cacheEnebled is true and data is cached already', () => {
		const key = '$cust.testSection.testId.testName';
		const responseData = { data: 'ribdemo' };

		service.registerControl(key, infoWithCacheEnabled, responseData);

		service['loadTranslation$'](key).subscribe((response) => {
			expect(response).toBe(responseData);
		});
	});

	it('Check if loadTranslationsFromServer$ returns Translation data', () => {
		const key = '$cust.testSection.testId.testName';
		const responseData = {
			en: 'ribdemo',
			de: 'nein',
		};
		service['loadTranslationsFromServer$'](key).subscribe((response) => {
			expect(response).toBe(responseData);
		});
		const req = httpTestingController.expectOne({
			method: 'GET',
			url: webApiBaseUrl + `cloud/translation/custom/loadlist?translationKey=${key}`,
		});

		req.flush(responseData);
	});

	it('check if loadTranslations$ returns the Translation data when cacheEnabled is false', () => {
		const key = '$cust.testSection.testId.testName';
		const responseData = { data: { en: 'rib', de: 'winjit' } };

		service.registerControl(key, info, undefined);

		service['loadTranslations$'](key).subscribe((response) => {
			expect(response).toBe(responseData);
		});

		const req = httpTestingController.expectOne({
			method: 'GET',
			url: webApiBaseUrl + `cloud/translation/custom/loadlist?translationKey=${key}`,
		});

		req.flush(responseData);
	});

	it('check if loadTranslation$ returns the Translation data when cacheEnebled is true', () => {
		const key = '$cust.testSection.testId.testName';
		const responseData = { data: { en: 'rib', de: 'winjit' } };

		service.registerControl(key, infoWithCacheEnabled, undefined);

		service['loadTranslations$'](key).subscribe((response) => {
			expect(response).toBe(responseData);
		});

		const req = httpTestingController.expectOne({
			method: 'GET',
			url: webApiBaseUrl + `cloud/translation/custom/loadlist?translationKey=${key}`,
		});

		req.flush(responseData);
	});

	it('check if loadTranslation$ returns the Translation data when cacheEnebled is true and data is cached already', () => {
		const key = '$cust.testSection.testId.testName';
		const responseData = { data: 'ribdemo' };

		service.registerControl(key, infoWithCacheEnabled, { en: 'rib', de: 'winjit' });

		service['loadTranslations$'](key).subscribe((response) => {
			expect(response).toBe(responseData);
		});
	});

	it('check if saveTranslationToServer$ saves data to server', () => {
		const key = '$cust.testSection.testId.testName';
		const translation = 'demo';
		const culture = 'en';

		const responseData = null;

		service['saveTranslationToServer$'](key, translation, culture).subscribe((response) => {
			expect(response).toBeNull;
		});

		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/save?translationKey=${key}&translation=${translation}&culture=${culture}`,
		});

		req.flush(responseData);
	});

	it('Check if saveTranslation$ saves the data when cache enebled is false', () => {
		const key = '$cust.testSection.testId.testName';
		const translation = 'demo';
		const culture = 'en';

		const responseData = null;
		service.registerControl(key, info, { en: 'rib', de: 'winjit' });
		service['saveTranslation$'](key, translation, culture).subscribe((response) => {
			expect(response).toBeNull;
		});

		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/save?translationKey=${key}&translation=${translation}&culture=${culture}`,
		});

		req.flush(responseData);
	});

	it('Check if saveTranslation$ saves the data when cache enabled is true', () => {
		const key = '$cust.testSection.testId.testName';
		const translation = 'demo';

		service.registerControl(key, infoWithCacheEnabled);
		service['saveTranslation$'](key, translation).subscribe((response) => {
			expect(response).toBeNull;
		});
	});

	it('check if saveTranslationsToServer$ saves data to server', () => {
		const key = '$cust.testSection.testId.testName';
		const translation = { en: 'demo', de: 'nein' };

		const responseData = null;

		service['saveTranslationsToServer$'](key, translation).subscribe((response) => {
			expect(response).toBeNull;
		});

		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + 'cloud/translation/custom/savelist',
		});

		req.flush(responseData);
	});

	it('Check if saveTranslations$ saves the data when cache enebled is false', () => {
		const key = '$cust.testSection.testId.testName';
		const translation = { en: 'demo', de: 'nein' };

		const responseData = null;
		service.registerControl(key, info);
		service['saveTranslations$'](key, translation).subscribe((response) => {
			expect(response).toBeNull;
		});

		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + 'cloud/translation/custom/savelist',
		});

		req.flush(responseData);
	});

	it('Check if saveTranslations$ saves the data when cache enabled is true', () => {
		const key = '$cust.testSection.testId.testName';
		const translation = { en: 'demo', de: 'nein' };

		service.registerControl(key, infoWithCacheEnabled);
		service['saveTranslations$'](key, translation).subscribe((response) => {
			expect(response).toBeNull;
		});
	});

	it('Check if writeCachedData$ saves the data', () => {
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, infoWithCacheEnabled, undefined, true);
		service.writeCachedData$(key).subscribe((response) => {
			expect(response).toBeUndefined;
		});

		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + 'cloud/translation/custom/savelists',
		});

		req.flush(null);
	});

	it('Check if writeCachedData$ saves the data', () => {
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, infoWithCacheEnabled, undefined, true);
		service.writeCachedData$('$cust.testSection.testId.testNameNew').subscribe((response) => {
			expect(response).toBeUndefined;
		});
	});

	it('Check if writeCachedData$ saves the data', () => {
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, infoWithCacheEnabled, undefined, true);
		service.writeCachedData$('').subscribe((response) => {
			expect(response).toBeUndefined;
		});
		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + 'cloud/translation/custom/savelists',
		});

		req.flush(null);
	});

	it('Check if deleteTranslationByKeyToServer$ deletes the translation', () => {
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, infoWithCacheEnabled, undefined, true);
		service['deleteTranslationByKeyToServer$'](key).subscribe((response) => {
			expect(response).toBeNull;
		});
		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/deletetranslationbykey?translationKey=${key}`,
		});

		req.flush(null);
	});

	it('Check if deleteTranslationByKey$ deletes the translation when cache enabled false', () => {
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, infoWithCacheEnabled, { en: 'demo' }, true);
		service['deleteTranslationByKey$'](key).subscribe((response) => {
			expect(response).toBeNull;
		});
	});

	it('Check if deleteTranslationByKey$ deletes the translation when cache enabled', () => {
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, info, { en: 'demo' }, true);
		service['deleteTranslationByKey$'](key).subscribe((response) => {
			expect(response).toBeNull;
		});

		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/deletetranslationbykey?translationKey=${key}`,
		});

		req.flush(null);
	});

	it('deleteTranslationFilesByKey$', () => {
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, info, { en: 'demo' }, true);
		const section = 'testSection';
		const id = 'testId';
		const responseData = {
			section: 'testSection',
			id: 'testId',
		};

		service['deleteTranslationFilesByKey$'](key).subscribe((response) => {
			expect(response).toBe(true);
		});

		const req = httpTestingController.expectOne({
			method: 'GET',
			url: webApiBaseUrl + `cloud/translation/custom/gettranslationkeyparts?translationKey=${key}`,
		});

		req.flush(responseData);

		const req1 = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/deletetranslationsbyid?section=${section}&id=${id}`,
		});

		req1.flush(true);
	});

	it('Check if deleteTranslationFilesByIdToServer$ deletes the files', () => {
		const section = 'testSection';
		const id = 'testId';

		service['deleteTranslationFilesByIdToServer$'](section, id).subscribe((response) => {
			expect(response).toBe(true);
		});
		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/deletetranslationsbyid?section=${section}&id=${id}`,
		});

		req.flush(true);
	});

	it('Check if deleteTranslationFilesById$ deletes the files', () => {
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, info, { en: 'demo' }, true);
		const section = 'testSection';
		const id = 'testId';

		service['deleteTranslationFilesById$'](section, id).subscribe((response) => {
			expect(response).toBe(true);
		});
		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/deletetranslationsbyid?section=${section}&id=${id}`,
		});

		req.flush(true);
	});

	it('Check if deleteTranslationFilesById$ deletes the files when key differ', () => {
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, info, { en: 'demo' }, true);
		const section = 'testSection1';
		const id = 'testId';

		service['deleteTranslationFilesById$'](section, id).subscribe((response) => {
			expect(response).toBe(true);
		});
		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/deletetranslationsbyid?section=${section}&id=${id}`,
		});

		req.flush(true);
	});

	it('Check if deleteTranslationFilesById$ deletes the files when result false', () => {
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, info, { en: 'demo' }, true);
		const section = 'testSection1';
		const id = 'testId';

		service['deleteTranslationFilesById$'](section, id).subscribe((response) => {
			expect(response).toBe(true);
		});
		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/deletetranslationsbyid?section=${section}&id=${id}`,
		});

		req.flush(false);
	});
	it('check if getTranslationKeyParts$ returns the part', () => {
		const key = '$cust.testSection.testId.testName';
		const responseData = {
			section: 'testSection',
			id: 'testId',
		};

		service['getTranslationKeyParts$'](key).subscribe((response) => {
			expect(response).toBe(responseData);
		});

		const req = httpTestingController.expectOne({
			method: 'GET',
			url: webApiBaseUrl + `cloud/translation/custom/gettranslationkeyparts?translationKey=${key}`,
		});

		req.flush(responseData);
	});

	it('check if changeTranslationIdToServer$ changes the translation id to server', () => {
		const section = 'testSection';
		const oldId = 'testId';
		const newId = 'testIdNew';

		service['changeTranslationIdToServer$'](section, oldId, newId).subscribe((response) => {
			expect(response).toBe(true);
		});

		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/renametranslationid?section=${section}&oldId=${oldId}&newId=${newId}`,
		});

		req.flush(true);
	});

	it('check if changeTranslationId$ changes the translation id', () => {
		const section = 'testSection';
		const oldId = 'testId';
		const newId = 'testIdNew';
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, info, { en: 'demo' }, true);

		service['changeTranslationId$'](section, oldId, newId).subscribe((response) => {
			expect(response).toBe(true);
		});

		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/renametranslationid?section=${section}&oldId=${oldId}&newId=${newId}`,
		});

		req.flush(true);
	});

	it('check if changeTranslationId$ changes the translation id', () => {
		const section = 'testSection1';
		const oldId = 'testId';
		const newId = 'testIdNew';
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, info, { en: 'demo' }, true);

		service['changeTranslationId$'](section, oldId, newId).subscribe((response) => {
			expect(response).toBe(true);
		});

		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/renametranslationid?section=${section}&oldId=${oldId}&newId=${newId}`,
		});

		req.flush(true);
	});

	it('check if changeTranslationId$ changes the translation id', () => {
		const section = 'testSection1';
		const oldId = 'testId';
		const newId = 'testIdNew';
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, info, { en: 'demo' }, true);

		service['changeTranslationId$'](section, oldId, newId).subscribe((response) => {
			expect(response).toBe(true);
		});

		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/renametranslationid?section=${section}&oldId=${oldId}&newId=${newId}`,
		});

		req.flush(false);
	});

	it('check if duplicateTranslationIdToServer$ duplicates the translation id to server', () => {
		const section = 'testSection';
		const oldId = 'testId';
		const newId = 'testIdNew';

		service['duplicateTranslationIdToServer$'](section, oldId, newId).subscribe((response) => {
			expect(response).toBe(true);
		});

		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/duplicatetranslationid?section=${section}&oldId=${oldId}&newId=${newId}`,
		});

		req.flush(true);
	});

	it('check if duplicateTranslationId$ duplicate the translation id', () => {
		const section = 'testSection';
		const oldId = 'testId';
		const newId = 'testIdNew';
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, info, { en: 'demo' }, true);

		service['duplicateTranslationId$'](section, oldId, newId).subscribe((response) => {
			expect(response).toBe(true);
		});

		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/duplicatetranslationid?section=${section}&oldId=${oldId}&newId=${newId}`,
		});

		req.flush(true);
	});

	it('check if duplicateTranslationId$ duplicate the translation id', () => {
		const section = 'testSection1';
		const oldId = 'testId';
		const newId = 'testIdNew';
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, info, { en: 'demo' }, true);

		service['duplicateTranslationId$'](section, oldId, newId).subscribe((response) => {
			expect(response).toBe(true);
		});

		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/duplicatetranslationid?section=${section}&oldId=${oldId}&newId=${newId}`,
		});

		req.flush(true);
	});

	it('check if duplicateTranslationId$ duplicate the translation id', () => {
		const section = 'testSection1';
		const oldId = 'testId';
		const newId = 'testIdNew';
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, info, { en: 'demo' }, true);

		service['duplicateTranslationId$'](section, oldId, newId).subscribe((response) => {
			expect(response).toBe(true);
		});

		const req = httpTestingController.expectOne({
			method: 'POST',
			url: webApiBaseUrl + `cloud/translation/custom/duplicatetranslationid?section=${section}&oldId=${oldId}&newId=${newId}`,
		});

		req.flush(false);
	});

	it('check if load section returns the result', () => {
		const section = 'testSection';

		service.loadSection$(section).subscribe((response) => {
			expect(response).toBeTruthy;
		});

		const req = httpTestingController.expectOne({
			method: 'GET',
			url: webApiBaseUrl + `cloud/translation/custom/loadsection?section=${section}`,
		});

		req.flush(true);
	});

	it('check if unregister control unregisters the control', () => {
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, info, { en: 'demo' }, true);
		service.unregisterControl(key);
		expect(service['registeredControls']).toStrictEqual([]);
	});

	it('check if update control updates the value', () => {
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, info, { en: 'demo' }, true);
		service.updateControl(key, info);
	});

	it('check if set control sets the value', () => {
		const key = '$cust.testSection.testId.testName';
		service.registerControl(key, info, { en: 'demo' }, true);
		service.setControlValue(key, 'new', info);
	});

	it('check if get control by key throws error', () => {
		const key = '$cust.testSection.testId.testName';
		try {
			service['getControlByKey'](key);
		} catch (ex) {
			console.log(ex);
		}
	});

	it('check if getTranslationPrefix returns the prefix', () => {
		const prefix = service.getTranslationPrefix();
		expect(prefix).toBe('$cust');
	});
});
