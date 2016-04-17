import {sample} from 'lodash'

import {
  Gunner,
  Launcher,
  Repair,
  Bank,
  Wall,
} from './modules'

import Point from '../Point'

const easyPlans = [
  [
    [Gunner, new Point(1, 0)],
    [Gunner, new Point(-1, 0)],
    [Wall, new Point(-2, 0)],
    [Wall, new Point(2, 0)],
    [Gunner, new Point(3, 0)],
    [Gunner, new Point(-3, 0)],
    [Gunner, new Point(0, 1)],
    [Repair, new Point(4, 0)],
    [Repair, new Point(-4, 0)],
    [Launcher, new Point(4, -1)],
    [Launcher, new Point(-4, -1)],
    [Bank, new Point(1, -1)],
    [Bank, new Point(-1, -1)],
    [Repair, new Point(1, -2)],
    [Repair, new Point(-1, -2)],
    [Gunner, new Point(2, -2)],
    [Gunner, new Point(-2, -2)],
  ]
]

const normalPlans = [
  [
    [Wall, new Point(0, 1)],
    [Wall, new Point(1, 1)],
    [Wall, new Point(-1, 1)],
    [Bank, new Point(0, -1)],
    [Gunner, new Point(1, 0)],
    [Gunner, new Point(-1, 0)],
    [Wall, new Point(2, 1)],
    [Wall, new Point(-2, 1)],
    [Repair, new Point(2, 0)],
    [Repair, new Point(-2, 0)],
    [Bank, new Point(-1, -1)],
    [Bank, new Point(1, -1)],
    [Launcher, new Point(-2, -1)],
    [Launcher, new Point(2, -1)],
    [Gunner, new Point(0, -2)],
    [Wall, new Point(0, 2)],
    [Wall, new Point(2, 2)],
    [Wall, new Point(-2, 2)],
    [Wall, new Point(3, 1)],
    [Wall, new Point(-3, 1)],
    [Launcher, new Point(3, 0)],
    [Launcher, new Point(-3, 0)],
    [Bank, new Point(-1, -2)],
    [Bank, new Point(1, -2)],
    [Bank, new Point(-2, -2)],
    [Bank, new Point(2, -2)],
    [Launcher, new Point(3, -1)],
    [Launcher, new Point(-3, -1)],
    [Gunner, new Point(3, -2)],
    [Gunner, new Point(-3, -2)],
    [Wall, new Point(4, 1)],
    [Wall, new Point(-4, 1)],
    [Wall, new Point(4, 2)],
    [Wall, new Point(-4, 2)],
  ],
  [
    [Bank, new Point(0, -1)],
    [Wall, new Point(0, 1)],
    [Wall, new Point(1, 1)],
    [Wall, new Point(-1, 1)],
    [Repair, new Point(1, 0)],
    [Repair, new Point(-1, 0)],
    [Bank, new Point(-1, -1)],
    [Bank, new Point(1, -1)],
    [Bank, new Point(-1, -2)],
    [Bank, new Point(1, -2)],
    [Bank, new Point(0, -2)],
    [Wall, new Point(0, 2)],
    [Wall, new Point(1, 2)],
    [Wall, new Point(-1, 2)],
    [Wall, new Point(2, 1)],
    [Wall, new Point(2, 2)],
    [Wall, new Point(-2, 1)],
    [Wall, new Point(-2, 2)],
    [Wall, new Point(-3, 1)],
    [Wall, new Point(-3, 2)],
    [Wall, new Point(-4, 1)],
    [Wall, new Point(-4, 2)],
    [Wall, new Point(3, 1)],
    [Wall, new Point(3, 2)],
    [Wall, new Point(4, 1)],
    [Wall, new Point(4, 2)],
    [Launcher, new Point(2, 0)],
    [Launcher, new Point(3, 0)],
    [Launcher, new Point(-2, 0)],
    [Launcher, new Point(-3, 0)],
    [Launcher, new Point(4, 0)],
    [Launcher, new Point(-4, 0)],
    [Launcher, new Point(2, -1)],
    [Launcher, new Point(3, -1)],
    [Launcher, new Point(-2, -1)],
    [Launcher, new Point(-3, -1)],
    [Launcher, new Point(4, -1)],
    [Launcher, new Point(-4, -1)],
    [Launcher, new Point(2, -2)],
    [Launcher, new Point(3, -2)],
    [Launcher, new Point(-2, -2)],
    [Launcher, new Point(-3, -2)],
    [Launcher, new Point(4, -2)],
    [Launcher, new Point(-4, -2)],

  ]
]

export function randomPlan() {
  return sample([...easyPlans, ...normalPlans])
}

export function randomEasyPlan() {
  return sample(easyPlans)
}

export function randomNormalPlan() {
  return sample(normalPlans)
}
