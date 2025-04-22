import { IIdentificationData } from '@libs/platform/common';

export interface IDataProvider<T> {
	create(identificationData: IIdentificationData | null): Promise<T>
	createEnhanced?<PT extends object, RT>(payload: PT | undefined, onSuccess: (created: RT) => T): Promise<T>

	load(identificationData: IIdentificationData | null): Promise<T[]>
	loadEnhanced?<PT extends object, RT>(payload: PT | undefined, onSuccess: (loaded: RT) => T[]): Promise<T[]>
}
