import { IRevalidator } from './revalidators.interface';

export type Revalidators<T extends object> = IRevalidator<T> | IRevalidator<T>[]