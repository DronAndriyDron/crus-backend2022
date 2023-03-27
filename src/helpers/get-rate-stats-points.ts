export const getRateStatsPoints = (rateValue, gameValue, zone1, zone2, zone3) => {
  if (rateValue === gameValue) {
    return 1
  } else if (rateValue > gameValue - zone1 && rateValue < gameValue + zone1) {
    return 1
  } else if (rateValue >= gameValue - zone2 && rateValue <= gameValue + zone2) {
    return 0.5
  } else if (rateValue >= gameValue - zone3 && rateValue <= gameValue + zone3) {
    return 0.3
  }

  return 0
}