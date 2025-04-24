import { IDataProvider } from './data-provider.interface';

export interface IDataCacheProvider<T> extends IDataProvider<T>  {
	clearCache(): void
}
