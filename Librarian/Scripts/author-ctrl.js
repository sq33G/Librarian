var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app
.factory("Author", function authorFactory() {
    return function Author() {
        this.ID = 0;
        this.FirstName = "";
        this.LastName = "";
        this.Suffix = "";
        this.RowState = 0;
    };
})

.service("authorService", function AuthorService(Author, ServiceWithDialogs) {
    var that = new ServiceWithDialogs();

    that.authors = JSON.parse($(".model-container").val());
    that.addUrl = $(".url-container.create").val();
    that.deleteUrl = $(".url-container.delete").val();
    that.updateUrl = $(".url-container.update").val();

    that.authorData = {
        newAuthor: new Author(),
        currAuthor: {}
    };

    that.displayAuthor = function (author) {
        if (author)
            that.authorData.currAuthor = author;

        that.showDetails();
    };

    that.createAuthor = function () {
        that.showCreate();
    }

    that.displayDeleteAuthor = function (author) {
        that.authorData.currAuthor = author;
        //TODO merge/remove AuthorItem
        that.showDelete();
    };

    that.displayEditAuthor = function (author) {
        that.hideDetails();

        if (author)
            that.authorData.currAuthor = author;
        //otherwise use currently set currAuthor

        that.showEdit();
    };

    return that;
})

.controller("authorCtrl", function AuthorCtrl(authorService, $scope) {
    var that = this;

    that.authors = authorService.authors;

    that.displayAuthor = authorService.displayAuthor;
    that.createAuthor = authorService.createAuthor;
    that.displayDeleteAuthor = authorService.displayDeleteAuthor;
    that.displayEditAuthor = authorService.displayEditAuthor;

})

.controller("authorDetailCtrl", function AuthorDetailCtrl(authorService) {
    var that = this;

    that.authorData = authorService.authorData;
    that.displayEditAuthor = authorService.displayEditAuthor;
})

.controller("authorDeleteCtrl", function AuthorDeleteCtrl(authorService, librarian, $http, $scope) {
    var that = this;

    that.authorData = authorService.authorData;

    that.deleteAuthor = function () {
        var id = that.authorData.currAuthor.ID;

        $scope.notifyDialogSending();
        $http.post(authorService.deleteUrl,
                   { id: id })
             .then(function (deletedID) {
                 $scope.notifyDialogSendComplete();
                 librarian.removeByID(authorService.authors, deletedID.data);
                 $scope.hideDialog();
             })
    };
})

.controller("authorCreateCtrl", function AuthorCreateCtrl($scope, $http, authorService, Author, ValidatingForm) {
    var that = new ValidatingForm();

    that.form = function () { return $scope.createForm; };

    that.authorData = authorService.authorData;

    that.close = function () {
        $scope.hideDialog();
        authorService.authorData.newAuthor = new Author();
        that.form().$setPristine(); //not submitted for next use
    };

    that.addAuthor = function () {
        if (!that.isValid())
            return;

        $scope.notifyDialogSending();
        $http.post(authorService.addUrl,
                   authorService.authorData.newAuthor)
             .then(function (addedAuthor) {
                 $scope.notifyDialogSendComplete();
                 authorService.authors.push(addedAuthor.data);
                 authorService.authorData.newAuthor = new Author();
                 authorService.authorData.currAuthor = addedAuthor.data;
                 $scope.hideDialog();
                 that.form().$setPristine(); //not submitted for next use
                 authorService.displayAuthor();
             });
    };

    return that;
})

.controller("authorEditCtrl", function AuthorEditCtrl(authorService, $http, $scope, ValidatingForm) {
    var that = new ValidatingForm();

    that.form = function () { return $scope.editForm; };

    that.authorData = {};

    that.dialogShow = function () {
        that.authorData.currAuthor = angular.copy(authorService.authorData.currAuthor);
    };

    that.close = function () {
        that.form().$setPristine;
        $scope.hideDialog();
    };

    that.updateAuthor = function () {
        if (!that.isValid())
            return;

        $scope.notifyDialogSending();
        $http.post(authorService.updateUrl,
                   that.authorData.currAuthor)
             .then(function (updatedAuthor) {
                 $scope.notifyDialogSendComplete();
                 angular.copy(updatedAuthor.data, authorService.authorData.currAuthor);
                 $scope.hideDialog();
                 that.form().$setPristine(); //not submitted for next use
                 authorService.displayAuthor();
             });
    };

    return that;
});

