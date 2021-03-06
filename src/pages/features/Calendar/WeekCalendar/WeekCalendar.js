import HeaderCalendar from '../HeaderCalendar';
import HoursCalendar from '../HoursCalendar';
import TimeSlotGroup from '../TimeSlotGroup';
import GridCalendar from 'components/layout/GridCalendar';

import { calendarKeys, calendarValues } from './constants';
import { parseToString } from 'libs/toString';

import './WeekCalendar.css';
//TODO: Refactor in how rendered all cards
const WeekCalendar = () => {
  return (
    <div className="week-calendar">
      <GridCalendar>
        <HeaderCalendar />
        <HoursCalendar />
        {calendarValues.map((day, idxCol) => {
          const { periodsDay } = day;
          return periodsDay.map((segmentHour, idxRow) => (
            <TimeSlotGroup
              key={`${calendarKeys[idxCol]}-${segmentHour.start}:${segmentHour.end}`}
              row={parseToString(idxRow + 2)}
              col={parseToString(idxCol + 2)}
              day={idxCol + 1}
              hourRange={segmentHour}
            />
          ));
        })}
      </GridCalendar>
    </div>
  );
};

export default WeekCalendar;
