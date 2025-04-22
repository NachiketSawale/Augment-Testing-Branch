import {Dictionary, IDictionary, IIdentificationData} from '@libs/platform/common';
import {HttpDataProvider} from './http-data-provider.class';
import {IDataCacheProvider} from './data-cache-provider.interface';
import {IDataServiceOptions} from '../data-service/interface/options/data-service-options.interface';


export class HttpDataCacheProvider<T> extends HttpDataProvider<T> implements IDataCacheProvider<T> {
    private cache: IDictionary<IIdentificationData, T[]>;

    public constructor(options: IDataServiceOptions<T>) {
        super(options);
        this.cache = new Dictionary();
    }

    public clearCache(): void {
        this.cache = new Dictionary();
    }

    public override create(identificationData: IIdentificationData | null): Promise<T> {
        return super.create(identificationData);
    }

    /**
     *
     * @param identificationData
     */
    public override load(identificationData: IIdentificationData | null): Promise<T[]> {
        if (identificationData) {
            if (this.cache.containsKey(identificationData)) {
                const result = this.cache.get(identificationData);
                if (result != undefined) {
                    return Promise.resolve(result);
                }
            }

            return super.load(identificationData).then(result => {
                this.cache.add(identificationData, result);

                return result;
            });
        }
        /**
         * TODO: decide if null is a valid method param
         */
        return super.load(null);
    }
}