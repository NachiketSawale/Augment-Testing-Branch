/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Input/Output parameters for the action 'Get a Authentication Token Action'
 */
export enum GetAuthenticationTokenActionEditorParams {
	ActiveDirectoryTenant = 'ActiveDirectoryTenant',
	ActiveDirectoryClientAppId = 'ActiveDirectoryClientAppId',
	ActiveDirectoryResource = 'ActiveDirectoryResource',
	UserName = 'UserName',
	UserPassword = 'UserPassword',
	AccessTokenType = 'AccessTokenType',
	AccessToken = 'AccessToken',
	AuthenticationResult = 'AuthenticationResult',
	ClientSecret = 'ClientSecret',
}