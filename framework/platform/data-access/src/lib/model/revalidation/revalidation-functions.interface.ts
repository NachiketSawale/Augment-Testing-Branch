import { Revalidators } from './revalidators.type';

export interface IRevalidationFunctions<T extends object> {
	[key: string]: (() => Revalidators<T>)| Revalidators<T> | undefined;
}