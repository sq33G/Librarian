var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app.service("authorService", function AuthorService() {
    var that = this;

    that.authors = JSON.parse($(".model-container").val());
    that.detailsUrl = $(".url-container.details").val();
    that.createUrl = $(".url-container.create-view").val();
    that.addUrl = $(".url-container.create").val();
    that.deleteUrl = $(".url-container.delete").val();
    that.editUrl = $(".url-container.edit").val();
    that.updateUrl = $(".url-container.update").val();

    that.detailsContent = $("#detailPopupContainer .modal");
    that.createContent = $("#createPopupContainer .modal");
    that.deleteContent = $("#deletePopupContainer .modal");
    that.editContent = $("#editPopupContainer .modal");

    that.createContent.add(that.editContent).on("shown.bs.modal", function () {
        $(this).find("#firstName").focus();
    });

    var modalByUrl = {};
    modalByUrl[that.createUrl] = that.createContent;
    modalByUrl[that.detailsUrl] = that.detailsContent;
    modalByUrl[that.deleteUrl] = that.deleteContent;
    modalByUrl[that.editUrl] = that.editContent;

    that.setDefaultButton = function (url) {
        var defaultButton = modalByUrl[url].find("button.btn-primary");
        modalByUrl[url].find("input").keypress(function (eventArgs) {
            if (eventArgs.which == 13)
                defaultButton.click();
            if (eventArgs.which == 27)
                modalByUrl[url].modal('hide');
        });
    };

    that.authorData = {
        newAuthor: new Author(),
        currAuthor: {}
    };

    that.displayAuthor = function (author) {
        if (author)
            that.authorData.currAuthor = author;

        that.detailsContent.modal();
    };

    that.createAuthor = function () {
        that.createContent.modal();
    }

    that.displayDeleteAuthor = function (author) {
        that.authorData.currAuthor = author;
        //TODO merge/remove AuthorItem
        that.deleteContent.modal();
    };

    that.displayEditAuthor = function (author) {
        that.detailsContent.modal('hide');

        if (author)
            that.authorData.currAuthor = author;
        //otherwise use currently set currAuthor

        that.editContent.modal();
    };
})

.controller("authorCtrl", function AuthorCtrl(authorService, $scope) {
    var that = this;

    that.authors = authorService.authors;

    that.displayAuthor = authorService.displayAuthor;
    that.createAuthor = authorService.createAuthor;
    that.displayDeleteAuthor = authorService.displayDeleteAuthor;
    that.displayEditAuthor = authorService.displayEditAuthor;

    $scope.$on('$includeContentLoaded', function (eventArgs, src) {
        authorService.setDefaultButton(src);
    });
})

.controller("authorDetailCtrl", function AuthorDetailCtrl(authorService) {
    var that = this;

    that.authorData = authorService.authorData;
    that.displayAuthorUrl = authorService.detailsUrl;
    that.displayEditAuthor = authorService.displayEditAuthor;
})

.controller("authorDeleteCtrl", function AuthorDeleteCtrl(authorService, $http, $scope) {
    var that = this;

    that.authorData = authorService.authorData;
    that.displayAuthorUrl = authorService.detailsUrl;

    that.deleteAuthor = function () {
        var id = that.authorData.currAuthor.ID;
        $http.post(authorService.deleteUrl,
                   { id: id })
             .then(function (deletedID) {
                 Librarian.removeByID(authorService.authors, deletedID.data);
                 authorService.deleteContent.modal('hide');
             })
    };
})

.controller("authorCreateCtrl", function AuthorCreateCtrl($scope, $http, authorService, validationService) {
    var that = this;
    that.form = function () { return $scope.createForm; };

    that.authorData = authorService.authorData;
    that.createAuthorUrl = authorService.createUrl;

    that.invalidFieldClass = function (field) {
        return validationService.invalidFieldClass(that.form(), field);
    };

    that.invalidIconClass = function (field) {
        return validationService.invalidIconClass(that.form(), field);
    };

    that.addAuthor = function () {
        if (!validationService.validateForm(that.form()))
            return;

        $http.post(authorService.addUrl,
                   authorService.authorData.newAuthor)
             .then(function (addedAuthor) {
                 authorService.authors.push(addedAuthor.data);
                 authorService.authorData.newAuthor = new Author();
                 authorService.authorData.currAuthor = addedAuthor.data;
                 authorService.createContent.modal('hide');
                 that.form().$setPristine(); //not submitted for next use
                 authorService.displayAuthor();
             });
    };
})

.controller("authorEditCtrl", function AuthorEditCtrl(authorService, $http, $scope, validationService) {
    var that = this;
    that.form = function () { return $scope.editForm; };

    that.editAuthorUrl = authorService.editUrl;
    that.authorData = {};

    authorService.editContent.on("show.bs.modal", function () {
        that.authorData.currAuthor = angular.copy(authorService.authorData.currAuthor);
    });

    that.invalidFieldClass = function (field) {
        if (!field) return '';
        return validationService.invalidFieldClass(that.form(), field);
    };

    that.invalidIconClass = function (field) {
        if (!field) return '';
        return validationService.invalidIconClass(that.form(), field);
    };

    that.updateAuthor = function () {
        if (!validationService.validateForm(that.form()))
            return;

        $http.post(authorService.updateUrl,
                   that.authorData.currAuthor)
             .then(function (updatedAuthor) {
                 angular.copy(updatedAuthor.data, authorService.authorData.currAuthor);
                 authorService.editContent.modal('hide');
                 that.form().$setPristine(); //not submitted for next use
                 authorService.displayAuthor();
             });
    };
});

function Author() {
    this.ID = 0;
    this.FirstName = "";
    this.LastName = "";
    this.Suffix = "";
    this.RowState = 0;
}
