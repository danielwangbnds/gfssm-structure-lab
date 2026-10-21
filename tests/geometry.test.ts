import test from 'node:test';

import assert from 'node:assert/strict';

import { bracketCoordinates, habitatCoordinates } from '../src/models/profiles.ts';

import type { Point2 } from '../src/models/profiles.ts';

import { lesson1 } from '../src/lessons/lesson1.ts';

function close(actual: number, expected: number) {

  assert.ok(Math.abs(actual - expected) < Math.max(1, Math.abs(expected)) * 1e-9);

}

function revolvedVolume(points: Point2[]) {

  let volume = 0;

  for (let i = 0;
  i < points.length - 1;
  i++) {

    const [r1, y1] = points[i];

    const [r2, y2] = points[i + 1];

    volume += Math.PI / 3 * (r1 * r1 + r1 * r2 + r2 * r2) * (y2 - y1);

  }
  return Math.abs(volume);

}

function polygonArea(points: Point2[]) {

  return Math.abs(points.slice(0, -1).reduce((sum, [x, y], i) =>
      sum + x * points[i + 1][1] - points[i + 1][0] * y, 0) / 2);

}

test(
  'habitat volume, blind cavity, back wall and hatch remain correct across all slider values',
  () => {

    for (let diameter = 60;
    diameter <= 110;
    diameter++) {

      for (let length = 80;
      length <= 180;
      length++) {

        const r = diameter / 2;

        const inner = r - 4;

        const solid = Math.PI * r * r * length;

        const cup = solid - Math.PI * inner * inner * (length - 4);

        const hatch = Math.PI * (r * r - (r * 0.35) ** 2) * 4;

        close(revolvedVolume(habitatCoordinates(diameter, length, 1)), solid);

        close(revolvedVolume(habitatCoordinates(diameter, length, 2)), cup);

        close(revolvedVolume(habitatCoordinates(diameter, length, 3)), cup + hatch);

        const final = habitatCoordinates(diameter, length, 3);

        assert.deepEqual(final[0], final.at(-1));

        assert.equal(final[2][1] - final[0][1], length + 4);

        assert.ok(inner > r * 0.35 && inner > 0);

      }

    }

  }
);

test(
  'bracket silhouette remains closed and connected at parameter extremes',
  () => {

    for (const length of [60, 80, 120]) {

      for (const thickness of [4, 8, 12]) {

        for (const height of [35, 50, 75]) {

          const profile = bracketCoordinates(length, thickness, height);

          assert.deepEqual(profile[0], profile.at(-1));

          close(polygonArea(profile), length * thickness + height * thickness);

          assert.equal(Math.max(...profile.map(point => point[1])), thickness + height);

          assert.ok(height / 2 > 7 + 4, 'Hole clears the top fillet and bottom');

        }

      }

    }

  }
);

test(
  'each lesson step supplies real instructions and every default parameter is valid',
  () => {

    assert.equal(lesson1.missions.length, 4);

    assert.equal(new Set(lesson1.missions.map(mission => mission.id)).size, 4);

    for (const mission of lesson1.missions) {

      for (const parameter of mission.parameters) {

        assert.ok(parameter.value >= parameter.min && parameter.value <= parameter.max);

      }
      for (const step of mission.steps) {

        assert.ok(step.actions.length > 0);

        for (const field of ['title', 'command', 'explanation', 'result', 'mistake', 'hint'] as const) {

          assert.ok(step[field].trim().length > 0);

        }
        assert.ok(step.stage >= 0);

      }
      if (mission.quiz) assert.ok(mission.quiz.answer >= 0 && mission.quiz.answer < mission.quiz.options.length);

    }

  }
);

