/*
 * Copyright(c) RIB Software GmbH
 */

export interface IUserProviderInfoEntity {
    id: number,
    provider: string,
    identityproviderFk: number,
    identityProviderName: string,
    providerId: string,
    familyName: string,
    email: string,
    zipCode: number,
    city: string,
    street: string,
    comment: string,
    userId: number,
    logonName: string,
    state:number,
    lastLogin:string,
    isExternal: boolean,
    contactId: number,
    bpdId: number,
    bpdName1: string,
    portalusergroupFk: number,
    portalUserGroupName: string
}