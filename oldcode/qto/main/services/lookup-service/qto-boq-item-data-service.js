(function () {
	/* global globals */
	'use strict';
	angular.module('qto.main').factory('qtoBoqItemLookupDataService', ['_', '$http', '$q','$injector', 'qtoBoqType','qtoBoqStructureService','cloudCommonGridService','qtoMainHeaderDataService',
		function (_, $http, $q, $injector, qtoBoqType, qtoBoqStructureService, cloudCommonGridService, qtoMainHeaderDataService) {

			let service = {};
			let loadBoqPromise = null;
			let qtoMainDetailService= {};
			let boqType = null;


			function getBoqList (){
				let boqItemList =[];
				boqType = qtoMainDetailService.getBoqType();

				let qtoBoqStruService = angular.copy(qtoBoqStructureService);
				if(boqType === qtoBoqType.PrjBoq || boqType === qtoBoqType.PrcBoq ||  boqType === qtoBoqType.PesBoq) {
					qtoBoqStruService = angular.copy(qtoMainDetailService.getParentService());
				}
				boqItemList = qtoBoqStruService.getList ();

				if(!boqItemList.length){

					if(!loadBoqPromise){
						let qtoHeader = qtoMainHeaderDataService.getSelected();
						if(!qtoHeader){
							qtoHeader = qtoMainDetailService.getQtoHeader();
						}
						let BoqHeaderFk = qtoHeader.BoqHeaderFk > 0 ? qtoHeader.BoqHeaderFk : 0;
						let isWip = qtoHeader.QtoTargetType === 2 || qtoHeader.QtoTargetType === 4;
						let isPes = qtoHeader.QtoTargetType === 1 || qtoHeader.QtoTargetType === 3;
						let callingContext = {};
						callingContext.QtoHeader = qtoHeader;
						qtoBoqStruService.setSelectedProjectId(qtoHeader.ProjectFk);
						loadBoqPromise = qtoBoqStruService.setSelectedHeaderFk(BoqHeaderFk, true, isPes, isWip, false, callingContext);
					}

					return loadBoqPromise.then(function () {
						loadBoqPromise = null;
						boqItemList = qtoBoqStruService.getList();
						return boqItemList;
					});
				}
				return $q.when(boqItemList);
			}

			function  getBoqItemList () {
				let qtoDetailList = qtoMainDetailService.getList();
				let qtoSelected = qtoMainDetailService.getSelected();

				return getBoqList().then(function (data) {
					let boqItemList = data;

					if(boqType === qtoBoqType.PrjBoq || boqType === qtoBoqType.PrcBoq ||  boqType === qtoBoqType.PesBoq){
						let param = {
							SelectQtoHeaderId:qtoSelected.QtoHeaderFk,
							BoqItemIds:_.map(boqItemList,'Id'),
							SelectQtoDetail:qtoSelected,
							QtoBoqType:boqType
						};
						return $http.post(globals.webApiBaseUrl + 'qto/main/detail/getBoqReferenceForType7', param).then(function (response) {
							return response.data;
						});

					}else{

						let qtoRefereceBoqItem = [];

						if (qtoDetailList && qtoDetailList.length) {

							let qtolist1 = _.groupBy(qtoDetailList, 'BoqItemFk');

							let boqItemIds = _.uniqBy(_.map(qtoDetailList, 'BoqItemFk'));
							_.forEach(boqItemIds, function (id) {
								let boq = {};
								if (qtoSelected && id !== qtoSelected.BoqItemFk) {
									let qList = qtolist1[id];
									if (qList && qList.length) {
										if (qtoSelected.QtoLineTypeFk === 6 && qtoSelected.PrjLocationReferenceFk) {
											qList = _.filter(qList, function (qLine) {
												return qtoSelected.PrjLocationReferenceFk > 0 && qLine.PrjLocationFk === qtoSelected.PrjLocationReferenceFk;
											});
										}

										if (qList && qList.length) {
											let resultTotal = qList.length > 0 ? _.sumBy(qList, 'Result') : 0;
											if (qtoSelected.QtoLineTypeFk === 6 && !qtoSelected.PrjLocationReferenceFk){
												resultTotal = 0;
											}

											boq.Result = resultTotal;
											boq.Id = qList[0].BoqItemFk;
											let boqItem = _.find(boqItemList, {Id: boq.Id});

											if (boqItem) {
												boq.Reference = boqItem.Reference;
												boq.BriefInfo = boqItem.BriefInfo.Description;
												boq.BasUomFk = boqItem.BasUomFk;
												qtoRefereceBoqItem.push(boq);
											}
										}
									}
								}
							});
						}

						return qtoRefereceBoqItem;

					}
				});
			}

			service.getList = function getList(){
				return $q.when(getBoqItemList());
			};

			service.setQtoDetailService = function (value){
				qtoMainDetailService = value;
			};

			service.getItemByKey=  function getItemByKey(value) {
				let promise = {};
				if (qtoMainDetailService.getServiceName() === 'qtoMainLineLookupService'){
					let detailLookupFilterService = $injector.get('qtoMainDetailLookupFilterService');
					let headerId = detailLookupFilterService.selectedQtoHeader ? detailLookupFilterService.selectedQtoHeader.BoqHeaderFk : 0;
					promise = getSimpleBoqItems(headerId);
				} else {
					promise = getBoqList();
				}

				return promise.then(function (data) {
					let boqItemList = [];
					cloudCommonGridService.flatten(data, boqItemList, 'BoqItems');

					return _.find(boqItemList, function (boq) {
						return boq.Id  === value;
					});
				});
			};

			let loadSimpleBoqPromise = null;
			function getSimpleBoqItems(headerId) {
				if (!loadSimpleBoqPromise) {
					loadSimpleBoqPromise = $http.get(globals.webApiBaseUrl + 'boq/main/simpleBoqItems?headerId=' + headerId);
				}

				return loadSimpleBoqPromise.then(function (response) {
					loadSimpleBoqPromise = null;
					return response.data;
				});
			}

			return service;
		}]);
})();

