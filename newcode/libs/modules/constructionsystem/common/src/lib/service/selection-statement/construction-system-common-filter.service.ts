/*
 * Copyright(c) RIB Software GmbH
 */
import _ from 'lodash';
import { inject } from '@angular/core';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { ConstructionSystemCommonFilterDataService } from './construction-system-common-filter-data.service';
import { IFilterDefinitionEntity } from '../../model/entities/selection-statement/filter-definition-entity.interface';
import { IFilterDefinitionInfo } from '@libs/basics/interfaces';
import { SelectionStatementSearchType } from '../../model/enums/selection-statement-search-type.enum';
/**
 * the Cos FilterDefinitionEntity, From API
 */
interface ICosFilterDefinitionEntity {
	id: number;
	moduleName: string;
	filterName: string;
	accessLevel: string;
	filterDef: string;
}

export class ConstructionSystemCommonFilterService {
	private readonly http = inject(PlatformHttpService);
	private readonly translateService = inject(PlatformTranslateService);
	public readonly filterDataService = inject(ConstructionSystemCommonFilterDataService);

	public availableFilterDefs: IFilterDefinitionEntity[] = [];
	public selectedFilterDefDto: IFilterDefinitionEntity | null = null;
	private filterDtoIdCounter: number = 0;
	private initDone: boolean = false;
	public constructor(private parentServiceName: string = '') {}

	/**
	 * This method reads all filter definition from backend
	 * @method loadAllFilters
	 **/
	public async loadAllFilters(filterType: SelectionStatementSearchType) {
		const filterDefinitionInfo = await this.http.get<ICosFilterDefinitionEntity[]>('constructionsystem/master/selectionstatement/getfilterdefinitions?type=' + filterType);
		const filterDtos: IFilterDefinitionEntity[] = [];
		this.filterDtoIdCounter = 1;
		_.forEach(filterDefinitionInfo, (dto) => {
			//todo: waiting cloudDesktopEnhancedFilterService
			//filterDtos.push(new cloudDesktopEnhancedFilterService.FilterDefDto(dto));
			const entity: IFilterDefinitionEntity = {
				AccessLevel: dto.accessLevel,
				FilterDef: dto.filterDef,
				FilterName: dto.filterName,
				Id: dto.id,
				ModuleName: dto.moduleName,
				DisplayName: dto.filterName,
			};
			filterDtos.push(entity);
		});

		this.sortFilterDef(filterDtos);
		return true;
	}

	/**
	 * delete the filter dto in database
	 **/
	public async deleteFilterDefinition(filterDto: IFilterDefinitionEntity) {
		await this.http.post('constructionsystem/master/selectionstatement/deletefilterdefinition', filterDto);
		return this.removeFilterDef(filterDto.FilterName);
	}

	/**
	 * This method saves ...
	 **/
	public async saveFilterDefinition(filterDto: IFilterDefinitionEntity) {
		const filterDefParams = {
			filterName: filterDto.FilterName,
			accessLevel: filterDto.AccessLevel,
			filterDef: filterDto.FilterDef,
		};

		return this.http.post<IFilterDefinitionInfo>('constructionsystem/master/selectionstatement/savefilterdefinition', filterDefParams).then(() => {
			return this.addUpdateFilterDef(filterDto);
		});
	}

	/**
	 * get selected filter.
	 */
	public getSelectedFilter() {
		return this.selectedFilterDefDto;
	}

	/**
	 * clear selected filter.
	 */
	public clearSelectedFilter() {
		this.selectedFilterDefDto = null;
		this.filterDataService.clearSelectedFilter(this.parentServiceName);
	}

	/**
	 * get filter text by the filter dto.
	 */
	public getCurrentFilterDef(filterDto: IFilterDefinitionEntity): Record<string, unknown> {
		this.filterDataService.setSelectedFilter(this.parentServiceName, filterDto);
		this.selectedFilterDefDto = filterDto;
		return this.convertKeysToCamelCase(JSON.parse(filterDto.FilterDef));
	}
	public convertKeysToCamelCase(obj: Record<string, unknown>): Record<string, unknown> {
		const newObj: Record<string, unknown> = {};

		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				const value = obj[key];
				const camelCaseKey = this.toCamelCase(key);
				newObj[camelCaseKey] = value;
			}
		}
		return newObj;
	}

	/**
	 * convert to CamelCase
	 * @param str
	 * @private
	 */
	private toCamelCase(str: string): string {
		return str.replace(/([-_][a-z])/gi, (group) => group.toUpperCase().replace('-', '').replace('_', '')).replace(/^\w/, (firstChar) => firstChar.toLowerCase());
	}

	/**
	 * This method reads the filter data
	 **/
	public loadFilterBaseData(filterType: SelectionStatementSearchType) {
		return new Promise((resolve) => {
			if (!this.initDone) {
				this.refresh(filterType).then(() => {
					resolve(this.availableFilterDefs);
				});
			} else {
				resolve(this.availableFilterDefs);
			}
		});
	}

	/**
	 * remove the selected filter dto in client.
	 * */
	public removeFilterDef(filterName: string): IFilterDefinitionEntity | null {
		const foundIdx = _.findIndex(this.availableFilterDefs, (item) => {
			return item.FilterName === filterName;
		});

		if (foundIdx >= 0) {
			// remove the selected filter dto
			this.availableFilterDefs.splice(foundIdx, 1);

			// select the next filter dto
			if (this.availableFilterDefs.length > 0) {
				// always take the new filter.
				return this.availableFilterDefs[0];
			}
		}

		return null;
	}

	public addUpdateFilterDef(filterDefParams: IFilterDefinitionEntity) {
		const newFilterDefDto = filterDefParams; //todo: new cloudDesktopEnhancedFilterService.FilterDefDto(filterDefParams);

		const foundIdx = _.findIndex(this.availableFilterDefs, function (item) {
			return item.FilterName === filterDefParams.FilterName;
		});

		if (foundIdx >= 0) {
			// if found, we have to override actual filter definition
			_.extend(this.availableFilterDefs[foundIdx], newFilterDefDto);
		} else {
			this.availableFilterDefs.push(newFilterDefDto);
		}

		return newFilterDefDto;
	}

	public async refresh(filterType: SelectionStatementSearchType) {
		await this.loadAllFilters(filterType).then(() => {
			this.initDone = true;
			const dto: IFilterDefinitionEntity = {
				FilterName: this.translateService.instant('cloud.desktop.filterdefDefaultFilterName').text,
				AccessLevel: 'New',
				FilterDef: '',
				Id: this.filterDtoIdCounter++,
				ModuleName: '',
				DisplayName: this.translateService.instant('cloud.desktop.filterdefDefaultFilterName').text,
			};

			const filterDefDto = dto; //todo: transform -> new cloudDesktopEnhancedFilterService.FilterDefDto(dto);
			this.availableFilterDefs.unshift(filterDefDto);
			this.selectedFilterDefDto = filterDefDto;
		});
	}

	/**
	 *  @function sortFilterDef
	 * we first sort the new array and then clear origin array and add each item individual.
	 * We need to keep origin array attached to the angular watch mechanism
	 *
	 * if !filterDef    >> we take service.availableFilterDefs
	 */
	public sortFilterDef(filterDef: IFilterDefinitionEntity[]) {
		const sortedFilterDef = _.sortBy(filterDef || this.availableFilterDefs, (a) => {
			return [a.AccessLevel, a.FilterName];
		});
		this.availableFilterDefs.length = 0;

		_.forEach(sortedFilterDef, (item) => {
			this.availableFilterDefs.push(item);
		});
	}
}
