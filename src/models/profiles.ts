/** Rendering-independent millimetre coordinates for geometry validation. */
export type Point2 = [number, number];

export function bracketCoordinates(length: number, thickness: number, height: number): Point2[] {

  return [
      [0, 0], [length, 0], [length, thickness],
      [thickness, thickness], [thickness, thickness + height],
      [0, thickness + height], [0, 0],
  ];

}

/** Closed radial/axial profile; revolving it forms one continuous solid. */
export function habitatCoordinates(diameter: number, length: number, stage: number): Point2[] {

  const r = diameter / 2;

  const inner = r - 4;

  const back = -length / 2;

  const front = length / 2;

  if (stage <= 1) return [[0, back], [r, back], [r, front], [0, front], [0, back]];

  if (stage === 2) {

    return [
        [0, back], [r, back], [r, front], [inner, front],
        [inner, back + 4], [0, back + 4], [0, back],
    ];

  }
  return [
      [0, back], [r, back], [r, front + 4],
      [r * 0.35, front + 4], [r * 0.35, front],
      [inner, front], [inner, back + 4], [0, back + 4], [0, back],
  ];

}
