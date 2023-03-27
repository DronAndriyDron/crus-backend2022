import {getRateStatsPoints} from "./get-rate-stats-points";

const rangesData =  {
  shoots: {
      rateValue: 0,
      gameValue: 0,
      points: 0,
      zone1: 0,
      zone2: 1,
      zone3: 3
  },
  successShots: {
      rateValue: 0,
      gameValue: 0,
      points: 0,
      zone1: 0,
      zone2: 1,
      zone3: 2
  },
  passes: {
      rateValue: 0,
      gameValue: 0,
      points: 0,
      zone1: 10,
      zone2: 20,
      zone3: 50
  },
  successPasses: {
      rateValue: 0,
      gameValue: 0,
      points: 0,
      zone1: 10,
      zone2: 20,
      zone3: 30
  },
  dribbles: {
      rateValue: 0,
      gameValue: 0,
      points: 0,
      zone1: 0,
      zone2: 1,
      zone3: 3
  },
  successDribbles: {
      rateValue: 0,
      gameValue: 0,
      points: 0,
      zone1: 0,
      zone2: 1,
      zone3: 2
  },
  ballAccuracy: {
      rateValue: 0,
      gameValue: 0,
      points: 0,
      zone1: 1,
      zone2: 3,
      zone3: 5
  },
}


const getResultByRatesToGameHelper = ({rateStats, gameStats, isHome}) => {
  let lineupsPoints: any = 0
  let captainsPoints: any = 0
  let gamePoints: any = 0
  let gameDribbles = 0
  let gameSuccessDribbles = 0

  gameStats.rating.forEach(item => {
    gameDribbles = gameDribbles + item.dribblesTotal
  })

  gameStats.rating.forEach(item => {
    gameSuccessDribbles = gameSuccessDribbles + item.dribblesSuccess
  })


  // Get stats points
  {
    rangesData.shoots.rateValue = rateStats.shots
    rangesData.shoots.gameValue = isHome ? gameStats.homeShotsTotal : gameStats.awayShotsTotal
    gamePoints = gamePoints + getRateStatsPoints(
      rangesData.shoots.rateValue,
      rangesData.shoots.gameValue,
      rangesData.shoots.zone1,
      rangesData.shoots.zone2,
      rangesData.shoots.zone3,
    )

    rangesData.successShots.rateValue = rateStats.successShots
    rangesData.successShots.gameValue = isHome ? gameStats.homeShotsOnGoal : gameStats.awayShotsOnGoal

    rangesData.passes.rateValue = rateStats.passes
    rangesData.passes.gameValue = isHome ? gameStats.homePassesTotal : gameStats.awayPassesTotal

    rangesData.successPasses.rateValue = rateStats.successPasses
    rangesData.successPasses.gameValue = isHome ? gameStats.homePassesAccurate : gameStats.awayPassesAccurate

    rangesData.dribbles.rateValue = rateStats.dribbles
    rangesData.dribbles.gameValue = gameDribbles

    rangesData.successDribbles.rateValue = rateStats.successDribbles
    rangesData.successDribbles.gameValue = gameSuccessDribbles

    rangesData.ballAccuracy.rateValue = rateStats.ballAccuracy
    rangesData.ballAccuracy.gameValue = isHome ? gameStats.homeBallPossession : gameStats.awayBallPossession

    Object.keys(rangesData).map(key => {
      const valueToAdd = getRateStatsPoints(
        rangesData[key].rateValue,
        rangesData[key].gameValue,
        rangesData[key].zone1,
        rangesData[key].zone2,
        rangesData[key].zone3,
      )
      gamePoints = gamePoints + valueToAdd

    })

  }

  // Get Lineup Points
  if (rateStats.formation === gameStats.formation) {
    const gameLineupForm = {}
    const rateLineupForm = {}

    gameStats.gameLineups.forEach(item => {
      gameLineupForm[item.role] = item.player.id
    })

    rateStats.ratesLineups.forEach(item => {
      rateLineupForm[item.role] = item.player.id
    })

    Object.keys(gameLineupForm).forEach(key => {
      if (gameLineupForm[key] === rateLineupForm[key]) {
        lineupsPoints = lineupsPoints + 1
      }
    })
  }

  // Get Captains Points
  {
    const ratingsForm = {}
    const rateCaptainsArray =[]

    gameStats.rating.forEach(item => {
      ratingsForm[item.player.id] = item.rating * 1
    })

    rateStats.ratesCaptains.forEach((item) => {
      rateCaptainsArray.push(item.player.id)
    })

    rateCaptainsArray.map(playerId => {
      if (ratingsForm[playerId]) {
        captainsPoints = captainsPoints + ratingsForm[playerId]
      }
    })
  }


  const allPoints = gamePoints + lineupsPoints + captainsPoints


  return {
    gameStatsPoints: gamePoints,
    lineupPoints: lineupsPoints,
    captainsPoints: captainsPoints,
    points: allPoints.toFixed(1) * 1,
    coins: allPoints.toFixed() * 1
  }
}

export  {
  getResultByRatesToGameHelper
}