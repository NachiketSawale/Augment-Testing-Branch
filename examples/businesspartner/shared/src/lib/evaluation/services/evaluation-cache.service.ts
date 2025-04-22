import { EvaluationServiceTypes } from '@libs/businesspartner/interfaces';

export class EvaluationCacheService {
	private readonly serviceCache = new Map();
	public getCacheKey(serviceType: EvaluationServiceTypes, serviceDescriptor: string) {
		const prefix = serviceType || 'SERVICE';
		return prefix + '_' + serviceDescriptor;
	}

	public hasService(serviceType: EvaluationServiceTypes, serviceDescriptor: string) {
		const cacheKey = this.getCacheKey(serviceType, serviceDescriptor);
		return this.serviceCache.has(cacheKey);
	}

	public getService(serviceType: EvaluationServiceTypes, serviceDescriptor: string) {
		const cacheKey = this.getCacheKey(serviceType, serviceDescriptor);
		return this.serviceCache.has(cacheKey) ? this.serviceCache.get(cacheKey) : null;
	}

	public setService(
		serviceType: EvaluationServiceTypes,
		serviceDescriptor: string,
		service: {
			serviceName: string;
		},
	) {
		const cacheKey = this.getCacheKey(serviceType, serviceDescriptor);
		service.serviceName = cacheKey;
		this.serviceCache.set(cacheKey, service);
	}
}
