import { HostListener, inject, Injectable } from '@angular/core';
import { IContext } from '../model/context/context.interface';
import { ISysContext } from '../model/context/sys-context.interface';
import { AppContextValue, IAppContext } from '../model/context/app-context.interface';
import { PlatformDateService } from './platform-date.service';
import { clone, isNil, omitBy } from 'lodash';


@Injectable({
	providedIn: 'root'
})
/**
 * @ngdoc service
 * @name ContextService
 * @deprecated The service is obsolete and will be removed soon. Please use PlatformConfigurationService instead.
 * @description platformContextService provides access to system and application contexts
 */
export class ContextService implements IContext {
	public sysContext: ISysContext;
	public defaultLanguage: string;
	public defaultCulture: string;
	public defaultSysContext: ISysContext;
	public currentUserId: number;
	public appContext: IAppContext;

	private appBaseUrl: string = '';

	private readonly dateService = inject(PlatformDateService);

	public constructor() {
		this.sysContext = {
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
		this.defaultLanguage = 'en';
		this.defaultCulture = 'en-gb';
		this.defaultSysContext = {
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
		this.currentUserId = 0;
		this.appContext = {
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
	}

	public setAppBaseUrl(appBaseUrl: string) {
		this.appBaseUrl = appBaseUrl;
	}

	@HostListener('$stateChangeSuccess')
	public stateChangeSuccess(
		_event: Event,
		toState: { [x: string]: string | object },
		_toParams: {
			ipderror: string | undefined;
		},
		fromState: { [x: string]: string | null | boolean }
	): void {
		const permissionObjectInfoCache: { [x: string]: string } = {};
		if (toState['name'] !== fromState['name']) {
			permissionObjectInfoCache[fromState['name'] as string] = this.permissionObjectInfo;
			this.setPermissionObjectInfo(permissionObjectInfoCache[toState['name'].toString()] || null);
		}
	}

	public getStorageKey(userId?: number): string {
		const theId = userId ? userId : this.currentUserId;
		return this.appBaseUrl + ':' + theId + '-ctx';
	}

	/**
	 * @ngdoc function
	 * @name updateHttpClientContextHeader
	 * @function
	 * @methodOf contextService
	 * @description updates the content of http header with current state of sysContext
	 */
	public updateHttpClientContextHeader(): void {
		const clientCtx = clone(this.sysContext);
		if (clientCtx.secureClientRole) {
			// do not put the ids onto the client header if its already there in secureClientRole
			clientCtx.signedInClientId = undefined;
			clientCtx.clientId = undefined;
			clientCtx.permissionClientId = 1;
			clientCtx.permissionRoleId = undefined;
		}
		// clientname and signinClientname not required in context, we clean it
		clientCtx.signedInClientName = undefined;
		clientCtx.clientName = undefined;

		//const headers = JSON.parse(JSON.stringify(clientCtx));

		// this.http.defaults.headers.common['Client-Context'] = headers;

		// if (globals.trace && globals.trace.context) {
		// 	let stacktrace = new Error().stack as string;
		// 	stacktrace = stacktrace.replace('Error', '');
		// 	const contextInfo = 'C.Id:' + this.sysContext.clientId + ' SC.Id:' + this.sysContext.signedInClientId + ' PC.Id:' + this.sysContext.permissionClientId + ' R.Id:' + this.sysContext.permissionRoleId;
		// 	// TODO: replace with console wrapper service
		// 	console.groupCollapsed('Http Context Header changed: ' + contextInfo + '(expand for details)');
		// 	// TODO: remove?
		// 	//console.trace(stacktrace);
		// 	console.groupEnd();
		// }
	}

	/**
	 * @ngdoc function
	 * @name initialize
	 * @function
	 * @methodOf contextService
	 * @description initializes context service
	 */
	public initialize(): void {
		Object.assign(this.sysContext, this.defaultSysContext);
		this.dateService.setLocale(this.sysContext.culture as string);

		// rei: 02.12.14 patch german localization of LT to the format we accept with [Uhr]
		// moment.localeData('de').longDateFormat.LT = 'HH:mm';
	}

	/**
	 * @ngdoc function
	 * @name setLanguage
	 * @function
	 * @methodOf contextService
	 * @description set currently used language
	 * @param {string} language ISO language for UI text
	 */
	public setLanguage(language: string): void {
		if (language !== this.sysContext.language) {
			this.sysContext.language = language;
			this.updateHttpClientContextHeader();
		}
	}

	/**
	 * @ngdoc function
	 * @name getLanguage
	 * @function
	 * @methodOf contextService
	 * @description gets currently selected language
	 * @returns {string} current language
	 */
	public getLanguage(): string | null | undefined {
		return this.sysContext.language;
	}

	/**
	 * @ngdoc function
	 * @name getDefaultLanguage
	 * @function
	 * @methodOf contextService
	 * @description gets default language
	 * @returns {string} default language
	 */
	public getDefaultLanguage(): string {
		return this.defaultLanguage;
	}

	/**
	 * @ngdoc function
	 * @name culture
	 * @function
	 * @methodOf contextService
	 * @description sets ISO code used to format Currency/Date/Datetime etc
	 * @param {string} newCulture ISO code for Currency/Date/Datetime etc
	 * @returns {string} culture ISO code
	 */
	public culture(newCulture?: string): string | null | undefined {
		if (newCulture && newCulture !== this.sysContext.culture) {
			this.sysContext.culture = newCulture;

			this.updateHttpClientContextHeader();

			this.dateService.setLocale(this.sysContext.culture);
		}
		return this.sysContext.culture;
	}

	/**
	 * @ngdoc function
	 * @name setCulture
	 * @function
	 * @methodOf contextService
	 * @description sets ISO code used to format Currency/Date/Datetime etc
	 * @param {string} newCulture ISO code for Currency/Date/Datetime etc
	 * @returns {string} culture ISO code
	 */
	public setCulture(newCulture: string): string | null | undefined {
		return this.culture(newCulture);
	}

	/**
	 * @ngdoc function
	 * @name getCulture
	 * @function
	 * @methodOf contextService
	 * @description gets ISO code used to format Currency/Date/Datetime etc
	 * @returns {string} culture ISO code
	 */
	public getCulture(): string | null | undefined {
		return this.culture();
	}

	/**
	 * @ngdoc function
	 * @name setDataLanguageId
	 * @function
	 * @methodOf contextService
	 * @description sets the language id of database language to be used in service operations
	 * @param {int} id new language id
	 */
	public setDataLanguageId(id: number): void {
		if (id !== 0 && id !== this.sysContext.dataLanguageId) {
			this.sysContext.dataLanguageId = id;
			this.updateHttpClientContextHeader();
		}
	}

	/**
	 * @ngdoc function
	 * @name getDataLanguageId
	 * @function
	 * @methodOf contextService
	 * @description gets language id of database language currently used in service operations
	 * @returns {int} language id
	 */
	public getDataLanguageId(): string | number | undefined {
		return this.sysContext.dataLanguageId;
	}

	/**
	 * @ngdoc function
	 * @name setCurrentUserId
	 * @function
	 * @methodOf contextService
	 * @description set current userid for usage for saving user specific values
	 * @param {int} userId new user id
	 */
	public setCurrentUserId(userId: number): void {
		this.currentUserId = userId;
	}

	/**
	 * @ngdoc function
	 * @name getCurrentUserId
	 * @deprecated This methode is obsolete. Please use PlatformConfigurationService.loggedInUserId instead
	 * @function
	 * @methodOf contextService
	 * @description get current userid for usage of saving user specific values
	 * @return {int} current userId
	 */
	public getCurrentUserId(): number {
		return this.currentUserId;
	}

	/**
	 * @ngdoc function
	 * @name setCompanyConfiguration
	 * @function
	 * @methodOf contextService
	 * @description sets company and permission configuration
	 * @param {int} signedInClientId
	 * @param {int} companyId
	 * @param {int} permissionCompanyId
	 * @param {int} permissionRoleId
	 * @param {string, undefined} secureClientRole: ,
	 * @param {string} signedInClientCode ,
	 * @param {string, undefined, optional} signedInClientName,
	 * @param {string, optional} companyCode,
	 * @param {string , undefined, optional} companyName
	 * @returns {boolean} returns whether the values are changed or not
	 */
	public setCompanyConfiguration(
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
		if (signedInClientId !== this.sysContext.signedInClientId) {
			this.sysContext.signedInClientId = signedInClientId;
			changed = true;
		}
		if (companyId !== this.sysContext.clientId) {
			this.sysContext.clientId = companyId;
			changed = true;
		}
		if (permissionCompanyId !== this.sysContext.permissionClientId) {
			this.sysContext.permissionClientId = permissionCompanyId;
			changed = true;
		}
		if (permissionRoleId !== this.sysContext.permissionRoleId) {
			this.sysContext.permissionRoleId = permissionRoleId;
			changed = true;
		}
		if (secureClientRole !== this.sysContext.secureClientRole) {
			this.sysContext.secureClientRole = secureClientRole;
			changed = true;
		}
		if (signedInClientCode !== this.sysContext.signedInClientCode) {
			this.sysContext.signedInClientCode = signedInClientCode || '';
			changed = true;
		}
		if (signedInClientName !== this.sysContext.signedInClientName) {
			this.sysContext.signedInClientName = signedInClientName;
			changed = true;
		}
		if (companyCode !== this.sysContext.clientCode) {
			this.sysContext.clientCode = companyCode || '';
			changed = true;
		}
		if (companyName !== this.sysContext.clientName) {
			this.sysContext.clientName = companyName;
			changed = true;
		}

		if (changed) {
			this.updateHttpClientContextHeader();
		}
		return changed;
	}

	/**
	 * @ngdoc function
	 * @name companyRoleConfigIsValid
	 * @function
	 * @methodOf contextService
	 * @description return signedInClientId,clientId,permissionClientId,permissionRoleId
	 * @return {int}
	 */
	public companyRoleConfigIsValid(): number | undefined {
		return this.sysContext.signedInClientId && this.sysContext.clientId && this.sysContext.permissionClientId && this.sysContext.permissionRoleId;
	}

	/**
	 * @ngdoc function
	 * @name setPermissionObjectInfo
	 * @function
	 * @methodOf contextService
	 * @description sets object permission info
	 * @param {string} permissionObjectInfo
	 */
	public setPermissionObjectInfo(permissionObjectInfo: string | null): void {
		let changed = false;

		if (isNil(permissionObjectInfo)) {
			permissionObjectInfo = '';
		}

		if (permissionObjectInfo !== this.sysContext.permissionObjectInfo) {
			this.sysContext.permissionObjectInfo = permissionObjectInfo;
			changed = true;
		}

		if (changed) {
			this.updateHttpClientContextHeader();
		}
	}

	/**
	 * @ngdoc function
	 * @name getContext
	 * @function
	 * @methodOf contextService
	 * @description gets a copy of currently used context
	 * @returns {object} cloned content of internal state
	 */
	public getContext(): ISysContext {
		return clone(this.sysContext);
	}

	/**
	 * @ngdoc function
	 * @name setContext
	 * @function
	 * @methodOf contextService
	 * @description sets a new configuration
	 * @param {object} context containing new configuration to be used
	 */
	public setContext(context: ISysContext): void {
		Object.assign(this.sysContext, context);
		this.updateHttpClientContextHeader();
	}

	/**
	 * @ngdoc function
	 * @name removeApplicationValue
	 * @function
	 * @methodOf contextService
	 * @description removes an application defined value
	 * @param {string} key  name of property to retrieve
	 * @returns {boolean} true if there was an item , false if not found
	 */
	public removeApplicationValue(key: string): boolean {
		if (Object.prototype.hasOwnProperty.call(this.appContext, key)) {
			delete this.appContext[key];
			return true;
		}
		return false;
	}

	/**
	 * @ngdoc function
	 * @name getApplicationValue
	 * @function
	 * @methodOf contextService
	 * @description gets an application defined value
	 * @param {string} key name of property to retrieve
	 * @returns {string , { [x: string]: string } , null , undefined} value of key or null
	 */
	public getApplicationValue(key: string): AppContextValue {
		if (Object.prototype.hasOwnProperty.call(this.appContext, key)) {
			return this.appContext[key].val;
		}
		return null;
	}

	/**
	 * @ngdoc function
	 * @name setApplicationValue
	 * @function
	 * @methodOf contextService
	 * @description sets an application defined value
	 * @param {string} key key name of property to be inserted or updated
	 * @param {string , null , undefined} value application defined data
	 * @param {boolean} doPersist, save data into storage
	 */
	public setApplicationValue(key: string, value: AppContextValue, doPersist: boolean): void {
		if (typeof key === 'string') {
			if (value === undefined) {
				value = null;
			}
			if (!this.appContext[key] || this.appContext[key].val !== value) {
				this.appContext[key] = {val: value, persist: doPersist};
			}
		}
	}

	/**
	 * @ngdoc function
	 * @name saveContextToLocalStorage
	 * @function
	 * @methodOf contextService
	 * @description saves the context to local storage
	 * @param {int} userId  key name of property to be inserted or updated
	 */
	public saveContextToLocalStorage(userId: number): void {
		// Put the object into storage
		const key = this.getStorageKey(userId);
		const appPersist = omitBy(this.appContext, function (a) {
			return a.persist !== true;
		});
		const mysyscontext = this.getContext();
		// mysyscontext.dataLanguageId = undefined;
		// mysyscontext.language = undefined;
		// mysyscontext.culture = undefined;

		const saveCtx = {sysContext: mysyscontext, appContext: appPersist};
		localStorage.setItem(key, JSON.stringify(saveCtx));
	}

	/**
	 * @ngdoc function
	 * @name ClearObsoleteProperties
	 * @function
	 * @methodOf contextService
	 * @description reads the syscontext from storage and clears all obsolete values
	 */
	public ClearObsoleteProperties(): void {
		const key = this.getStorageKey();
		let mySysContext,
			changed = false;
		const savedContext = localStorage.getItem(key);
		if (!isNil(savedContext)) {
			const myContext = JSON.parse(savedContext);
			mySysContext = myContext.sysContext;
			// put all cleanup properties here
			if (mySysContext && mySysContext.secureClientRole) {
				changed = true;

				mySysContext.secureClientRole = undefined;
			}
			if (changed) {
				const saveCtx = {
					sysContext: myContext.sysContext,
					appContext: myContext.appContext
				};
				localStorage.setItem(key, JSON.stringify(saveCtx));
			}
		}
	}

	/**
	 * @ngdoc function
	 * @name readContextFromLocalStorage
	 * @function
	 * @methodOf contextService
	 * @description reads the context from local storage
	 * @param {int} userId
	 * @param {string , undefined} clearSecureClientRole
	 */
	public readContextFromLocalStorage(userId: number, clearSecureClientRole: string | undefined): void {
		// Retrieve the object from storage
		const key = this.getStorageKey(userId);

		let mySysContext: {
			secureClientRole: string | undefined;
			signedInClientId: number | undefined;
			clientId: number | undefined;
			permissionClientId: number;
			permissionRoleId: number | undefined;
		} = {
			secureClientRole: undefined,
			signedInClientId: undefined,
			clientId: undefined,
			permissionRoleId: undefined,
			permissionClientId: 0
		};
		let myAppContext: object = {};

		const savedContext = localStorage.getItem(key);
		if (!isNil(savedContext)) {
			const myContext = JSON.parse(savedContext);
			mySysContext = myContext.sysContext;
			myAppContext = myContext.appContext;
			if (clearSecureClientRole && mySysContext.secureClientRole) {
				mySysContext.secureClientRole = undefined;
				this.saveContextToLocalStorage(userId);
			}
		}
		if (mySysContext) {
			this.setCompanyConfiguration(mySysContext.signedInClientId, mySysContext.clientId, mySysContext.permissionClientId, mySysContext.permissionRoleId, mySysContext.secureClientRole);
		}
		if (myAppContext) {
			Object.assign(this.appContext, myAppContext);
		}
	}

	public readContextWithoutInitialization(userId: number) {
		const key = this.getStorageKey(userId);
		const savedContext = localStorage.getItem(key);
		if (!isNil(savedContext)) {
			const myContext = JSON.parse(savedContext);
			return myContext;
		}
	}

	/**
	 * @ngdoc function
	 * @name signedInClientId
	 * @function
	 * @methodOf contextService
	 * @description returns signedInClientId
	 * @returns {int, undefined}
	 */
	public get signedInClientId() {
		return this.sysContext.signedInClientId;
	}

	/**
	 * @ngdoc function
	 * @name signedInClientCode
	 * @function
	 * @methodOf contextService
	 * @description returns signedInClientCode
	 * @returns {string}
	 */
	public get signedInClientCode() {
		return this.sysContext.signedInClientCode;
	}

	/**
	 * @ngdoc function
	 * @name signedInClientName
	 * @function
	 * @methodOf contextService
	 * @description returns signedInClientName
	 * @returns {string, undefined}
	 */
	public get signedInClientName() {
		return this.sysContext.signedInClientName;
	}

	/**
	 * @ngdoc function
	 * @name clientId
	 * @deprecated This methode is obsolete. Please use PlatformConfigurationService.clientId instead
	 * @function
	 * @methodOf contextService
	 * @description returns clientId
	 * @returns {number, undefined}
	 */
	public get clientId() {
		return this.sysContext.clientId;
	}

	/**
	 * @ngdoc function
	 * @name clientCode
	 * @function
	 * @methodOf contextService
	 * @description returns clientCode
	 * @returns {string}
	 */
	public get clientCode() {
		return this.sysContext.clientCode;
	}

	/**
	 * @ngdoc function
	 * @name clientName
	 * @function
	 * @methodOf contextService
	 * @description returns clientName
	 * @returns {string, undefined}
	 */
	public get clientName() {
		return this.sysContext.clientName;
	}

	/**
	 * @ngdoc function
	 * @name permissionRoleId
	 * @function
	 * @methodOf contextService
	 * @description returns permissionRoleId
	 * @returns {int, undefined}
	 */
	public get permissionRoleId() {
		return this.sysContext.permissionRoleId;
	}

	/**
	 * @ngdoc function
	 * @name permissionClientId
	 * @function
	 * @methodOf contextService
	 * @description returns permissionClientId
	 * @returns {int}
	 */
	public get permissionClientId() {
		return this.sysContext.permissionClientId;
	}

	/**
	 * @ngdoc function
	 * @name permissionObjectInfo
	 * @function
	 * @methodOf contextService
	 * @description returns permissionObjectInfo
	 * @returns {string}
	 */
	public get permissionObjectInfo() {
		return this.sysContext.permissionObjectInfo;
	}

	/**
	 * @ngdoc function
	 * @name isLoggedIn
	 * @function
	 * @methodOf contextService
	 * @description returns isLoggedIn
	 * @returns {boolean, undefined}
	 */
	public get isLoggedIn() {
		return this.sysContext.isLoggedIn;
	}
}
