import { LazyInjectionToken } from '@libs/platform/common';

export interface ICircular2 {
	test(): void;
	outputOther(): void;
}

export const Circular2Token = new LazyInjectionToken<ICircular2>('circ2');