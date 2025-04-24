/*
 * $Id$
* Copyright(c) RIB Software GmbH
*/
import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

import { WebApiHelpMainService } from '../../services/webapihelp-main.service';

import { WebApiHelpMainSwaggerContentComponent } from './webapihelp-main-swagger-content.component';
import { WebApiHelpMainPaginatorComponent } from '../webapihelp-main-paginator/webapihelp-main-paginator.component';
import { PlatformConfigurationService } from '@libs/platform/common';
import { StsConfigLoader, OidcSecurityService } from 'angular-auth-oidc-client';
import { PlatformAuthService } from '@libs/platform/authentication';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('WebApiHelpMainSwaggerContentComponent', () => {
	let component: WebApiHelpMainSwaggerContentComponent;
	let fixture: ComponentFixture<WebApiHelpMainSwaggerContentComponent>;
	let service: OidcSecurityService;
	const mockAccessToken = 'hSsrV6A4RJnXHf1mYBYsqEc/EYKJhCUoFbfQTDNN7QWOqAVfm9+bmlBSusr/HEFd6yAuPSYZwpICkxPxgNIo4ltqDfunmMfDlcwHyumdmu4=';
	const mockData = {
		'swagger': '2.0',
		'RIBDocTotalPage': 1,
		'RIBDocCurrentPageIndex': 1,
		'info': {
			'version': 'v1',
			'title': 'iTWO 4.0 API'
		},
		'host': 'apps-int.itwo40.eu',
		'basePath': '/itwo40/daily/services',
		'schemes': [
			'https'
		],
		'paths': {
			'/basics/publicapi/address/2.0': {
				'get': {
					'tags': [
						'basics.publicapi (v2.0)'
					],
					'summary': 'Returns items of type address as specified by OData arguments.',
					'description': '# Summary\r\n\r\n> Returns items of type address as specified by OData arguments.\r\n# Description\r\n> In the following, request and response are described in detail.\r\n> <h4> <strong> Request Parameters </strong> </h4>This endpoint allows for retrieving items based on a subset of the parameters specified by the [OData URL conventions](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html). The following parameters are supported:<blockquote><table><tr><th> Parameter </th><th> Type </th><th> Optional </th><th> Description </th></tr><tr><td> $skip                   </td><td> { Int32 } </td><td> <em>Optional</em> </td><td> Indicates the number of items from the result set to skip before the first item to return. </td></tr><tr><td> $top                    </td><td> { Int32 } </td><td> <em>Optional</em> </td><td> Indicates the maximum number of items to return. </td></tr><tr><td> $select                 </td><td> { String } </td><td> <em>Optional</em> </td><td> A comma-separated list of one or more properties of the result object to return. </td></tr><tr><td> $orderBy                </td><td> { String } </td><td> <em>Optional</em> </td><td> A comma-separated list of one or more properties of the result object to order the result set by. </td></tr><tr><td> $filter                 </td><td> { String } </td><td> <em>Optional</em> </td><td> Any filter restrictions for the result set. </td></tr> </table> </blockquote> <h4> <strong> Return </strong> </h4> <blockquote> <h4> <strong> response </strong>  - { Array&lt;Object&gt; } </h4><table><tr><th> Parameter </th><th> Type </th><th> Description </th></tr><tr name=\'.Id\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> Id </td><td> { Int32 } </td><td> Id of the Address </td></tr><tr name=\'.CountryId\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> CountryId </td><td> { Int32 } </td><td> Id of the Country </td></tr><tr name=\'.Iso2\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> Iso2 </td><td> { String } </td><td> Length:[0,2]. Iso2 of the Country </td></tr><tr name=\'.Iso3\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> Iso3 </td><td> { String } </td><td> Length:[0,3]. Iso3 of the Country </td></tr><tr name=\'.CountryDescription\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> CountryDescription </td><td> { String } </td><td> Length:[0,2000]. Description of the Country </td></tr><tr name=\'.StateId\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> StateId </td><td> { Int32? } </td><td> Id of the State </td></tr><tr name=\'.State\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> State </td><td> { String } </td><td> Length:[0,16]. Short for State </td></tr><tr name=\'.StateDescription\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> StateDescription </td><td> { String } </td><td> Length:[0,252]. Description of the State </td></tr><tr name=\'.Street\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> Street </td><td> { String } </td><td> Length:[0,255]. Street of the Address </td></tr><tr name=\'.City\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> City </td><td> { String } </td><td> Length:[0,252]. City of the Address </td></tr><tr name=\'.Zipcode\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> Zipcode </td><td> { String } </td><td> Length:[0,20]. Zip code of the Address </td></tr><tr name=\'.County\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> County </td><td> { String } </td><td> Length:[0,252]. County of the Address </td></tr><tr name=\'.Address\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> Address </td><td> { String } </td><td> Length:[0,2000]. Formated Address </td></tr><tr name=\'.AddressLine\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> AddressLine </td><td> { String } </td><td> Length:[0,2000]. Formated Address </td></tr><tr name=\'.AddressModified\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> AddressModified </td><td> { Boolean } </td><td> Address is Modified </td></tr><tr name=\'.Longitude\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> Longitude </td><td> { Decimal? } </td><td> Longitude of the Address </td></tr><tr name=\'.Latitude\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> Latitude </td><td> { Decimal? } </td><td> Latitude of the Address </td></tr><tr name=\'.Supplement\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> Supplement </td><td> { String } </td><td> Length:[0,255]. Supplement of the Address </td></tr><tr name=\'.InsertedAt\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> InsertedAt </td><td> { DateTime } </td><td> DateTime of creation. </td></tr><tr name=\'.InsertedBy\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> InsertedBy </td><td> { Int32 } </td><td> User who has created the data. </td></tr><tr name=\'.UpdatedAt\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> UpdatedAt </td><td> { DateTime? } </td><td> DateTime of last update. </td></tr><tr name=\'.UpdatedBy\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> UpdatedBy </td><td> { Int32? } </td><td> User who has updated the data. </td></tr><tr name=\'.Version\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> Version </td><td> { Int32 } </td><td> Version counter used for optimistic locking. </td></tr><tr name=\'.LanguageId\'  ref=\'\' level=\'0\' collapse=\'false\'  class=\'ref- level-0 collapse-false \'><td> LanguageId </td><td> { Int32 } </td><td> Provides the data language id, used for translation operations of data description. </td></tr> </table> </blockquote>\r\n> \r\n> > #### **Example (response) - Auto Generated**\r\n> > ``` json\r\n> > [\r\n> >   {\r\n> >     \'Id\': 133,\r\n> >     \'CountryId\': 134,\r\n> >     \'Iso2\': \'sample string 135\',\r\n> >     \'Iso3\': \'sample string 136\',\r\n> >     \'CountryDescription\': \'sample string 137\',\r\n> >     \'StateId\': 138,\r\n> >     \'State\': \'sample string 139\',\r\n> >     \'StateDescription\': \'sample string 140\',\r\n> >     \'Street\': \'sample string 141\',\r\n> >     \'City\': \'sample string 142\',\r\n> >     \'Zipcode\': \'sample string 143\',\r\n> >     \'County\': \'sample string 144\',\r\n> >     \'Address\': \'sample string 145\',\r\n> >     \'AddressLine\': \'sample string 146\',\r\n> >     \'AddressModified\': true,\r\n> >     \'Longitude\': 148.0,\r\n> >     \'Latitude\': 149.0,\r\n> >     \'Supplement\': \'sample string 150\',\r\n> >     \'InsertedAt\': \'2023-08-14T00:00:00Z\',\r\n> >     \'InsertedBy\': 151,\r\n> >     \'UpdatedAt\': \'2023-08-14T00:00:00Z\',\r\n> >     \'UpdatedBy\': 152,\r\n> >     \'Version\': 153,\r\n> >     \'LanguageId\': 154\r\n> >   }\r\n> > ]\r\n> > ```\r\n',
					'externalDocs': {
						'description': 'OData URL Conventions',
						'url': 'http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html'
					},
					'operationId': 'get-basics-publicapi-address-2.0',
					'consumes': [
						'application/json',
						'text/json'
					],
					'produces': [
						'application/json',
						'text/json'
					],
					'parameters': [
						{
							'name': '$skip',
							'in': 'query',
							'description': 'Indicates the number of items from the result set to skip before the first item to return.',
							'required': false,
							'type': 'integer'
						},
						{
							'name': '$top',
							'in': 'query',
							'description': 'Indicates the maximum number of items to return.',
							'required': false,
							'type': 'integer'
						},
						{
							'name': '$select',
							'in': 'query',
							'description': 'A comma-separated list of one or more properties of the result object to return.',
							'required': false,
							'type': 'string'
						},
						{
							'name': '$orderBy',
							'in': 'query',
							'description': 'A comma-separated list of one or more properties of the result object to order the result set by.',
							'required': false,
							'type': 'string'
						},
						{
							'name': '$filter',
							'in': 'query',
							'description': 'Any filter restrictions for the result set.',
							'required': false,
							'type': 'string'
						}
					],
					'responses': {
						'200': {
							'description': 'HttpStatusCode.OK indicates that the request succeeded and that the requested information is in the response'
						},
						'201': {
							'description': 'HttpStatusCode.Created indicates that the request resulted in a new resource created before the response was sent'
						},
						'202': {
							'description': 'HttpStatusCode.Accepted indicates that the request has been accepted for further processing'
						},
						'204': {
							'description': 'HttpStatusCode.NoContent indicates that the request has been successfully processed and that the response is intentionally blank'
						},
						'205': {
							'description': 'HttpStatusCode.ResetContent indicates that the client should reset (not reload) the current resource'
						},
						'304': {
							'description': 'HttpStatusCode.NotModified indicates that the clients cached copy is up to date. The contents of the resource are not transferred'
						},
						'400': {
							'description': 'Invalid queryOptions supplied'
						},
						'401': {
							'description': 'HttpStatusCode.Unauthorized indicates that the requested resource requires authentication. The WWW-Authenticate header contains the details of how to perform the authentication'
						},
						'403': {
							'description': 'HttpStatusCode.Forbidden indicates that the server refuses to fulfill the request'
						},
						'404': {
							'description': 'Object not found'
						},
						'409': {
							'description': 'HttpStatusCode.Conflict indicates that the request could not be carried out because of a conflict on the server'
						},
						'415': {
							'description': 'HttpStatusCode.UnsupportedMediaType indicates that the request is an unsupported type'
						},
						'422': {
							'description': 'HttpStatusCode.UnprocessableEntity indicates that the request was well-formed but was unable to be followed due to semantic errors'
						},
						'500': {
							'description': 'HttpStatusCode.InternalServerError indicates that a generic error has occurred on the server'
						}
					},
					'RIBDeprecatedMessage': '',
					'RIBRelativePath': 'basics/publicapi/address/2.0'
				}
			}
		},
		'definitions': {}
	};

	const jsonMock = {
		'Id': 399,
		'CountryId': 400,
		'Iso2': 'sample string 401',
		'Iso3': 'sample string 402',
		'CountryDescription': 'sample string 403',
		'StateId': 404,
		'State': 'sample string 405',
		'StateDescription': 'sample string 406',
		'Street': 'sample string 407',
		'City': 'sample string 408',
		'Zipcode': 'sample string 409',
		'County': 'sample string 410',
		'Address': 'sample string 411',
		'AddressLine': 'sample string 412',
		'AddressModified': true,
		'Longitude': 414.0,
		'Latitude': 415.0,
		'Supplement': 'sample string 416',
		'InsertedAt': '2023-08-14T00:00:00Z',
		'InsertedBy': 417,
		'UpdatedAt': '2023-08-14T00:00:00Z',
		'UpdatedBy': 418,
		'Version': 419,
		'LanguageId': 420
	};
	let htmlString: string;
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule, MatProgressSpinnerModule],
			declarations: [WebApiHelpMainSwaggerContentComponent, WebApiHelpMainPaginatorComponent],
			providers: [OidcSecurityService, PlatformConfigurationService, StsConfigLoader, PlatformAuthService]
		}).compileComponents();
		service = TestBed.inject(OidcSecurityService);
		fixture = TestBed.createComponent(WebApiHelpMainSwaggerContentComponent);
		component = fixture.componentInstance;
		jest.spyOn(service, 'getAccessToken').mockImplementation(() => {
			return of(mockAccessToken);
		});
		component.loadSwaggerUi(mockData);
		htmlString = `<div class="opblock-body" data-event-bind="false">
		<div class="opblock-description-wrapper">
		  <div class="opblock-description">
			<div class="markdown">
			  <h1>Summary</h1>
			  <blockquote>
				<p>Returns items of type address as specified by OData arguments.</p>
			  </blockquote>
			  <h1>Description</h1>
			  <blockquote class="expand">
				<p>In the following, request and response are described in detail.<br>
				</p>
				<h4> <strong> Request Parameters </strong> </h4>This endpoint allows for retrieving items based on a subset of
				the parameters specified by the <a rel="noopener noreferrer" target="_blank"
				  href="http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html">OData URL
				  conventions</a>. The following parameters are supported:<blockquote>
				</blockquote>
				<h4> <strong> Return </strong> </h4>
				<blockquote>
				  <h4> <strong> response </strong> - { Array&lt;Object&gt; } </h4>
				</blockquote>
				<p></p>
				<blockquote>
				  <h4><strong>Example (response) - Auto Generated</strong></h4>
				  <pre style="position: relative;">
				  <code class="language-json">[
					{
					  <span class="key">"Id":</span> <span class="number">2135</span>,
					  <span class="key">"CountryId":</span> <span class="number">2136</span>,
					  <span class="key">"Iso2":</span> <span class="string">"sample string 2137"</span>,
					  <span class="key">"Iso3":</span> <span class="string">"sample string 2138"</span>,
					  <span class="key">"CountryDescription":</span> <span class="string">"sample string 2139"</span>,
					  <span class="key">"StateId":</span> <span class="number">2140</span>,
					  <span class="key">"State":</span> <span class="string">"sample string 2141"</span>,
					  <span class="key">"StateDescription":</span> <span class="string">"sample string 2142"</span>,
					  <span class="key">"Street":</span> <span class="string">"sample string 2143"</span>,
					  <span class="key">"City":</span> <span class="string">"sample string 2144"</span>,
					  <span class="key">"Zipcode":</span> <span class="string">"sample string 2145"</span>,
					  <span class="key">"County":</span> <span class="string">"sample string 2146"</span>,
					  <span class="key">"Address":</span> <span class="string">"sample string 2147"</span>,
					  <span class="key">"AddressLine":</span> <span class="string">"sample string 2148"</span>,
					  <span class="key">"AddressModified":</span> <span class="boolean">true</span>,
					  <span class="key">"Longitude":</span> <span class="number">2150.0</span>,
					  <span class="key">"Latitude":</span> <span class="number">2151.0</span>,
					  <span class="key">"Supplement":</span> <span class="string">"sample string 2152"</span>,
					  <span class="key">"InsertedAt":</span> <span class="string">"2023-08-17T00:00:00Z"</span>,
					  <span class="key">"InsertedBy":</span> <span class="number">2153</span>,
					  <span class="key">"UpdatedAt":</span> <span class="string">"2023-08-17T00:00:00Z"</span>,
					  <span class="key">"UpdatedBy":</span> <span class="number">2154</span>,
					  <span class="key">"Version":</span> <span class="number">2155</span>,
					  <span class="key">"LanguageId":</span> <span class="number">2156</span>
					}
				  ]
				  </code>
				  <a class="copy-code">Copy</a>
				  </pre>
				</blockquote>
				<a class="content-switcher top collapsed" title="Collapsed/Expand"></a><a
				  class="content-switcher bottom collapsed" title="Collapsed"></a>
			  </blockquote>
			</div>
		  </div>
		</div>
	  </div>`;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('searchedData', () => {
		component.searchData = 'Basics';
		expect(component.searchData).toBeDefined();
	});

	it('reloadFlagData', () => {
		component.reloadFlagData = false;
		expect(component.reloadFlagData).toBeDefined();
	});

	it('getDatafromPageNum', inject([WebApiHelpMainService], (WebApiHelpService: WebApiHelpMainService) => {
		const spy = jest.spyOn(WebApiHelpService, 'getDataFromPageNumber').mockReturnValue(of(mockData));
		const subspy = jest.spyOn(WebApiHelpService.getDataFromPageNumber('', 1, false), 'subscribe');
		component.dataGetFromPageNumber(1);
		expect(spy).toHaveBeenCalled();
		expect(subspy).toHaveBeenCalled();
	}));


	it('changePage', () => {
		jest.spyOn(component, 'changePage');
		component.changePage(1);
		expect(component.changePage).toBeDefined();
	});

	it('toGetTockenAccess', inject([OidcSecurityService], (OidcSecurityService: OidcSecurityService) => {
		const spy = jest.spyOn(OidcSecurityService, 'getAccessToken').mockReturnValue(of(mockAccessToken));
		const subspy = jest.spyOn(OidcSecurityService.getAccessToken(), 'subscribe');
		component.toGetTockenAccess();
		expect(subspy).toHaveBeenCalled();
		expect(spy).toHaveBeenCalled();
	}));

	it('isJsonLike', () => {
		jest.spyOn(component, 'isJsonLike');
		component.isJsonLike('{}');
		expect(component.isJsonLike).toBeDefined();
	});

	it('isJsonLike with object', () => {
		jest.spyOn(component, 'isJsonLike');
		component.isJsonLike(JSON.stringify(jsonMock));
		expect(component.isJsonLike).toBeDefined();
	});

	it('isJsonLike for match /(\'w+)=([^&]+)/gi', () => {
		jest.spyOn(component, 'isJsonLike');
		component.isJsonLike('/(\'w+)=([^&]+)/gi');
		expect(component.isJsonLike).toBeDefined();
	});


	it('jsonFormat', () => {
		jest.spyOn(component, 'jsonFormat');
		component.jsonFormat('param1=value1&param2=value2&param3=value3');
		const obj = {
			'key': 'value',
			'number': 123,
			'boolean': true,
			'nullValue': null,
			'unicode': '\u2764\ufe0f'
		};
		component.jsonFormat(JSON.stringify(obj));
		expect(component.jsonFormat).toBeDefined();
	});

});
