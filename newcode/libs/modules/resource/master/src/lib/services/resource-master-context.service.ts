import { Injectable } from '@angular/core';
import { isUndefined } from 'lodash';
class ModuleContext{
	public val: boolean = false;
}
@Injectable({
	providedIn: 'root'
})
export class ResourceMasterContextService {
	private readonly moduleContext = new Map<string,ModuleContext>();
	private readonly timeout = new Map<string,NodeJS.Timeout|undefined>();

	public readonly moduleStatusKey = 'res.current.resource.pools.status';
	public readonly moduleReadOnlyKey = 'res.current.readOnly';

	/**
	 * @ngdoc event
	 * @name applicationValueChanged
	 * @methodOf resourceMaster:resourceMasterContextService
	 * @description Messenger that fires events when an application values has been changed
	 */
	//public moduleValueChanged = new PlatformMessenger();
	/**
	 * @ngdoc function
	 * @name setModuleValue
	 * @function
	 * @methodOf resourceMaster:resourceMasterContextService
	 * @description sets an module defined value
	 * @param key {string} key name of property to be inserted or updated
	 * @param {*} value module defined data
	 */
	public setModuleValue(key: string, value?: boolean | null): void {
		if (typeof key === 'string') {
			if (isUndefined(value)) {
				value = null;
			}

			if (this.timeout.get(key)){
				clearTimeout(this.timeout.get(key));
			}

			if (!this.moduleContext.get(key) || this.moduleContext.get(key)?.val !== value) {
				this.moduleContext.set(key,{ val: value } as ModuleContext);
				//this.moduleValueChanged.fire(key);
			}
		}
	}
	/**
	 * @ngdoc function
	 * @name getApplicationValue
	 * @function
	 * @methodOf resourceMaster:resourceMasterContextService
	 * @description gets an module defined value
	 * @param key {string} name of property to retrieve
	 * @returns {*} value of key or null
	 */
	public getModuleValue(key: string) {
		if (this.moduleContext.has(key)) {
			return this.moduleContext.get(key)?.val;
		}
		return null;
	}
	/**
	 * @ngdoc function
	 * @name removeModuleValue
	 * @function
	 * @methodOf resourceMaster:resourceMasterContextService
	 * @description removes an module defined value
	 * @param key {string} name of property to retrieve
	 * @returns {*} true if there was an item , false if not found
	 */
	public removeModuleValue(key: string) {
		if (this.moduleContext.has(key)) {
			if (!this.timeout.get(key)) {
				// eslint-disable-next-line @typescript-eslint/no-this-alias
				const self = this;
				this.timeout.set(key, setTimeout(function () {
					self.moduleContext.delete(key);
					self.timeout.set(key, undefined);
				}, 1000)) ;
			}

			return true;
		}
		return false;
	}

	/**
	 * @ngdoc function
	 * @name setModuleStatus
	 * @function
	 * @methodOf resourceMaster:resourceMasterContextService
	 * @description set module status in current module
	 */
	public setModuleStatus(readOnly: boolean) {
		this.setModuleValue(this.moduleStatusKey, readOnly);
	}
	/**
	 * @ngdoc function
	 * @name setModuleReadOnly
	 * @function
	 * @methodOf resourceMaster:resourceMasterContextService
	 * @description get module status in current module
	 */
	public getModuleStatus() {
		return this.getModuleValue(this.moduleStatusKey);
	}

	/**
	 * @ngdoc function
	 * @name setModuleReadOnly
	 * @function
	 * @methodOf resourceMaster:resourceMasterContextService
	 * @description set readonly status in current module
	 */
	public setModuleReadOnly(readOnly: boolean) {
		this.setModuleValue(this.moduleReadOnlyKey, readOnly);
	}
	/**
	 * @ngdoc function
	 * @name setModuleReadOnly
	 * @function
	 * @methodOf resourceMaster:resourceMasterContextService
	 * @description get readonly status in current module
	 */
	public getModuleReadOnly() {
		return this.getModuleValue(this.moduleReadOnlyKey);
	}
	public get isReadOnly(){
		return this.getModuleReadOnly();
	}

}