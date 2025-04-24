import { IStatus } from './status.interface';
import { Observable } from 'rxjs';

export interface IStatusProvider {
	/**
	 * get statuses
	 */
	getStatusList(): Observable<IStatus[]>;
}
