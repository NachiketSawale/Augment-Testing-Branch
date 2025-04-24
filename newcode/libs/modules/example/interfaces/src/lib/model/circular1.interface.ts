import { LazyInjectionToken } from '@libs/platform/common';

export interface ICircular1 {
	test(): void;
	output(): void;
}

export const Circular1Token = new LazyInjectionToken<ICircular1>('circ1');