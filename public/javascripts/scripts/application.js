/**
 * Created by hassan-MBP on 8/4/14.
 */
define(["require", "jquery", "knockout", "pubsub", "./leftbar", "./addTripForm", "./newsFeed"],
  function (require, $, ko, pubsub) {

    return (function () {
      var _app = {},
        _leftBar = require("./leftbar"),
        _addTripForm = require("./addTripForm"),
        _newsFeedModel = require("./newsFeed"),

        _applicationModel = {
//          View: ko.observable("list")
        };

      function ManageState(newView, params) {
        switch (newView) {
          case "article":
          {
            _articleModel.FetchQuestion(params.qid, function () {
              _applicationModel.View(newView);
            });

            break;
          }
          case "list":
          {
            _applicationModel.View(newView);
          }
        }
      }

      function onScroll() {
//                console.log("scrolled boy ", $(window).scrollTop());
      }

      _app.Init = function () {

//        pubsub.subscribe("state", ManageState);

        console.log("APPLICATION IS UP");

        // Attach scroll event handler
        // $(window).scroll(onScroll);

        _applicationModel.LeftBarModel = _leftBar;
        _applicationModel.AddTripFormModel = _addTripForm;
        _applicationModel.NewsFeedModel = _newsFeedModel;
        ko.applyBindings(_applicationModel);

        // Initiate the list
        pubsub.publish("fetchNewsFeed", {});
      }
      return _app;
    }());
  });
