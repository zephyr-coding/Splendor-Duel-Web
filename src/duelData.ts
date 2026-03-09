export type DuelAbility =
  | 'extra_turn'
  | 'take_matching'
  | 'steal_token'
  | 'gain_privilege'
  | null;

export type DuelBonus = 'white' | 'blue' | 'green' | 'red' | 'black' | 'linked' | null;
export type DuelCostColor = 'white' | 'blue' | 'green' | 'red' | 'black' | 'pearl';

export interface DuelCardData {
  id: string;
  name: string;
  level: 1 | 2 | 3;
  type: 'jewel' | 'royal';
  cost: Partial<Record<DuelCostColor, number>>;
  points: number;
  crowns: number;
  bonus: DuelBonus;
  bonusCount: number;
  ability: DuelAbility;
}

export const duelJewelCards: DuelCardData[] = [
  {
    id: "l1-01",
    name: "Level 1 White Bonus #1",
    level: 1,
    type: 'jewel',
    cost: {
      blue: 1,
      green: 1,
      red: 1,
      black: 1
    },
    points: 0,
    crowns: 0,
    bonus: 'white',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-02",
    name: "Level 1 White Bonus #2",
    level: 1,
    type: 'jewel',
    cost: {
      blue: 3
    },
    points: 0,
    crowns: 1,
    bonus: 'white',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-03",
    name: "Level 1 White Bonus #3",
    level: 1,
    type: 'jewel',
    cost: {
      blue: 2,
      green: 2,
      pearl: 1
    },
    points: 0,
    crowns: 0,
    bonus: 'white',
    bonusCount: 1,
    ability: 'extra_turn'
  },
  {
    id: "l1-04",
    name: "Level 1 White Bonus #4",
    level: 1,
    type: 'jewel',
    cost: {
      red: 2,
      black: 2
    },
    points: 0,
    crowns: 0,
    bonus: 'white',
    bonusCount: 1,
    ability: 'take_matching'
  },
  {
    id: "l1-05",
    name: "Level 1 White Bonus #5",
    level: 1,
    type: 'jewel',
    cost: {
      green: 2,
      red: 3
    },
    points: 1,
    crowns: 0,
    bonus: 'white',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-06",
    name: "Level 1 Blue Bonus #1",
    level: 1,
    type: 'jewel',
    cost: {
      white: 1,
      green: 1,
      red: 1,
      black: 1
    },
    points: 0,
    crowns: 0,
    bonus: 'blue',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-07",
    name: "Level 1 Blue Bonus #2",
    level: 1,
    type: 'jewel',
    cost: {
      green: 3
    },
    points: 0,
    crowns: 1,
    bonus: 'blue',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-08",
    name: "Level 1 Blue Bonus #3",
    level: 1,
    type: 'jewel',
    cost: {
      green: 2,
      red: 2,
      pearl: 1
    },
    points: 0,
    crowns: 0,
    bonus: 'blue',
    bonusCount: 1,
    ability: 'extra_turn'
  },
  {
    id: "l1-09",
    name: "Level 1 Blue Bonus #4",
    level: 1,
    type: 'jewel',
    cost: {
      white: 2,
      black: 2
    },
    points: 0,
    crowns: 0,
    bonus: 'blue',
    bonusCount: 1,
    ability: 'take_matching'
  },
  {
    id: "l1-10",
    name: "Level 1 Blue Bonus #5",
    level: 1,
    type: 'jewel',
    cost: {
      red: 2,
      black: 3
    },
    points: 1,
    crowns: 0,
    bonus: 'blue',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-11",
    name: "Level 1 Green Bonus #1",
    level: 1,
    type: 'jewel',
    cost: {
      white: 1,
      blue: 1,
      red: 1,
      black: 1
    },
    points: 0,
    crowns: 0,
    bonus: 'green',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-12",
    name: "Level 1 Green Bonus #2",
    level: 1,
    type: 'jewel',
    cost: {
      red: 3
    },
    points: 0,
    crowns: 1,
    bonus: 'green',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-13",
    name: "Level 1 Green Bonus #3",
    level: 1,
    type: 'jewel',
    cost: {
      red: 2,
      black: 2,
      pearl: 1
    },
    points: 0,
    crowns: 0,
    bonus: 'green',
    bonusCount: 1,
    ability: 'extra_turn'
  },
  {
    id: "l1-14",
    name: "Level 1 Green Bonus #4",
    level: 1,
    type: 'jewel',
    cost: {
      white: 2,
      blue: 2
    },
    points: 0,
    crowns: 0,
    bonus: 'green',
    bonusCount: 1,
    ability: 'take_matching'
  },
  {
    id: "l1-15",
    name: "Level 1 Green Bonus #5",
    level: 1,
    type: 'jewel',
    cost: {
      white: 3,
      black: 2
    },
    points: 1,
    crowns: 0,
    bonus: 'green',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-16",
    name: "Level 1 Black Bonus #1",
    level: 1,
    type: 'jewel',
    cost: {
      white: 1,
      blue: 1,
      green: 1,
      red: 1
    },
    points: 0,
    crowns: 0,
    bonus: 'black',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-17",
    name: "Level 1 Black Bonus #2",
    level: 1,
    type: 'jewel',
    cost: {
      white: 3
    },
    points: 0,
    crowns: 1,
    bonus: 'black',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-18",
    name: "Level 1 Black Bonus #3",
    level: 1,
    type: 'jewel',
    cost: {
      white: 2,
      blue: 2,
      pearl: 1
    },
    points: 0,
    crowns: 0,
    bonus: 'black',
    bonusCount: 1,
    ability: 'extra_turn'
  },
  {
    id: "l1-19",
    name: "Level 1 Black Bonus #4",
    level: 1,
    type: 'jewel',
    cost: {
      green: 2,
      red: 2
    },
    points: 0,
    crowns: 0,
    bonus: 'black',
    bonusCount: 1,
    ability: 'take_matching'
  },
  {
    id: "l1-20",
    name: "Level 1 Black Bonus #5",
    level: 1,
    type: 'jewel',
    cost: {
      blue: 2,
      green: 3
    },
    points: 1,
    crowns: 0,
    bonus: 'black',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-21",
    name: "Level 1 Red Bonus #1",
    level: 1,
    type: 'jewel',
    cost: {
      white: 1,
      blue: 1,
      green: 1,
      black: 1
    },
    points: 0,
    crowns: 0,
    bonus: 'red',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-22",
    name: "Level 1 Red Bonus #2",
    level: 1,
    type: 'jewel',
    cost: {
      black: 3
    },
    points: 0,
    crowns: 1,
    bonus: 'red',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-23",
    name: "Level 1 Red Bonus #3",
    level: 1,
    type: 'jewel',
    cost: {
      white: 2,
      black: 2,
      pearl: 1
    },
    points: 0,
    crowns: 0,
    bonus: 'red',
    bonusCount: 1,
    ability: 'extra_turn'
  },
  {
    id: "l1-24",
    name: "Level 1 Red Bonus #4",
    level: 1,
    type: 'jewel',
    cost: {
      blue: 2,
      green: 2
    },
    points: 0,
    crowns: 0,
    bonus: 'red',
    bonusCount: 1,
    ability: 'take_matching'
  },
  {
    id: "l1-25",
    name: "Level 1 Red Bonus #5",
    level: 1,
    type: 'jewel',
    cost: {
      white: 2,
      blue: 3
    },
    points: 1,
    crowns: 0,
    bonus: 'red',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-26",
    name: "Level 1 Associate #1",
    level: 1,
    type: 'jewel',
    cost: {
      black: 4,
      pearl: 1
    },
    points: 1,
    crowns: 0,
    bonus: 'linked',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-27",
    name: "Level 1 Associate #2",
    level: 1,
    type: 'jewel',
    cost: {
      white: 4,
      pearl: 1
    },
    points: 0,
    crowns: 1,
    bonus: 'linked',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-28",
    name: "Level 1 Gold Card",
    level: 1,
    type: 'jewel',
    cost: {
      red: 4,
      pearl: 1
    },
    points: 3,
    crowns: 0,
    bonus: null,
    bonusCount: 0,
    ability: null
  },
  {
    id: "l1-29",
    name: "Level 1 Associate #3",
    level: 1,
    type: 'jewel',
    cost: {
      blue: 2,
      red: 2,
      black: 1,
      pearl: 1
    },
    points: 1,
    crowns: 0,
    bonus: 'linked',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l1-30",
    name: "Level 1 Associate #4",
    level: 1,
    type: 'jewel',
    cost: {
      white: 2,
      green: 2,
      black: 1,
      pearl: 1
    },
    points: 1,
    crowns: 0,
    bonus: 'linked',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l2-01",
    name: "Level 2 White Bonus #1",
    level: 2,
    type: 'jewel',
    cost: {
      green: 2,
      red: 2,
      black: 2,
      pearl: 1
    },
    points: 2,
    crowns: 1,
    bonus: 'white',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l2-02",
    name: "Level 2 White Bonus #2",
    level: 2,
    type: 'jewel',
    cost: {
      blue: 4,
      red: 3
    },
    points: 1,
    crowns: 0,
    bonus: 'white',
    bonusCount: 1,
    ability: 'steal_token'
  },
  {
    id: "l2-03",
    name: "Level 2 White Bonus #3",
    level: 2,
    type: 'jewel',
    cost: {
      white: 4,
      black: 2,
      pearl: 1
    },
    points: 2,
    crowns: 0,
    bonus: 'white',
    bonusCount: 1,
    ability: 'gain_privilege'
  },
  {
    id: "l2-04",
    name: "Level 2 White Bonus #4",
    level: 2,
    type: 'jewel',
    cost: {
      blue: 5,
      green: 2
    },
    points: 1,
    crowns: 0,
    bonus: 'white',
    bonusCount: 2,
    ability: null
  },
  {
    id: "l2-05",
    name: "Level 2 Blue Bonus #1",
    level: 2,
    type: 'jewel',
    cost: {
      white: 2,
      red: 2,
      black: 2,
      pearl: 1
    },
    points: 2,
    crowns: 1,
    bonus: 'blue',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l2-06",
    name: "Level 2 Blue Bonus #2",
    level: 2,
    type: 'jewel',
    cost: {
      green: 4,
      black: 3
    },
    points: 1,
    crowns: 0,
    bonus: 'blue',
    bonusCount: 1,
    ability: 'steal_token'
  },
  {
    id: "l2-07",
    name: "Level 2 Blue Bonus #3",
    level: 2,
    type: 'jewel',
    cost: {
      white: 2,
      blue: 4,
      pearl: 1
    },
    points: 2,
    crowns: 0,
    bonus: 'blue',
    bonusCount: 1,
    ability: 'gain_privilege'
  },
  {
    id: "l2-08",
    name: "Level 2 Blue Bonus #4",
    level: 2,
    type: 'jewel',
    cost: {
      green: 5,
      red: 2
    },
    points: 1,
    crowns: 0,
    bonus: 'blue',
    bonusCount: 2,
    ability: null
  },
  {
    id: "l2-09",
    name: "Level 2 Green Bonus #1",
    level: 2,
    type: 'jewel',
    cost: {
      white: 2,
      blue: 2,
      black: 2,
      pearl: 1
    },
    points: 2,
    crowns: 1,
    bonus: 'green',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l2-10",
    name: "Level 2 Green Bonus #2",
    level: 2,
    type: 'jewel',
    cost: {
      white: 3,
      red: 4
    },
    points: 1,
    crowns: 0,
    bonus: 'green',
    bonusCount: 1,
    ability: 'steal_token'
  },
  {
    id: "l2-11",
    name: "Level 2 Green Bonus #3",
    level: 2,
    type: 'jewel',
    cost: {
      blue: 2,
      green: 4,
      pearl: 1
    },
    points: 2,
    crowns: 0,
    bonus: 'green',
    bonusCount: 1,
    ability: 'gain_privilege'
  },
  {
    id: "l2-12",
    name: "Level 2 Green Bonus #4",
    level: 2,
    type: 'jewel',
    cost: {
      red: 5,
      black: 2
    },
    points: 1,
    crowns: 0,
    bonus: 'green',
    bonusCount: 2,
    ability: null
  },
  {
    id: "l2-13",
    name: "Level 2 Black Bonus #1",
    level: 2,
    type: 'jewel',
    cost: {
      blue: 2,
      green: 2,
      red: 2,
      pearl: 1
    },
    points: 2,
    crowns: 1,
    bonus: 'black',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l2-14",
    name: "Level 2 Black Bonus #2",
    level: 2,
    type: 'jewel',
    cost: {
      white: 4,
      green: 3
    },
    points: 1,
    crowns: 0,
    bonus: 'black',
    bonusCount: 1,
    ability: 'steal_token'
  },
  {
    id: "l2-15",
    name: "Level 2 Black Bonus #3",
    level: 2,
    type: 'jewel',
    cost: {
      red: 2,
      black: 4,
      pearl: 1
    },
    points: 2,
    crowns: 0,
    bonus: 'black',
    bonusCount: 1,
    ability: 'gain_privilege'
  },
  {
    id: "l2-16",
    name: "Level 2 Black Bonus #4",
    level: 2,
    type: 'jewel',
    cost: {
      white: 5,
      blue: 2
    },
    points: 1,
    crowns: 0,
    bonus: 'black',
    bonusCount: 2,
    ability: null
  },
  {
    id: "l2-17",
    name: "Level 2 Red Bonus #1",
    level: 2,
    type: 'jewel',
    cost: {
      white: 2,
      blue: 2,
      green: 2,
      pearl: 1
    },
    points: 2,
    crowns: 1,
    bonus: 'red',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l2-18",
    name: "Level 2 Red Bonus #2",
    level: 2,
    type: 'jewel',
    cost: {
      blue: 3,
      black: 4
    },
    points: 1,
    crowns: 0,
    bonus: 'red',
    bonusCount: 1,
    ability: 'steal_token'
  },
  {
    id: "l2-19",
    name: "Level 2 Red Bonus #3",
    level: 2,
    type: 'jewel',
    cost: {
      green: 2,
      red: 4,
      pearl: 1
    },
    points: 2,
    crowns: 0,
    bonus: 'red',
    bonusCount: 1,
    ability: 'gain_privilege'
  },
  {
    id: "l2-20",
    name: "Level 2 Red Bonus #4",
    level: 2,
    type: 'jewel',
    cost: {
      white: 2,
      black: 5
    },
    points: 1,
    crowns: 0,
    bonus: 'red',
    bonusCount: 2,
    ability: null
  },
  {
    id: "l2-21",
    name: "Level 2 Associate #1",
    level: 2,
    type: 'jewel',
    cost: {
      green: 6,
      pearl: 1
    },
    points: 2,
    crowns: 0,
    bonus: 'linked',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l2-22",
    name: "Level 2 Associate #2",
    level: 2,
    type: 'jewel',
    cost: {
      green: 6,
      pearl: 1
    },
    points: 0,
    crowns: 2,
    bonus: 'linked',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l2-23",
    name: "Level 2 Associate #3",
    level: 2,
    type: 'jewel',
    cost: {
      blue: 6,
      pearl: 1
    },
    points: 0,
    crowns: 2,
    bonus: 'linked',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l2-24",
    name: "Level 2 Gold Card",
    level: 2,
    type: 'jewel',
    cost: {
      blue: 6,
      pearl: 1
    },
    points: 5,
    crowns: 0,
    bonus: null,
    bonusCount: 0,
    ability: null
  },
  {
    id: "l3-01",
    name: "Level 3 White Bonus #1",
    level: 3,
    type: 'jewel',
    cost: {
      blue: 3,
      red: 5,
      black: 3,
      pearl: 1
    },
    points: 3,
    crowns: 2,
    bonus: 'white',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l3-02",
    name: "Level 3 White Bonus #2",
    level: 3,
    type: 'jewel',
    cost: {
      white: 6,
      blue: 2,
      black: 2
    },
    points: 4,
    crowns: 0,
    bonus: 'white',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l3-03",
    name: "Level 3 Blue Bonus #1",
    level: 3,
    type: 'jewel',
    cost: {
      white: 3,
      green: 3,
      black: 5,
      pearl: 1
    },
    points: 3,
    crowns: 2,
    bonus: 'blue',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l3-04",
    name: "Level 3 Blue Bonus #2",
    level: 3,
    type: 'jewel',
    cost: {
      white: 2,
      blue: 6,
      green: 2
    },
    points: 4,
    crowns: 0,
    bonus: 'blue',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l3-05",
    name: "Level 3 Green Bonus #1",
    level: 3,
    type: 'jewel',
    cost: {
      white: 5,
      blue: 3,
      red: 3,
      pearl: 1
    },
    points: 3,
    crowns: 2,
    bonus: 'green',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l3-06",
    name: "Level 3 Green Bonus #2",
    level: 3,
    type: 'jewel',
    cost: {
      blue: 2,
      green: 6,
      red: 2
    },
    points: 4,
    crowns: 0,
    bonus: 'green',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l3-07",
    name: "Level 3 Black Bonus #1",
    level: 3,
    type: 'jewel',
    cost: {
      white: 3,
      green: 5,
      red: 3,
      pearl: 1
    },
    points: 3,
    crowns: 2,
    bonus: 'black',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l3-08",
    name: "Level 3 Black Bonus #2",
    level: 3,
    type: 'jewel',
    cost: {
      white: 2,
      red: 2,
      black: 6
    },
    points: 4,
    crowns: 0,
    bonus: 'black',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l3-09",
    name: "Level 3 Red Bonus #1",
    level: 3,
    type: 'jewel',
    cost: {
      blue: 5,
      green: 3,
      black: 3,
      pearl: 1
    },
    points: 3,
    crowns: 2,
    bonus: 'red',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l3-10",
    name: "Level 3 Red Bonus #2",
    level: 3,
    type: 'jewel',
    cost: {
      green: 2,
      red: 6,
      black: 2
    },
    points: 4,
    crowns: 0,
    bonus: 'red',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l3-11",
    name: "Level 3 Associate #1",
    level: 3,
    type: 'jewel',
    cost: {
      red: 8
    },
    points: 3,
    crowns: 0,
    bonus: 'linked',
    bonusCount: 1,
    ability: 'extra_turn'
  },
  {
    id: "l3-12",
    name: "Level 3 Associate #2",
    level: 3,
    type: 'jewel',
    cost: {
      black: 8
    },
    points: 0,
    crowns: 3,
    bonus: 'linked',
    bonusCount: 1,
    ability: null
  },
  {
    id: "l3-13",
    name: "Level 3 Gold Card",
    level: 3,
    type: 'jewel',
    cost: {
      white: 8
    },
    points: 6,
    crowns: 0,
    bonus: null,
    bonusCount: 0,
    ability: null
  }
];

export const duelRoyalCards: DuelCardData[] = [
  {
    id: "royal-01",
    name: "Royal Card #1",
    level: 1,
    type: 'royal',
    cost: {},
    points: 2,
    crowns: 0,
    bonus: null,
    bonusCount: 0,
    ability: 'steal_token'
  },
  {
    id: "royal-02",
    name: "Royal Card #2",
    level: 1,
    type: 'royal',
    cost: {},
    points: 2,
    crowns: 0,
    bonus: null,
    bonusCount: 0,
    ability: 'extra_turn'
  },
  {
    id: "royal-03",
    name: "Royal Card #3",
    level: 1,
    type: 'royal',
    cost: {},
    points: 2,
    crowns: 0,
    bonus: null,
    bonusCount: 0,
    ability: 'gain_privilege'
  },
  {
    id: "royal-04",
    name: "Royal Card #4",
    level: 1,
    type: 'royal',
    cost: {},
    points: 3,
    crowns: 0,
    bonus: null,
    bonusCount: 0,
    ability: null
  }
];
