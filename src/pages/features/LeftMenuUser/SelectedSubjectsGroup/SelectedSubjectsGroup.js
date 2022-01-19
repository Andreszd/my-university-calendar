import { useContext } from 'react';
import Heading from 'components/atoms/Heading';
import ButtonIcon from 'components/molecules/ButtonIcon';

import { CalendarContext } from 'provider/calendarProvider';

import './SelectedSubjectsGroup.css';

export default function SelectedSubjectsGroup() {
  const { groupSubjects, removeSubject } = useContext(CalendarContext);
  //TODO handler re-renders
  return (
    <section className="subjects-group">
      <Heading typeTag="h2">Selected</Heading>
      <ul className="subjects-group__list">
        {groupSubjects?.map(
          ({ subjectName, groupCode, subjectCode, className }, idx) => (
            <li
              className={`subjects-group__item subjects-group__item--bullet-${className}`}
              key={idx}>
              <p className="subjects-group__text">
                {subjectName} G:{groupCode}
              </p>
              <ButtonIcon
                icon="icon-close"
                type="tertiary"
                onClick={() => removeSubject({ subjectCode, groupCode })}
              />
            </li>
          )
        )}
      </ul>
    </section>
  );
}

