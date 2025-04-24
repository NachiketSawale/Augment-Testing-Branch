/*
 * Copyright(c) RIB Software GmbH
 */

import { map, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';
import { BasicsCharacteristicSection, ICharacteristicDataEntity, IPrcStructureEntity } from '@libs/basics/interfaces';
import { MaterialSearchRequest } from '../model/material-search-request';
import { MaterialSearchResponse } from '../model/material-search-response';
import { IMaterialSearchEntity } from '../model/interfaces/material-search-entity.interface';
import { IMaterialSearchError } from '../model/interfaces/material-search-error.interface';
import { IAlternativeSource } from '../model/interfaces/alternative-source.interface';
import { IMaterialSearchCatalog } from '../model/interfaces/material-search-catalog.interface';
import { IMaterialAttributeRangeMinMaxEntity } from '../model/interfaces/material-search-attribute-range.interface';
import { IMaterialAttributeLoadEntity } from '../model/interfaces/material-search-attribute-load.interface';
import { IMaterialAttributeUomEntity } from '../model/interfaces/material-search-attribute-uom.interface';
import { IMaterialAttributeCo2SourcesEntity } from '../model/interfaces/material-search-attribute-co2sources.interface';
import { IMaterialSearchDocumentResponse } from '../model/interfaces/material-search-document-entity.interfact';

/**
 * Service to handle material search
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedMaterialSearchService {
	private readonly httpService = inject(PlatformHttpService);
	protected http = inject(HttpClient);
	protected configurationService = inject(PlatformConfigurationService);
	protected queryPath = this.configurationService.webApiBaseUrl + 'basics/material/commoditysearch/';

	/**
	 * Initialize the material search result with the selected material, only for material lookup
	 * @param materialId
	 */
	public init(materialId: number) {
		const request = new MaterialSearchRequest();

		request.MaterialId = materialId;

		// process request to add custom search filter.
		this.processSearchRequest(request);

		return this.http.post(this.queryPath + 'initialnew', request).pipe(
			map((res) => {
				const response = res as MaterialSearchHttpResponse;
				return this.createSearchResponse(request, response);
			}),
		);
	}

	/**
	 * Search material from server
	 * @param request
	 * @param simpleMode
	 */
	public search(request: MaterialSearchRequest, simpleMode?: boolean) {
		if (request.EnableOnlyMainContract === false) {
			request.Filter.BasisContractId = undefined;
		}

		// process request to add custom search filter.
		this.processSearchRequest(request);

		return this.http.post(this.queryPath + (simpleMode ? '1.0/simplesearch' : '1.0/search'), request).pipe(
			map((res) => {
				const response = res as MaterialSearchHttpResponse;
				if (response && response.TraceLog) {
					console.log(response.TraceLog);
				}
				return this.createSearchResponse(request, response);
			}),
		);
	}

	/**
	 * load more attributes
	 * @param data
	 */
	public loadAttribute(data: MaterialSearchRequest) {
		return this.http.post(this.queryPath + 'loadmoreattribute', data).pipe(
			map((res) => {
				return res as IMaterialAttributeLoadEntity[];
			}),
		);
	}

	/**
	 * Initialize search request when search view opening
	 * @param request
	 * @protected
	 */
	public initSearchRequest(request: MaterialSearchRequest) {}

	/**
	 * Process search request before searching
	 * @param request
	 * @protected
	 */
	protected processSearchRequest(request: MaterialSearchRequest) {}

	private createSearchResponse(request: MaterialSearchRequest, httpResponse: MaterialSearchHttpResponse) {
		const response = new MaterialSearchResponse();
		response.hasResult = true;

		this.preprocessSearchResponse(request, httpResponse);

		if (request.IsResetCatalog) {
			response.categories = httpResponse.MaterialCategories;
			response.alternativeSources = httpResponse.AlternativeSources;
		}

		response.structures = httpResponse.Structures;

		if (request.IsResetAttribute) {
			response.attributes = httpResponse.Attributes;
			response.attributesFinished = false;
			response.uoms = httpResponse.Uoms;
			response.co2sources = httpResponse.Co2Sources;

			if (httpResponse.PriceRange) {
				response.price = {
					Min: httpResponse.PriceRange.MinValue,
					Max: httpResponse.PriceRange.MaxValue,
					Value: [httpResponse.PriceRange.MinValue, httpResponse.PriceRange.MaxValue],
				};
			} else {
				response.price = null;
			}

			if (httpResponse.Co2ProjectRange) {
				response.co2project = {
					Min: httpResponse.Co2ProjectRange.MinValue,
					Max: httpResponse.Co2ProjectRange.MaxValue,
					Value: [httpResponse.Co2ProjectRange.MinValue, httpResponse.Co2ProjectRange.MaxValue],
				};
			} else {
				response.co2project = null;
			}

			if (httpResponse.Co2SourceRange) {
				response.co2source = {
					Min: httpResponse.Co2SourceRange.MinValue,
					Max: httpResponse.Co2SourceRange.MaxValue,
					Value: [httpResponse.Co2SourceRange.MinValue, httpResponse.Co2SourceRange.MaxValue],
				};
			} else {
				response.co2source = null;
			}
		}

		response.matchedCount = httpResponse.MatchedCount;
		response.maxGroupCount = httpResponse.MaxGroupCount;
		response.items = httpResponse.Materials;
		response.errors = httpResponse.InternetCatalogErrors;

		//initPriceList();
		//setCache(httpResponse.Materials);
		//service.processFrameworkCatalog();
		//basicsMaterialMaterialBlobService.provideImage(response.items);
		//response.groups = groupBy(httpResponse, 'InternetCatalogFk');
		response.internetCategories = httpResponse.InternetCategories;

		this.postprocessSearchResponse(request, response);

		return response;
	}

	/**
	 * Preprocess search response once http returns
	 * @param request
	 * @param httpResponse
	 * @protected
	 */
	protected preprocessSearchResponse(request: MaterialSearchRequest, httpResponse: MaterialSearchHttpResponse) {}

	/**
	 * Postprocess search response in the end
	 * @param request
	 * @param response
	 * @protected
	 */
	protected postprocessSearchResponse(request: MaterialSearchRequest, response: MaterialSearchResponse) {}

	/**
	 * get preview attribute
	 * @param item
	 * @protected
	 */
	public getPreviewAttribute(item: IMaterialSearchEntity): Observable<IMaterialAttributeLoadEntity[]> {
		return new Observable((observer) => {
			this.http
				.get(
					this.queryPath + '1.0/listattributes',
					item.InternetCatalogFk
						? {
								params: {
									materialId: item.Id,
									catalogId: item.InternetCatalogFk as number,
								},
							}
						: {
								params: {
									materialId: item.Id,
								},
							},
				)
				.subscribe((res) => {
					observer.next(res as IMaterialAttributeLoadEntity[]);
					observer.complete();
				});
		});
	}

	/**
	 * get material document by a material
	 * @param item
	 */
	public getDocumentByMaterial(item: IMaterialSearchEntity): Observable<IMaterialSearchDocumentResponse> {
		return new Observable((observer) => {
			let request;
			if (item.InternetCatalogFk) {
				request = this.http.get(this.queryPath + '1.0/internetDoc?materialId=' + item.Id + '&catalogId=' + item.InternetCatalogFk);
			} else {
				request = this.http.post(this.configurationService.webApiBaseUrl + 'basics/material/document/listbyparent', { PKey1: item.Id });
			}
			request.subscribe((response) => {
				const data = response as IMaterialSearchDocumentResponse;
				data.Main = data.Main.filter((d) => {
					return d.DocumentTypeFk && data.DocumentType.find((e) => d.DocumentTypeFk === e.Id);
				});
				observer.next(data);
				observer.complete();
			});
		});
	}

	/**
	 * get material characteristics by a materialId
	 * @param materialId
	 */
	public async getCharacteristics(materialId: number): Promise<ICharacteristicDataEntity[]> {
		return this.httpService.get<ICharacteristicDataEntity[]>('basics/characteristic/data/list', {
			params: {
				sectionId: BasicsCharacteristicSection.Material,
				mainItemId: materialId
			}
		});
	}
}

interface MaterialSearchHttpResponse {
	MaterialIdSelected: number;
	MatchedCount: number;
	MaxGroupCount: number;
	Materials: IMaterialSearchEntity[];
	MaterialCategories: IMaterialSearchCatalog[];
	Structures: IPrcStructureEntity[];
	Attributes: IMaterialAttributeLoadEntity[];
	Uoms: IMaterialAttributeUomEntity[];
	Co2Sources: IMaterialAttributeCo2SourcesEntity[];
	PriceRange: IMaterialAttributeRangeMinMaxEntity;
	Co2ProjectRange: IMaterialAttributeRangeMinMaxEntity;
	Co2SourceRange: IMaterialAttributeRangeMinMaxEntity;
	AlternativeSources: IAlternativeSource[];
	InternetCategories: unknown[];
	InternetCatalogErrors: IMaterialSearchError[];
	TraceLog: string;
}
