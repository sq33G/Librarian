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
    var itemPages = [];
    that.items = [];
    that.filter = '';

    that.getItems = function (page, filter, scope) {
        if (filter != that.filter) {
            itemPages = [];
            items = [];

            scope.$broadcast("itemsReset");
        }

        if (itemPages[page])
            return;

        $http.post(that.itemsUrl,
            {
                pageSize: that.pageSize,
                pageNum: page,
                filter: filter
            }).then(function (results) {
                itemPages[results.data.pageNum] = results.data.items;
                for (var i = 0; i < that.pageSize; i++) {
                    that.items[i + (results.data.pageNum * that.pageSize)] = itemPages[results.data.pageNum][i];
                }
                that.totalPages = results.data.pages;
                scope.$broadcast("itemsSet");
            });

    }

    that.getItemByID = function (id, callback) {
        var itemsFound = $filter('filter')(that.items, '{ ID: ' + id + ' }', true);

        if (itemsFound.length == 1)
            callback(itemsFound[0]);

        $http.post(that.singleItemUrl, { id: id })
            .then(function (found) {
                that.items.push(found.data);
                callback(found.data);
            })
    };

    that.addItem = function (item) {
        itemPages = []; //invalidate all - new item could be anywhere in orderby
        items.push(item);
    };

    that.removeItem = function (itemID) {
        for (var i = 0; i < itemPages.length; i++) {
            if (!itemPages[i])
                continue;
            var match = $filter('filter')(itemPages[i], '{ ID: ' + itemID + '}', true);
            if (match.length > 0) { //invalidate containing and all successive item pages
                itemPages.splice(i, itemPages.length);
                break;
            }
        }
        librarian.removeByID(that.items, itemID);
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

    that.page = 0;
    that.filter = '';
    that.virtualPageHeight = 1; //starting nonsense
    that.headerHeight = $("#itemsTable").first("tr").height();

    $scope.$on("itemsReset", function () {
        $(".virtual-scroll-container").scrollTop(0);
    });

    $scope.$on("itemsSet", function () {
        that.items = itemService.items;
        setTimeout(that.updateVirtualPageHeight, 0);
    });

    $(window).resize(function () {
        $(".virtual-scroll-container").height($(window).innerHeight() - $(".virtual-scroll-container").offset().top - 20)
    });

    itemService.getItems(0, '', $scope);

    that.updateVirtualPageHeight = function () {
        that.virtualPageHeight = $("#itemsTable tr").eq(1).height() * itemService.pageSize;
        $(".virtual-height").height(that.headerHeight + (that.virtualPageHeight * itemService.totalPages));
    };

    that.checkPassedVirtualPage = function () {
        if ($(".virtual-scroll-container").scrollTop() + $(".virtual-scroll-container").height() > that.headerHeight + that.virtualPageHeight * that.page) {
            that.page = ($(".virtual-scroll-container").scrollTop() + $(".virtual-scroll-container").height() - that.headerHeight) / that.virtualPageHeight;
            itemService.getItems(that.page, that.filter, $scope);
        }
    };

    $(".virtual-scroll-container").scroll(function () {
        that.checkPassedVirtualPage();
    });
})

.controller("itemDetailCtrl", function ItemDetailCtrl(itemService, $location, $scope, $filter, $routeParams) {
    var that = this;

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

.controller("itemCreateCtrl", function ItemCreateCtrl($scope, $http, $location, itemService, validationService) {
    var that = this;
    that.form = function () { return $scope.createForm; };

    $scope.item = new Item();
    $("#title").select();

    $("input").keypress(function (eventArgs) {
        if (eventArgs.which == 13)
            that.save();
        if (eventArgs.which == 27)
            that.close();
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

.controller("itemEditCtrl", function ItemEditCtrl(itemService, $routeParams, $location, $http, $scope, validationService) {
    var that = this;
    that.form = function () { return $scope.editForm; };

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
