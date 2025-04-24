/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstShareUrbConfigCostCode } from '../../model/Urb-config-Cost-Code.interface';
import { inject, Injectable } from '@angular/core';
import { IUrb2CostCode } from '../../model/urb-config-entity.interface';
import { IEstShareUrbConfigUrb2CostCode } from '../../model/urb-config-urb-cost-code.interface';
import { HttpClient } from '@angular/common/http';
import { CollectionHelper, PlatformConfigurationService } from '@libs/platform/common';
import { clone, find, forEach, map as mapList, orderBy, merge } from 'lodash';
import { map, Observable, of } from 'rxjs';


/*
 * get master costCodes and project cost codes
 */
@Injectable({
	providedIn: 'root'
})
export class EstShareUrbConfigGridDataService{
	private readonly http = inject(HttpClient);
	private readonly configurationService = inject(PlatformConfigurationService);

	private cache: IEstShareUrbConfigCostCode[] = [];
	private isCreateNewEstBoqUppConfig = false;
	private dataCache: IEstShareUrbConfigUrb2CostCode[] = [];

	public setIsCreateNew(val: boolean){
		this.isCreateNewEstBoqUppConfig = val;
	}

	private loadMdcCostCode(projectId?: number | null,fouceReloadCostCode?: boolean | null){
		if(this.cache && this.cache.length > 0 && !fouceReloadCostCode){
			return of(this.cache);
		}

		if(!projectId){
			// todo: get current context id
			return this.http.get(this.configurationService.webApiBaseUrl + 'basics/costcodes/estcostcodetree?mdcContextId=-0').pipe(map((response) => {
				if (response) {
					let roots = response as IEstShareUrbConfigCostCode[];
					roots = roots.filter(item => !item.CostCodeParentFk);
					return roots;
				}
				return [];
			}));
		}

		return this.http.get(this.configurationService.webApiBaseUrl + 'basics/costcodes/getestcostcodelistbycompany').pipe(map((response) => {
			if (response) {
				let roots = response as IEstShareUrbConfigCostCode[];
				roots = roots.filter(item => !item.CostCodeParentFk);
				return roots;
			}
			return [];
		}));
	}

	private loadProjectCostCodeOnly(){

	}

	public load(projectId?: number | null, urb2CostCodes?: IUrb2CostCode[], fouceReloadCostCode?: boolean | null): Observable<IEstShareUrbConfigUrb2CostCode[]>{
		return this.loadMdcCostCode(projectId, fouceReloadCostCode).pipe(map(response =>{
			return this.mergeData(response, urb2CostCodes);
		}));
	}

	public getList(){
		return this.dataCache;
	}

	public getUpdatedList(){
		const flatList = CollectionHelper.Flatten(this.dataCache, item => item.CostCodes || []);

		return flatList.filter(item => item && item.UppId && item.UppId > 0);
	}

	private mergeData(costCodes: IEstShareUrbConfigCostCode[], urb2CostCodes?: IUrb2CostCode[]): IEstShareUrbConfigUrb2CostCode[]{

		let currentAllowanceId = -100;
		const _costCodes = clone(costCodes);
		const flatList = CollectionHelper.Flatten(_costCodes || [], item => item.CostCodes || []);
		// add allowance cost code for each costCode
		forEach(flatList, (item) => {
			item.CostCodes = item.CostCodes || [];
			const dcmOn = clone(item);
			dcmOn.Code += ' DCM on';
			dcmOn.CostCodeParentFk = item.Id;
			dcmOn.MdcCostCodeFk = item.IsOnlyProjectCostCode? undefined : item.Id;
			dcmOn.Project2MdcCstCdeFk = item.IsOnlyProjectCostCode? item.Id: undefined;
			dcmOn.IsOnlyProjectCostCode = item.IsOnlyProjectCostCode;
			dcmOn.CostCodes = [];
			dcmOn.Id = currentAllowanceId--;
			dcmOn.LineType = 1;
			item.CostCodes.unshift(dcmOn);
		});

		// Append allowance items
		const cloneDesc = clone(_costCodes[0].DescriptionInfo);
		if(cloneDesc){
			cloneDesc.Description = cloneDesc.Translated = '';
		}

		_costCodes.push({
			Id: -2,
			Code: 'AA',
			Sort: 2,
			LineType:2,
			CostCodes:[],
			Version:1,
			DescriptionInfo: cloneDesc,
			Description2Info: cloneDesc
		});
		_costCodes.push({
			Id: -3,
			Code: 'AA-Surcharge',
			Sort: 3,
			LineType:3,
			CostCodes:[],
			Version:1,
			DescriptionInfo: cloneDesc,
			Description2Info: cloneDesc
		});
		_costCodes.push({
			Id: -4,
			Code: 'MM',
			Sort: 4,
			LineType:4,
			CostCodes:[],
			Version:1,
			DescriptionInfo: cloneDesc,
			Description2Info: cloneDesc
		});
		_costCodes.push({
			Id: -5,
			Code: 'URD',
			Sort: 5,
			LineType:5,
			CostCodes:[],
			Version:1,
			DescriptionInfo: cloneDesc,
			Description2Info: cloneDesc
		});
		_costCodes.push({
			Id: -6,
			Code: 'Rounding Divergence',
			Sort: 6,
			LineType:6,
			CostCodes:[],
			Version:1,
			DescriptionInfo: cloneDesc,
			Description2Info: cloneDesc
		});

		const result: IEstShareUrbConfigUrb2CostCode[] = mapList(_costCodes, function (item) {
			return {
				Id: currentAllowanceId--,
				Code: item.Code,
				DescriptionInfo: item.DescriptionInfo,
				Description2Info: item.Description2Info,
				CostCodeParentFk: item.CostCodeParentFk,
				CostCodes: mapChild(item.CostCodes),
				MdcCostCodeFk: item.IsOnlyProjectCostCode ? null : (item.Id > 0 ? item.Id : item.MdcCostCodeFk),
				Project2MdcCstCdeFk: item.IsOnlyProjectCostCode ? (item.Id > 0 ? item.Id : item.Project2MdcCstCdeFk) : null,
				Version: item.Version,
				image: item.Id > 0 ? 'ico-folder-empty' : 'ico-folder-controls',
				Sort: item.Sort || 0,
				LineType: item.LineType
			};
		});

		function mapChild(childcostcodes: IEstShareUrbConfigCostCode[]): IEstShareUrbConfigUrb2CostCode[] {

			let children:IEstShareUrbConfigUrb2CostCode[] = [];
			if (childcostcodes && childcostcodes.length) {
				children = mapList(childcostcodes, function (child) {
					return {
						Id: currentAllowanceId--,
						Code: child.Code,
						DescriptionInfo: child.DescriptionInfo,
						Description2Info: child.Description2Info,
						CostCodeParentFk: child.CostCodeParentFk,
						CostCodes: mapChild(child.CostCodes),
						MdcCostCodeFk: child.IsOnlyProjectCostCode ? null : (child.Id > 0 ? child.Id : child.MdcCostCodeFk),
						Project2MdcCstCdeFk: child.IsOnlyProjectCostCode ? (child.Id > 0 ? child.Id : child.Project2MdcCstCdeFk) : null,
						Version: child.Version,
						image: child.Id > 0 ? 'ico-folder-empty' : 'ico-folder-controls',
						Sort: 0,
						LineType: child.LineType
					};
				}) as IEstShareUrbConfigUrb2CostCode[];
			}
			return children ;
		}

		// merge upp2costcode with costcodes
		const flatResult = CollectionHelper.Flatten(result || [], item => item.CostCodes);

		if(!this.isCreateNewEstBoqUppConfig){
			forEach(flatResult, flat=>{
				merge(flat, {
					__rt$data: {
						entityReadonly: true
					}
				});
			});
		}

		if (urb2CostCodes && urb2CostCodes.length) {
			forEach(urb2CostCodes,  (upp2CC) => {
				const item = this.findCostCode(flatResult, upp2CC);
				if (item) {
					let children:IEstShareUrbConfigUrb2CostCode[] = [];
					if(!this.isCreateNewEstBoqUppConfig && item.CostCodes && item.CostCodes.length >0){
						// isCreateNewEstBoqUppConfig = false, this means current Grid is loaded from default Urp config from customize module,
						// and only project cost code would be showed in customize module,
						// so we need to set its own only project cost code urp config same as parent.
						children = item.CostCodes;
						children = children.filter(function (child){
							return !child.MdcCostCodeFk && child.Project2MdcCstCdeFk;
						});
						if(children && children.length > 0){
							children =  CollectionHelper.Flatten(children, item => item.CostCodes);
						}
					}
					children.push(item);
					forEach(children, function (child){
						child.EstUpp2CostcodeId = upp2CC.Id;
						// item.Id = upp2CC.Id;
						child.UppId = upp2CC.UppId;
						child.UppId1 = child.UppId === 1;
						child.UppId2 = child.UppId === 2;
						child.UppId3 = child.UppId === 3;
						child.UppId4 = child.UppId === 4;
						child.UppId5 = child.UppId === 5;
						child.UppId6 = child.UppId === 6;
						child.EstUppConfigFk = upp2CC.EstUppConfigFk;
					});

				}else if(upp2CC.Id < 0){
					result.push({
						Id: upp2CC.Id,
						Code: '',
						CostCodes: [],
						MdcCostCodeFk: upp2CC.MdcCostCodeFk,
						Project2MdcCstCdeFk: upp2CC.Project2MdcCstCdeFk,
						EstUpp2CostcodeId: null,
						image: 'ico-folder-controls',
						Sort:  0,
						LineType: upp2CC.LineType
					});
				}
			});
		}

		forEach(result, res=>{
			res.nodeInfo = {
				level: 0,
				collapsed: true,
				lastElement: false,
				children: true
			};
		});

		this.dataCache = orderBy(result, ['Sort','Code'], ['asc']);

		return this.dataCache;
	}

	private findCostCode(list:IEstShareUrbConfigUrb2CostCode[], source:IUrb2CostCode) {
		if((source.MdcCostCodeFk || source.Project2MdcCstCdeFk) && !source.LineType) {
			return source.MdcCostCodeFk
				? find(list, function (item){
					return item.MdcCostCodeFk === source.MdcCostCodeFk && !item.LineType;
				})
				: find(list, function (item){
					return item.Project2MdcCstCdeFk === source.Project2MdcCstCdeFk && !item.LineType;
				});
		}else if((source.MdcCostCodeFk || source.Project2MdcCstCdeFk) && source.LineType){
			return source.MdcCostCodeFk
				? find(list, {'MdcCostCodeFk': source.MdcCostCodeFk, 'LineType': source.LineType})
				: find(list, {'Project2MdcCstCdeFk': source.Project2MdcCstCdeFk, 'LineType': source.LineType});
		}else{
			return find(list, {'LineType': source.LineType});
		}
	}

	public clear(){
		this.cache = [];
		this.dataCache = [];
	}

}