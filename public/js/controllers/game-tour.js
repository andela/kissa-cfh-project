angular.module('mean.system')
	.controller('GameTourController', ['$scope', function ($scope) {
		$scope.gameTour = introJs();
 	  $scope.tourState = '';
 	  $scope.gameTour.setOptions({
 	    steps: [
 	      {
 	        intro: `This guided tour will explain how to play Cards For Humanity.
 	          Use the left and right arrow keys for navigation or hit ESC to exit the
 	         tour immediately.`
 	      },
 	      {
 	        element: '#player0',
 	        intro: `Here you have a list of current players during and before
 	          the game commences`
 	      },
 	      {
 	        element: '#question-container',
 	        intro: `Game needs a minimum of 3 players to start the game.
 	          You have to wait for minimum number of players to join the game`
 	      },
 	      {
 	        element: '#info-container',
 	        intro: `While waiting for other players to join the game you can also read
 	          a brief of how the game is played`,
 	        position: 'top'
 	      },
 	      {
 	        element: '#social-bar-container',
 	        intro: `As new players join the game, the list of players is updated
 	          accordingly`
 	      },
 	      {
 	        element: '#start-game-button',
 	        intro: `Once minimum required players have joined, you can start the 
 	          game by clicking on the start game button`
 	      },
 	      {
 	        element: '#question',
 	        intro: 'Once the game starts, a question is displayed'
 	      },
 	      {
 	        element: '#cards',
 	        intro: `You also have different answer cards to pick what you feel
 	         is the most appropriate answer to the question`
 	      },
 	      {
 	        element: '#inner-timer-container',
 	        intro: `Timer counts down. You have a limited time to choose an answer
 	          to the current question. After time out, the CZAR is also given a
 	          limited time to select his favorite answer. Player who submitted
 	          the CZARs favorite answer wins the round. The game proceeds to
 	          another round and the next CZAR is chosen`
 	      },
 	      {
 	        element: '#czar-container',
 	        intro: `You might be the next CZAR, check the CZAR icon to 
 	          know the next CZAR. The game continues until a player
 	          wins five rounds`
 	      },
 	      {
 	        element: '#player-score',
 	        intro: `This shows the user's score. The user with a score up to 5 wins the game`
 	      },
 	      {
 	        element: '#abandon-game-button',
 	        intro: 'You can abandon the game at any time.'
 	      }
 	    ]
 	  });
 	
 	  const isGameCustom = () => {
 	    const custom = window.location.href.indexOf('custom') >= 0;
 	    return (custom);
   };

 	  const tourComplete = () => {
 	    if (isGameCustom()) {
 	      window.location = '/play?custom';
 	    } else {
 	    	if (window.user) {
 	    		window.location = '/playgame';
 	    	} else {
 	    		window.location = '/play';
 	    	}
 	    }
 	  };

 	  const tourExit = () => {
 	    tourComplete();
 	  };
 	
 	  const beforeTourChange = (targetElement) => {
 	    switch ($(targetElement).attr('id')) {
 	    case 'social-bar-container': {
 	      $scope.$apply(() => {
 	      	$scope.playerCount = 3;
 	        $scope.showSocialBar = true;
 	        $scope.showOtherPlayers = true;
 	      });
 	      break;
 	    }
 	    case 'question-container': {
 	      $scope.$apply(() => {
 	        $scope.showQuestionContainer = true;
 	        $scope.showAwaitingPlayers = true;
 	      });
 	      break;
 	    }
 	    case 'player0': {
 	      $scope.$apply(() => {
 	        $scope.showSocialBar = true;
 	        $scope.showFirstPlayer = true;
 	        $scope.playerCount = 1;
 	      });
 	      break;
 	    }
 	    case 'info-container': {
 	      $scope.$apply(() => {
 	        
 	        $scope.showAwaitingPlayers = true;
 	        $scope.showHowToPlay = true;
 	      });
 	      break;
 	    }
 	    case 'start-game-button': {
 	      $scope.$apply(() => {
 	        $scope.showStartGameContainer = true;
 	        $scope.showAwaitingPlayers = true;
 	        $scope.showHowToPlay = true;
 	        $scope.showQuestion = false;
 	        $scope.showOtherPlayers = true;
 	      });
 	      break;
 	    }
 	    case 'question': {
 	      $scope.$apply(() => {
 	        $scope.showStartGameContainer = false;
 	        $scope.showAwaitingPlayers = false;
 	        $scope.showHowToPlay = true;
 	        $scope.showQuestion = true;
 	      });
 	      break;
 	    }
 	    case 'cards': {
 	      $scope.$apply(() => {
 	        $scope.showHowToPlay = false;
 	        $scope.showAnswerCards = true;
 	      });
 	      break;
 	    }
 	
 	    case 'inner-timer-container': {
 	      $scope.$apply(() => {
 	        $scope.showTimer = true;
 	        $scope.showHowToPlay = false;
 	        $scope.showAnswerCards = true;
 	      });
 	      break;
 	    }
 	
 	    case 'czar-container': {
 	      $scope.showCurrentCzar = true;
 	      $scope.$apply(() => {
  	      $scope.showTimer = true;
 	        $scope.showHowToPlay = false;
 	        $scope.showAnswerCards = true;
					$scope.theCzar = true;
 	      });
 	      break;
 	    }

 	    case 'player-score': {
 	    	$scope.$apply(() => {
 	        $scope.showPlayerScore = true;
 	      });
 	    }
 	    default: {
 	     window.location = '/play';
 	    }
 	    }
 	  };
 	
 	  $scope.gameTour.start()
 	    .oncomplete(tourComplete)
 	    .onexit(tourExit)
 	    .onbeforechange(beforeTourChange);
 	}]);