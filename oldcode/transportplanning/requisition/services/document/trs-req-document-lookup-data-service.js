(angular => {
	'use strict';
	const moduleName = 'transportplanning.requisition';
	angular.module(moduleName).service('trsReqDocumentLookupDataService', service);
	service.$inject = ['platformUtilService', 'productionplanningCommonDocumentDataServiceFactory', 'trsReqDocumentSourceWindowFilterService'];

	function service(platformUtilService, ppsCommonDocumentDataServiceFactory, trsReqDocumentSourceWindowFilterService) {
		const filterParams = [];
		let isPinned = false;
		let currentSource = null;

		const serviceOptions = {
			containerId: moduleName + '.documentLookup',
			parentService: 'transportplanningRequisitionMainService',
			endRead: 'filterBy',
			initReadDataFn: (readData) => {
				const filter = getCurrentFilter();
				readData.filter = '?' + filterParams.filter(param => filter[param] !== null)
					.map(param => param + '=' + filter[param])
					.join('&');
			}
		};

		const dataService = ppsCommonDocumentDataServiceFactory.getService(serviceOptions);
		Object.assign(this, dataService);

		this.createItem = false;
		this.deleteItem = false;
		this.canUploadFiles = () => false;
		this.singleUploadVisible = false;
		this.uploadCreateVisible = false;
		this.setDoNotLoadOnSelectionChange(true);
		this.setDoNotUnloadOwnOnSelectionChange(true);

		this.getPinState = () => isPinned;
		this.togglePinState = () => {
			isPinned = !isPinned;

			const selectedTrsReq = this.parentService().getSelected();
			this.filterBySelection(selectedTrsReq);
		};

		this.filterBySelection = selection => {
			if (isPinned) {
				return;
			}

			currentSource = selection;
			if (!currentSource) {
				return;
			}

			filterParams.forEach(p => {
				this.setSelectedFilter(p, currentSource[p]);
			});
		};

		this.setFilterParams = params => {
			filterParams.length = 0;
			filterParams.push(...params);
		};

		this.getSelectedFilter = filterParam => {
			const filter = getCurrentFilter();
			return filter[filterParam];
		};

		this.setSelectedFilter = (filterParam, value = null) => {
			if (isPinned) {
				return;
			}

			trsReqDocumentSourceWindowFilterService.setFilter(filterParam, value);
			delayLoad();
		};

		let delayLoad = platformUtilService.getDebouncedFn(this.load, 200);

		function getCurrentFilter() {
			return trsReqDocumentSourceWindowFilterService.getFilter();
		}
	}
})(angular);