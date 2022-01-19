import React, { useState } from 'react';

import { getRandomClassColor, enableColor } from 'libs/colors';

import { MAX_SUBJECTS_GROUP_SELECTED } from 'constants.js';
import { amountPeriodsByRangePeriod } from 'libs/calculatePeriods.js';

export const CalendarContext = React.createContext();

export function CalendarProvider({ children }) {
  const [collisions, setCollisions] = useState([]);
  const [groupSubjects, setGroupSubjects] = useState([]);
  const [subjectGroupPeriods, setSubjectGroupPeriods] = useState([]);
  const [modifiedGroups, setModifiedGroups] = useState([]);

  const addSubject = (subject) => {
    if (groupSubjects > MAX_SUBJECTS_GROUP_SELECTED)
      return console.error('cant to add more than 8 subjects');
    const newSubject = copyAllSubject(subject);

    const { subjectCode, groupCode, subjectName } = newSubject;

    const periodsOfSubject = newSubject.schedule.map((daySchedule) => ({
      ...daySchedule,
      subjectCode,
      groupCode,
      subjectName,
    }));

    addClassToPeriodSubject(newSubject);
    checkPeriodsCollision(periodsOfSubject);
    setSubjectGroupPeriods([...subjectGroupPeriods, ...periodsOfSubject]);
  };

  const addClassToPeriodSubject = (subject) => {
    setGroupSubjects([
      ...groupSubjects,
      {
        subjectName: subject?.subjectName,
        subjectCode: subject?.subjectCode,
        groupCode: subject?.groupCode,
        className: getRandomClassColor(),
      },
    ]);
  };

  const copyAllSubject = (obj) => {
    return { ...obj, schedule: obj?.schedule.map((sch) => ({ ...sch })) };
  };

  const checkPeriodsCollision = (periodsOfSubject) => {
    const collisionsPeriod = [];
    const newGroups = [];
    subjectGroupPeriods.forEach((period) => {
      const periodWithcollision = periodsOfSubject.find(
        (periodOfSubject) =>
          period.day === periodOfSubject.day &&
          hasCollision(period, periodOfSubject)
      );
      if (periodWithcollision) {
        buildCollision(
          period,
          periodWithcollision,
          collisionsPeriod,
          newGroups
        );
      }
    });
    if (collisionsPeriod.length > 0)
      setCollisions([...collisions, ...collisionsPeriod]);
    if (newGroups.length > 0)
      setModifiedGroups([...modifiedGroups, ...newGroups]);
  };

  const hasCollision = (a, b) => {
    const aStart = parseInt(a.start);
    const aEnd = parseInt(a.end);
    const bStart = parseInt(b.start);
    const bEnd = parseInt(b.end);
    return (
      caseCollisionOne({ bStart, bEnd, aStart, aEnd }) ||
      caseCollisionTwo({ bStart, bEnd, aStart, aEnd }) ||
      caseCollisionThree({ bStart, bEnd, aStart, aEnd })
    );
  };

  const caseCollisionOne = ({ bStart, bEnd, aStart, aEnd }) =>
    bStart >= aStart && bEnd <= aEnd;

  const caseCollisionTwo = ({ aStart, aEnd, bStart, bEnd }) =>
    bEnd > aEnd && bStart > aStart && bStart < aEnd;

  const caseCollisionThree = ({ aStart, aEnd, bStart, bEnd }) =>
    bStart < aStart && bEnd > aStart && bEnd < aEnd;

  const caseCollisionFour = ({ aStart, aEnd, bStart, bEnd }) =>
    bStart > aStart && bEnd < aEnd && bEnd === aEnd;

  const caseCollisionFive = ({ aStart, aEnd, bStart, bEnd }) =>
    bStart === aStart && bEnd < aEnd;

  const buildCollision = (
    periodOne,
    periodTwo,
    collisionsPeriod,
    newPeriods
  ) => {
    const aStart = parseInt(periodOne.start);
    const aEnd = parseInt(periodOne.end);
    const bStart = parseInt(periodTwo.start);
    const bEnd = parseInt(periodTwo.end);
    //TODO Refactor !!!!
    const createdBy = {
      subjectCodes: [periodOne.subjectCode, periodTwo.subjectCode],
      groupCodes: [periodOne.groupCode, periodTwo.groupCode],
    };

    const newPeriod = {
      subjectNames: [periodOne.subjectName, periodTwo.subjectName],
      createdBy,
      day: periodOne.day,
    };

    if (
      periodOne.start === periodTwo.start &&
      periodTwo.end === periodOne.end
    ) {
      collisionsPeriod.push({
        ...newPeriod,
        end: periodOne.end,
        start: periodOne.start,
        duration: periodOne.duration,
      });
    }
    if (caseCollisionTwo({ bStart, bEnd, aStart, aEnd })) {
      collisionsPeriod.push({
        ...newPeriod,
        end: periodOne.end,
        start: periodTwo.start,
        duration: amountPeriodsByRangePeriod(bStart, aEnd),
      });
      newPeriods.push({
        ...periodOne,
        end: periodTwo.start,
        createdBy,
        duration: amountPeriodsByRangePeriod(aStart, bStart),
      });
      newPeriods.push({
        ...periodTwo,
        start: periodOne.end,
        end: periodTwo.end,
        createdBy,
        duration: amountPeriodsByRangePeriod(aEnd, bEnd),
      });
    }
    if (caseCollisionThree({ bStart, bEnd, aStart, aEnd })) {
      collisionsPeriod.push({
        ...newPeriod,
        end: periodTwo.end,
        start: periodOne.start,
        duration: amountPeriodsByRangePeriod(aStart, bEnd),
      });
      newPeriods.push({
        ...periodTwo,
        end: periodOne.start,
        createdBy,
        duration: amountPeriodsByRangePeriod(bStart, aStart),
      });
      newPeriods.push({
        ...periodOne,
        start: periodTwo.end,
        createdBy,
        duration: amountPeriodsByRangePeriod(bEnd, aEnd),
      });
    }
  };

  const removeSubject = ({ subjectCode, groupCode }) => {
    removeClassColor({ subjectCode, groupCode });
    removeCollisions({ subjectCode, groupCode });
    removeModifiedGroups({ subjectCode, groupCode });
    const periods = subjectGroupPeriods.filter(
      (period) =>
        !(period.subjectCode === subjectCode && period.groupCode === groupCode)
    );
    setSubjectGroupPeriods(periods);
  };

  const removeModifiedGroups = ({ subjectCode, groupCode }) => {
    setModifiedGroups(
      modifiedGroups.filter(
        ({ createdBy }) =>
          !(
            createdBy.subjectCodes.includes(subjectCode) &&
            createdBy.groupCodes.includes(groupCode)
          )
      )
    );
  };
  const removeCollisions = ({ subjectCode, groupCode }) => {
    setCollisions(
      collisions.filter(
        ({ createdBy }) =>
          !(
            createdBy.subjectCodes.includes(subjectCode) &&
            createdBy.groupCodes.includes(groupCode)
          )
      )
    );
  };

  const getSubjectById = (period) => {
    return groupSubjects.find(
      ({ subjectCode, groupCode }) =>
        subjectCode === period?.subjectCode && groupCode === period?.groupCode
    );
  };
  const removeClassColor = ({ subjectCode, groupCode }) => {
    const period = getSubjectById({ subjectCode, groupCode });
    if (period) enableColor(period.className);
    setGroupSubjects(
      groupSubjects.filter(
        (period) =>
          !(
            period.subjectCode === subjectCode && period.groupCode === groupCode
          )
      )
    );
  };

  return (
    <CalendarContext.Provider
      value={{
        subjectGroupPeriods,
        addSubject,
        removeSubject,
        groupSubjects,
        collisions,
        getSubjectById,
        modifiedGroups,
      }}>
      {children}
    </CalendarContext.Provider>
  );
}
