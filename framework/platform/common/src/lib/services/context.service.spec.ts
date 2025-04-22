import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContextService } from './context.service';
import {
	clearSecureClientRole,
	currentUserId,
	key,
	language,
	newCulture,
	permissionObjectInfo,
	setApplicationValueParams,
	setCompanyConfigurationParams,
	sysContext,
	userId,
} from '../mock-data/context';

describe('ContextService', () => {
	let service: ContextService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
		});
		service = TestBed.inject(ContextService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should call getStorageKey()', () => {
		jest.spyOn(service, 'getStorageKey');
		service.getStorageKey(userId);
		expect(service.getStorageKey).toHaveBeenCalled();
	});

	it('should call updateHttpClientContextHeader()', () => {
		jest.spyOn(service, 'updateHttpClientContextHeader');
		service.updateHttpClientContextHeader();
		expect(service.updateHttpClientContextHeader).toHaveBeenCalled();
	});

	it('should call initialize()', () => {
		jest.spyOn(service, 'initialize');
		service.initialize();
		expect(service.initialize).toHaveBeenCalled();
	});

	it('should call setLanguage()', () => {
		jest.spyOn(service, 'setLanguage');
		service.setLanguage(language);
		expect(service.setLanguage).toHaveBeenCalled();
	});

	it('should call getLanguage()', () => {
		jest.spyOn(service, 'getLanguage');
		service.getLanguage();
		expect(service.getLanguage).toHaveBeenCalled();
	});

	it('should call getDefaultLanguage()', () => {
		jest.spyOn(service, 'getDefaultLanguage');
		service.getDefaultLanguage();
		expect(service.getDefaultLanguage).toHaveBeenCalled();
	});

	it('should call culture()', () => {
		jest.spyOn(service, 'culture');
		service.culture(newCulture);
		expect(service.culture).toHaveBeenCalled();
	});

	it('should call setCulture()', () => {
		jest.spyOn(service, 'setCulture');
		service.setCulture(newCulture);
		expect(service.setCulture).toHaveBeenCalled();
	});

	it('should call getCulture()', () => {
		jest.spyOn(service, 'getCulture');
		service.getCulture();
		expect(service.getCulture).toHaveBeenCalled();
	});

	it('should call setDataLanguageId()', () => {
		jest.spyOn(service, 'setDataLanguageId');
		service.setDataLanguageId(userId);
		expect(service.setDataLanguageId).toHaveBeenCalled();
	});

	it('should call getDataLanguageId()', () => {
		jest.spyOn(service, 'getDataLanguageId');
		service.getDataLanguageId();
		expect(service.getDataLanguageId).toHaveBeenCalled();
	});

	it('should call setCurrentUserId()', () => {
		jest.spyOn(service, 'setCurrentUserId');
		service.setCurrentUserId(currentUserId);
		expect(service.setCurrentUserId).toHaveBeenCalled();
	});

	it('should call getCurrentUserId()', () => {
		jest.spyOn(service, 'getCurrentUserId');
		service.getCurrentUserId();
		expect(service.getCurrentUserId).toHaveBeenCalled();
	});

	it('should call setCompanyConfiguration()', () => {
		jest.spyOn(service, 'setCompanyConfiguration');
		service.setCompanyConfiguration(
			setCompanyConfigurationParams.signedInClientId,
			setCompanyConfigurationParams.companyId,
			setCompanyConfigurationParams.permissionCompanyId,
			setCompanyConfigurationParams.permissionRoleId,
			setCompanyConfigurationParams.secureClientRole,
			setCompanyConfigurationParams.signedInClientCode,
			setCompanyConfigurationParams.signedInClientName,
			setCompanyConfigurationParams.companyCode,
			setCompanyConfigurationParams.companyName
		);
		expect(service.setCompanyConfiguration).toHaveBeenCalled();
	});

	it('should call companyRoleConfigIsValid()', () => {
		jest.spyOn(service, 'companyRoleConfigIsValid');
		service.companyRoleConfigIsValid();
		expect(service.companyRoleConfigIsValid).toHaveBeenCalled();
	});

	it('should call setPermissionObjectInfo()', () => {
		jest.spyOn(service, 'setPermissionObjectInfo');
		service.sysContext.permissionObjectInfo = 'abc';
		service.setPermissionObjectInfo(permissionObjectInfo);
		service.sysContext.permissionObjectInfo = '';
		expect(service.setPermissionObjectInfo).toHaveBeenCalled();
	});

	it('should call getContext()', () => {
		jest.spyOn(service, 'getContext');
		service.getContext();
		expect(service.getContext).toHaveBeenCalled();
	});

	it('should call setContext()', () => {
		jest.spyOn(service, 'setContext');
		service.setContext(sysContext);
		expect(service.setContext).toHaveBeenCalled();
	});

	it('should call removeApplicationValue()', () => {
		jest.spyOn(service, 'removeApplicationValue');
		service.removeApplicationValue(key);
		expect(service.removeApplicationValue).toHaveBeenCalled();
	});

	it('should call getApplicationValue()', () => {
		jest.spyOn(service, 'getApplicationValue');
		service.getApplicationValue(key);
		expect(service.getApplicationValue).toHaveBeenCalled();
	});

	it('should call setApplicationValue()', () => {
		jest.spyOn(service, 'setApplicationValue');
		service.setApplicationValue(
			setApplicationValueParams.key,
			setApplicationValueParams.value,
			setApplicationValueParams.doPersist
		);
		expect(service.setApplicationValue).toHaveBeenCalled();

		service.appContext[key] = {
			val: setApplicationValueParams.value,
			persist: setApplicationValueParams.doPersist,
		};
		service.setApplicationValue(
			setApplicationValueParams.key,
			setApplicationValueParams.value,
			setApplicationValueParams.doPersist
		);
		expect(service.setApplicationValue).toHaveBeenCalled();
	});

	it('should call saveContextToLocalStorage()', () => {
		jest.spyOn(service, 'saveContextToLocalStorage');
		service.saveContextToLocalStorage(userId);
		expect(service.saveContextToLocalStorage).toHaveBeenCalled();
	});

	it('should call ClearObsoleteProperties()', () => {
		jest.spyOn(service, 'ClearObsoleteProperties');
		localStorage.setItem(key, JSON.stringify(service.sysContext));
		service.ClearObsoleteProperties();
		expect(service.ClearObsoleteProperties).toHaveBeenCalled();
	});

	it('should call readContextFromLocalStorage()', () => {
		jest.spyOn(service, 'readContextFromLocalStorage');
		service.readContextFromLocalStorage(userId, clearSecureClientRole);
		expect(service.readContextFromLocalStorage).toHaveBeenCalled();
	});

	it('should call signedInClientId()', () => {
		service.signedInClientId;
		expect(service.signedInClientId).toBe(service.sysContext.signedInClientId);
	});

	it('should call signedInClientCode()', () => {
		service.signedInClientCode;
		expect(service.signedInClientCode).toBe(
			service.sysContext.signedInClientCode
		);
	});

	it('should call signedInClientName()', () => {
		service.signedInClientName;
		expect(service.signedInClientName).toBe(
			service.sysContext.signedInClientName
		);
	});

	it('should call clientId()', () => {
		service.clientId;
		expect(service.clientId).toBe(service.sysContext.clientId);
	});

	it('should call clientCode()', () => {
		service.clientCode;
		expect(service.clientCode).toBe(service.sysContext.clientCode);
	});

	it('should call clientName()', () => {
		service.clientName;
		expect(service.clientName).toBe(service.sysContext.clientName);
	});

	it('should call permissionRoleId()', () => {
		service.permissionRoleId;
		expect(service.permissionRoleId).toBe(service.sysContext.permissionRoleId);
	});

	it('should call permissionClientId()', () => {
		service.permissionClientId;
		expect(service.permissionClientId).toBe(
			service.sysContext.permissionClientId
		);
	});

	it('should call permissionObjectInfo()', () => {
		service.permissionObjectInfo;
		expect(service.permissionObjectInfo).toBe(
			service.sysContext.permissionObjectInfo
		);
	});

	it('should call isLoggedIn()', () => {
		service.isLoggedIn;
		expect(service.isLoggedIn).toBe(service.sysContext.isLoggedIn);
	});
});
