/*
 * Copyright (c) RIB Software GmbH
 */

import { AppContextValue } from './app-context.interface';
import { ISysContext } from './sys-context.interface';

export interface IContext {
	permissionClientId: number;
	permissionObjectInfo: string;
	defaultLanguage: string;
	defaultCulture: string;
	currentUserId: number;

	signedInClientId: number | undefined;
	signedInClientCode: string;
	signedInClientName: string | undefined;
	clientId: number | undefined;
	clientCode: string;
	clientName: string | undefined;
	permissionRoleId: number | undefined;
	isLoggedIn: boolean | undefined;

	getStorageKey(userId?: number): string;
	updateHttpClientContextHeader(): void;
	initialize(): void;
	setLanguage(language: string): void;
	getLanguage(): string | null | undefined;
	getDefaultLanguage(): string;
	culture(newCulture?: string): string | null | undefined;
	setCulture(newCulture: string): string | null | undefined;
	getCulture(): string | null | undefined;
	setDataLanguageId(id: number): void;
	getDataLanguageId(): string | number | undefined;
	setCurrentUserId(userId: number): void;
	getCurrentUserId(): number;
	setCompanyConfiguration(
		signedInClientId: number | undefined,
		companyId: number | undefined,
		permissionCompanyId: number | undefined,
		permissionRoleId: number | undefined,
		secureClientRole: string | undefined,
		signedInClientCode: string,
		signedInClientName: string | undefined,
		companyCode: string,
		companyName: string | undefined
	): boolean;
	companyRoleConfigIsValid(): number | undefined;
	setPermissionObjectInfo(permissionObjectInfo: string | null): void;
	getContext(): ISysContext;
	setContext(context: ISysContext): void;
	removeApplicationValue(key: string): boolean;
	getApplicationValue(key: string): AppContextValue;
	setApplicationValue(key: string, value: AppContextValue, doPersist: boolean): void;
	saveContextToLocalStorage(userId: number): void;
	ClearObsoleteProperties(): void;
	readContextFromLocalStorage(userId: number, clearSecureClientRole: string | undefined): void;
}