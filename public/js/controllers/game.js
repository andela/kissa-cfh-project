angular.module('mean.system')
.controller('GameController', ['$scope', 'game', 'dataFactory', '$timeout', '$location', '$modal', 'MakeAWishFactsService', function ($scope, game, dataFactory, $timeout, $location, $modal, MakeAWishFactsService) {
  $scope.hasPickedCards = false;
  $scope.winningCardPicked = false;
  $scope.showTable = false;
  $scope.modalShown = false;
  $scope.game = game;
  $scope.inviteList = [];
  $scope.pickedCards = [];
  var makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
  $scope.makeAWishFact = makeAWishFacts.pop();

  $scope.pickCard = function(card) {
    if (!$scope.hasPickedCards) {
      if ($scope.pickedCards.indexOf(card.id) < 0) {
        $scope.pickedCards.push(card.id);
        if (game.curQuestion.numAnswers === 1) {
          $scope.sendPickedCards();
          $scope.hasPickedCards = true;
        } else if (game.curQuestion.numAnswers === 2 &&
          $scope.pickedCards.length === 2) {
          //delay and send
          $scope.hasPickedCards = true;
          $timeout($scope.sendPickedCards, 300);
        }
      } else {
        $scope.pickedCards.pop();
      }
    }
  };

  $scope.pointerCursorStyle = function() {
    if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
        return {'cursor': 'pointer'};
      } else {
        return {};
      }
  };

  $scope.sendPickedCards = function() {
    game.pickCards($scope.pickedCards);
    $scope.showTable = true;
  };

  $scope.cardIsFirstSelected = function(card) {
    if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[0];
      } else {
        return false;
      }
  };

  $scope.cardIsSecondSelected = function(card) {
    if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[1];
      } else {
        return false;
      }
  };

  $scope.firstAnswer = function($index){
    if($index % 2 === 0 && game.curQuestion.numAnswers > 1){
        return true;
      } else{
        return false;
      }
  };

  $scope.secondAnswer = function($index){
    if($index % 2 === 1 && game.curQuestion.numAnswers > 1){
        return true;
      } else{
        return false;
      }
  };

  $scope.showFirst = function(card) {
    return game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;
  };

  $scope.showSecond = function(card) {
    return game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;
  };

  $scope.isCzar = function() {
    return game.czar === game.playerIndex;
  };

  $scope.isPlayer = function($index) {
    return $index === game.playerIndex;
  };

  $scope.isCustomGame = function() {
    return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
  };

  $scope.isPremium = function($index) {
    return game.players[$index].premium;
  };

  $scope.currentCzar = function($index) {
    return $index === game.czar;
  };

  $scope.winningColor = function($index) {
    if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
        return $scope.colors[game.players[game.winningCardPlayer].color];
      } else {
        return '#f9f9f9';
      }
  };

  $scope.pickWinning = function(winningSet) {
    if ($scope.isCzar()) {
      game.pickWinning(winningSet.card[0]);
      $scope.winningCardPicked = true;
    }
  };

  $scope.winnerPicked = function() {
    return game.winningCard !== -1;
  };

  $scope.customCreator = function () {
    if (game.players[0] === undefined) {
      return false;
    } else if (window.user === null) {
      return false;
    }
    return game.players[0].id === window.user._id;
  };

  $scope.isUser = window.user;

  $scope.userEmail = $location.search().email;

  $scope.startGame = function () {
    if (game.players.length < game.playerMinLimit) {
      let message = `You need at least ${game.playerMinLimit} players to start the game`;
      let template = '/views/popup.html';
      showModal(message, template);
    } else if ($scope.isCustomGame()) {
      let message = 'You are about to start a game that will be saved';
      let template = '/views/save-game.html';
      showModal(message, template);
    } else {
      game.startGame();
    }
  };

  $scope.saveGame = function () {
    game.startGame();
    $scope.modalInstance.close();
    const gameId = $location.search().game;
    console.log(gameId);
    const link = `/api/games/${gameId}/start`;
    const data = {
      creator: game.players[0].id,
      friends: game.players
    }
    dataFactory.saveGameHistory(link, data)
    .success(function(response) {
      gameKey = response._id;
      $scope.model = 'Game Saved';
      return gameKey;
    })
    .error(function (response) {
      $scope.message = 'Could not save game';
    });
  };

  $scope.closeModal = function () {
    $scope.modalInstance.close();
  };

  $scope.$watch('game.state', function() {
    if (game.state === 'game ended' && $scope.isCustomGame()) {
      const gameId = $location.search().game;
      const link = `/api/games/${gameId}/start`;
      const data = {
        creator: game.players[0].id,
        winner: game.players[game.gameWinner].id,
        status: 'true',
        rounds: game.round
      }
      dataFactory.updateGameHistory(link, data)
      .success(function(response) {
        $scope.model = 'Game updated';
      })
      .error(function (response) {
        $scope.message = 'Could not update game';
      });
    }
  });

  $scope.abandonGame = function() {
    game.leaveGame();
    $location.path('/');
  };

    // Catches changes to round to update when no players pick card
    // (because game.state remains the same)
  $scope.$watch('game.round', function() {
    $scope.hasPickedCards = false;
    $scope.showTable = false;
    $scope.winningCardPicked = false;
    $scope.makeAWishFact = makeAWishFacts.pop();
    if (!makeAWishFacts.length) {
        makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      }
    $scope.pickedCards = [];
  });

    // In case player doesn't pick a card in time, show the table
  $scope.$watch('game.state', function() {
    if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
        $scope.showTable = true;
      }
  });

  $scope.$watch('game.gameID', function() {
    if (game.gameID && game.state === 'awaiting players') {
        if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
          $location.search({});
        } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.
          $location.search({game: game.gameID});
          if(!$scope.modalShown){
            setTimeout(function(){
              var link = document.URL;
              var txt = 'Give the following link to your friends so they can join your game: ';
              $('#lobby-how-to-play').text(txt);
              $('#oh-el').css({'text-align': 'center', 'font-size':'22px', 'background': 'white', 'color': 'black'}).text(link);
            }, 200);
            $scope.modalShown = true;
          }
        }
    }
  });

  if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
    if (!!window.user) {
      console.log('joining custom game');
      game.joinGame('joinGame',$location.search().game);
    } else {
      $location.path('/signup');
    }
  } else if ($location.search().custom) {
    game.joinGame('joinGame',null,true);
  } else {
    game.joinGame();
  }

  $scope.searchUsers = function (word, type) {
    dataFactory.searchUsers(word, type)
      .success(function(data, status, headers, config) {
        $scope.searchResult = data;
      })
      .error(function (data, status, headers, config) {
        $scope.noResult = status;
      });
  };

  $scope.selectList = function (email, id) {
    $scope.email = email;
    $scope.friendId = id;
  };

  $scope.sendInvites = function (email, mode, friendId) {
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;
    if (regex.test($scope.email) && !$scope.inviteList.includes($scope.email)) {
      if ($scope.inviteList.length > game.playerMaxLimit) {
        let message = `You have exceeded ${game.playerMaxLimit}, the  maximum amount of invite for this game.`;
        let templateUrl = '/views/popup.html';
        showModal(message, templateUrl);
      } else {
        const form = {
          email: email,
          link: document.URL,
          sender: window.user.name,
          friendId: friendId
        }
        dataFactory.sendInvites(mode, form)
        .success(function(response) {
          $scope.message = 'Invite has been sent';
          $scope.inviteList.push($scope.email);
        })
        .error(function (response) {
          $scope.message = 'Could not send invite';
        });
      }
    }
  };

  $scope.addFriend = function(playerEmail) {
    const link = '/api/users/friends';
    const data = {
      email: playerEmail
    }
    dataFactory.addFriends(link, data)
    .success(function(response) {
      $scope.friendMessage = response.message;
    })
    .error(function(response) {
      $scope.friendMessage = response.message;
    })
  }

  function showModal(message, template) {
    $scope.animationsEnabled = true;
      $scope.errorBody = message;
      $scope.modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        scope: $scope,
        ariaDescribedBy: 'modal-body',
        templateUrl: template,
        controller: 'GameController',
        size: 'sm',
        appendTo: angular.element(document).find('#gameplay-container'),
        resolve: {
          items: function () {
            return $scope.errorBody;
          }
        }
      });
  }
}]);
