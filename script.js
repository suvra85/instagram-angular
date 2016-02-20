// Code goes here

var app=angular.module("instagramApp",['ngRoute', 'ui.bootstrap']);


app.config(function($routeProvider){
	$routeProvider.when('/',{
		 controller:'instagramCtrl',
		 templateUrl:"populate.html"        

	})
	.when('/search-users',{
		 controller:'instagramUserCtrl',
		 templateUrl:"users.html"        

	})
	.when('/view-user/:uid',{
         controller:'instagramUserCtrl',
         templateUrl:"userview.html"

	})
	.when('/search-tags',{
		 controller:'instagramTagsCtrl',
		 templateUrl:"tags.html"        

	})
	.otherwise({
           redirectTo:'/'


	});
});


app.factory('instagram', ['$http','$rootScope' ,function($http,$rootScope){

	return {
		fetchPopular: function(callback){
            
            var endPoint = "https://api.instagram.com/v1/media/popular?access_token=2280204805.1677ed0.d9f516f6de3b4c688c9ff5a8af79b50e&callback=JSON_CALLBACK";
            
            $http.jsonp(endPoint).success(function(response){
                callback(response.data);
            });
		},
		setLayout: function(value){
            $rootScope.layout = value;
            $rootScope.pageLayout=value+".html";
     }
       
	}

}]);

app.controller("instagramCtrl",["$scope","instagram",function($scope,instagram){
  
  $scope.instaData=[]
  instagram.setLayout('grid');
  $scope.loading=true;
  instagram.fetchPopular(function(response){
      $scope.loading=false;

    $scope.instaData=response;
    
  });
  
  
  $scope.changeLayout=function(type){
    
      instagram.setLayout(type);

  };
  
  $scope.wordLImit = function(text) {
    var s = text ? text.split(/\s+/) : 0; // it splits the text on space/tab/enter
    var arr=[];
    if(s.length>25)
     {
       for(var i=0;i<25;i=i+1)
       {
         arr.push(s[i]);
       }
       return arr.join(" ");
       
     }
    else
    {
      
      return text
    }
};
  
  
}]);

app.controller("instagramUserCtrl",["$scope","$http","$routeParams","$modal",function($scope,$http,$routeParams,$modal){
  $scope.searchuser="";
   $scope.instaData=[];

   $scope.instaDataMedia=[];
     $scope.loading=false;

  $scope.searchUser=function(){
    $scope.loading=true;
     var endpoint="https://api.instagram.com/v1/users/search?q="+$scope.searchuser+"&access_token=2280204805.1677ed0.d9f516f6de3b4c688c9ff5a8af79b50e&callback=JSON_CALLBACK";
        $http.jsonp(endpoint).success(function(response){
                $scope.instaData = response.data;
              $scope.loading=false;

        });
  };
  

  if(typeof $routeParams.uid!=="undefined")
  {
      $scope.loading=true;
      var uid=$routeParams.uid;
      $scope.loaddetails=false;
      $scope.loadmedia=false;

    var endpoint="https://api.instagram.com/v1/users/"+uid+"/?access_token=2280204805.1677ed0.d9f516f6de3b4c688c9ff5a8af79b50e&callback=JSON_CALLBACK";

        $http.jsonp(endpoint).success(function(response){
              $scope.instaData=response.data;
              $scope.loaddetails=true;

        });

      var mediapoint="https://api.instagram.com/v1/users/"+uid+"/media/recent/?access_token=2280204805.1677ed0.d9f516f6de3b4c688c9ff5a8af79b50e&callback=JSON_CALLBACK"
        $http.jsonp(mediapoint).success(function(responsedata){
              $scope.instaDataMedia=responsedata.data;
                    $scope.loadmedia=true;

        });
        
        if($scope.loadmedia && $scope.loaddetails)
        {
          
               $scope.loading=false;
 
        }
        
  }
  $scope.showModal = function(itemcontent) {
        var item=[];
        $scope.opts = {
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        templateUrl : 'modalContent.html',
        controller : ModalInstanceCtrl,
        resolve: {
              item: function(){
              return itemcontent;
              }
      
          } // empty storage
       };
          
     
          var modalInstance = $modal.open($scope.opts);
          
          modalInstance.result.then(function(){
            //on ok button press 
          },function(){
            //on cancel button press
            console.log("Modal Closed");
          });
      }; 
      


}]);


app.controller("instagramTagsCtrl",["$scope","$http","instagram",function($scope,$http,instagram){
  
   $scope.searchtag="";
   $scope.instaData=[]
    $scope.loading=false;

  $scope.searchTag=function(){
    
   var endpoint=" https://api.instagram.com/v1/tags/"+$scope.searchtag+"/media/recent?access_token=2280204805.1677ed0.d9f516f6de3b4c688c9ff5a8af79b50e&callback=JSON_CALLBACK";
    $scope.loading=true;

        $http.jsonp(endpoint).success(function(response){
              $scope.loading=false;

                $scope.instaData = response;
        });
  };
  
    $scope.changeLayout=function(type){
    
      instagram.setLayout(type);

  };
    $scope.searchMore=function(path){
    alert(path);
   
        $http.jsonp(path).success(function(response){
                   // $scope.instaData = $scope.instaData.concat(response);
                   $scope.instaData.push(response);

        });
  };
  

  

}]);



 var ModalInstanceCtrl = function($scope, $modalInstance, $modal, item) {
    
     $scope.item = {};
     $scope.item=item;
    
      $scope.ok = function () {
        $modalInstance.close();
      };
      
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
}

