/**
 * Created by zwz on 2025/4/9.
 */
(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.item';
	const module = angular.module(moduleName);

	module.factory('productionplanningItemJobBundleDataService', BundleDataService);

	BundleDataService.$inject = ['$injector', '$http', '$q', 'moment',
		'$translate',
		'platformModalService',
		'transportplanningBundleDataServiceContainerBuilder',
		'productionplanningItemDataService',
		'basicsLookupdataLookupDescriptorService',
	];

	function BundleDataService($injector, $http, $q, moment,
		$translate,
		platformModalService,
		ServiceBuilder,
		parentService,
		basicsLookupdataLookupDescriptorService) {

		const mainOptionsType = 'flatNodeItem';
		const serviceInfo = {
			module: module,
			serviceName: 'productionplanningItemJobBundleDataService'
		};
		var validationService;
		const getHeaderOfSelectedPU = () => {
			const selectedItem = parentService.getSelected();
			if (selectedItem) {
				return basicsLookupdataLookupDescriptorService.getLookupItem('PpsHeader', selectedItem.PPSHeaderFk);
			}
			return null;
		};
		const httpResource = {
			endRead: 'listbyjobofppsheader',
			initReadData: function initReadData(readData) {
				const ppsHeader = getHeaderOfSelectedPU();
				let jobId = ppsHeader?.LgmJobFk ?? -1;
				readData.filter = `?jobId=${jobId}`;
				// remark: generally, LgmJobFk of ppsItem is equal to LgmJobFk of ppsHeader, But to be serious, we still get LgmJobFk from ppsHeader
			}
		};
		const entityRole = {
			node: {
				itemName: 'JobBundle',
				parentService: parentService,
				parentFilter: 'ppsItemId'
			}
		};
		const actions = {
			create: 'flat',
			delete: {},
			canDeleteCallBackFunc: function (item) {
				const childServices = serviceContainer.service.getChildServices();
				const productOfJobService = childServices.find(e => e.getServiceName() === 'productionplanningItemJobBundleProductDataService');
				if(productOfJobService && productOfJobService.getList().length > 0){
					return false;
				}

				if (item.IsLinkedToProducts === true) {
					return false;
				}
				return true;
			}
		};
		const presenter = {
			list: {
				handleCreateSucceeded: function (item, data) {
					const seletedPU = parentService.getSelected()
					const ppsHeader = getHeaderOfSelectedPU();
					if (ppsHeader) {
						item.LgmJobFk = ppsHeader.LgmJobFk;
						item.ProjectFk = ppsHeader.PrjProjectFk;
						item.BasUomLengthFk = seletedPU.UomFk;
						item.BasUomWidthFk = seletedPU.UomFk;
						item.BasUomHeightFk = seletedPU.UomFk;
						item.BasUomWeightFk = seletedPU.UomFk;
					}
					// set stack
					const stackCreationData = {
						Id:seletedPU.EngDrawingDefFk
					}
					$http.post(globals.webApiBaseUrl + 'productionplanning/drawing/stack/create', stackCreationData).then(function (respond) {
						const stack = respond?.data;
						if (stack) {
							stack.Code = item.Code;
							stack.DescriptionInfo = item.DescriptionInfo;
							stack.Length = item.Length;
							stack.UomLengthFk = item.BasUomLengthFk;
							stack.Width = item.Width;
							stack.UomWidthFk = item.BasUomWidthFk;
							stack.Height = item.Height;
							stack.UomHeightFk = item.BasUomHeightFk;
							stack.Weight = item.Weight;
							stack.UomWeightFk = item.BasUomWeightFk;
							item.EngStackFk = stack.Id;
							item.Stack = stack;
						}
					});
				},
			}
		};
		const builder = new ServiceBuilder(mainOptionsType);
		const serviceContainer = builder
			.setServiceInfo(serviceInfo)
			.setValidationService(validationService)
			.setHttpResource(httpResource)
			.setPresenter(presenter)
			.setEntityRole(entityRole)
			.setActions(actions)
			.build();

		const originalCreateItemFn = serviceContainer.service.createItem;
		serviceContainer.service.createItem = function () {
			const selectedItem = parentService.getSelected();
			if(_.isNil(selectedItem.EngDrawingDefFk)){
				// let msgText = $translate.instant('productionplanning.item.productStacker.errorNotDrawingOfPu');
				//				"errorNotDrawingOfPu": "Please set drawing of selected Production Unit first",
				let msgText = 'Please set drawing of selected Production Unit first';
				platformModalService.showMsgBox(msgText, '', 'warning');
			} else {
				originalCreateItemFn();
			}
		}

		return serviceContainer.service;
	}
})(angular);