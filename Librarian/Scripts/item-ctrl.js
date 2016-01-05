var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', ['ngRoute']);

Librarian.app.service("itemService", function ItemService($filter, $http, librarian) {
    var that = this;

    that.itemsUrl = $(".url-container.retrieve-model").val();
    that.singleItemUrl = $(".url-container.retrieve-single").val();

    that.addUrl = $(".url-container.create").val();
    that.deleteUrl = $(".url-container.delete").val();
    that.updateUrl = $(".url-container.update").val();

    that.pageSize = 200;
    that.totalPages = 100; //starting estimate

    var items = [];

    that.getItems = function ($scope) {
        if ($scope.gettingOrDone) return; //don't load while already loading
        $scope.gettingOrDone = true;
        $scope.items = $filter('filter')($scope.items, function (item) { return !item.$$specialFetch; });

        $http.post(that.itemsUrl,
            {
                pageSize: that.pageSize,
                pageNum: $scope.page++,
                filter: $scope.filter
            }).then(function (results) {
                that.totalPages = results.data.pages;

                $scope.items = $scope.items.concat(results.data.items);
                items = $scope.items;

                if (that.pageSize == results.data.items.length)
                    $scope.gettingOrDone = false;
                else
                    $scope.loadedAll = true;
            });

    };

    that.getItemByID = function (id, callback) {
        var itemsFound = $filter('filter')(items, '{ ID: ' + id + ' }', true);

        if (itemsFound.length == 1)
            callback(itemsFound[0]);

        $http.post(that.singleItemUrl, { id: id })
            .then(function (found) {
                items.push(angular.extend(found.data,{ $$specialFetch: true }));
                callback(found.data);
            })
    };

    that.addItem = function (item, $scope) {
        $scope.items.push(angular.extend(item, { $$specialFetch: true }));
        $scope.$emit('items:modifiedOrFiltered');
    };

    that.modifyItem = function (item, $scope) {
        $scope.$emit('items:modifiedOrFiltered');
    };

    that.removeItem = function (itemID, $scope) {
        $scope.items = $filter('filter')($scope.items, '{ ID: !' + itemID + '}');
        $scope.$emit("items:modifiedOrFiltered")
    };
})

.config(function ($routeProvider) {
    var indexContentUrl = $(".url-container.index").val();
    var detailsUrl = $(".url-container.details").val();
    var createUrl = $(".url-container.create-view").val();
    var editUrl = $(".url-container.edit").val();

    $routeProvider
    .when('/Detail/:itemID', {
        templateUrl: detailsUrl,
        controller: 'itemDetailCtrl',
        controllerAs: 'ctrl'
    })
    .when('/Create', {
        templateUrl: createUrl,
        controller: 'itemCreateCtrl',
        controllerAs: 'ctrl'
    })
    .when('/Edit/:itemID', {
        templateUrl: editUrl,
        controller: 'itemEditCtrl',
        controllerAs: 'ctrl'
    })
    .when('/Delete/:itemID', {
        templateUrl: detailsUrl,
        controller: 'itemDeleteCtrl',
        controllerAs: 'ctrl'
    })
    .when('/', {
        templateUrl: indexContentUrl,
        controller: 'itemIndexCtrl',
        controllerAs: 'controller'
    })
    .otherwise({
        redirectTo: '/'
    });
})


.controller("itemCtrl", function ItemCtrl() {
})

.controller("itemIndexCtrl", function ItemIndexCtrl(itemService, $http, $scope) {
    var that = this;

    $scope.filter = '';
    $scope.items = [];
    $scope.page = 0;

    $scope.getMoreItems = function () {
        itemService.getItems($scope);
    };

    //initial set
    $scope.getMoreItems();

    $scope.filterItems = function (value, index, array) {
        return true; //server side filtering on

     //client-side filtering 
       //$scope.$emit("items:modifiedOrFiltered");
        //if (!$scope.filter || $scope.filter == '') return true;
        //var expected = $scope.filter.toLowerCase();
        //return value.Title.toLowerCase().indexOf(expected) !== -1 ||
        //       value.AuthorsDesc.toLowerCase().indexOf(expected) !== -1 ||
        //       value.Location.Text.toLowerCase().indexOf(expected) !== -1 ||
        //       value.CallNum.toLowerCase().indexOf(expected) !== -1;
    };

    $scope.sentFilter = '';
    $scope.setFilter = function () {
        if ($scope.sentFilter == $scope.filter)
            return;

        $scope.items = [];
        $scope.page = 0;
        $scope.loadedAll = $scope.gettingOrDone = false;
        itemService.getItems($scope);
        $scope.sentFilter = $scope.filter;
    };
})

.controller("itemDetailCtrl", function ItemDetailCtrl(itemService, $location, $scope, $filter, $routeParams) {
    var that = this;

    $scope.nullDate = new Date(1, 1, 1);

    $scope.primaryAction = 'Edit';
    itemService.getItemByID($routeParams.itemID, function (found) {
        $scope.item = found;
    });

    $("input").keypress(function (eventArgs) {
        if (eventArgs.which == 13)
            that.actionItem();
        if (eventArgs.which == 27)
            that.close();
    });


    that.actionItem = function () {
        $location.path('/Edit/' + $routeParams.itemID);
    };

    that.close = function () {
        $location.path('/');
    };
})

.controller("itemDeleteCtrl", function ItemDeleteCtrl(itemService, $location, $scope, $filter, $routeParams) {
    var that = this;

    $scope.primaryAction = 'Delete';
    itemService.getItemByID($routeParams.itemID, function (found) {
        $scope.item = found;
    });

    $("input").keypress(function (eventArgs) {
        if (eventArgs.which == 13)
            that.actionItem();
        if (eventArgs.which == 27)
            that.close();
    });

    that.actionItem = function () {
        var id = $routeParams.itemID;
        $http.post(itemService.deleteUrl,
                   { id: id })
             .then(function (deletedID) {
                 itemService.removeItem(deletedID.data);
                 that.close();
             })
    };

    that.close = function () {
        $location.path('/');
    };

})

.controller("itemCreateCtrl", function ItemCreateCtrl($scope, $http, $location, itemService, authorService, validationService) {
    var that = this;
    that.form = function () { return $scope.itemCreateForm; };

    $scope.formDesc = "Add New Item";
    $scope.formName = "itemCreateForm";
    $scope.item = new Item();
    $("#title").select();

    $("input").keypress(function (eventArgs) {
        if (eventArgs.which == 13)
            that.save();
        if (eventArgs.which == 27)
            that.close();
    });

    $("#authors").typeahead({
        source: authorService.lookup,
        addItem: { name: 'Add Author...', id: -1 },
        minLength: 2,
        updater: function (item) {
            if (item.id == -1)
                authorService.displayAddAuthor($scope.item);
            else
                $scope.$apply(function () { $scope.item.Authors.push({ LastName: item.name, ID: item.id }); });
        }
    });

    that.invalidFieldClass = function (field) {
        return validationService.invalidFieldClass(that.form(), field);
    };

    that.invalidIconClass = function (field) {
        return validationService.invalidIconClass(that.form(), field);
    };

    that.save = function () {
        if (!validationService.validateForm(that.form()))
            return;

        $http.post(itemService.addUrl,
                   $scope.item)
             .then(function (addedItem) {
                 itemService.addItem(addedItem);
                 $location.path('/Detail/' + addedItem.ID);
             });
    };
})

.controller("itemEditCtrl", function ItemEditCtrl(itemService, authorService, $routeParams, $location, $http, $scope,
                                                  validationService) {
    var that = this;
    that.form = function () { return $scope.itemEditForm; };
    $scope.formName = "itemEditForm";
    $scope.formDesc = "Edit Item";

    var original;
    itemService.getItemByID($routeParams.itemID, function (found) {
        original = found;
        $scope.item = angular.copy(found);
    });

    $("input").keypress(function (eventArgs) {
        if (eventArgs.which == 13)
            that.save();
        if (eventArgs.which == 27)
            that.close();
    });

    $("#authors").typeahead({
        source: authorService.lookup,
        addItem: { name: 'Add Author...', id: -1 },
        minLength: 2,
        updater: function (item) {
            if (item.id == -1)
                authorService.displayAddAuthor($scope.item);
            else
                $scope.$apply(function () { $scope.item.Authors.push({ LastName: item.name, ID: item.id }); });
        }
    });

    that.invalidFieldClass = function (field) {
        if (!field) return '';
        return validationService.invalidFieldClass(that.form(), field);
    };

    that.invalidIconClass = function (field) {
        if (!field) return '';
        return validationService.invalidIconClass(that.form(), field);
    };

    that.save = function () {
        if (!validationService.validateForm(that.form()))
            return;

        $http.post(itemService.updateUrl,
                   $scope.item)
             .then(function (updatedItem) {
                 angular.copy(updatedItem.data, original);
                 $location.path('/Detail/' + $routeParams.itemID)
             });
    };
});

function Item() {
    this.ID = 0;
    this.MediaType = { value: 1, text: "Book" },
    this.Authors = [];
    this.Deleted = false;
    this.Reference = false;
    this.Restricted = false;
    this.Subjects = [];
    this.Location = { value: 91, text: 'New' };
    this.TimesCheckedOut = 0;
    this.CopiesCount = 0;
    this.EditionsCount = 0;
    this.Editions = [];
}
