## Switch on Scope and Watch count for easy debugging

### module 'Cloud.desktop' file ./controller/mainframe.js

set property show to true switches watchesInfo On.

	$scope.watchesInfo = {
		show: true,
		watches: function () {
			return cloudDesktopEnhancedFilterService.getWatchCount();
		}
	};
	
	


## Enhanced Filter 

### Recipe to active enhanced filter 

-	prepare module for working with data dictionary
--	add module to BAS_MODULE table (swhould be done anayway)
--	add module with root table into datadictionary table (BAS_DDMODULE).
this is done via added module into dd-generation script (...) 
-	activate filter in module 


#### Active filter in module

in your application Data Factory Service 
 
 in sidebarSearchOptions you must set the filter options:
   	modulename:  <module name from BAS_MODULE> i.e.  'businesspartner.main'
   	enhancedSearchEnabled:   true | false
   	.....
  	
   	
 code Sample from business partner: i.e. file businesspartner-main-controller.js

	angular.module(moduleName).factory('businesspartnerMainHeaderDataService',
	['platformDataServiceFactory', 'platformContextService', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService',
		'cloudDesktopSidebarService','cloudCommonBlobDataService', 'businessPartnerHelper', 'platformRuntimeDataService', 'basicsLookupdataLookupDataService',
		/* jshint -W072*/ //many parameters because of dependency injection
		function (platformDataServiceFactory, platformContextService, basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService,
					cloudDesktopSidebarService,cloudCommonBlobDataService, businessPartnerHelper, platformRuntimeDataService, basicsLookupdataLookupDataService) {
			var itemName = 'BusinessPartner',
				codeField = 'BusinessPartnerName1',
				descField = 'BusinessPartnerName2';
	
			var sidebarSearchOptions = {
				moduleName: moduleName,  // required for filter initialization
				enhancedSearchEnabled: true,
				pattern: '',
				orderBy: [{Field: 'BusinessPartnerName1'}],
				useCurrentClient: false,
				includeNonActiveItems: false,
				showOptions: true,
				showProjectContext: false,
				withExecutionHints: false
			};
			
#### Server Side filtering must handle enhanced filter

while parsing the filter, check for flag 'IsEnhancedFilter', idf true call enhanced filter processing logic
	FilterType2Logic.GetFilterType2Results, and add query similar to pKey Array 
	query = query.Where(e => resultKeys.Contains(e.Id));

	if (filterIn.IsEnhancedFilter.HasValue && filterIn.IsEnhancedFilter.Value)
	{
		var resultKeys = FilterType2Logic.GetFilterType2Results(filterIn, useJson: true) ?? new int[] { };
		query = query.Where(e => resultKeys.Contains(e.Id));
	}


### Sample Code Business Partner

	public IEnumerable<BusinessPartnerEntity> GetBusinessPartnerByFilter(FilterRequest<Int32> filterIn, ref FilterResponse<Int32> filterOut)
	{
		// if you want to report execution info then use it here
		// ExecutionInfo<Int32> execInfo = new ExecutionInfo<int>(filterIn, filterOut, true);
		try
		{
			using (var dbContext = new RVPBizComp.DbContext(ModelBuilder.DbModel))
			{
				IQueryable<BusinessPartnerEntity> query = null;
	
				query = dbContext.Entities<BusinessPartnerEntity>();
				if (filterIn.IncludeNonActiveItems == null || !filterIn.IncludeNonActiveItems.Value)
				{
					query = query.Where(e => e.IsLive == true);
				}
	
				if (filterIn.UseCurrentClient.HasValue && filterIn.UseCurrentClient.Value)
				{
					var loginCompanyFk = BusinessApplication.BusinessEnvironment.CurrentContext.ClientId;
					query = query.Where(e => e.BpdBp2BasCompanyEntities.Any(c => c.CompanyFk == loginCompanyFk));
				}
	
				if (!string.IsNullOrWhiteSpace(filterIn.Pattern))
				{
					// expand filterIn.Pattern to Like expression
					query = FilterRequest<Int32>.ExpandToSearchPattern(filterIn, query,
						filterVal => "SearchPattern.Contains(\"" + filterVal + "\")");
				}
				if (filterIn.PKeys != null)
				{
					query = query.Where(e => filterIn.PKeys.Contains(e.Id));
				}
	
				if (filterIn.IsEnhancedFilter.HasValue && filterIn.IsEnhancedFilter.Value)
				{
					var resultKeys = FilterType2Logic.GetFilterType2Results(filterIn, useJson: true) ?? new int[] { };
					query = query.Where(e => resultKeys.Contains(e.Id));
				}
	
	
				// handle paging within this method completely
				IList<BusinessPartnerEntity> entities = null;
				entities = filterIn.OrderBy == null ?
						FilterRequest<Int32>.RetrieveEntities(filterIn, filterOut, query, e => e.BusinessPartnerName1, e => e.Id)
						: FilterRequest<Int32>.RetrieveEntities(filterIn, filterOut, query);
	
				//entities.Translate(this.UserLanguageId, new Func<UoMEntity, DescriptionTranslateType>[] { e => e. });
	
				return entities;
			}
		}
		catch (Exception ex)
		{
			throw new OPN.BusinessLayerException(ex.Message, ex) { ErrorCode = (Int32)OPN.ExceptionErrorCodes.BusinessFatalError };
		}
	}


	
	
		