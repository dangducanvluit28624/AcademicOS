export interface GradeConversion {
  letterGrade: string
  fourPointValue: number
}

const gradeTable: Array<readonly [number, GradeConversion]> = [
  [10, { letterGrade: 'A+', fourPointValue: 4 }],
  [9, { letterGrade: 'A', fourPointValue: 4 }],
  [8.5, { letterGrade: 'B+', fourPointValue: 3.5 }],
  [8, { letterGrade: 'B', fourPointValue: 3 }],
  [7, { letterGrade: 'C+', fourPointValue: 2.5 }],
  [6.5, { letterGrade: 'C', fourPointValue: 2 }],
  [6, { letterGrade: 'D+', fourPointValue: 1.5 }],
  [5, { letterGrade: 'D', fourPointValue: 1 }],
  [0, { letterGrade: 'F', fourPointValue: 0 }],
]

export function convertCourseScore(score: number): GradeConversion {
  if (
    !Number.isFinite(score) ||
    score < 0 ||
    score > 10 ||
    Math.round(score * 10) !== score * 10
  ) {
    throw new Error(
      'Course score must be a value from 0.0 through 10.0 in 0.1 increments',
    )
  }

  return gradeTable.find(([minimum]) => score >= minimum)![1]
}
