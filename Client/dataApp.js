'use strict';

/* App Module */

var app = angular.module('webixApp', ['webix', 'ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app.controller("webixTestController", function ($scope, $http, $uibModal) {

	$scope.records = [];
	$scope.rowId = -1;
	$scope.newEmployee = {};
	$scope.totalItems = 100;
	$scope.currentPage = 1;
	$scope.itemPerPage = 10;

	$scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
	};

	$scope.pageChanged = function () {
	//	console.log('Page changed to: ' + $scope.currentPage);
		$scope.pageLoad();
	};
	$scope.pageLoad = function () {
		$http({
			url: "http://localhost:5100/api/Employee/GetEmployees/" + $scope.currentPage + "/" + $scope.itemPerPage,
			method: "GET",
			params: { cur: $scope.currentPage, total: $scope.itemPerPage }
		}).then(
			function successCallback(response) {
			//	console.log("Result : " + JSON.stringify(response));
				$scope.totalItems = response.data.pagination.totalItems;
				$scope.records = response.data.employees;
				$scope.currentPage = response.data.pagination.currentPage;
			},
		);
	};


	$scope.pageLoad();

	$scope.submitForm = function () {
	//	console.log(JSON.stringify($scope.newEmployee));
		$http.post('http://localhost:5100/api/Employee/SaveEmployees', JSON.stringify($scope.newEmployee)).
			then(
				$scope.pageLoad()
			);
	}
	$scope.getRow = function (item) {
		$scope.rowId = item;
	}
	$scope.deleteRecord = function () {
		if ($scope.rowId != -1) {
			alert($scope.rowId);
			$http.post('http://localhost:5100/api/Employee/DeleteEmployees/'+ $scope.rowId).
				then(
					$scope.pageLoad()
				);
		}
	}
	$scope.addRecord = function (size, parentSelector) {
		var parentElem = parentSelector ?
			angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'myModalContent.html',
			controller: 'webixTestController',
			size: size,
			appendTo: parentElem,
			resolve: {

			}
		});

		modalInstance.result.then(function (selectedItem) {
			$ctrl.selected = selectedItem;
		}, function () {
			//		$log.info('Modal dismissed at: ' + new Date());
		});
	};
});

