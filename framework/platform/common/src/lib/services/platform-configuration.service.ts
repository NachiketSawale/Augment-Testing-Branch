/*
 * Copyright (c) RIB Software GmbH
 */

import { EventEmitter, inject, Injectable } from '@angular/core';
import { JsonObject, JsonValue } from '@angular-devkit/core';
import { IAuthConfig } from '@libs/platform/authentication';
import { ICheckCompanyResponse } from '../model/company-role/check-company-response.interface';
import { map, Observable, of, Subject, take, tap } from 'rxjs';
import { IGetCompanyRole } from '../model/company-role/get-company-role.interface';
import { IGetUiDataLanguages } from '../model/ui-data-languages/get-ui-data-languages.interface';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IContextData } from '../model/context/context-init-data.interface';
import { ISwitchContextData } from '../model/context/switch-context-data.interface';
import { ISysContext } from '../model/context/sys-context.interface';
import { AppContextValue, IAppContext } from '../model/context/app-context.interface';
import { PlatformDateService } from './platform-date.service';
import { omitBy, compact, clone, isNil } from 'lodash';
import { PlatformKeyService } from './platform-key.service';

@Injectable({
	providedIn: 'root'
})
export class PlatformConfigurationService {

	// Globals --------------------------------------------------------
	private _appBaseUrl: string = '';
	private _webApiBaseUrl: string = 'https://apps-int.itwo40.eu/itwo40/daily/services/';
	private _clientUrl: string = '';
	private _reportingBaseUrl: string = '';
	private _identityBaseUrl: string = '';
	private _portalUrl: string = '';
	private _serverUrl: string = '';
	private _baseUrl: string = '';
	private _defaultState: string = 'app';
	private _isPortal: boolean = false;
	private _trace: object = {
		context: '',
	};
	private _acceptLanguages: string[] = ['en'];
	private _headerServerUrl: string = '';
	// ----------------------------------------------------------------

	// Configuration loading ------------------------------------------
	private configLoaded = false;
	private configuration: JsonObject = {};
	private readonly config_folder_relative_path = 'assets/config.json';
	// ----------------------------------------------------------------

	// Context related ------------------------------------------------
	private _loggedInUserId?: number;
	private secureContextRole?: string;
	private _uiLanguage?: string | null;
	private _uiCulture?: string | null;
	private _dataLanguage?: number | null;
	private readonly _defaultUiLanguage = 'en';
	private readonly _defaultUiCulture = 'en-gb';
	private readonly _defaultDataLanguageId = 1;
	private readonly _defaultUiLanguageId = 1;

	private readonly _sysContext: ISysContext;
	private readonly _defaultSysContext: ISysContext;
	private _appContext: IAppContext;

	private contextResult?: ICheckCompanyResponse = undefined;
	private readonly contextResult$: Subject<ICheckCompanyResponse> = new Subject<ICheckCompanyResponse>();
	// ----------------------------------------------------------------

	// Service urls ---------------------------------------------------
	private readonly checkCompanyUrl = 'basics/company/checkcompany';
	private readonly getUiDataLanguagesUrl = 'cloud/common/getuidatalanguages';
	private readonly getAssignedCompaniesWithRolesUrl = 'basics/company/getassignedcompanieswithroles';
	private readonly readMessagesUrl = 'infrastructure/message/readmessages';
	// ----------------------------------------------------------------

	public readonly contextChangeEmitter: EventEmitter<IContextData> = new EventEmitter<IContextData>();

	private readonly dateService = inject(PlatformDateService);
	private readonly httpClient = inject(HttpClient);
	private readonly platformKeyService = inject(PlatformKeyService);

	public constructor() {
		this._sysContext = {
			clientCode: '',
			clientId: 1,
			clientName: '',
			permissionClientId: 1,
			permissionObjectInfo: '',
			permissionRoleId: 1,
			signedInClientCode: '',
			signedInClientId: 1,
			signedInClientName: ''
		};

		this._defaultSysContext = {
			signedInClientId: 0,
			signedInClientCode: '',
			signedInClientName: '',
			clientId: 0,
			clientCode: '',
			clientName: '',
			permissionClientId: 0,
			permissionRoleId: 0,
			dataLanguageId: 1,
			language: null,
			culture: null,
			secureClientRole: undefined,
			permissionObjectInfo: ''
		};

		this._appContext = {
			sidebarUserSettings: {
				persist: false,
				val: {
					sidebarpin: {
						active: false,
						lastButtonId: ''
					}
				}
			},
			pinningContexts: {
				persist: true,
				val: []
			}
		};
		this.platformKeyService.registerKeyEvents();
	}

	private urlBuilder(): void {
		const dirs = compact(window.location.pathname.split('/'));

		if (dirs && dirs.length !== 0) {
			const idxFile = dirs[dirs.length - 1];

			if (idxFile && idxFile.indexOf('.html') > 0) {
				dirs.pop();
			}

			this._appBaseUrl = '/' + dirs.join('/') + '/';

			if (this._isPortal) {
				dirs.pop();
			}

			// in case of serverBaseUrl is defined in config.json we use this one.
			if (this.configLoaded) {
				this._webApiBaseUrl = this.getConfig('serverBaseUrl') as string;
				this._baseUrl = this._webApiBaseUrl.replace('/services/', '/');
			} else {
				dirs.pop();
				this._baseUrl = '/' + dirs.join('/') + '/';
				this._webApiBaseUrl = this._baseUrl + 'services/';
			}
		} else {
			// localhost ...
			this._appBaseUrl = '/';

			// in case of serverBaseUrl is defined in config.json we use this one.
			if (this.configLoaded) {
				this._webApiBaseUrl = this.getConfig('serverBaseUrl') as string;
				this._baseUrl = this._webApiBaseUrl.replace('/services/', '/');
			} else {
				this._baseUrl = '/';
				this._webApiBaseUrl = 'services/';
			}
		}

		this._reportingBaseUrl = this._baseUrl + 'reporting/';
		this._identityBaseUrl = this._baseUrl + 'identityservercore/core';
		this._clientUrl = window.location.origin + window.location.pathname;
		this._portalUrl = this._baseUrl + 'portal/start';
		this._serverUrl = this._baseUrl + 'services/';
	}

	/**
	 * URL of web-api endpoints
	 */
	public get webApiBaseUrl(): string {
		return this._webApiBaseUrl;
	}

	/**
	 * URL of running application
	 */
	public get appBaseUrl(): string {
		return this._appBaseUrl;
	}

	/**
	 * Base/root URL of installation
	 */
	public get baseUrl(): string {
		return this._baseUrl;
	}

	/**
	 * reportingBaseUrl
	 */
	public get reportingBaseUrl() {
		return this._reportingBaseUrl;
	}

	/**
	 * clientUrl
	 */
	public get clientUrl() {
		return this._clientUrl;
	}

	/**
	 * identityBaseUrl
	 */
	public get identityBaseUrl() {
		return this._identityBaseUrl;
	}

	/**
	 * portalUrl
	 */
	public get portalUrl() {
		return this._portalUrl;
	}

	/**
	 * serverUrl
	 */
	public get serverUrl() {
		return this._serverUrl;
	}

	/**
	 * defaultState
	 */
	public get defaultState() {
		return this._defaultState;
	}

	/**
	 * portal
	 */
	public get isPortal() {
		return this._isPortal;
	}

	/**
	 * trace
	 */
	public get trace() {
		return this._trace;
	}

	/**
	 * acceptLanguages
	 */
	public get acceptLanguages() {
		return this._acceptLanguages;
	}

	/**
	 * headerServerUrl
	 */
	public get headerServerUrl() {
		return this._headerServerUrl;
	}

	/***
	 * the return value (Promise) of this method is used as an APP_INITIALIZER,
	 * so the application's initialization will not complete until the Promise resolves.
	 */
	public loadInitialConfiguration(): Promise<JsonObject> {

		if (this.configLoaded) {
			return Promise.resolve(this.configuration);
		} else {
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open('GET', this.config_folder_relative_path);
				xhr.addEventListener('readystatechange', () => {
					if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
						this.configuration = JSON.parse(xhr.responseText);
						this.configLoaded = true;
						this.urlBuilder();
						resolve(this.configuration);
					} else if (xhr.readyState === XMLHttpRequest.DONE) {
						reject();
					}
				});
				xhr.send();
			});
		}
	}

	/**
	 * Gets the configuration using key
	 * @param key
	 */
	public getConfig(key: string): JsonValue {

		if (!this.configLoaded) {
			throw new Error('ConfigurationService.getConfig() - service has not finished loading the config. It should never occur.');
		}

		return this.configuration[key];
	}

	/**
	 * get the config part from config.json which is used for initializing the authentication module
	 */
	public getOidcUserConfig() {
		if (this.configLoaded) {
			const authConfig: IAuthConfig = {
				identityBaseUrl: this.getConfig('identityBaseUrl') as string,
				logLevel: this.getConfig('oidcLogLevel') as string
			};
			return authConfig;
		} else {
			return {};
		}
	}


	// Language related ------------------------------------------------------------------------------

	/***
	 * Gets the saved or default ui language
	 */
	public get savedOrDefaultUiLanguage() {
		return this._uiLanguage ?? this._defaultUiLanguage;
	}

	/***
	 * Gets the default ui language id
	 */
	public get defaultUiLanguageId() {
		return this._defaultUiLanguageId;
	}

	/***
	 * Gets the saved or default culture
	 */
	public get savedOrDefaultUiCulture() {
		return this._uiCulture ?? this._defaultUiCulture;
	}

	/***
	 * Gets the default culture
	 */
	public get defaultCulture() {
		return this._defaultUiCulture;
	}

	/***
	 * Gets the saved or default data language id
	 */
	public get savedOrDefaultDataLanguageId() {
		return this._dataLanguage ?? this._defaultDataLanguageId;
	}

	/***
	 * Gets the default data language id
	 */
	public get defaultDataLanguageId() {
		return this._defaultDataLanguageId;
	}

	// ---------------------------------------------------------------------------------------------


	/***
	 * Gets the latest company check result
	 */
	public get getContextResult(): ICheckCompanyResponse | undefined {
		return this.contextResult;
	}

	/***
	 * Notifies on context result set
	 */
	public getContextResult$(): Observable<ICheckCompanyResponse> {
		return this.contextResult$.asObservable().pipe(
			take(1)
		);
	}

	/***
	 * Gets the client-context object. it needs to be set as header to api calls
	 */
	public getContextHeader() {
		const ctxResult = this.getContextResult;
		if (ctxResult) {
			// client-context: {"dataLanguageId":1,"language":"en","culture":"en-gb","secureClientRole":"jc...g=="}
			const dataLanguageId = this.savedOrDefaultDataLanguageId;
			const language = this.savedOrDefaultUiLanguage;
			const culture = this.savedOrDefaultUiCulture;
			const secureClientRole = ctxResult.secureClientRolePart ?? null;
			return `{"dataLanguageId":${dataLanguageId},"language":"${language}","culture":"${culture}","secureClientRole":"${secureClientRole}"}`;
		}
		return null;
	}

	/**
	 * @ngdoc function
	 * @name getContext
	 * @function
	 * @description gets a copy of currently used context
	 * @returns {object} cloned content of internal state
	 */
	public getContext(): ISysContext {
		return clone(this._sysContext);
	}

	/***
	 * Context is initialized if the provided company info is valid.
	 * @param requestedContext
	 */
	public trySwitchCompany(requestedContext: ISwitchContextData): Observable<boolean> {
		const response = this.checkCompany(requestedContext.companyId, requestedContext.permissionClientId, requestedContext.roleId, requestedContext.signedInCompanyId);
		return response.pipe(
			map((result) => {
				if (result.isValid) {
					const uiLang = requestedContext.uiLanguage ?? this._defaultUiLanguage;
					const culture = requestedContext.culture ?? this._defaultUiCulture;
					const dataLanguage = requestedContext.dataLanguageId ?? this.defaultDataLanguageId;
					this.switchCompany(result, uiLang, culture, dataLanguage);
					return true;
				} else {
					return false;
				}
			})
		);
	}

	/**
	 * Checks if there is a context info present in the storage and the company info is still valid. If valid company found context is initialized
	 * returns false if no stored context or the company in stored context is invalid
	 */
	public trySwitchToSavedCompany(loggedInUserId: number): Observable<boolean> {
		this._loggedInUserId = loggedInUserId;
		const savedContext = this.readContextWithoutInitialization(this._loggedInUserId ?? 0);
		if (savedContext) {
			const systemContext = savedContext.sysContext;
			const contextSwitchData: ISwitchContextData = {
				companyId: systemContext.clientId ?? 0,
				permissionClientId: systemContext.permissionClientId ?? 0,
				roleId: systemContext.permissionRoleId ?? 0,
				signedInCompanyId: systemContext.signedInClientId ?? 0,
				uiLanguage: systemContext.language ?? this._defaultUiLanguage,
				culture: systemContext.culture ?? this._defaultUiCulture,
				dataLanguageId: systemContext.dataLanguageId ?? this.defaultDataLanguageId
			};
			return this.trySwitchCompany(contextSwitchData);
		} else {
			return of(false);
		}

	}

	private setSecureClientRole(result: ICheckCompanyResponse) {
		this.contextResult = result;
		this.contextResult$.next(this.contextResult);
		this.secureContextRole = result.secureClientRolePart;
	}

	private setLanguages(uiLanguage: string = 'en', uiCulture: string = 'en-gb', selectedDataLanguage: number = 0) {
		this._uiLanguage = uiLanguage;
		this._uiCulture = uiCulture;
		this._dataLanguage = selectedDataLanguage;
		this._sysContext.language = uiLanguage;
		this._sysContext.culture = uiCulture;
		this._sysContext.dataLanguageId = selectedDataLanguage;
	}

	private setSystemContext(result: ICheckCompanyResponse) {
		Object.assign(this._sysContext, this._defaultSysContext); // first set it to default
		this.setCompanyConfiguration(result.signedInCompanyId, result.companyId, result.requestedPermissionCompanyId, result.requestedRoleId, result.secureClientRolePart, result.signedInCompanyCode, result.signedInCompanyName);
	}

	private switchCompany(result: ICheckCompanyResponse, uiLang: string, culture: string, dataLanguage: number) {
		const contextInitData: IContextData = {
			checkCompanyResponse: result,
			language: uiLang,
			culture: culture,
			dataLanguageId: dataLanguage,
			userId: this._loggedInUserId ?? 0
		};
		this.initializeContext(contextInitData);
		this.saveContextToLocalStorage(this._loggedInUserId);
		this.configureDateService(culture);
		this.contextChangeEmitter.emit(contextInitData);
	}

	private initializeContext(contextInitData: IContextData) {
		this.setSystemContext(contextInitData.checkCompanyResponse);
		this.setApplicationContext();
		this.setSecureClientRole(contextInitData.checkCompanyResponse);
		this.setLanguages(contextInitData.language, contextInitData.culture, contextInitData.dataLanguageId);
	}

	private configureDateService(culture: string) {
		this.dateService.setLocale(culture);
	}

	private setCompanyConfiguration(
		signedInClientId: number | undefined,
		companyId: number | undefined,
		permissionCompanyId: number,
		permissionRoleId: number | undefined,
		secureClientRole: string | undefined,
		signedInClientCode?: string,
		signedInClientName?: string | undefined,
		companyCode?: string,
		companyName?: string | undefined
	): boolean {
		let changed = false;
		if (signedInClientId !== this._sysContext.signedInClientId) {
			this._sysContext.signedInClientId = signedInClientId;
			changed = true;
		}
		if (companyId !== this._sysContext.clientId) {
			this._sysContext.clientId = companyId;
			changed = true;
		}
		if (permissionCompanyId !== this._sysContext.permissionClientId) {
			this._sysContext.permissionClientId = permissionCompanyId;
			changed = true;
		}
		if (permissionRoleId !== this._sysContext.permissionRoleId) {
			this._sysContext.permissionRoleId = permissionRoleId;
			changed = true;
		}
		if (secureClientRole !== this._sysContext.secureClientRole) {
			this._sysContext.secureClientRole = secureClientRole; // ToDo: remove secureClientRole from sysContext. Use this._secureClientRole
			changed = true;
		}
		if (signedInClientCode !== this._sysContext.signedInClientCode) {
			this._sysContext.signedInClientCode = signedInClientCode || '';
			changed = true;
		}
		if (signedInClientName !== this._sysContext.signedInClientName) {
			this._sysContext.signedInClientName = signedInClientName;
			changed = true;
		}
		if (companyCode !== this._sysContext.clientCode) {
			this._sysContext.clientCode = companyCode || '';
			changed = true;
		}
		if (companyName !== this._sysContext.clientName) {
			this._sysContext.clientName = companyName;
			changed = true;
		}

		return changed;
	}


	/**
	 * @ngdoc function
	 * @name setPermissionObjectInfo
	 * @function
	 * @description sets object permission info
	 * @param {string} permissionObjectInfo
	 */
	public setPermissionObjectInfo(permissionObjectInfo: string | null): void {

		if (permissionObjectInfo === null) {
			permissionObjectInfo = '';
		}

		if (permissionObjectInfo !== this._sysContext.permissionObjectInfo) {
			this._sysContext.permissionObjectInfo = permissionObjectInfo;
			// update local storage now???
		}

	}


	/**
	 * @ngdoc function
	 * @name signedInClientId
	 * @function
	 * @description returns signedInClientId
	 * @returns {int, undefined}
	 */
	public get signedInClientId() {
		return this._sysContext.signedInClientId;
	}

	/**
	 * @ngdoc function
	 * @name signedInClientCode
	 * @function
	 * @description returns signedInClientCode
	 * @returns {string}
	 */
	public get signedInClientCode() {
		return this._sysContext.signedInClientCode;
	}

	/**
	 * @ngdoc function
	 * @name signedInClientName
	 * @function
	 * @description returns signedInClientName
	 * @returns {string, undefined}
	 */
	public get signedInClientName() {
		return this._sysContext.signedInClientName;
	}

	/**
	 * @ngdoc function
	 * @name clientId
	 * @function
	 * @description returns clientId
	 * @returns {number, undefined}
	 */
	public get clientId() {
		return this._sysContext.clientId;
	}

	/**
	 * @ngdoc function
	 * @name clientCode
	 * @function
	 * @description returns clientCode
	 * @returns {string}
	 */
	public get clientCode() {
		return this._sysContext.clientCode;
	}

	/**
	 * @ngdoc function
	 * @name clientName
	 * @function
	 * @description returns clientName
	 * @returns {string, undefined}
	 */
	public get clientName() {
		return this._sysContext.clientName;
	}

	/**
	 * @ngdoc function
	 * @name permissionRoleId
	 * @function
	 * @description returns permissionRoleId
	 * @returns {int, undefined}
	 */
	public get permissionRoleId() {
		return this._sysContext.permissionRoleId;
	}

	/**
	 * @ngdoc function
	 * @name permissionClientId
	 * @function
	 * @description returns permissionClientId
	 * @returns {int}
	 */
	public get permissionClientId() {
		return this._sysContext.permissionClientId;
	}

	/**
	 * @ngdoc function
	 * @name permissionObjectInfo
	 * @function
	 * @description returns permissionObjectInfo
	 * @returns {string}
	 */
	public get permissionObjectInfo() {
		return this._sysContext.permissionObjectInfo;
	}

	/**
	 * @ngdoc function
	 * @name isLoggedIn
	 * @function
	 * @description returns isLoggedIn
	 * @returns {boolean, undefined}
	 */
	public get isLoggedIn() {
		return this._sysContext.isLoggedIn;
	}

	/**
	 * @ngdoc function
	 * @name removeApplicationValue
	 * @function
	 * @description removes an application defined value
	 * @param {string} key  name of property to retrieve
	 * @returns {boolean} true if there was an item , false if not found
	 */
	public removeApplicationValue(key: string): boolean {
		if (Object.prototype.hasOwnProperty.call(this._appContext, key)) {
			delete this._appContext[key];
			this.saveContextToLocalStorage();
			return true;
		}
		return false;
	}

	/**
	 * @ngdoc function
	 * @name getApplicationValue
	 * @function
	 * @description gets an application defined value
	 * @param {string} key name of property to retrieve
	 * @returns {string , { [x: string]: string } , null , undefined} value of key or null
	 */
	public getApplicationValue(key: string): AppContextValue {
		if (typeof key === 'string' && Object.prototype.hasOwnProperty.call(this._appContext, key)) {
			return this._appContext[key as keyof IAppContext].val;
		}
		return null;
	}

	/**
	 * @ngdoc function
	 * @name setApplicationValue
	 * @function
	 * @description sets an application defined value
	 * @param {string} key key name of property to be inserted or updated
	 * @param {string , null , undefined} value application defined data
	 * @param {boolean} doPersist, save data into storage
	 */
	public setApplicationValue(key: string, value: AppContextValue, doPersist: boolean): void {
		if (value === undefined) {
			value = null;
		}
		if (!this._appContext[key] || this._appContext[key].val !== value) {
			this._appContext[key] = {val: value, persist: doPersist};
		}
		if(doPersist) {
			this.saveContextToLocalStorage();
		}
	}

	private getStorageKey(userId?: number): string {
		const theId = userId ? userId : this._loggedInUserId;
		return this.appBaseUrl + ':' + theId + '-ctx';
	}

	/**
	 * @ngdoc function
	 * @name saveContextToLocalStorage
	 * @function
	 * @description saves the context to local storage
	 * @param {int} userId  key name of property to be inserted or updated
	 */
	private saveContextToLocalStorage(userId?: number): void {
		// Put the object into storage
		const key = this.getStorageKey(userId);
		const appPersist = omitBy(this._appContext, function (a) {
			return a.persist !== true;
		});
		const mySysContext = this.getContext();
		const saveCtx = {sysContext: mySysContext, appContext: appPersist};
		localStorage.setItem(key, JSON.stringify(saveCtx));
	}

	private readContextWithoutInitialization(userId: number) {
		const key = this.getStorageKey(userId);
		const savedContext = localStorage.getItem(key);
		return (savedContext) ? JSON.parse(savedContext) : undefined;
	}

	/**
	 * Set appContext value
	 */
	private setApplicationContext() {
		if (this.loggedInUserId) {
			// Retrieve the object from storage
			const key = this.getStorageKey(this.loggedInUserId);

			const savedContext = localStorage.getItem(key);
			if (!isNil(savedContext)) {
				const myContext = JSON.parse(savedContext);
				this._appContext = myContext.appContext;
			}
		}
	}

	/**
	 * service call to get the assigned companies with roles
	 */
	public getCompaniesWithRoles(): Observable<IGetCompanyRole> {
		//const url = this.getConfig('serverBaseUrl') + "platform/getinfo";
		const url = this.getConfig('serverBaseUrl') + this.getAssignedCompaniesWithRolesUrl;
		return this.httpClient.get<IGetCompanyRole>(url).pipe(
			tap((response) => {
				return response;
			})
		);
	}

	/**
	 * service call to get the ui and data language
	 */
	public getUiDataLanguages(): Observable<IGetUiDataLanguages> {
		//const url = this.getConfig('serverBaseUrl') + "platform/getinfo";
		const url = this.getConfig('serverBaseUrl') + this.getUiDataLanguagesUrl;
		return this.httpClient.get<IGetUiDataLanguages>(url).pipe(
			tap((response) => {
				return response;
			})
		);
	}

	/**
	 *
	 * @param requestedCompanyId
	 * @param requestedPermissionClientId
	 * @param requestedRoleId
	 * @param requestedSignedInCompanyId
	 */
	public checkCompany(requestedCompanyId: number, requestedPermissionClientId: number, requestedRoleId: number, requestedSignedInCompanyId: number): Observable<ICheckCompanyResponse> {
		//const url = this.getConfig('serverBaseUrl') + "platform/getinfo";
		const url = this.getConfig('serverBaseUrl') + this.checkCompanyUrl;
		let params = new HttpParams();
		params = params.set('requestedCompanyId', requestedCompanyId);
		params = params.set('requestedPermissionClientId', requestedPermissionClientId);
		params = params.set('requestedRoleId', requestedRoleId);
		params = params.set('requestedSignedInCompanyId', requestedSignedInCompanyId);
		return this.httpClient.get<ICheckCompanyResponse>(url + '?' + params.toString()).pipe(
			tap((response) => {
				return response;
			})
		);
	}


	/**
	 *
	 */
	public readMessages(): Observable<JsonObject> {
		//const url = this.getConfig('serverBaseUrl') + "platform/getinfo";const payload='{"includeCertDetails":false,"msgList":["System.Application.ShutDownMsg","System.Configuration.CertificateMsg"]}';
		const body = '{"includeCertDetails":false,"msgList":["System.Application.ShutDownMsg","System.Configuration.CertificateMsg"]}';
		const headers = new HttpHeaders().set('Content-Type', 'application/json');
		const url = this.getConfig('serverBaseUrl') + this.readMessagesUrl;
		return this.httpClient.post<JsonObject>(url, body, {headers}).pipe(
			tap((response) => {
				return response;
			})
		);
	}

	/**
	 * The product name.
	 */
	public get productName(): string {
		// TODO: retrieve dynamically
		return 'RIB 4.0';
	}

	/**
	 * The product version.
	 */
	public get productVersion(): string {
		// TODO: retrieve dynamically
		return '0.0.0.0';
	}

	/**
	 * The product build version.
	 */
	public get buildVersion(): string {
		// TODO: retrieve dynamically
		return '0.0.0.0';
	}

	/**
	 * The full product version with build version information.
	 */
	public get fullProductVersion(): string {
		return `${this.productVersion}@${this.buildVersion}`;
	}

	/**
	 * The current logged in user's ID.
	 */
	public get loggedInUserId(): number | undefined {
		return this._loggedInUserId;
	}
}
