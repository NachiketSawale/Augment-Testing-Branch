/*
 * Copyright(c) RIB Software GmbH
 */

import { StaticProvider } from '@angular/core';
import { IContainerInitializationContext } from './container-initialization-context.interface';

/**
 * The type for container injection providers that can be supplied directly or via a function.
 */
export type ContainerInjectionProviders = StaticProvider[] | ((context: IContainerInitializationContext) => StaticProvider[] | Promise<StaticProvider[]>);

/**
 * Combines two {@link ContainerInjectionProviders} values.
 *
 * @param providers1 The first value.
 * @param providers2 The second value.
 *
 * @returns The combined {@link ContainerInjectionProviders} value.
 */
export function combineContainerInjectionProviders(providers1?: ContainerInjectionProviders, providers2?: ContainerInjectionProviders): ContainerInjectionProviders | undefined {
	if (!providers1) {
		if (!providers2) {
			return undefined;
		} else {
			return providers2;
		}
	} else {
		if (!providers2) {
			return providers1;
		}
	}

	if (typeof providers1 === 'function') {
		if (typeof providers2 === 'function') {
			return async ctx => {
				return [
					...(await Promise.resolve(providers1(ctx))),
					...(await Promise.resolve(providers2(ctx)))
				];
			};
		} else {
			return async ctx => {
				return [
					...(await Promise.resolve(providers1(ctx))),
					...providers2
				];
			};
		}
	} else {
		if (typeof providers2 === 'function') {
			return async ctx => {
				return [
					...providers1,
					...(await Promise.resolve(providers2(ctx)))
				];
			};
		} else {
			return [
				...providers1,
				...providers2
			];
		}
	}
}
