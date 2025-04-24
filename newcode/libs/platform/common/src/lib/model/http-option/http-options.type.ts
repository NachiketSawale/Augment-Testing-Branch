/*
 * Copyright (c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';

/**
 * The Get Function Http option Type
 */
export type GetHttpOptions = Parameters<HttpClient['get']>[1];

/**
 * The Post Function Http option Type
 */
export type PostHttpOptions = Parameters<HttpClient['post']>[2];

/**
 * The Put Function Http option Type
 */
export type PutHttpOptions = Parameters<HttpClient['put']>[2];

/**
 * The Patch Function Http option Type
 */
export type PatchHttpOptions = Parameters<HttpClient['patch']>[2];

/**
 * The Delete Function Http option Type
 */
export type DeleteHttpOptions = Parameters<HttpClient['delete']>[1];

/**
 * The Request function http option type.
 */
export type CustomHttpRequest = Parameters<HttpClient['request']>[2];